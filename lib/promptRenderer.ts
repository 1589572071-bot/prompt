import { formatAvatarBoundaries } from "./avatarBoundaries";
import { formatAvatarAppearance } from "./formatAppearance";
import {
  deriveActionTokenFromMotion,
  formatProactiveMotionReference,
  resolveProactiveMotion
} from "./proactiveMotionOptions";
import { getPersonaPromptById, resolvePersonaContent } from "./personaPromptCatalog";
import { createDefaultConfig, type OrchestrationConfig } from "./runtimeConfig";
import { getSystemPromptAsset, type SystemPromptAsset } from "./systemBaseCatalog";
import { getSessionStrategies, matchIntentStrategies } from "./strategyRouter";
import type { AvatarProfile, BizStrategy, PromptLayer, ProactiveStrategy } from "./types";

const variablePattern = /\{\{\s*([a-zA-Z_][\w]*)(?:\s*\|\s*default\((.*?)\))?\s*\}\}/g;

export interface RenderOptions {
  userInput: string;
  selectedStateId: string;
  enableTailReinforcement: boolean;
  avatarId?: string;
  config?: OrchestrationConfig;
}

export interface RenderResult {
  layers: PromptLayer[];
  fullPrompt: string;
  unresolvedVariables: string[];
  totalTokens: number;
  intent: string;
  toolCalls: ToolCallPlan[];
  structuredOutput: Record<string, unknown>;
}

const runtimeContext: Record<string, string> = {
  history_buffer: "Previous turn finished a try-on display; return naturally to front-facing",
  action_token: "[ACT:smile]",
  proactive_direction: "No proactive direction selected.",
  proactive_motion: "Use a small natural opener gesture with a gentle smile."
};

function estimateTokens(content: string) {
  return Math.max(1, Math.ceil(content.length / 4));
}

function resolveTemplate(template: string, context: Record<string, string>) {
  const unresolved = new Set<string>();
  const rendered = template.replace(variablePattern, (match, variableName: string, fallback?: string) => {
    if (context[variableName]) {
      return context[variableName];
    }

    if (fallback) {
      return fallback.replace(/^['"]|['"]$/g, "");
    }

    unresolved.add(variableName);
    return match;
  });

  return {
    rendered,
    unresolved: Array.from(unresolved)
  };
}

function resolveAvatar(avatarId: string | undefined, config: OrchestrationConfig): AvatarProfile {
  if (!avatarId) return config.avatars[0];
  return config.avatars.find((avatar) => avatar.id === avatarId) ?? config.avatars[0];
}

function getPersonaById(personaPromptId: string, config: OrchestrationConfig) {
  return config.personas.find((prompt) => prompt.id === personaPromptId) ?? getPersonaPromptById(personaPromptId);
}

function buildPersonaContent(avatar: AvatarProfile, config: OrchestrationConfig): string {
  const prompt = getPersonaById(avatar.personaPromptId, config);
  const content = prompt?.content ?? resolvePersonaContent(avatar.personaPromptId);

  if (avatar.temperament.length) {
    return `${content}\n\nTemperament:\n${avatar.temperament.join("\n")}`;
  }

  return content || `[Missing persona prompt: ${avatar.personaPromptId}${prompt ? "" : " — not found in catalog"}]`;
}

function buildPersonaSummary(avatar: AvatarProfile, config: OrchestrationConfig) {
  const prompt = getPersonaById(avatar.personaPromptId, config);
  const label = prompt?.label ?? avatar.personaLabel;
  if (!prompt) return `${label}: concise, clear, and aligned with the selected persona prompt.`;

  return `${label}
styleSummary: ${prompt.styleSummary}
relationshipSummary: ${prompt.relationshipSummary}
speakingStyleTags: ${prompt.speakingStyleTags.join(", ") || "none"}
forbiddenStyleTags: ${prompt.forbiddenStyleTags.join(", ") || "none"}`;
}

function getPromptAssetFromConfig(id: string, config: OrchestrationConfig) {
  return config.systemPromptAssets.find((asset) => asset.id === id) ?? getSystemPromptAsset(id);
}

function formatIdleMotionPromptFromConfig(ids: string[], config: OrchestrationConfig) {
  const motions = ids
    .map((id) => config.idleMotions.find((motion) => motion.id === id))
    .filter((motion): motion is (typeof config.idleMotions)[number] => Boolean(motion))
    .filter((motion) => motion.status === "Published");

  if (!motions.length) return "Maintain a neutral, still posture with subtle natural breathing.";
  return motions.map((motion) => `${motion.name} (${motion.chunk} chunks): ${motion.actionPrompt}`).join("\n");
}

export interface ToolCallPlan {
  tool: string;
  reason: string;
  inputs: Record<string, string>;
}

function formatBizStrategy(strategy: BizStrategy) {
  return `Strategy: ${strategy.name}\nVisual Anchor: ${strategy.visualAnchor}\nPose Constraints: ${strategy.poseConstraints}\nKnowledge: ${strategy.knowledgeBase}`;
}

function formatProactiveStrategyLayer(strategy: ProactiveStrategy, motion?: { name: string; actionPrompt: string; chunk: number }) {
  const examples =
    strategy.examplePhrases.length > 0
      ? `\nExample phrases (reference only — do not copy verbatim):\n${strategy.examplePhrases.map((line) => `- ${line}`).join("\n")}`
      : "";
  const forbidden =
    strategy.forbiddenPatterns.length > 0
      ? `\nForbidden patterns:\n${strategy.forbiddenPatterns.map((line) => `- ${line}`).join("\n")}`
      : "";
  const motionLine = motion
    ? `\nSuggested motion:\n${motion.name} (${motion.chunk} chunks): ${motion.actionPrompt}`
    : "";

  return `Strategy: ${strategy.name}
Direction:
${strategy.directionPrompt}${examples}${forbidden}${motionLine}
Strategy cooldown: ${strategy.cooldown} (enforced by runtime orchestration, not by the model)`;
}

function layerFromPromptAsset(asset: SystemPromptAsset, name?: string): PromptLayer {
  return {
    name: name ?? asset.name,
    source: asset.id,
    version: `${asset.versions} versions`,
    content: asset.content,
    tokenCount: estimateTokens(asset.content)
  };
}

function inferIntent(
  selectedStateId: string,
  matchedIntentStrategies: BizStrategy[],
  selectedProactiveStrategy?: ProactiveStrategy
) {
  if (selectedStateId === "idle") return "none";
  if (selectedStateId === "proactive" && selectedProactiveStrategy) return "proactive_invite";
  return matchedIntentStrategies[0]?.intentName ?? "none";
}

function planToolCalls(stateId: string, intent: string, hasSpeech: boolean, config: OrchestrationConfig): ToolCallPlan[] {
  const rules = config.toolCallingRules.filter((rule) => {
    if (!rule.enabled) return false;
    if (rule.stateId && rule.stateId !== stateId) return false;
    if (rule.intent && rule.intent !== intent) return false;
    if (rule.tool === "tts_model" && !hasSpeech) return false;
    return Boolean(rule.stateId || rule.intent);
  });

  const calls = rules.map((rule) => {
    const routing = config.modelRouting.find((route) => route.tool === rule.tool && route.enabled);
    return {
      tool: rule.tool,
      reason: rule.reason,
      inputs: {
        ...(routing ? { model: routing.model, fallbackModel: routing.fallbackModel ?? "" } : {}),
        ...Object.fromEntries(
          rule.requiredInputs.map((input) => [
            input,
            input === "look_id" ? "look_001" : input === "action" ? "turn_or_detail_view" : input === "voice" ? "character_voice" : ""
          ])
        )
      }
    };
  });

  return calls.length ? calls : [{ tool: "none", reason: "No tool required for this turn", inputs: {} }];
}

function formatToolCalls(calls: ToolCallPlan[]) {
  return calls
    .map((call, index) => `${index + 1}. ${call.tool}\nReason: ${call.reason}\nInputs: ${JSON.stringify(call.inputs)}`)
    .join("\n\n");
}

function buildAvatarProfileLight(avatar: AvatarProfile, boundariesText: string, config: OrchestrationConfig) {
  return `avatarId: ${avatar.id}
personaPromptId: ${avatar.personaPromptId}
persona: ${buildPersonaSummary(avatar, config)}
voice: ${avatar.voice}
ttsUrl: ${avatar.ttsUrl || "not configured"}
basicBoundaries:
${boundariesText
  .split("\n")
  .filter(Boolean)
  .slice(0, 4)
  .join("\n")}`;
}

function getAvatarLayerMode(stateId: string, intent: string) {
  if (stateId === "idle") return "visual";
  if (stateId === "proactive" || stateId === "fallback") return "light";
  if (intent === "outfit_change" || intent === "action_view") return "full";
  return "light";
}

function buildCharacterLayerContent(
  avatar: AvatarProfile,
  mode: "visual" | "light" | "full",
  appearanceText: string,
  boundariesText: string,
  config: OrchestrationConfig
) {
  if (mode === "visual") {
    return `Avatar Profile.Visual Identity:
${appearanceText}

Motion Boundaries:
${boundariesText}`;
  }

  if (mode === "light") {
    return buildAvatarProfileLight(avatar, boundariesText, config);
  }

  return `Default Appearance:\n${appearanceText}\n\nBoundaries:\n${boundariesText}`;
}

function shouldUseFullPersona(stateId: string, intent: string) {
  if (stateId !== "interaction") return false;
  return intent === "outfit_change" || intent === "action_view" || intent === "outfit_reaction" || intent === "casual_chat" || intent === "none";
}

function shouldUseScenarioBase(stateId: string, intent: string) {
  if (stateId !== "interaction") return false;
  return intent !== "none";
}

export function renderPrompt({
  userInput,
  selectedStateId,
  enableTailReinforcement,
  avatarId,
  config: providedConfig
}: RenderOptions): RenderResult {
  const config = providedConfig ?? createDefaultConfig();
  const avatar = resolveAvatar(avatarId, config);
  const machine = config.stateMachine;
  const selectedState = machine.nodes.find((node) => node.id === selectedStateId) ?? machine.nodes[0];
  const scenarioStrategies = getSessionStrategies(machine.scenarioStrategyIds, config.bizStrategies);
  const intentCandidates = config.bizStrategies.filter((strategy) => selectedState.strategyIds.includes(strategy.id));
  const intentMatches = matchIntentStrategies(userInput, intentCandidates);
  const matchedIntentStrategies = intentMatches.map(({ strategy }) => strategy);
  const selectedProactiveStrategy = config.proactiveStrategies
    .filter(
      (strategy) =>
        selectedState.proactiveStrategyIds.includes(strategy.id) &&
        strategy.enabled &&
        strategy.applicableStateId === selectedState.id
    )
    .sort((left, right) => (left.priority === "high" ? -1 : right.priority === "high" ? 1 : 0))[0];
  const boundariesText = formatAvatarBoundaries(avatar);
  const appearanceText = formatAvatarAppearance(avatar);
  const personaContent = buildPersonaContent(avatar, config);
  const personaPrompt = getPersonaById(avatar.personaPromptId, config);
  const idleMotionContent = formatIdleMotionPromptFromConfig(avatar.idleMotionIds, config);
  const systemPromptAssets = [
    getPromptAssetFromConfig("prompt-action-space", config),
    getPromptAssetFromConfig("prompt-guardrails", config),
    getPromptAssetFromConfig("prompt-output-contract", config)
  ].filter((asset): asset is SystemPromptAsset => Boolean(asset));
  const fallbackPrompt = selectedState.id === "fallback" ? getPromptAssetFromConfig("fallback-strategy-conflict-prompt", config) : undefined;
  const toolPrompt =
    matchedIntentStrategies[0]?.intentName === "outfit_change"
      ? getPromptAssetFromConfig("aigcportal_reference_tryon_step2_image_prompt", config)
      : undefined;
  const dynamicContextPrompt = getPromptAssetFromConfig(`dynamic-${selectedState.id}-context-template`, config);

  const selectedProactiveMotion = selectedProactiveStrategy
    ? resolveProactiveMotion(selectedProactiveStrategy.suggestedMotionId, config.idleMotions)
    : undefined;
  const proactiveMotionReference = formatProactiveMotionReference(selectedProactiveMotion);
  const proactiveActionToken = deriveActionTokenFromMotion(selectedProactiveMotion);

  const context = {
    ...runtimeContext,
    idle_motion: idleMotionContent,
    proactive_direction: selectedProactiveStrategy?.directionPrompt ?? runtimeContext.proactive_direction,
    proactive_motion: proactiveMotionReference,
    action_token: selectedState.id === "proactive" ? proactiveActionToken : runtimeContext.action_token,
    user_input: userInput || "Try on the first item.",
    current_state: selectedState.name
  };

  const dynamic = resolveTemplate(selectedState.dynamicTemplate, context);
  const scenarioContent = scenarioStrategies.map(formatBizStrategy).join("\n\n");
  const intentContent = intentMatches
    .map(({ strategy, score }) => `${formatBizStrategy(strategy)}\nSemantic Match: ${score.toFixed(2)}`)
    .join("\n\n");
  const intent = inferIntent(selectedState.id, matchedIntentStrategies, selectedProactiveStrategy);
  const hasSpeech = selectedState.id !== "idle";
  const toolCalls = planToolCalls(selectedState.id, intent, hasSpeech, config);
  const avatarLayerMode = getAvatarLayerMode(selectedState.id, intent);
  const useFullPersona = shouldUseFullPersona(selectedState.id, intent);
  const useScenarioBase = shouldUseScenarioBase(selectedState.id, intent);
  const structuredOutput = {
    state: selectedState.id,
    intent,
    spoken_text: selectedState.id === "idle" ? "" : "Generated at runtime by the model.",
    action_token: context.action_token,
    tool_calls: toolCalls,
    look_id: intent === "outfit_change" ? "look_001" : null,
    safety_notes: []
  };

  const layers: PromptLayer[] = [
    ...systemPromptAssets.map((asset) => layerFromPromptAsset(asset, "System Prompt")),
    {
      name:
        avatarLayerMode === "visual"
          ? "Avatar Profile.Visual Identity"
          : avatarLayerMode === "light"
            ? "Avatar Profile.Light"
            : "Avatar Profile",
      source: avatar.id,
      version: avatar.version,
      content: buildCharacterLayerContent(avatar, avatarLayerMode, appearanceText, boundariesText, config),
      tokenCount: estimateTokens(appearanceText + boundariesText)
    },
    ...(selectedState.id === "idle"
      ? [
          {
            name: "Idle Motion",
            source: avatar.idleMotionIds.join(", ") || "none",
            version: "character_selection",
            content: idleMotionContent,
            tokenCount: estimateTokens(idleMotionContent)
          }
        ]
      : []),
    ...(useFullPersona
      ? [
          {
            name: "Persona",
            source: personaPrompt?.id ?? avatar.personaPromptId,
            version: personaPrompt?.version ?? avatar.version,
            content: personaContent,
            tokenCount: estimateTokens(personaContent)
          }
        ]
      : []),
    ...(useScenarioBase
      ? [
          {
            name: "Scenario Base",
            source: scenarioStrategies.map((strategy) => strategy.id).join(", ") || "none",
            version: scenarioStrategies.map((strategy) => strategy.version).join(", ") || "-",
            content: scenarioContent || "No session-level scenario strategy is active.",
            tokenCount: estimateTokens(scenarioContent || "none")
          }
        ]
      : []),
    ...(matchedIntentStrategies.length
      ? [
          {
            name: "Business Strategy",
            source: matchedIntentStrategies.map((strategy) => strategy.id).join(", "),
            version: matchedIntentStrategies.map((strategy) => strategy.version).join(", "),
            content: intentContent,
            tokenCount: estimateTokens(intentContent)
          }
        ]
      : []),
    ...(toolPrompt ? [layerFromPromptAsset(toolPrompt, "Tool Prompt · Try-on Image")] : []),
    ...(fallbackPrompt
      ? [
          {
            name: "Fallback Prompt",
            source: fallbackPrompt.id,
            version: `${fallbackPrompt.versions} versions`,
            content: fallbackPrompt.content,
            tokenCount: estimateTokens(fallbackPrompt.content)
          }
        ]
      : []),
    {
      name: "User Context",
      source: dynamicContextPrompt?.id ?? selectedState.id,
      version: dynamicContextPrompt ? `${dynamicContextPrompt.versions} versions` : machine.version,
      content: dynamic.rendered,
      tokenCount: estimateTokens(dynamic.rendered),
      warning: dynamic.unresolved.length ? `Unresolved variables: ${dynamic.unresolved.join(", ")}` : undefined
    }
  ];

  if (selectedProactiveStrategy) {
    const content = formatProactiveStrategyLayer(selectedProactiveStrategy, selectedProactiveMotion);
    layers.splice(layers.length - 1, 0, {
      name: "Proactive Strategy",
      source: selectedProactiveStrategy.id,
      version: "runtime",
      content,
      tokenCount: estimateTokens(content)
    });
  }

  if (enableTailReinforcement) {
    const tailLines = boundariesText.split("\n").filter(Boolean).slice(0, 2);
    const content = `Tail Reinforcement:\n${tailLines.join("\n")}`;
    layers.push({
      name: "Tail Reinforcement",
      source: "enable_tail_reinforcement",
      version: "runtime",
      content,
      tokenCount: estimateTokens(content)
    });
  }

  const fullPrompt = layers.map((layer) => `[${layer.name}]\n${layer.content}`).join("\n\n");

  return {
    layers,
    fullPrompt,
    unresolvedVariables: dynamic.unresolved,
    totalTokens: layers.reduce((sum, layer) => sum + layer.tokenCount, 0),
    intent,
    toolCalls,
    structuredOutput
  };
}

export function maskUserId(userId: string) {
  return `${userId.slice(0, 4)}****`;
}

export function collapseInput(input: string) {
  return input.length > 20 ? `${input.slice(0, 20)}...` : input;
}

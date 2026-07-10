import { avatarProfile, bizStrategies, stateMachine, systemBase } from "./mockData";
import type { PromptLayer } from "./types";

const variablePattern = /\{\{\s*([a-zA-Z_][\w]*)(?:\s*\|\s*default\((.*?)\))?\s*\}\}/g;

export interface RenderOptions {
  userInput: string;
  selectedStateId: string;
  enableTailReinforcement: boolean;
}

export interface RenderResult {
  layers: PromptLayer[];
  fullPrompt: string;
  unresolvedVariables: string[];
  totalTokens: number;
}

const runtimeContext: Record<string, string> = {
  idle_motion: "Subtle eye movement and steady breathing",
  history_buffer: "Previous turn used a light three-quarter turn; return naturally to front-facing",
  action_token: "[ACT:smile]",
  proactive_text: "Hi there, happy to show what I have on today."
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

export function renderPrompt({
  userInput,
  selectedStateId,
  enableTailReinforcement
}: RenderOptions): RenderResult {
  const selectedState = stateMachine.nodes.find((node) => node.id === selectedStateId) ?? stateMachine.nodes[0];
  const selectedStrategies = bizStrategies.filter((strategy) => selectedState.strategyIds.includes(strategy.id));
  const context = {
    ...runtimeContext,
    user_input: userInput || "Show me the current outfit.",
    current_state: selectedState.name
  };

  const dynamic = resolveTemplate(selectedState.dynamicTemplate, context);
  const strategyContent = selectedStrategies
    .map(
      (strategy) =>
        `Strategy: ${strategy.name}\nVisual Anchor: ${strategy.visualAnchor}\nPose Constraints: ${strategy.poseConstraints}\nKnowledge: ${strategy.knowledgeBase}`
    )
    .join("\n\n");

  const layers: PromptLayer[] = [
    {
      name: "System Base",
      source: systemBase.id,
      version: systemBase.version,
      content: `${systemBase.actionSpace}\n${systemBase.guardrails}`,
      tokenCount: estimateTokens(`${systemBase.actionSpace}\n${systemBase.guardrails}`)
    },
    {
      name: "Avatar Profile",
      source: avatarProfile.id,
      version: avatarProfile.version,
      content: `Default Appearance:\n${avatarProfile.defaultAppearance}\n\nBoundaries:\n${avatarProfile.boundaries.join("\n")}`,
      tokenCount: estimateTokens(avatarProfile.defaultAppearance + avatarProfile.boundaries.join(""))
    },
    {
      name: "Persona",
      source: avatarProfile.id,
      version: avatarProfile.version,
      content: `${avatarProfile.persona}\nTemperament:\n${avatarProfile.temperament.join("\n")}`,
      tokenCount: estimateTokens(avatarProfile.persona + avatarProfile.temperament.join(""))
    },
    {
      name: "Business Strategy",
      source: selectedStrategies.map((strategy) => strategy.id).join(", ") || "none",
      version: selectedStrategies.map((strategy) => strategy.version).join(", ") || "-",
      content: strategyContent || "No business strategy pack is bound to the current state.",
      tokenCount: estimateTokens(strategyContent || "none")
    },
    {
      name: "Dynamic Context",
      source: selectedState.id,
      version: stateMachine.version,
      content: dynamic.rendered,
      tokenCount: estimateTokens(dynamic.rendered),
      warning: dynamic.unresolved.length ? `Unresolved variables: ${dynamic.unresolved.join(", ")}` : undefined
    }
  ];

  if (enableTailReinforcement) {
    const content = `Tail Reinforcement:\n${avatarProfile.boundaries.slice(0, 2).join("\n")}`;
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
    totalTokens: layers.reduce((sum, layer) => sum + layer.tokenCount, 0)
  };
}

export function maskUserId(userId: string) {
  return `${userId.slice(0, 4)}****`;
}

export function collapseInput(input: string) {
  return input.length > 20 ? `${input.slice(0, 20)}...` : input;
}

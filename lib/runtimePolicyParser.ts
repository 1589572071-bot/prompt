import type { ModelRoutingConfig, ToolCallingRule } from "./runtimeConfig";

const ROUTING_PRIMARY_KEYS: Record<string, string> = {
  default_llm: "llm",
  tryon_model: "tryon_model",
  scene_image_model: "scene_image_model",
  idle_motion_model: "idle_motion_chunk",
  action_motion_model: "action_motion_model",
  tryon_video_model: "tryon_video_model",
  default_tts_model: "tts_model"
};

const ROUTING_FALLBACK_KEYS: Record<string, { tool: string; field: "fallbackModel" }> = {
  fallback_llm: { tool: "llm", field: "fallbackModel" },
  fallback_image_model: { tool: "tryon_model", field: "fallbackModel" },
  fallback_tts_model: { tool: "tts_model", field: "fallbackModel" }
};

const STATE_NAME_TO_ID: Record<string, string> = {
  idle: "idle",
  proactive: "proactive",
  interaction: "interaction",
  fallback: "fallback"
};

const KNOWN_INTENTS = new Set(["outfit_change", "action_view", "outfit_reaction", "casual_chat"]);

function extractKeyValuePairs(content: string) {
  const pairs: Record<string, string> = {};
  const pattern = /([a-z_]+)\s*[:=]\s*([a-z0-9_-]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    pairs[match[1].toLowerCase()] = match[2];
  }
  return pairs;
}

export function parseModelRouting(content: string): ModelRoutingConfig[] {
  const pairs = extractKeyValuePairs(content);
  const byTool = new Map<string, ModelRoutingConfig>();

  for (const [key, value] of Object.entries(pairs)) {
    const tool = ROUTING_PRIMARY_KEYS[key];
    if (tool) {
      byTool.set(tool, {
        tool,
        model: value,
        environment: "All",
        enabled: true
      });
      continue;
    }

    const fallback = ROUTING_FALLBACK_KEYS[key];
    if (fallback) {
      const existing = byTool.get(fallback.tool) ?? {
        tool: fallback.tool,
        model: value,
        environment: "All" as const,
        enabled: true
      };
      byTool.set(fallback.tool, { ...existing, [fallback.field]: value });
    }
  }

  const parsed = Array.from(byTool.values());
  return parsed;
}

function normalizeLine(line: string) {
  return line.replace(/^[-*]\s*/, "").trim();
}

function detectTools(body: string) {
  const lower = body.toLowerCase();
  const tools = new Set<string>();
  if (lower.includes("idle_motion")) tools.add("idle_motion_chunk");
  if (lower.includes("tryon_model") || lower.includes("try-on") || lower.includes("try on")) tools.add("tryon_model");
  if (lower.includes("tryon_video") || lower.includes("video generation")) tools.add("tryon_video_model");
  if (lower.includes("action_motion")) tools.add("action_motion_model");
  if (lower.includes("tts")) tools.add("tts_model");
  if (lower.includes("do not call") && lower.includes("visual") && lower.includes("tool")) tools.add("none");
  if (lower.includes("no visual generation")) tools.add("none");
  return tools;
}

function pushRule(rules: ToolCallingRule[], rule: ToolCallingRule) {
  const duplicate = rules.some(
    (existing) =>
      existing.tool === rule.tool &&
      existing.stateId === rule.stateId &&
      existing.intent === rule.intent
  );
  if (!duplicate) rules.push(rule);
}

export function parseToolCallingRules(content: string): ToolCallingRule[] {
  const rules: ToolCallingRule[] = [];
  const lines = content.split("\n").map(normalizeLine).filter(Boolean);

  for (const line of lines) {
    const stateMatch = line.match(/^(Idle|Proactive|Interaction|Fallback)\s*:\s*(.+)$/i);
    if (stateMatch) {
      const stateId = STATE_NAME_TO_ID[stateMatch[1].toLowerCase()];
      const body = stateMatch[2];
      const tools = detectTools(body);

      if (stateId === "fallback" || tools.has("none")) {
        pushRule(rules, {
          stateId: "fallback",
          tool: "none",
          reason: body,
          requiredInputs: [],
          enabled: true
        });
      }

      if (tools.has("idle_motion_chunk")) {
        pushRule(rules, {
          stateId,
          tool: "idle_motion_chunk",
          reason: body,
          requiredInputs: [],
          enabled: true
        });
      }

      if (tools.has("tts_model") && stateId !== "idle") {
        pushRule(rules, {
          stateId,
          tool: "tts_model",
          reason: body,
          requiredInputs: ["voice"],
          enabled: true
        });
      }

      if (stateId === "interaction" && !tools.has("tts_model")) {
        pushRule(rules, {
          stateId: "interaction",
          tool: "tts_model",
          reason: "Interaction turns with spoken output use TTS",
          requiredInputs: ["voice"],
          enabled: true
        });
      }
      continue;
    }

    const intentMatch = line.match(/^([a-z_]+)\s*:\s*(.+)$/i);
    if (!intentMatch || !KNOWN_INTENTS.has(intentMatch[1])) continue;

    const intent = intentMatch[1];
    const body = intentMatch[2];
    const tools = detectTools(body);

    if (tools.has("tryon_model")) {
      pushRule(rules, {
        intent,
        tool: "tryon_model",
        reason: body,
        requiredInputs: ["look_id"],
        enabled: true
      });
    }

    if (tools.has("tryon_video_model") || (intent === "outfit_change" && body.toLowerCase().includes("video"))) {
      pushRule(rules, {
        intent,
        tool: "tryon_video_model",
        reason: body,
        requiredInputs: ["look_id"],
        enabled: true
      });
    }

    if (tools.has("action_motion_model")) {
      pushRule(rules, {
        intent,
        tool: "action_motion_model",
        reason: body,
        requiredInputs: ["action"],
        enabled: true
      });
    }
  }

  return rules;
}

export function deriveRuntimePoliciesFromPrompts(
  systemPromptAssets: Array<{ id: string; content: string }>,
  fallback: { modelRouting: ModelRoutingConfig[]; toolCallingRules: ToolCallingRule[] }
) {
  const routingPrompt = systemPromptAssets.find((asset) => asset.id === "prompt-model-routing");
  const policyPrompt = systemPromptAssets.find((asset) => asset.id === "prompt-tool-calling-policy");

  return {
    modelRouting: routingPrompt ? parseModelRouting(routingPrompt.content) : fallback.modelRouting,
    toolCallingRules: policyPrompt ? parseToolCallingRules(policyPrompt.content) : fallback.toolCallingRules
  };
}

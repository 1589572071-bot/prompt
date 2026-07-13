import { systemModelRoutingDemo, systemToolCallingPolicyDemo } from "./demoPrompts";
import { avatarProfiles, bizStrategies, proactiveStrategies, stateMachine } from "./seedData";
import { idleMotionCatalog } from "./idleMotionCatalog";
import { personaPromptCatalog } from "./personaPromptCatalog";
import { deriveRuntimePoliciesFromPrompts } from "./runtimePolicyParser";
import { systemPromptAssets } from "./systemBaseCatalog";
import type {
  AvatarProfile,
  BizStrategy,
  IdleMotion,
  PersonaPrompt,
  ProactiveStrategy,
  StateMachine
} from "./types";

export interface ModelRoutingConfig {
  tool: string;
  model: string;
  fallbackModel?: string;
  environment: "Dev" | "Staging" | "Production" | "All";
  enabled: boolean;
}

export interface ToolCallingRule {
  stateId?: string;
  intent?: string;
  tool: string;
  reason: string;
  requiredInputs: string[];
  enabled: boolean;
}

export interface RuntimeDefaultsConfig {
  defaultLanguage: string;
  idleTimeoutToProactive: string;
  proactiveCooldownDefault: string;
  interruptBufferPolicyDefault: string;
  maxToolRetries: number;
  tailReinforcementDefault: boolean;
}

export interface ObservabilityConfig {
  spanNames: string[];
  redactedFields: string[];
  logToolCalls: boolean;
}

export interface OrchestrationConfig {
  avatars: AvatarProfile[];
  personas: PersonaPrompt[];
  idleMotions: IdleMotion[];
  bizStrategies: BizStrategy[];
  proactiveStrategies: ProactiveStrategy[];
  stateMachine: StateMachine;
  systemPromptAssets: typeof systemPromptAssets;
  modelRouting: ModelRoutingConfig[];
  toolCallingRules: ToolCallingRule[];
  runtimeDefaults: RuntimeDefaultsConfig;
  observability: ObservabilityConfig;
}

function seedSystemPromptAssets() {
  return systemPromptAssets.map((asset) => {
    if (asset.id === "prompt-model-routing") {
      return { ...asset, content: systemModelRoutingDemo };
    }
    if (asset.id === "prompt-tool-calling-policy") {
      return { ...asset, content: systemToolCallingPolicyDemo };
    }
    return asset;
  });
}

export function applyRuntimePolicies(config: OrchestrationConfig): OrchestrationConfig {
  const derived = deriveRuntimePoliciesFromPrompts(config.systemPromptAssets, {
    modelRouting: config.modelRouting,
    toolCallingRules: config.toolCallingRules
  });

  return {
    ...config,
    modelRouting: derived.modelRouting.length ? derived.modelRouting : defaultModelRouting,
    toolCallingRules: derived.toolCallingRules.length ? derived.toolCallingRules : defaultToolCallingRules
  };
}

export const defaultModelRouting: ModelRoutingConfig[] = [
  { tool: "llm", model: "realtime_avatar_dialogue_v1", fallbackModel: "safe_response_v1", environment: "All", enabled: true },
  { tool: "tryon_model", model: "virtual_tryon_v2", fallbackModel: "general_image_v1", environment: "All", enabled: true },
  { tool: "tryon_video_model", model: "avatar_tryon_video_v2", environment: "All", enabled: true },
  { tool: "action_motion_model", model: "avatar_action_motion_v2", environment: "All", enabled: true },
  { tool: "idle_motion_chunk", model: "avatar_idle_motion_v1", environment: "All", enabled: true },
  { tool: "tts_model", model: "local_en_female_v1", fallbackModel: "cloud_multilingual_v1", environment: "All", enabled: true }
];

export const defaultToolCallingRules: ToolCallingRule[] = [
  { stateId: "idle", tool: "idle_motion_chunk", reason: "Idle state uses selected Character idle motion", requiredInputs: [], enabled: true },
  { stateId: "fallback", tool: "none", reason: "Fallback avoids visual generation and uses safe response", requiredInputs: [], enabled: true },
  { intent: "outfit_change", tool: "tryon_model", reason: "User requested an outfit change", requiredInputs: ["look_id"], enabled: true },
  { intent: "outfit_change", tool: "tryon_video_model", reason: "Show the changed outfit from useful angles", requiredInputs: ["look_id"], enabled: true },
  { intent: "action_view", tool: "action_motion_model", reason: "User requested a view or body action", requiredInputs: ["action"], enabled: true },
  { stateId: "proactive", tool: "tts_model", reason: "LLM generated spoken_text from proactive direction", requiredInputs: ["voice"], enabled: true },
  { stateId: "interaction", tool: "tts_model", reason: "spoken_text is non-empty", requiredInputs: ["voice"], enabled: true }
];

export const defaultRuntimeDefaults: RuntimeDefaultsConfig = {
  defaultLanguage: "English",
  idleTimeoutToProactive: "15s",
  proactiveCooldownDefault: "45s",
  interruptBufferPolicyDefault: "fade_1_5s",
  maxToolRetries: 1,
  tailReinforcementDefault: false
};

export const defaultObservability: ObservabilityConfig = {
  spanNames: [
    "state_routing",
    "persona_resolution",
    "scenario_base_resolution",
    "intent_strategy_match",
    "proactive_strategy_select",
    "prompt_assembly",
    "tool_call_plan",
    "model_inference",
    "action_parse",
    "tts_generation"
  ],
  redactedFields: ["userId", "rawUploadedImage", "credentials"],
  logToolCalls: true
};

export function createDefaultConfig(): OrchestrationConfig {
  return applyRuntimePolicies({
    avatars: avatarProfiles,
    personas: personaPromptCatalog,
    idleMotions: idleMotionCatalog,
    bizStrategies,
    proactiveStrategies,
    stateMachine,
    systemPromptAssets: seedSystemPromptAssets(),
    modelRouting: defaultModelRouting,
    toolCallingRules: defaultToolCallingRules,
    runtimeDefaults: defaultRuntimeDefaults,
    observability: defaultObservability
  });
}

import type { SystemBase } from "./types";

export type SystemBaseModuleId =
  | "algorithm-rules"
  | "image-generation-prompts"
  | "fallback-prompts"
  | "dynamic-context-templates"
  | "model-routing"
  | "tool-calling-policy"
  | "output-contract"
  | "runtime-defaults"
  | "observability";

export interface SystemBaseField {
  key: keyof Pick<
    SystemBase,
    | "actionSpace"
    | "guardrails"
    | "modelRouting"
    | "toolCallingPolicy"
    | "outputContract"
    | "runtimeDefaults"
    | "observability"
  >;
  label: string;
  rows: number;
}

export type SystemBaseModuleGroupId = "safety" | "context" | "execution" | "runtime";

export interface SystemBaseModuleGroup {
  id: SystemBaseModuleGroupId;
  label: string;
}

export interface SystemBaseModule {
  id: SystemBaseModuleId;
  groupId: SystemBaseModuleGroupId;
  name: string;
  railLabel: string;
  description: string;
  fields: SystemBaseField[];
}

export const systemBaseModuleGroups: SystemBaseModuleGroup[] = [
  { id: "safety", label: "Safety" },
  { id: "context", label: "Context" },
  { id: "execution", label: "Execution" },
  { id: "runtime", label: "Runtime" }
];

export interface SystemPromptAsset {
  id: string;
  moduleId: SystemBaseModuleId;
  name: string;
  versions: number;
  type: "text" | "json" | "yaml";
  latestVersionCreatedAt: string;
  observations: number;
  tags: string[];
  content: string;
  variables: string[];
}

export const systemBaseModules: SystemBaseModule[] = [
  {
    id: "algorithm-rules",
    groupId: "safety",
    name: "Algorithm Iron Rules",
    railLabel: "Iron Rules",
    description: "Highest-priority system rules, action protocol, and guardrails.",
    fields: [
      { key: "actionSpace", label: "Action Space", rows: 5 },
      { key: "guardrails", label: "Guardrails", rows: 5 }
    ]
  },
  {
    id: "image-generation-prompts",
    groupId: "execution",
    name: "Image Generation Prompts",
    railLabel: "Image Prompts",
    description: "System prompts used by try-on, reference image, outfit batch, and scene image generation.",
    fields: []
  },
  {
    id: "fallback-prompts",
    groupId: "safety",
    name: "Fallback Prompts",
    railLabel: "Fallback",
    description: "Reusable safe response prompts for unsupported actions, missing inputs, low confidence, and policy conflicts.",
    fields: []
  },
  {
    id: "dynamic-context-templates",
    groupId: "context",
    name: "User Context Templates",
    railLabel: "User Context",
    description: "Templates for user query, history buffer, current state, fallback reason, and runtime context.",
    fields: []
  },
  {
    id: "model-routing",
    groupId: "execution",
    name: "Model Routing",
    railLabel: "Models",
    description: "LLM, try-on, image generation, video generation, and TTS model selection.",
    fields: [{ key: "modelRouting", label: "Model Routing", rows: 14 }]
  },
  {
    id: "tool-calling-policy",
    groupId: "execution",
    name: "Tool Calling Policy",
    railLabel: "Tool Policy",
    description: "Rules for when to call try-on, image generation, video generation, and TTS.",
    fields: [{ key: "toolCallingPolicy", label: "Tool Calling Policy", rows: 16 }]
  },
  {
    id: "output-contract",
    groupId: "context",
    name: "Output Contract",
    railLabel: "Output",
    description: "Structured response contract for downstream orchestration and validation.",
    fields: [{ key: "outputContract", label: "Output Contract", rows: 16 }]
  },
  {
    id: "runtime-defaults",
    groupId: "runtime",
    name: "Runtime Defaults",
    railLabel: "Defaults",
    description: "Default language, timeout, retry, fallback, and reinforcement behavior.",
    fields: [{ key: "runtimeDefaults", label: "Runtime Defaults", rows: 10 }]
  },
  {
    id: "observability",
    groupId: "runtime",
    name: "Observability",
    railLabel: "Observability",
    description: "Trace span requirements, logging scope, and redaction rules.",
    fields: [{ key: "observability", label: "Observability", rows: 12 }]
  }
];

export const systemPromptAssets: SystemPromptAsset[] = [
  {
    id: "prompt-action-space",
    moduleId: "algorithm-rules",
    name: "avatar_action_space_system_prompt",
    versions: 2,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:20:00",
    observations: 12,
    tags: ["system", "action"],
    content: "Supported actions: nod, shake, smile, point, turn_3q, turn_around, idle_breath, tryon_silent.\nEvery spoken output must include an action tag, e.g. [ACT:smile] or [ACT:turn_3q].",
    variables: []
  },
  {
    id: "prompt-guardrails",
    moduleId: "algorithm-rules",
    name: "avatar_guardrails_system_prompt",
    versions: 3,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:21:00",
    observations: 9,
    tags: ["system", "safety"],
    content: "Use restrained responses for compliance, sensitive content, or unverified facts. Refusals must force [ACT:shake].\nDo not invent product facts or change the current visual appearance without an explicit visual action.",
    variables: []
  },
  {
    id: "aigcportal_reference_tryon_step2_image_prompt",
    moduleId: "image-generation-prompts",
    name: "aigcportal_reference_tryon_step2_image_prompt",
    versions: 2,
    type: "text",
    latestVersionCreatedAt: "2026-06-04 19:01:40",
    observations: 0,
    tags: ["try-on", "image", "reference"],
    content:
      "Generate a vertical 9:16 photorealistic real-person virtual try-on image.\nThe target model gender is {{gender}}, and the overall requested style is {{style}}.\nThe requested sub-style is {{sub_style}}.\nImage 1 is the model reference. Keep the model in Image 1 as the exact same person, preserve face identity, facial features, hairstyle, body proportion, age impression, and overall temperament as consistently as possible.\nProduct images start from Image 2 in the same order described below.\n{{product_lines}}\nThe final image must prioritize accurate product presentation, realistic wearing or carrying position, natural body structure, and no product confusion.\nDo not add text, watermarks, stickers, extra brand logos, or extra people.\n\n{{design_text}}",
    variables: ["gender", "style", "sub_style", "product_lines", "design_text"]
  },
  {
    id: "aigcportal_lifestyle_tryon_step1_design",
    moduleId: "image-generation-prompts",
    name: "aigcportal_lifestyle_tryon_step1_design",
    versions: 2,
    type: "text",
    latestVersionCreatedAt: "2026-06-04 19:00:19",
    observations: 0,
    tags: ["try-on", "design"],
    content:
      "Design a lifestyle virtual try-on image plan for a real-person model.\nUse the requested style {{style}} and sub-style {{sub_style}}.\nDescribe the scene, pose, camera framing, lighting, and product placement.\nKeep the design realistic and suitable for downstream image generation.",
    variables: ["style", "sub_style"]
  },
  {
    id: "aigcportal_lifestyle_tryon_step2_image_prompt",
    moduleId: "image-generation-prompts",
    name: "aigcportal_lifestyle_tryon_step2_image_prompt",
    versions: 2,
    type: "text",
    latestVersionCreatedAt: "2026-06-04 18:59:10",
    observations: 0,
    tags: ["try-on", "image", "lifestyle"],
    content:
      "Generate a photorealistic lifestyle try-on image from the approved design.\nKeep the same model identity and use the product images in order.\nFollow the scene and styling plan in {{design_text}}.\nAvoid text, watermarks, logo hallucinations, body distortion, or extra people.",
    variables: ["design_text"]
  },
  {
    id: "aigcportal_outfit_batch_sgl_image2_reference_prompt",
    moduleId: "image-generation-prompts",
    name: "aigcportal_outfit_batch_sgl_image2_reference_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-06-04 18:58:22",
    observations: 0,
    tags: ["outfit", "batch"],
    content:
      "Create a clean reference image for outfit batch generation.\nUse the supplied product image as the primary visual source.\nPreserve product shape, color, material impression, and important details.\nDo not introduce unrelated clothing or accessories.",
    variables: []
  },
  {
    id: "aigcportal_reference_tryon_location_system_prompt",
    moduleId: "image-generation-prompts",
    name: "aigcportal_reference_tryon_location_system_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-05-21 20:28:35",
    observations: 0,
    tags: ["try-on", "location"],
    content:
      "When a location or background is requested, modify only the surrounding environment.\nDo not change the model identity, body, outfit, shoes, accessories, or product placement unless explicitly instructed.",
    variables: []
  },
  {
    id: "aigcportal_reference_tryon_location_user_prompt",
    moduleId: "image-generation-prompts",
    name: "aigcportal_reference_tryon_location_user_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-05-21 20:27:53",
    observations: 0,
    tags: ["try-on", "location"],
    content:
      "Place the same model and outfit into the requested location: {{location}}.\nKeep the model and product unchanged. Make the background photorealistic and naturally lit.",
    variables: ["location"]
  },
  {
    id: "aigcportal_reference_tryon_step1_design",
    moduleId: "image-generation-prompts",
    name: "aigcportal_reference_tryon_step1_design",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-05-21 11:39:03",
    observations: 0,
    tags: ["try-on", "design"],
    content:
      "Create a precise virtual try-on design brief.\nSpecify camera framing, pose, product usage order, visible product details, and constraints for preserving identity and body proportion.",
    variables: []
  },
  {
    id: "fallback-safety-refusal-prompt",
    moduleId: "fallback-prompts",
    name: "safety_refusal_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:54:00",
    observations: 0,
    tags: ["fallback", "safety"],
    content:
      "When the user request violates safety, privacy, or body-shaming policy, refuse briefly and kindly. Do not lecture. Do not continue with visual generation. Use [ACT:shake].",
    variables: []
  },
  {
    id: "fallback-missing-tool-input-prompt",
    moduleId: "fallback-prompts",
    name: "missing_tool_input_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:54:00",
    observations: 0,
    tags: ["fallback", "tool"],
    content:
      "When a required tool input is missing, ask one short clarification question instead of inventing values. Keep the current avatar appearance unchanged and avoid calling generation tools.",
    variables: []
  },
  {
    id: "fallback-unsupported-action-prompt",
    moduleId: "fallback-prompts",
    name: "unsupported_action_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:54:00",
    observations: 0,
    tags: ["fallback", "action"],
    content:
      "When the requested action is not supported by the avatar action space, acknowledge it naturally and offer a nearby supported action. Do not pretend the action was completed.",
    variables: []
  },
  {
    id: "fallback-low-confidence-asr-prompt",
    moduleId: "fallback-prompts",
    name: "low_confidence_asr_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:54:00",
    observations: 0,
    tags: ["fallback", "asr"],
    content:
      "When ASR confidence is low, ask the user to repeat or choose from a short set of likely actions. Keep the tone casual and do not trigger try-on or TTS-heavy flows.",
    variables: []
  },
  {
    id: "fallback-strategy-conflict-prompt",
    moduleId: "fallback-prompts",
    name: "strategy_conflict_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:54:00",
    observations: 0,
    tags: ["fallback", "strategy"],
    content:
      "When multiple strategies conflict or the selected strategy contradicts higher-priority rules, follow System Base and Boundaries first. Give a short safe response and avoid tool calls that would amplify the conflict.",
    variables: []
  },
  {
    id: "dynamic-idle-context-template",
    moduleId: "dynamic-context-templates",
    name: "idle_context_template",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:55:00",
    observations: 0,
    tags: ["dynamic", "idle"],
    content:
      "No user input. Maintain natural idle motion: {{ idle_motion | default('light breathing') }}.",
    variables: ["idle_motion", "presence_level"]
  },
  {
    id: "dynamic-proactive-context-template",
    moduleId: "dynamic-context-templates",
    name: "proactive_context_template",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:55:00",
    observations: 0,
    tags: ["dynamic", "proactive"],
    content:
      "State: proactive · user has been silent. Generate one short spoken line from the proactive direction and persona. Do not copy example phrases verbatim.\nDirection: {{ proactive_direction }}\nSuggested motion: {{ proactive_motion }}\nOutput action token: {{ action_token }}",
    variables: ["proactive_direction", "proactive_motion", "action_token"]
  },
  {
    id: "dynamic-interaction-context-template",
    moduleId: "dynamic-context-templates",
    name: "interaction_context_template",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:55:00",
    observations: 0,
    tags: ["dynamic", "interaction"],
    content:
      "User input: {{ user_input }}. Finish the previous action naturally first: {{ history_buffer | default('none') }}.",
    variables: ["user_input", "history_buffer", "current_state"]
  },
  {
    id: "dynamic-fallback-context-template",
    moduleId: "dynamic-context-templates",
    name: "fallback_context_template",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:55:00",
    observations: 0,
    tags: ["dynamic", "fallback"],
    content:
      "When the request cannot be completed safely, use a restrained explanation and trigger [ACT:shake].",
    variables: ["fallback_reason", "action_token"]
  },
  {
    id: "dynamic-interrupt-buffer-template",
    moduleId: "dynamic-context-templates",
    name: "interrupt_buffer_template",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:55:00",
    observations: 0,
    tags: ["dynamic", "interrupt"],
    content:
      "If interrupted, first finish the previous micro-action naturally: {{ history_buffer | default('none') }}.",
    variables: ["history_buffer"]
  },
  {
    id: "prompt-model-routing",
    moduleId: "model-routing",
    name: "model_routing_system_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:22:00",
    observations: 4,
    tags: ["routing", "models"],
    content: "LLM: default_llm=realtime_avatar_dialogue_v1, fallback_llm=safe_response_v1.\nVisual generation: tryon_model=virtual_tryon_v2, scene_image_model=scene_render_v1.\nMotion and video: idle_motion_model=avatar_idle_motion_v1, action_motion_model=avatar_action_motion_v2.\nSpeech: default_tts_model=local_en_female_v1.",
    variables: []
  },
  {
    id: "prompt-tool-calling-policy",
    moduleId: "tool-calling-policy",
    name: "tool_calling_policy_system_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:23:00",
    observations: 6,
    tags: ["tools", "policy"],
    content: "Idle: call idle_motion_chunk only; do not call TTS.\nProactive: runtime selects proactive strategy direction; LLM generates spoken_text; call TTS if spoken_text is non-empty.\nInteraction: route user intent first, then call only the tools required by the matched intent.",
    variables: []
  },
  {
    id: "prompt-output-contract",
    moduleId: "output-contract",
    name: "avatar_output_contract_prompt",
    versions: 1,
    type: "json",
    latestVersionCreatedAt: "2026-07-13 15:24:00",
    observations: 3,
    tags: ["schema", "contract"],
    content: "{\n  \"state\": \"idle | proactive | interaction | fallback\",\n  \"intent\": \"outfit_change | action_view | outfit_reaction | casual_chat | none\",\n  \"spoken_text\": \"string\",\n  \"action_token\": \"[ACT:...]\",\n  \"tool_calls\": [],\n  \"look_id\": \"string | null\"\n}",
    variables: []
  },
  {
    id: "prompt-runtime-defaults",
    moduleId: "runtime-defaults",
    name: "runtime_defaults_prompt",
    versions: 1,
    type: "yaml",
    latestVersionCreatedAt: "2026-07-13 15:25:00",
    observations: 2,
    tags: ["runtime"],
    content: "default_language: English\nmax_response_sentences: 2\nidle_timeout_to_proactive: 15s\nproactive_cooldown_default: 45s\ninterrupt_buffer_policy_default: fade_1_5s\nmax_tool_retries: 1",
    variables: []
  },
  {
    id: "prompt-observability",
    moduleId: "observability",
    name: "observability_trace_policy_prompt",
    versions: 1,
    type: "text",
    latestVersionCreatedAt: "2026-07-13 15:26:00",
    observations: 8,
    tags: ["trace", "redaction"],
    content: "Trace spans: state_routing, persona_resolution, scenario_base_resolution, intent_strategy_match, proactive_strategy_select, prompt_assembly, tool_call_plan, model_inference, action_parse, tts_generation.\nMask user identifiers by default and do not log raw uploaded images or private credentials.",
    variables: []
  }
];

export function getSystemBaseModule(id: SystemBaseModuleId) {
  return systemBaseModules.find((module) => module.id === id) ?? systemBaseModules[0];
}

export function getSystemPromptAssets(moduleId: SystemBaseModuleId) {
  return systemPromptAssets.filter((asset) => asset.moduleId === moduleId);
}

export function getSystemPromptAsset(id: string) {
  return systemPromptAssets.find((asset) => asset.id === id);
}

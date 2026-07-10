export const interruptBufferPolicies = [
  { id: "none", label: "Disabled" },
  { id: "hard_cut", label: "Policy A · Hard Cut" },
  { id: "fade_1_5s", label: "Policy B · 1.5s Fade Buffer" }
] as const;

export type InterruptBufferPolicyId = (typeof interruptBufferPolicies)[number]["id"];

export const edgeEventOptions = [
  "No input timeout",
  "ASR user input",
  "User interrupt",
  "Conversation ended",
  "Strategy conflict",
  "Low ASR confidence",
  "Custom condition"
] as const;

export const edgeTimeoutOptions = ["5s", "10s", "15s", "20s", "30s", "45s", "60s"] as const;

export const defaultCustomNodeTemplate =
  "User input: {{ user_input }}. Context variables: {{ custom_context | default('none') }}.";

export const idleContextVariables = ["idle_motion", "presence_level"];

export const interactionContextVariables = ["user_input", "history_buffer", "current_state"];

export type StudioTab =
  | "base"
  | "persona"
  | "idleMotion"
  | "avatar"
  | "strategy"
  | "sandbox"
  | "trace";

export type Environment = "Dev" | "Staging" | "Production";

export type VersionStatus = "Draft" | "Pending Review" | "Published" | "Deprecated";

export type ScriptSourceType = "manual" | "avatar_script_library";

export interface PersonaPrompt {
  id: string;
  name: string;
  label: string;
  version: string;
  status: VersionStatus;
  styleSummary: string;
  relationshipSummary: string;
  speakingStyleTags: string[];
  forbiddenStyleTags: string[];
  content: string;
  updatedAt: string;
}

export interface IdleMotion {
  id: string;
  name: string;
  version: string;
  status: VersionStatus;
  category: "Breathing" | "Gaze" | "Posture" | "Gesture";
  description: string;
  actionPrompt: string;
  chunk: number;
  updatedAt: string;
}

export interface AvatarImageAsset {
  headImageUrl: string;
  headImageSize: string;
  cardImageUrl: string;
  cardImageSize: string;
}

export interface AvatarScript {
  id: string;
  name: string;
  category: string;
  text: string;
  applicableState: string;
  version: string;
  enabled: boolean;
}

export interface AvatarProfile {
  id: string;
  name: string;
  version: string;
  owner: string;
  status: VersionStatus;
  scenario: string;
  language: string;
  studio: string;
  voice: string;
  ttsUrl: string;
  personaLabel: string;
  sort: number;
  updatedAt: string;
  imageAsset: AvatarImageAsset;
  visualDescription: string;
  backgroundDescription: string;
  personaPromptId: string;
  idleMotionIds: string[];
  temperament: string[];
  topics: string[];
  speechStyle: {
    rules: string[];
    good: string;
    bad: string;
  };
  scripts: AvatarScript[];
  behaviorPreferences: {
    preferred: string[];
    avoided: string[];
    backViewRule: string;
  };
  boundaries: string[];
}

export interface SystemBase {
  id: string;
  version: string;
  status: VersionStatus;
  updatedAt: string;
  actionSpace: string;
  guardrails: string;
  modelRouting: string;
  toolCallingPolicy: string;
  outputContract: string;
  runtimeDefaults: string;
  observability: string;
}

export interface BizStrategy {
  id: string;
  name: string;
  type: string;
  activationMode: "session" | "intent";
  intentName?: string;
  triggerExamples: string[];
  similarityThreshold?: number;
  enabled: boolean;
  version: string;
  updatedAt: string;
  visualAnchor: string;
  poseConstraints: string;
  knowledgeBase: string;
}

export interface StateNode {
  id: string;
  name: string;
  type: string;
  description: string;
  dynamicTemplate: string;
  x: number;
  y: number;
  strategyIds: string[];
  proactiveStrategyIds: string[];
  initial?: boolean;
  terminal?: boolean;
  interruptLock?: boolean;
  interruptBufferPolicy?: "none" | "hard_cut" | "fade_1_5s";
}

export interface StateEdge {
  id: string;
  from: string;
  to: string;
  event: string;
  timeout?: string;
  condition?: string;
  allowInterrupt?: boolean;
}

export interface StateMachine {
  id: string;
  version: string;
  scenarioStrategyIds: string[];
  nodes: StateNode[];
  edges: StateEdge[];
  customTypes: string[];
}

export interface ProactiveStrategy {
  id: string;
  name: string;
  /** Guidance for what kinds of proactive openers are allowed — not fixed copy. */
  directionPrompt: string;
  /** Optional reference lines for authors; model must not copy verbatim. */
  examplePhrases: string[];
  /** Patterns the model should avoid when generating proactive speech. */
  forbiddenPatterns: string[];
  /** Visual motion reference for the proactive opener beat (from Idle Motions catalog). */
  suggestedMotionId: string;
  applicableStateId: string;
  /** Per-strategy throttle after this strategy fires (runtime orchestration). */
  cooldown: string;
  priority: string;
  enabled: boolean;
  updatedAt: string;
}

export interface PromptLayer {
  name: string;
  source: string;
  version: string;
  tokenCount: number;
  content: string;
  warning?: string;
}

export interface TraceSnapshot {
  id: string;
  sessionId: string;
  turnId: string;
  turnIndex: number;
  avatarId: string;
  avatarName: string;
  userId: string;
  stateNodeId: string;
  stateNode: string;
  strategyIds: string[];
  proactiveStrategyIds: string[];
  interruptBufferPolicy: string;
  strategy: string;
  environment: string;
  promptCostMs: number;
  modelCostMs: number;
  userInput: string;
  promptLayers: PromptLayer[];
  dynamicContextRendered: string;
  fullPrompt: string;
  totalTokens: number;
  unresolvedVariables: string[];
  modelOutput: string;
  actionToken: string;
  createdAt: string;
}

export type TraceSpanKind =
  | "turn"
  | "state_routing"
  | "prompt_assembly"
  | "prompt_layer"
  | "model_inference"
  | "action_parse";

export interface TraceSpan {
  id: string;
  traceId: string;
  parentId: string | null;
  name: string;
  kind: TraceSpanKind;
  durationMs: number;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  children: TraceSpan[];
}

export interface FlatTraceSpan extends TraceSpan {
  traceName: string;
  sessionId: string;
  turnId: string;
  timestamp: string;
  spanPath: string;
}

export interface SandboxCase {
  id: string;
  name: string;
  avatarId: string;
  avatarName: string;
  stateNodeId: string;
  stateNodeName: string;
  userInput: string;
  expectedIntent: string;
  expectedToolCalls: string[];
  enableTailReinforcement: boolean;
  totalTokens: number;
  status: "ready" | "passed" | "warning";
  sort: number;
  updatedAt: string;
}

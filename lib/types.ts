export type StudioTab =
  | "base"
  | "avatar"
  | "state"
  | "proactive"
  | "sandbox"
  | "trace";

export type Environment = "Dev" | "Staging" | "Production";

export type VersionStatus = "Draft" | "Pending Review" | "Published" | "Deprecated";

export type ScriptSourceType = "manual" | "avatar_script_library";

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
  personaLabel: string;
  sort: number;
  updatedAt: string;
  imageAsset: AvatarImageAsset;
  defaultAppearance: string;
  persona: string;
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
}

export interface BizStrategy {
  id: string;
  name: string;
  type: string;
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
  nodes: StateNode[];
  edges: StateEdge[];
  customTypes: string[];
}

export interface ProactiveTextAtom {
  id: string;
  name: string;
  text: string;
  sourceType: ScriptSourceType;
  sourceScriptId?: string;
  sourceScriptVersion?: string;
}

export interface ProactiveStrategy {
  id: string;
  name: string;
  textAtom: ProactiveTextAtom;
  actionToken: string;
  emotionTag: string;
  applicableStateId: string;
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

export interface SandboxCase {
  id: string;
  name: string;
  avatarId: string;
  avatarName: string;
  stateNodeId: string;
  stateNodeName: string;
  userInput: string;
  enableTailReinforcement: boolean;
  totalTokens: number;
  status: "ready" | "passed" | "warning";
  sort: number;
  updatedAt: string;
}

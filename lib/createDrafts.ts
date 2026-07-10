import { strategyTypeOptions, strategyVersionOptions } from "./strategyOptions";
import type {
  AvatarProfile,
  BizStrategy,
  ProactiveStrategy,
  SandboxCase,
  StateEdge,
  StateNode
} from "./types";

function draftId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function todayLabel() {
  const now = new Date();
  return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
}

export function createDraftBizStrategy(): BizStrategy {
  return {
    id: draftId("biz"),
    name: "New Strategy Pack",
    type: strategyTypeOptions[0],
    enabled: false,
    version: strategyVersionOptions[0],
    updatedAt: todayLabel(),
    visualAnchor: "",
    poseConstraints: "",
    knowledgeBase: ""
  };
}

export function createDraftAvatar(sort: number): AvatarProfile {
  return {
    id: draftId("avatar"),
    name: "New Avatar",
    version: "v0.1",
    owner: "Strategy PM",
    status: "Draft",
    scenario: "Live Commerce / Try-on",
    language: "English",
    studio: "preset",
    voice: "phen_localfemale",
    personaLabel: "Custom Persona",
    sort,
    updatedAt: todayLabel(),
    imageAsset: {
      headImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-824hg-mpevca",
      headImageSize: "384 x 640",
      cardImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-823rg-mp34dh",
      cardImageSize: "971 x 546"
    },
    defaultAppearance: "",
    persona: "Describe the avatar persona here.",
    temperament: [],
    topics: [],
    speechStyle: {
      rules: [],
      good: "",
      bad: ""
    },
    scripts: [],
    behaviorPreferences: {
      preferred: [],
      avoided: [],
      backViewRule: ""
    },
    boundaries: []
  };
}

export function createDraftProactiveStrategy(defaultStateId = "proactive"): ProactiveStrategy {
  const id = draftId("proactive");
  return {
    id,
    name: "New Strategy",
    textAtom: {
      id: draftId("atom"),
      name: "Manual Text Atom",
      text: "",
      sourceType: "manual"
    },
    actionToken: "[ACT:smile]",
    emotionTag: "friendly",
    applicableStateId: defaultStateId,
    cooldown: "45s",
    priority: "normal",
    enabled: false,
    updatedAt: todayLabel()
  };
}

export function createDraftSandboxCase(sort: number): SandboxCase {
  return {
    id: draftId("sandbox"),
    name: "New Simulation",
    avatarId: "avatar-jennie",
    avatarName: "Jennie",
    stateNodeId: "interaction",
    stateNodeName: "User Interaction",
    userInput: "",
    enableTailReinforcement: false,
    totalTokens: 0,
    status: "ready",
    sort,
    updatedAt: todayLabel()
  };
}

export function createDraftStateNode(existingNodes: StateNode[]): StateNode {
  const index = existingNodes.length;
  return {
    id: draftId("state"),
    name: "New State",
    type: "User Interaction",
    description: "",
    dynamicTemplate: "User input: {{ user_input }}.",
    x: 120 + index * 40,
    y: 120 + index * 30,
    strategyIds: [],
    proactiveStrategyIds: [],
    interruptBufferPolicy: "none"
  };
}

export function createDraftStateEdge(nodes: StateNode[]): StateEdge {
  const from = nodes[0]?.id ?? "idle";
  const to = nodes[1]?.id ?? from;
  return {
    id: draftId("edge"),
    from,
    to,
    event: "Custom event",
    allowInterrupt: true
  };
}

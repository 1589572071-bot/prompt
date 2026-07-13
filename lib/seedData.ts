import type {
  AvatarProfile,
  BizStrategy,
  ProactiveStrategy,
  SandboxCase,
  StateMachine,
  SystemBase
} from "./types";
import {
  alexVisualDescription,
  actionViewStrategy,
  casualChatStrategy,
  defaultAppearanceDemo,
  outfitChangeStrategy,
  outfitReactionStrategy,
  proactiveSilenceNudgeDirection,
  proactiveNextOutfitDirection,
  secondMeBoundaries,
  serenaBoundaries,
  studioBackgroundDemo,
  systemActionSpaceDemo,
  systemGuardrailsDemo,
  systemModelRoutingDemo,
  systemObservabilityDemo,
  systemOutputContractDemo,
  systemRuntimeDefaultsDemo,
  systemToolCallingPolicyDemo,
  tryonScenarioBase
} from "./demoPrompts";

export const systemBase: SystemBase = {
  id: "system-core-001",
  version: "v1.9",
  status: "Published",
  updatedAt: "2026-07-13",
  actionSpace: systemActionSpaceDemo,
  guardrails: systemGuardrailsDemo,
  modelRouting: systemModelRoutingDemo,
  toolCallingPolicy: systemToolCallingPolicyDemo,
  outputContract: systemOutputContractDemo,
  runtimeDefaults: systemRuntimeDefaultsDemo,
  observability: systemObservabilityDemo
};

export const avatarProfile: AvatarProfile = {
  id: "avatar-second-me",
  name: "Second Me",
  version: "v3.0",
  owner: "Strategy PM",
  status: "Published",
  scenario: "Live Commerce / Try-on",
  language: "English",
  studio: "preset",
  voice: "phen_localfemale",
  ttsUrl: "",
  personaLabel: "Second Me",
  sort: 0,
  updatedAt: "2026/7/13 12:00:00",
  imageAsset: {
    headImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-824hg-mpevca",
    headImageSize: "384 x 640",
    cardImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-823rg-mp34dh",
    cardImageSize: "971 x 546"
  },
  visualDescription: defaultAppearanceDemo,
  backgroundDescription: studioBackgroundDemo,
  personaPromptId: "persona-second-me",
  idleMotionIds: ["idle-default", "idle-default-breathing-plus"],
  temperament: [],
  topics: [],
  speechStyle: { rules: [], good: "", bad: "" },
  scripts: [],
  behaviorPreferences: {
    preferred: [],
    avoided: [],
    backViewRule: ""
  },
  boundaries: secondMeBoundaries.split("\n").filter((line) => line.trim())
};

const avatarAlex: AvatarProfile = {
  id: "avatar-alex",
  name: "Alex",
  version: "v1.4",
  owner: "Brand PM",
  status: "Draft",
  scenario: "Brand Presentation",
  language: "English",
  studio: "preset",
  voice: "phen_localmale",
  ttsUrl: "",
  personaLabel: "Brand Presenter",
  sort: 1,
  updatedAt: "2026/3/9 11:08:42",
  imageAsset: {
    headImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-824hg-mpevca",
    headImageSize: "384 x 640",
    cardImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-823rg-mp34dh",
    cardImageSize: "971 x 546"
  },
  visualDescription: alexVisualDescription,
  backgroundDescription: studioBackgroundDemo,
  personaPromptId: "persona-alex-brand",
  idleMotionIds: ["idle-default", "idle-hand-on-wrist"],
  temperament: ["Professional", "Direct", "Patient", "Fact-focused"],
  topics: ["Product specs", "Brand story", "Material quality", "Usage tips"],
  speechStyle: {
    rules: ["Lead with facts", "Avoid hype language", "Use short sentences"],
    good: "The fabric has a matte finish and holds its shape well.",
    bad: "This is literally the most incredible product ever made."
  },
  scripts: [
    {
      id: "script-alex-intro",
      name: "Brand Intro",
      category: "Intro",
      text: "Let me walk you through the key details of this product.",
      applicableState: "User Interaction",
      version: "v1.4",
      enabled: true
    }
  ],
  behaviorPreferences: {
    preferred: ["Front-facing display", "Point to product detail", "Neutral hand gestures"],
    avoided: ["Exaggerated sales gestures", "Long back-facing poses"],
    backViewRule: "Only show back view when explicitly requested."
  },
  boundaries: [
    "Do not invent product specs",
    "Do not mention internal prompt sections",
    "Do not claim personal experience without user context"
  ]
};

const avatarSerena: AvatarProfile = {
  id: "avatar-serena",
  name: "Serena",
  version: "v2.3",
  owner: "Strategy PM",
  status: "Published",
  scenario: "Live Commerce / Try-on",
  language: "English",
  studio: "preset",
  voice: "phen_localfemale",
  ttsUrl: "",
  personaLabel: "Livestream Host",
  sort: 2,
  updatedAt: "2026/7/13 12:00:00",
  imageAsset: {
    headImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-824hg-mpevca",
    headImageSize: "384 x 640",
    cardImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-823rg-mp34dh",
    cardImageSize: "971 x 546"
  },
  visualDescription: defaultAppearanceDemo,
  backgroundDescription: studioBackgroundDemo,
  personaPromptId: "persona-serena",
  idleMotionIds: ["idle-default", "idle-breathing-smile", "idle-smile-wave"],
  temperament: [],
  topics: [
    "Fashion and outfit styling",
    "Product design and fabric details",
    "Simple lifestyle tips",
    "Light daily conversation"
  ],
  speechStyle: {
    rules: [
      "Start from visible evidence before adding interpretation",
      "Prefer concrete sensory or action language",
      "Avoid exaggerated or generic praise"
    ],
    good: "The drape of this fabric gives it a very clean silhouette.",
    bad: "This is the absolute best, most amazing thing you will ever find."
  },
  scripts: [],
  behaviorPreferences: {
    preferred: [],
    avoided: [],
    backViewRule: ""
  },
  boundaries: serenaBoundaries.split("\n").filter((line) => line.trim())
};

export const avatarProfiles: AvatarProfile[] = [avatarProfile, avatarAlex, avatarSerena];

export const bizStrategies: BizStrategy[] = [
  {
    id: "biz-tryon-base",
    name: "Try-on Scenario Base",
    type: "Scenario",
    activationMode: "session",
    triggerExamples: [],
    enabled: true,
    version: "v1.0",
    updatedAt: "2026-07-13",
    visualAnchor: "Keep current outfit after try-on; do not invent accessories",
    poseConstraints: "Keep the avatar available for front-facing interaction; specific poses come from matched intent strategies.",
    knowledgeBase: tryonScenarioBase
  },
  {
    id: "biz-outfit-change",
    name: "Outfit Change Strategy",
    type: "Intent",
    activationMode: "intent",
    intentName: "outfit_change",
    triggerExamples: [
      "Try on the first item",
      "Change into another outfit",
      "Wear something for work",
      "Put this dress on"
    ],
    similarityThreshold: 0.5,
    enabled: true,
    version: "v1.0",
    updatedAt: "2026-07-13",
    visualAnchor: "Apply only the requested look_id; preserve unmentioned appearance details.",
    poseConstraints: "Use a silent try-on beat, then front, three-quarter, and relevant detail views.",
    knowledgeBase: outfitChangeStrategy
  },
  {
    id: "biz-action-view",
    name: "Action & View Strategy",
    type: "Intent",
    activationMode: "intent",
    intentName: "action_view",
    triggerExamples: ["Show me the back", "Turn around", "Raise your arm", "Show me the sleeve"],
    similarityThreshold: 0.5,
    enabled: true,
    version: "v1.0",
    updatedAt: "2026-07-13",
    visualAnchor: "Keep the current outfit and scene unchanged.",
    poseConstraints: "Execute only the requested view, then return to front or three-quarter view.",
    knowledgeBase: actionViewStrategy
  },
  {
    id: "biz-outfit-reaction",
    name: "Outfit Reaction Strategy",
    type: "Intent",
    activationMode: "intent",
    intentName: "outfit_reaction",
    triggerExamples: ["Do you like this outfit", "Does this suit me", "Does it look good", "What do you think"],
    similarityThreshold: 0.5,
    enabled: true,
    version: "v1.0",
    updatedAt: "2026-07-13",
    visualAnchor: "Ground comments in the current visible outfit.",
    poseConstraints: "Use a small natural gesture; do not start an unrelated try-on.",
    knowledgeBase: outfitReactionStrategy
  },
  {
    id: "biz-casual-chat",
    name: "Casual Chat Strategy",
    type: "Intent",
    activationMode: "intent",
    intentName: "casual_chat",
    triggerExamples: ["I'm so bored", "Let's chat", "How are you", "What should we do next"],
    similarityThreshold: 0.5,
    enabled: true,
    version: "v1.0",
    updatedAt: "2026-07-13",
    visualAnchor: "Keep the current avatar appearance and scene.",
    poseConstraints: "Use subtle conversational gestures.",
    knowledgeBase: casualChatStrategy
  }
];

export const stateMachine: StateMachine = {
  id: "state-second-me-main",
  version: "v1.1",
  scenarioStrategyIds: ["biz-tryon-base"],
  customTypes: ["Product Comparison", "Support Q&A", "Size Recommendation"],
  nodes: [
    {
      id: "idle",
      name: "Idle Standby",
      type: "Idle Standby",
      description: "Subtle eye movement and steady breathing to maintain on-camera presence.",
      dynamicTemplate: "No user input. Maintain natural idle motion: {{ idle_motion | default('light breathing') }}.",
      x: 70,
      y: 130,
      strategyIds: [],
      proactiveStrategyIds: [],
      initial: true,
      interruptLock: true,
      interruptBufferPolicy: "fade_1_5s"
    },
    {
      id: "proactive",
      name: "Proactive Active",
      type: "Proactive Active",
      description: "Offer light guidance when the user stays silent.",
      dynamicTemplate:
        "State: proactive · user has been silent. Generate one short spoken line from the proactive direction and persona. Do not copy example phrases verbatim.\nDirection: {{ proactive_direction }}\nSuggested motion: {{ proactive_motion }}\nOutput action token: {{ action_token }}",
      x: 290,
      y: 65,
      strategyIds: [],
      proactiveStrategyIds: ["proactive-greeting", "proactive-promo"]
    },
    {
      id: "interaction",
      name: "User Interaction",
      type: "User Interaction",
      description: "Respond to user questions and continue from the previous action buffer.",
      dynamicTemplate:
        "User input: {{ user_input }}. Finish the previous action naturally first: {{ history_buffer | default('none') }}.",
      x: 300,
      y: 240,
      strategyIds: [
        "biz-outfit-change",
        "biz-action-view",
        "biz-outfit-reaction",
        "biz-casual-chat"
      ],
      proactiveStrategyIds: [],
      interruptLock: true,
      interruptBufferPolicy: "fade_1_5s"
    },
    {
      id: "fallback",
      name: "Fallback",
      type: "Fallback",
      description: "Enter fallback when strategy conflicts or required variables are missing.",
      dynamicTemplate: "When the request cannot be completed safely, use a restrained explanation and trigger [ACT:shake].",
      x: 560,
      y: 160,
      strategyIds: [],
      proactiveStrategyIds: [],
      terminal: true
    }
  ],
  edges: [
    {
      id: "e1",
      from: "idle",
      to: "proactive",
      event: "No input timeout",
      timeout: "15s",
      condition: "idle_duration >= 15s",
      allowInterrupt: true
    },
    { id: "e2", from: "idle", to: "interaction", event: "ASR user input", allowInterrupt: true },
    { id: "e3", from: "proactive", to: "interaction", event: "User interrupt", allowInterrupt: true },
    { id: "e4", from: "interaction", to: "idle", event: "Conversation ended" },
    {
      id: "e5",
      from: "interaction",
      to: "fallback",
      event: "Strategy conflict",
      condition: "strategy_conflict == true"
    }
  ]
};

export const proactiveStrategies: ProactiveStrategy[] = [
  {
    id: "proactive-greeting",
    name: "Silence Nudge",
    directionPrompt: proactiveSilenceNudgeDirection,
    examplePhrases: [
      "Hey, still here! Want to try another look, or chat about this one?",
      "Should we switch to the next outfit, or stay with this vibe?"
    ],
    forbiddenPatterns: ["sales pitch", "limited time offer", "buy now", "livestream host tone"],
    suggestedMotionId: "idle-breathing-smile",
    applicableStateId: "proactive",
    cooldown: "45s",
    priority: "normal",
    enabled: true,
    updatedAt: "2026-07-09"
  },
  {
    id: "proactive-promo",
    name: "Try Next Outfit Invite",
    directionPrompt: proactiveNextOutfitDirection,
    examplePhrases: ["This one's kinda fun — want me to try the next outfit so we can compare?"],
    forbiddenPatterns: ["hard sell", "discount", "add to cart", "teacher-like explanation"],
    suggestedMotionId: "idle-smile-wave",
    applicableStateId: "proactive",
    cooldown: "60s",
    priority: "high",
    enabled: true,
    updatedAt: "2026-07-07"
  }
];

export interface TraceSnapshotSeed {
  id: string;
  sessionId: string;
  turnId: string;
  turnIndex: number;
  avatarId: string;
  avatarName: string;
  userId: string;
  stateNodeId: string;
  environment: string;
  promptCostMs: number;
  modelCostMs: number;
  userInput: string;
  modelOutput: string;
  actionToken: string;
  createdAt: string;
  enableTailReinforcement?: boolean;
}

export const traceSnapshotSeeds: TraceSnapshotSeed[] = [
  {
    id: "trace-demo-idle",
    sessionId: "sess_state_demo",
    turnId: "turn_idle_001",
    turnIndex: 1,
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    userId: "user_demo_001",
    stateNodeId: "idle",
    environment: "Dev",
    promptCostMs: 2.4,
    modelCostMs: 0,
    userInput: "No user input (0–15s)",
    modelOutput:
      "No spoken output. Run Default Motion or Default Motion (Breathing Plus). [ACT:idle_breath]",
    actionToken: "[ACT:idle_breath]",
    createdAt: "2026/7/13 14:30:01"
  },
  {
    id: "trace-demo-proactive",
    sessionId: "sess_state_demo",
    turnId: "turn_proactive_002",
    turnIndex: 2,
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    userId: "user_demo_001",
    stateNodeId: "proactive",
    environment: "Dev",
    promptCostMs: 2.8,
    modelCostMs: 148,
    userInput: "No input timeout reached (15s)",
    modelOutput: "This one's kinda fun — want me to try the next outfit so we can compare? [ACT:smile]",
    actionToken: "[ACT:smile]",
    createdAt: "2026/7/13 14:30:16"
  },
  {
    id: "trace-demo-interaction-match",
    sessionId: "sess_state_demo",
    turnId: "turn_interaction_003",
    turnIndex: 3,
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    userId: "user_demo_001",
    stateNodeId: "interaction",
    environment: "Dev",
    promptCostMs: 3.2,
    modelCostMs: 176,
    userInput: "Try on the first item.",
    modelOutput:
      "Okay wait — putting this one on now. The color combo is so nice, kinda beach-holiday vibes! What do you think? [ACT:turn_3q]",
    actionToken: "[ACT:turn_3q]",
    createdAt: "2026/7/13 14:30:21"
  },
  {
    id: "trace-demo-interaction-action",
    sessionId: "sess_state_demo",
    turnId: "turn_interaction_004",
    turnIndex: 4,
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    userId: "user_demo_001",
    stateNodeId: "interaction",
    environment: "Dev",
    promptCostMs: 3.0,
    modelCostMs: 164,
    userInput: "Show me the back.",
    modelOutput: "Okay, quick back view — then I'll turn to the front again so we can compare. [ACT:turn_around]",
    actionToken: "[ACT:turn_around]",
    createdAt: "2026/7/13 14:30:28"
  },
  {
    id: "trace-demo-interaction-none",
    sessionId: "sess_state_demo",
    turnId: "turn_interaction_005",
    turnIndex: 5,
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    userId: "user_demo_001",
    stateNodeId: "interaction",
    environment: "Dev",
    promptCostMs: 2.7,
    modelCostMs: 152,
    userInput: "Tell me a fun fact about the moon.",
    modelOutput: "A day on the Moon lasts about 29.5 Earth days. Kinda wild, right? [ACT:smile]",
    actionToken: "[ACT:smile]",
    createdAt: "2026/7/13 14:30:35"
  }
];

export const sandboxCases: SandboxCase[] = [
  {
    id: "sandbox-001",
    name: "Try-on Interaction",
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    stateNodeId: "interaction",
    stateNodeName: "User Interaction",
    userInput: "Try on the first item.",
    expectedIntent: "outfit_change",
    expectedToolCalls: ["tryon_model", "tryon_video_model", "tts_model"],
    enableTailReinforcement: false,
    totalTokens: 842,
    status: "passed",
    sort: 0,
    updatedAt: "2026/3/10 15:40:12"
  },
  {
    id: "sandbox-002",
    name: "Idle Timeout Prompt",
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    stateNodeId: "idle",
    stateNodeName: "Idle Standby",
    userInput: "No input timeout",
    expectedIntent: "none",
    expectedToolCalls: ["idle_motion_chunk"],
    enableTailReinforcement: false,
    totalTokens: 612,
    status: "ready",
    sort: 1,
    updatedAt: "2026/3/10 14:18:06"
  },
  {
    id: "sandbox-003",
    name: "Proactive Invite Check",
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    stateNodeId: "proactive",
    stateNodeName: "Proactive Active",
    userInput: "No input timeout",
    expectedIntent: "proactive_invite",
    expectedToolCalls: ["tts_model"],
    enableTailReinforcement: true,
    totalTokens: 905,
    status: "warning",
    sort: 2,
    updatedAt: "2026/3/9 18:02:44"
  },
  {
    id: "sandbox-004",
    name: "Brand Q&A Smoke Test",
    avatarId: "avatar-alex",
    avatarName: "Alex",
    stateNodeId: "interaction",
    stateNodeName: "User Interaction",
    userInput: "What material is this jacket made of?",
    expectedIntent: "none",
    expectedToolCalls: ["tts_model"],
    enableTailReinforcement: false,
    totalTokens: 731,
    status: "passed",
    sort: 3,
    updatedAt: "2026/3/9 10:11:29"
  },
  {
    id: "sandbox-005",
    name: "Action View · Back",
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    stateNodeId: "interaction",
    stateNodeName: "User Interaction",
    userInput: "Show me the back.",
    expectedIntent: "action_view",
    expectedToolCalls: ["action_motion_model", "tts_model"],
    enableTailReinforcement: false,
    totalTokens: 780,
    status: "passed",
    sort: 4,
    updatedAt: "2026/7/13 16:00:00"
  },
  {
    id: "sandbox-006",
    name: "Outfit Reaction",
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    stateNodeId: "interaction",
    stateNodeName: "User Interaction",
    userInput: "Do you like this outfit?",
    expectedIntent: "outfit_reaction",
    expectedToolCalls: ["tts_model"],
    enableTailReinforcement: false,
    totalTokens: 760,
    status: "passed",
    sort: 5,
    updatedAt: "2026/7/13 16:00:00"
  },
  {
    id: "sandbox-007",
    name: "Casual Chat",
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    stateNodeId: "interaction",
    stateNodeName: "User Interaction",
    userInput: "I'm so bored.",
    expectedIntent: "casual_chat",
    expectedToolCalls: ["tts_model"],
    enableTailReinforcement: false,
    totalTokens: 740,
    status: "passed",
    sort: 6,
    updatedAt: "2026/7/13 16:00:00"
  },
  {
    id: "sandbox-008",
    name: "No Intent Match",
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    stateNodeId: "interaction",
    stateNodeName: "User Interaction",
    userInput: "Tell me a fun fact about the moon.",
    expectedIntent: "none",
    expectedToolCalls: ["tts_model"],
    enableTailReinforcement: false,
    totalTokens: 720,
    status: "warning",
    sort: 7,
    updatedAt: "2026/7/13 16:00:00"
  },
  {
    id: "sandbox-009",
    name: "Fallback · Strategy Conflict",
    avatarId: "avatar-second-me",
    avatarName: "Second Me",
    stateNodeId: "fallback",
    stateNodeName: "Fallback",
    userInput: "Change my body shape and make the clothes fit.",
    expectedIntent: "none",
    expectedToolCalls: ["none"],
    enableTailReinforcement: false,
    totalTokens: 690,
    status: "warning",
    sort: 8,
    updatedAt: "2026/7/13 16:00:00"
  }
];

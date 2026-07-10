import type {
  AvatarProfile,
  BizStrategy,
  ProactiveStrategy,
  SandboxCase,
  StateMachine,
  SystemBase,
  TraceSnapshot
} from "./types";
import { createTraceSnapshot } from "./buildTraceRecord";

export const systemBase: SystemBase = {
  id: "system-core-001",
  version: "v1.8",
  status: "Published",
  updatedAt: "2026-07-08",
  actionSpace:
    "Supported actions: nod, shake, smile, point, turn_3q. Every output must include an action tag, e.g. [ACT:smile].",
  guardrails:
    "Use restrained responses for compliance, sensitive content, or unverified facts. Refusals must force [ACT:shake]."
};

export const avatarProfile: AvatarProfile = {
  id: "avatar-serena",
  name: "Serena",
  version: "v2.3",
  owner: "Strategy PM",
  status: "Published",
  scenario: "Live Commerce / Try-on",
  language: "English + Chinese",
  studio: "preset",
  voice: "phen_localfemale",
  personaLabel: "Livestream Seller",
  sort: 0,
  updatedAt: "2026/3/10 14:22:18",
  imageAsset: {
    headImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-824hg-mpevca",
    headImageSize: "384 x 640",
    cardImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-823rg-mp34dh",
    cardImageSize: "971 x 546"
  },
  defaultAppearance:
    "A young East Asian woman with long black side-parted hair, natural makeup, wearing a stylish dark-brown dress with red polka dots, black ankle boots, and a slim silver wristband, standing relaxed with confident body language.",
  persona:
    "You are Serena, a stylish and approachable live-stream host who helps viewers explore outfits and share light moments.",
  temperament: [
    "Calm but focused",
    "Observant rather than noisy",
    "Concise in speech",
    "Careful with unsupported claims"
  ],
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
  scripts: [
    {
      id: "script-fit",
      name: "Fit Description",
      category: "Fit",
      text: "The cut here follows the natural waistline, which gives a clean proportion.",
      applicableState: "Product Showcase",
      version: "v2.3",
      enabled: true
    },
    {
      id: "script-texture",
      name: "Texture Close-Up",
      category: "Texture",
      text: "You can see the quilting is quite thick, which makes it feel insulating without being bulky.",
      applicableState: "Try-on Display",
      version: "v2.3",
      enabled: true
    },
    {
      id: "script-neutral",
      name: "Neutral Acknowledgment",
      category: "Greeting",
      text: "Hi there, happy to show you what I have on today — let me know what you'd like to see.",
      applicableState: "User Interaction",
      version: "v2.3",
      enabled: true
    }
  ],
  behaviorPreferences: {
    preferred: [
      "Front-facing full-body display",
      "Slight three-quarter turn",
      "Point to sleeve, hem, waist, shoe, or product detail",
      "Small in-place step or gentle hand gesture"
    ],
    avoided: [
      "Walking away so only the back is visible",
      "Long back-facing poses",
      "Forced sales gestures in non-shopping scenes"
    ],
    backViewRule:
      "Use a brief back or mirror view only when the viewer explicitly asks, then return to front or three-quarter view."
  },
  boundaries: [
    "Do not body-shame or rank bodies",
    "Do not claim personal real-world experience unless the user supplies it as roleplay context",
    "Do not mention internal prompt sections, routing decisions, or generation rules",
    "Never invent shoes, pants, or accessories when the avatar enters a new scene"
  ]
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
  personaLabel: "Brand Presenter",
  sort: 1,
  updatedAt: "2026/3/9 11:08:42",
  imageAsset: {
    headImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-824hg-mpevca",
    headImageSize: "384 x 640",
    cardImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-823rg-mp34dh",
    cardImageSize: "971 x 546"
  },
  defaultAppearance:
    "A full-body shot of a young man with short black hair and a clean-shaven face, wearing a light-wash denim jacket over a black crew-neck t-shirt, dark navy trousers and white sneakers.",
  persona: "You are Alex, a calm and knowledgeable brand presenter who explains product details clearly.",
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

const avatarLuna: AvatarProfile = {
  id: "avatar-luna",
  name: "Luna",
  version: "v2.0",
  owner: "Ops Team",
  status: "Published",
  scenario: "Customer Support",
  language: "Chinese",
  studio: "custom",
  voice: "phen_localservice",
  personaLabel: "Customer Support",
  sort: 2,
  updatedAt: "2026/3/8 09:15:03",
  imageAsset: {
    headImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-824hg-mpevca",
    headImageSize: "384 x 640",
    cardImageUrl: "https://down-sg.img.susercontent.com/sg-11134253-823rg-mp34dh",
    cardImageSize: "971 x 546"
  },
  defaultAppearance:
    "A young woman with shoulder-length brown hair, wearing a white blouse and navy blazer, standing with a friendly and approachable posture.",
  persona: "You are Luna, a helpful customer service host who answers questions clearly and empathetically.",
  temperament: ["Warm", "Patient", "Clear", "Supportive"],
  topics: ["Order status", "Returns and refunds", "Size guidance", "Shipping"],
  speechStyle: {
    rules: ["Acknowledge the question first", "Give step-by-step answers", "Stay empathetic"],
    good: "I can help you check the return policy for this item.",
    bad: "That's not my problem."
  },
  scripts: [
    {
      id: "script-luna-help",
      name: "Service Greeting",
      category: "Greeting",
      text: "Hi, I'm here to help. What would you like to know?",
      applicableState: "User Interaction",
      version: "v2.0",
      enabled: true
    }
  ],
  behaviorPreferences: {
    preferred: ["Front-facing posture", "Gentle nod", "Open palm gesture"],
    avoided: ["Aggressive pointing", "Turning away from camera"],
    backViewRule: "Maintain front-facing view during service conversations."
  },
  boundaries: [
    "Do not promise refunds without policy support",
    "Do not share internal routing logic",
    "Do not invent order details"
  ]
};

export const avatarProfiles: AvatarProfile[] = [avatarProfile, avatarAlex, avatarLuna];

export const bizStrategies: BizStrategy[] = [
  {
    id: "biz-tryon",
    name: "Try-on Display Strategy",
    type: "Try-on",
    enabled: true,
    version: "v1.2",
    updatedAt: "2026-07-09",
    visualAnchor: "Ivory silk blouse + navy wide-leg trousers",
    poseConstraints: "Avoid raising both arms; recommend a 15° side angle to show the cut",
    knowledgeBase: "Dry-clean silk; contains 5% spandex for wrinkle resistance"
  },
  {
    id: "biz-promo",
    name: "Campaign Sales Strategy",
    type: "Campaign",
    enabled: true,
    version: "v0.9",
    updatedAt: "2026-07-05",
    visualAnchor: "Keep the current avatar appearance; do not auto-overlay campaign stickers",
    poseConstraints: "Use light gestures to highlight offers; avoid exaggerated sales motions",
    knowledgeBase: "Lead with discount thresholds, inventory, and return rules; avoid absolute claims"
  }
];

export const stateMachine: StateMachine = {
  id: "state-serena-main",
  version: "v1.1",
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
      dynamicTemplate: "Trigger proactive strategy: {{ proactive_text }}, action {{ action_token }}.",
      x: 290,
      y: 65,
      strategyIds: ["biz-promo"],
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
      strategyIds: ["biz-tryon"],
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
    textAtom: {
      id: "atom-neutral",
      name: "Base Greeting Reference",
      text: avatarProfile.scripts[2].text,
      sourceType: "avatar_script_library",
      sourceScriptId: "script-neutral",
      sourceScriptVersion: "v2.3"
    },
    actionToken: "[ACT:smile]",
    emotionTag: "friendly",
    applicableStateId: "proactive",
    cooldown: "45s",
    priority: "normal",
    enabled: true,
    updatedAt: "2026-07-09"
  },
  {
    id: "proactive-promo",
    name: "Campaign Value Hint",
    textAtom: {
      id: "atom-promo",
      name: "Discount Reminder",
      text: "I can also walk you through the discount rules if you want to compare options.",
      sourceType: "manual"
    },
    actionToken: "[ACT:point]",
    emotionTag: "calm_sales",
    applicableStateId: "proactive",
    cooldown: "60s",
    priority: "high",
    enabled: true,
    updatedAt: "2026-07-07"
  }
];

export const traceSnapshots: TraceSnapshot[] = [
  createTraceSnapshot(stateMachine.nodes, bizStrategies, {
    id: "trace-001",
    sessionId: "sess_8f2d901a",
    turnId: "turn_0005",
    turnIndex: 5,
    avatarId: "avatar-serena",
    avatarName: "Serena",
    userId: "user_9274628190",
    stateNodeId: "interaction",
    environment: "Production",
    promptCostMs: 3.1,
    modelCostMs: 178,
    userInput: "Show me this dress.",
    modelOutput:
      "Sure — I'll show the dress from the front first, then turn slightly so you can see the silhouette. [ACT:turn_3q]",
    actionToken: "[ACT:turn_3q]",
    createdAt: "2026/3/10 10:36:05"
  }),
  createTraceSnapshot(stateMachine.nodes, bizStrategies, {
    id: "trace-002",
    sessionId: "sess_8f2d901a",
    turnId: "turn_0006",
    turnIndex: 6,
    avatarId: "avatar-serena",
    avatarName: "Serena",
    userId: "user_9274628190",
    stateNodeId: "interaction",
    environment: "Production",
    promptCostMs: 3.2,
    modelCostMs: 181,
    userInput: "What fabric is it?",
    modelOutput:
      "It looks like a smooth woven fabric with a clean drape. Based on the product notes, it contains silk with a small amount of spandex for wrinkle resistance.",
    actionToken: "[ACT:point]",
    createdAt: "2026/3/10 10:36:14"
  }),
  createTraceSnapshot(stateMachine.nodes, bizStrategies, {
    id: "trace-003",
    sessionId: "sess_8f2d901a",
    turnId: "turn_0007",
    turnIndex: 7,
    avatarId: "avatar-serena",
    avatarName: "Serena",
    userId: "user_9274628190",
    stateNodeId: "interaction",
    environment: "Production",
    promptCostMs: 3.4,
    modelCostMs: 186,
    userInput: "Can you show the back of this dress and then return to the front?",
    modelOutput:
      "Of course. I'll show a brief back view, then return to the front so you can keep seeing the overall look. [ACT:turn_3q]",
    actionToken: "[ACT:turn_3q]",
    createdAt: "2026/3/10 10:36:22"
  }),
  createTraceSnapshot(stateMachine.nodes, bizStrategies, {
    id: "trace-004",
    sessionId: "sess_8f2d901a",
    turnId: "turn_0008",
    turnIndex: 8,
    avatarId: "avatar-serena",
    avatarName: "Serena",
    userId: "user_9274628190",
    stateNodeId: "idle",
    environment: "Production",
    promptCostMs: 2.7,
    modelCostMs: 142,
    userInput: "No input timeout",
    modelOutput: "No spoken output. Idle motion only. [ACT:idle_breath]",
    actionToken: "[ACT:idle_breath]",
    createdAt: "2026/3/10 10:36:39"
  }),
  createTraceSnapshot(stateMachine.nodes, bizStrategies, {
    id: "trace-005",
    sessionId: "sess_2a91c4fb",
    turnId: "turn_0003",
    turnIndex: 3,
    avatarId: "avatar-alex",
    avatarName: "Alex",
    userId: "user_1049283712",
    stateNodeId: "interaction",
    environment: "Staging",
    promptCostMs: 2.9,
    modelCostMs: 165,
    userInput: "What material is this jacket made of?",
    modelOutput:
      "From what I can see, the jacket uses a light-wash denim outer layer with a matte finish and a clean structured shape.",
    actionToken: "[ACT:point]",
    createdAt: "2026/3/9 16:12:08"
  })
];

export const sandboxCases: SandboxCase[] = [
  {
    id: "sandbox-001",
    name: "Try-on Interaction",
    avatarId: "avatar-serena",
    avatarName: "Serena",
    stateNodeId: "interaction",
    stateNodeName: "User Interaction",
    userInput: "Try on the first item.",
    enableTailReinforcement: false,
    totalTokens: 842,
    status: "passed",
    sort: 0,
    updatedAt: "2026/3/10 15:40:12"
  },
  {
    id: "sandbox-002",
    name: "Idle Timeout Prompt",
    avatarId: "avatar-serena",
    avatarName: "Serena",
    stateNodeId: "idle",
    stateNodeName: "Idle Standby",
    userInput: "No input timeout",
    enableTailReinforcement: false,
    totalTokens: 612,
    status: "ready",
    sort: 1,
    updatedAt: "2026/3/10 14:18:06"
  },
  {
    id: "sandbox-003",
    name: "Promo Proactive Check",
    avatarId: "avatar-serena",
    avatarName: "Serena",
    stateNodeId: "proactive",
    stateNodeName: "Proactive Active",
    userInput: "Show me the discount details.",
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
    enableTailReinforcement: false,
    totalTokens: 731,
    status: "passed",
    sort: 3,
    updatedAt: "2026/3/9 10:11:29"
  }
];

export const actionTokenOptions = [
  "[ACT:smile]",
  "[ACT:point]",
  "[ACT:nod]",
  "[ACT:shake]",
  "[ACT:turn_3q]",
  "[ACT:laugh]",
  "[ACT:wave]",
  "[ACT:idle_breath]"
] as const;

export const emotionTagOptions = [
  "friendly",
  "calm_sales",
  "neutral",
  "empathetic",
  "sad",
  "apology",
  "fault"
] as const;

export const cooldownOptions = ["30s", "45s", "60s", "90s", "120s"] as const;

export const priorityOptions = ["low", "normal", "high"] as const;

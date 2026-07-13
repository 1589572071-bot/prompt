import type { IdleMotion } from "./types";

/** Motions suitable as visual references when breaking silence in Proactive state. */
export const proactiveMotionIds = [
  "idle-smile-wave",
  "idle-breathing-smile",
  "idle-default-breathing-plus",
  "idle-hand-on-wrist",
  "idle-hands-folded",
  "idle-hands-open-close"
] as const;

export type ProactiveMotionId = (typeof proactiveMotionIds)[number];

export function isProactiveMotionId(id: string): id is ProactiveMotionId {
  return (proactiveMotionIds as readonly string[]).includes(id);
}

export function getProactiveMotionCandidates(motions: IdleMotion[]) {
  return motions.filter((motion) => motion.status === "Published" && isProactiveMotionId(motion.id));
}

export function resolveProactiveMotion(motionId: string, motions: IdleMotion[]) {
  return motions.find((motion) => motion.id === motionId);
}

export function deriveActionTokenFromMotion(motion?: IdleMotion) {
  if (!motion) return "[ACT:smile]";
  const haystack = `${motion.id} ${motion.name} ${motion.description}`.toLowerCase();
  if (haystack.includes("wave")) return "[ACT:wave]";
  if (haystack.includes("nod")) return "[ACT:nod]";
  if (haystack.includes("point")) return "[ACT:point]";
  if (haystack.includes("turn")) return "[ACT:turn_3q]";
  return "[ACT:smile]";
}

export function formatProactiveMotionReference(motion?: IdleMotion) {
  if (!motion) return "Use a small natural opener gesture with a gentle smile.";
  return `${motion.name} (${motion.chunk} chunks): ${motion.actionPrompt}`;
}

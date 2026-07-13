import type { IdleMotion } from "./types";

export function createIdleMotionDraft(): IdleMotion {
  const now = new Date();
  return {
    id: `idle-${Date.now()}`,
    name: "New Idle Motion",
    version: "v0.1",
    status: "Draft",
    category: "Gesture",
    description: "",
    actionPrompt: "",
    chunk: 1,
    updatedAt: `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
  };
}

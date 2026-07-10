import type { StateNode } from "./types";

export type NodeBehaviorCategory = "idle" | "proactive" | "interaction" | "fallback" | "custom";

export function getNodeBehaviorCategory(node: StateNode): NodeBehaviorCategory {
  if (node.type === "Idle Standby" || node.id === "idle") return "idle";
  if (node.type === "Proactive Active" || node.id === "proactive") return "proactive";
  if (node.type === "User Interaction" || node.id === "interaction") return "interaction";
  if (node.type === "Fallback" || node.terminal) return "fallback";
  return "custom";
}

export function supportsBusinessStrategies(category: NodeBehaviorCategory) {
  return category === "interaction" || category === "custom";
}

export function supportsProactiveStrategies(category: NodeBehaviorCategory) {
  return category === "proactive";
}

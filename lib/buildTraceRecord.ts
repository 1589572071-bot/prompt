import { renderPrompt } from "./promptRenderer";
import type { OrchestrationConfig } from "./runtimeConfig";
import type { BizStrategy, PromptLayer, StateNode, TraceSnapshot } from "./types";

interface BuildTraceRecordInput {
  userInput: string;
  stateNodeId: string;
  enableTailReinforcement?: boolean;
  avatarId?: string;
  config?: OrchestrationConfig;
}

export function summarizeStrategyIds(strategyIds: string[], bizStrategies: BizStrategy[]) {
  if (!strategyIds.length) return "None";
  return strategyIds
    .map((id) => bizStrategies.find((strategy) => strategy.id === id)?.name ?? id)
    .join(", ");
}

export function buildTraceRecord(
  nodes: StateNode[],
  bizStrategies: BizStrategy[],
  { userInput, stateNodeId, enableTailReinforcement = false, avatarId, config }: BuildTraceRecordInput
) {
  const stateNode = nodes.find((node) => node.id === stateNodeId) ?? nodes[0];
  const rendered = renderPrompt({
    userInput,
    selectedStateId: stateNode.id,
    enableTailReinforcement,
    avatarId,
    config
  });
  const dynamicContextRendered =
    rendered.layers.find((layer) => layer.name === "User Context" || layer.name === "Dynamic Context")?.content ?? "";
  const matchedStrategyIds = (
    rendered.layers.find((layer) => layer.name === "Business Strategy")?.source ?? ""
  )
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id && id !== "none");
  const selectedProactiveLayer = rendered.layers.find((layer) => layer.name === "Proactive Strategy");
  const selectedProactiveStrategyId = selectedProactiveLayer?.source ?? "";
  const selectedProactiveStrategyIds =
    selectedProactiveStrategyId && selectedProactiveStrategyId !== "none" ? [selectedProactiveStrategyId] : [];
  const strategySummary = matchedStrategyIds.length
    ? summarizeStrategyIds(matchedStrategyIds, bizStrategies)
    : selectedProactiveStrategyIds.length
      ? `Proactive · ${
          selectedProactiveLayer?.content.match(/^Strategy: (.+)$/m)?.[1] ?? selectedProactiveStrategyIds[0]
        }`
      : "None";

  return {
    stateNodeId: stateNode.id,
    stateNode: stateNode.name,
    strategyIds: matchedStrategyIds,
    proactiveStrategyIds: selectedProactiveStrategyIds,
    interruptBufferPolicy: stateNode.interruptBufferPolicy ?? (stateNode.interruptLock ? "fade_1_5s" : "none"),
    strategy: strategySummary,
    promptLayers: rendered.layers as PromptLayer[],
    dynamicContextRendered,
    fullPrompt: rendered.fullPrompt,
    totalTokens: rendered.totalTokens,
    unresolvedVariables: rendered.unresolvedVariables
  };
}

export function createTraceSnapshot(
  nodes: StateNode[],
  bizStrategies: BizStrategy[],
  base: {
    id: string;
    sessionId: string;
    turnId: string;
    turnIndex: number;
    avatarId: string;
    avatarName: string;
    userId: string;
    environment: string;
    promptCostMs: number;
    modelCostMs: number;
    userInput: string;
    stateNodeId: string;
    enableTailReinforcement?: boolean;
    config?: OrchestrationConfig;
    modelOutput: string;
    actionToken: string;
    createdAt: string;
  }
): TraceSnapshot {
  const record = buildTraceRecord(nodes, bizStrategies, {
    userInput: base.userInput,
    stateNodeId: base.stateNodeId,
    enableTailReinforcement: base.enableTailReinforcement,
    avatarId: base.avatarId,
    config: base.config
  });

  const { enableTailReinforcement: _tail, stateNodeId: _stateNodeId, config: _config, ...rest } = base;

  return {
    ...rest,
    ...record
  };
}

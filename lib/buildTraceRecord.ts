import { renderPrompt } from "./promptRenderer";
import type { BizStrategy, PromptLayer, StateNode, TraceSnapshot } from "./types";

interface BuildTraceRecordInput {
  userInput: string;
  stateNodeId: string;
  enableTailReinforcement?: boolean;
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
  { userInput, stateNodeId, enableTailReinforcement = false }: BuildTraceRecordInput
) {
  const stateNode = nodes.find((node) => node.id === stateNodeId) ?? nodes[0];
  const rendered = renderPrompt({ userInput, selectedStateId: stateNode.id, enableTailReinforcement });
  const dynamicContextRendered =
    rendered.layers.find((layer) => layer.name === "Dynamic Context")?.content ?? "";

  return {
    stateNodeId: stateNode.id,
    stateNode: stateNode.name,
    strategyIds: [...stateNode.strategyIds],
    proactiveStrategyIds: [...stateNode.proactiveStrategyIds],
    interruptBufferPolicy: stateNode.interruptBufferPolicy ?? (stateNode.interruptLock ? "fade_1_5s" : "none"),
    strategy: summarizeStrategyIds(stateNode.strategyIds, bizStrategies),
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
    modelOutput: string;
    actionToken: string;
    createdAt: string;
  }
): TraceSnapshot {
  const record = buildTraceRecord(nodes, bizStrategies, {
    userInput: base.userInput,
    stateNodeId: base.stateNodeId,
    enableTailReinforcement: base.enableTailReinforcement
  });

  const { enableTailReinforcement: _tail, stateNodeId: _stateNodeId, ...rest } = base;

  return {
    ...rest,
    ...record
  };
}

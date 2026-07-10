import type { FlatTraceSpan, TraceSnapshot, TraceSpan } from "./types";

function roundMs(value: number) {
  return Math.round(value * 10) / 10;
}

export function buildTraceSpans(trace: TraceSnapshot): TraceSpan {
  const layerCount = Math.max(trace.promptLayers.length, 1);
  const layerDuration = roundMs(trace.promptCostMs / layerCount);

  const layerSpans: TraceSpan[] = trace.promptLayers.map((layer, index) => ({
    id: `${trace.id}-layer-${index}`,
    traceId: trace.id,
    parentId: `${trace.id}-prompt-assembly`,
    name: layer.name,
    kind: "prompt_layer",
    durationMs: layerDuration,
    input: {
      layerName: layer.name,
      source: layer.source,
      version: layer.version
    },
    output: {
      content: layer.content,
      tokenCount: layer.tokenCount,
      warning: layer.warning ?? null
    },
    children: []
  }));

  const promptAssembly: TraceSpan = {
    id: `${trace.id}-prompt-assembly`,
    traceId: trace.id,
    parentId: trace.id,
    name: "Prompt Assembly",
    kind: "prompt_assembly",
    durationMs: trace.promptCostMs,
    input: {
      enableTailReinforcement: false,
      layerCount: trace.promptLayers.length
    },
    output: {
      fullPrompt: trace.fullPrompt,
      totalTokens: trace.totalTokens,
      dynamicContextRendered: trace.dynamicContextRendered,
      unresolvedVariables: trace.unresolvedVariables
    },
    children: layerSpans
  };

  const stateRouting: TraceSpan = {
    id: `${trace.id}-state-routing`,
    traceId: trace.id,
    parentId: trace.id,
    name: "State Routing",
    kind: "state_routing",
    durationMs: 0.3,
    input: {
      stateNodeId: trace.stateNodeId,
      strategyIds: trace.strategyIds,
      proactiveStrategyIds: trace.proactiveStrategyIds
    },
    output: {
      stateNode: trace.stateNode,
      strategy: trace.strategy,
      interruptBufferPolicy: trace.interruptBufferPolicy
    },
    children: []
  };

  const modelInference: TraceSpan = {
    id: `${trace.id}-model-inference`,
    traceId: trace.id,
    parentId: trace.id,
    name: "Model Inference",
    kind: "model_inference",
    durationMs: trace.modelCostMs,
    input: {
      fullPrompt: trace.fullPrompt,
      totalTokens: trace.totalTokens
    },
    output: {
      modelOutput: trace.modelOutput
    },
    children: []
  };

  const actionParse: TraceSpan = {
    id: `${trace.id}-action-parse`,
    traceId: trace.id,
    parentId: trace.id,
    name: "Action Token Parse",
    kind: "action_parse",
    durationMs: 0.1,
    input: {
      modelOutput: trace.modelOutput
    },
    output: {
      actionToken: trace.actionToken
    },
    children: []
  };

  return {
    id: trace.id,
    traceId: trace.id,
    parentId: null,
    name: "Turn Assembly",
    kind: "turn",
    durationMs: roundMs(trace.promptCostMs + trace.modelCostMs),
    input: {
      sessionId: trace.sessionId,
      turnId: trace.turnId,
      turnIndex: trace.turnIndex,
      avatarId: trace.avatarId,
      avatarName: trace.avatarName,
      userId: trace.userId,
      userInput: trace.userInput,
      environment: trace.environment
    },
    output: {
      modelOutput: trace.modelOutput,
      actionToken: trace.actionToken,
      totalTokens: trace.totalTokens
    },
    metadata: {
      stateNode: trace.stateNode,
      stateNodeId: trace.stateNodeId
    },
    children: [stateRouting, promptAssembly, modelInference, actionParse]
  };
}

export function countSpans(span: TraceSpan): number {
  return 1 + span.children.reduce((sum, child) => sum + countSpans(child), 0);
}

export function flattenSpans(trace: TraceSnapshot, root?: TraceSpan): FlatTraceSpan[] {
  const tree = root ?? buildTraceSpans(trace);
  const traceName = `${trace.avatarName} · Turn ${trace.turnIndex}`;

  function walk(span: TraceSpan, path: string[]): FlatTraceSpan[] {
    const spanPath = [...path, span.name].join(" / ");
    const flat: FlatTraceSpan = {
      ...span,
      traceName,
      sessionId: trace.sessionId,
      turnId: trace.turnId,
      timestamp: trace.createdAt,
      spanPath
    };

    return [
      flat,
      ...span.children.flatMap((child) => walk(child, [...path, span.name]))
    ];
  }

  return walk(tree, []);
}

export function findSpanById(root: TraceSpan, spanId: string): TraceSpan | null {
  if (root.id === spanId) return root;
  for (const child of root.children) {
    const found = findSpanById(child, spanId);
    if (found) return found;
  }
  return null;
}

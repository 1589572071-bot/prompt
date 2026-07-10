export function truncateJson(value: unknown, maxLength = 140): string {
  const text = JSON.stringify(compactPreviewValue(value));
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

function compactPreviewValue(value: unknown): unknown {
  if (typeof value === "string") {
    if (value.length <= 72) return value;
    return `${value.slice(0, 72)}…`;
  }

  if (Array.isArray(value)) {
    return value.map((item) => compactPreviewValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        compactPreviewValue(nested)
      ])
    );
  }

  return value;
}

export function exportJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export type TraceListTab = "traces" | "observations";

export type TraceTimeRange = "1d" | "7d" | "all";

export interface TraceFilters {
  environments: string[];
  traceNames: string[];
  sessionIds: string[];
  userIds: string[];
  avatarNames: string[];
  stateNodes: string[];
}

export const defaultTraceFilters: TraceFilters = {
  environments: [],
  traceNames: [],
  sessionIds: [],
  userIds: [],
  avatarNames: [],
  stateNodes: []
};

export function traceDisplayName(avatarName: string, turnIndex: number) {
  return `${avatarName} · Turn ${turnIndex}`;
}

export function buildTraceInput(trace: {
  sessionId: string;
  turnId: string;
  turnIndex: number;
  avatarId: string;
  avatarName: string;
  userId: string;
  userInput: string;
  stateNodeId: string;
  stateNode: string;
  environment: string;
}) {
  return {
    sessionId: trace.sessionId,
    turnId: trace.turnId,
    turnIndex: trace.turnIndex,
    avatarId: trace.avatarId,
    avatarName: trace.avatarName,
    userId: trace.userId,
    userInput: trace.userInput,
    stateNodeId: trace.stateNodeId,
    stateNode: trace.stateNode,
    environment: trace.environment
  };
}

export function buildTraceOutput(trace: {
  modelOutput: string;
  actionToken: string;
  totalTokens: number;
  stateNode: string;
  strategyIds: string[];
}) {
  return {
    modelOutput: trace.modelOutput,
    actionToken: trace.actionToken,
    totalTokens: trace.totalTokens,
    stateNode: trace.stateNode,
    strategyIds: trace.strategyIds
  };
}

export function matchesTimeRange(createdAt: string, range: TraceTimeRange) {
  if (range === "all") return true;
  const parsed = new Date(createdAt.replace(/\//g, "-"));
  if (Number.isNaN(parsed.getTime())) return true;
  const now = new Date("2026-07-10T00:00:00");
  const diffMs = now.getTime() - parsed.getTime();
  const days = diffMs / (1000 * 60 * 60 * 24);
  return range === "1d" ? days <= 1 : days <= 7;
}

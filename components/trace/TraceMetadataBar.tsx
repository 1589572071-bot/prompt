"use client";

import { maskUserId } from "@/lib/promptRenderer";
import type { TraceSnapshot } from "@/lib/types";

interface TraceMetadataBarProps {
  trace: TraceSnapshot;
  showFull: boolean;
}

export function TraceMetadataBar({ trace, showFull }: TraceMetadataBarProps) {
  return (
    <div className="trace-metadata-bar">
      <span className="trace-meta-chip">{trace.promptCostMs}ms assembly</span>
      <span className="trace-meta-chip">{trace.modelCostMs}ms model</span>
      <span className="trace-meta-chip">{showFull ? trace.userId : maskUserId(trace.userId)}</span>
      <span className="trace-meta-chip">{trace.environment}</span>
      <span className="trace-meta-chip">{trace.totalTokens} tokens</span>
    </div>
  );
}

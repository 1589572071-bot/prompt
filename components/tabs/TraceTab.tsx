"use client";

import { useMemo, useState } from "react";
import { createTraceSnapshot } from "@/lib/buildTraceRecord";
import { traceSnapshotSeeds } from "@/lib/seedData";
import type { OrchestrationConfig } from "@/lib/runtimeConfig";
import { TraceDetailLayout } from "../trace/TraceDetailLayout";
import { TraceListLayout } from "../trace/TraceListLayout";

interface TraceTabProps {
  config: OrchestrationConfig;
}

export function TraceTab({ config }: TraceTabProps) {
  const [viewingTraceId, setViewingTraceId] = useState<string | null>(null);
  const [initialSpanId, setInitialSpanId] = useState<string | null>(null);

  const traces = useMemo(
    () =>
      traceSnapshotSeeds.map((trace) =>
        createTraceSnapshot(config.stateMachine.nodes, config.bizStrategies, {
          ...trace,
          config
        })
      ),
    [config]
  );

  const viewingTrace = traces.find((trace) => trace.id === viewingTraceId);

  const handleOpenTrace = (traceId: string, spanId?: string) => {
    setViewingTraceId(traceId);
    setInitialSpanId(spanId ?? null);
  };

  const handleBack = () => {
    setViewingTraceId(null);
    setInitialSpanId(null);
  };

  if (viewingTrace) {
    return (
      <TraceDetailLayout initialSpanId={initialSpanId} onBack={handleBack} trace={viewingTrace} />
    );
  }

  return <TraceListLayout onOpenTrace={handleOpenTrace} traces={traces} />;
}

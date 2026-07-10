"use client";

import { useState } from "react";
import { traceSnapshots } from "@/lib/mockData";
import { TraceDetailLayout } from "../trace/TraceDetailLayout";
import { TraceListLayout } from "../trace/TraceListLayout";

export function TraceTab() {
  const [viewingTraceId, setViewingTraceId] = useState<string | null>(null);
  const [initialSpanId, setInitialSpanId] = useState<string | null>(null);

  const viewingTrace = traceSnapshots.find((trace) => trace.id === viewingTraceId);

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

  return <TraceListLayout onOpenTrace={handleOpenTrace} traces={traceSnapshots} />;
}

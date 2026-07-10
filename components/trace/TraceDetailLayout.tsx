"use client";

import { useEffect, useMemo, useState } from "react";
import { buildTraceSpans, findSpanById } from "@/lib/buildTraceSpans";
import type { TraceSnapshot } from "@/lib/types";
import { TraceMetadataBar } from "./TraceMetadataBar";
import { TracePlaceholderActions } from "./TracePlaceholderActions";
import { TraceSpanPreview } from "./TraceSpanPreview";
import { TraceSpanTree } from "./TraceSpanTree";
import { traceDisplayName } from "./traceUtils";

interface TraceDetailLayoutProps {
  trace: TraceSnapshot;
  initialSpanId?: string | null;
  onBack: () => void;
}

export function TraceDetailLayout({ trace, initialSpanId, onBack }: TraceDetailLayoutProps) {
  const root = useMemo(() => buildTraceSpans(trace), [trace]);
  const [selectedSpanId, setSelectedSpanId] = useState(initialSpanId ?? root.id);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    setSelectedSpanId(initialSpanId ?? root.id);
  }, [initialSpanId, root.id, trace.id]);

  const selectedSpan = useMemo(
    () => findSpanById(root, selectedSpanId) ?? root,
    [root, selectedSpanId]
  );

  return (
    <div className="trace-workspace trace-detail-workspace">
      <div className="trace-detail-header">
        <div className="trace-detail-heading">
          <button className="button trace-back-button" onClick={onBack} type="button">
            ← Back
          </button>
          <div>
            <h1 className="trace-title">{selectedSpan.name}</h1>
            <p className="trace-subtitle">
              {traceDisplayName(trace.avatarName, trace.turnIndex)} · {trace.turnId} · {trace.id}
            </p>
          </div>
        </div>
        <div className="trace-detail-actions">
          <TracePlaceholderActions />
          <button className="button trace-toolbar-button" onClick={() => setShowFull((value) => !value)} type="button">
            {showFull ? "Show Masked View" : "View Full Snapshot"}
          </button>
        </div>
        <TraceMetadataBar showFull={showFull} trace={trace} />
      </div>

      <div className="trace-detail-split">
        <TraceSpanTree onSelect={setSelectedSpanId} root={root} selectedSpanId={selectedSpan.id} />
        <TraceSpanPreview input={selectedSpan.input} output={selectedSpan.output} showFull={showFull} />
      </div>
    </div>
  );
}

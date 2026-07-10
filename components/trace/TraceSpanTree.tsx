"use client";

import { useState } from "react";
import type { TraceSpan } from "@/lib/types";

interface TraceSpanTreeProps {
  root: TraceSpan;
  selectedSpanId: string;
  onSelect: (spanId: string) => void;
}

function SpanTreeNode({
  span,
  depth,
  selectedSpanId,
  onSelect
}: {
  span: TraceSpan;
  depth: number;
  selectedSpanId: string;
  onSelect: (spanId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = span.children.length > 0;
  const isSelected = span.id === selectedSpanId;

  return (
    <div className="trace-span-node">
      <button
        className={`trace-span-row ${isSelected ? "selected" : ""}`}
        onClick={() => onSelect(span.id)}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        type="button"
      >
        {hasChildren ? (
          <span
            className="trace-span-toggle"
            onClick={(event) => {
              event.stopPropagation();
              setExpanded((value) => !value);
            }}
          >
            {expanded ? "▾" : "▸"}
          </span>
        ) : (
          <span className="trace-span-toggle muted">•</span>
        )}
        <span className="trace-span-name">{span.name}</span>
        <span className="trace-span-duration">{span.durationMs}ms</span>
      </button>
      {expanded &&
        span.children.map((child) => (
          <SpanTreeNode
            depth={depth + 1}
            key={child.id}
            onSelect={onSelect}
            selectedSpanId={selectedSpanId}
            span={child}
          />
        ))}
    </div>
  );
}

export function TraceSpanTree({ root, selectedSpanId, onSelect }: TraceSpanTreeProps) {
  return (
    <div className="trace-span-tree">
      <div className="trace-span-tree-title">Trace</div>
      <SpanTreeNode depth={0} onSelect={onSelect} selectedSpanId={selectedSpanId} span={root} />
    </div>
  );
}

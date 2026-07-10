"use client";

import type { StateEdge, StateNode } from "@/lib/types";
import { StateEdgeInspector } from "./StateEdgeInspector";

interface StateEdgeDetailViewProps {
  edge: StateEdge;
  fromNode: StateNode;
  toNode: StateNode;
  onBack: () => void;
}

export function StateEdgeDetailView({ edge, fromNode, toNode, onBack }: StateEdgeDetailViewProps) {
  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to State Orchestration
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit Transition · {fromNode.name} → {toNode.name}
          </h1>
        </div>
        <span className="tag tag-blue">{edge.id}</span>
      </div>

      <section className="card">
        <StateEdgeInspector edge={edge} fromNode={fromNode} toNode={toNode} />
      </section>
    </div>
  );
}

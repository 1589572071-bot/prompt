"use client";

import { edgeEventOptions, edgeTimeoutOptions } from "@/lib/stateOptions";
import { withCurrentOption } from "@/lib/strategyOptions";
import type { StateEdge, StateNode } from "@/lib/types";

interface StateEdgeInspectorProps {
  edge: StateEdge;
  fromNode: StateNode;
  toNode: StateNode;
}

export function StateEdgeInspector({ edge, fromNode, toNode }: StateEdgeInspectorProps) {
  const eventOptions = withCurrentOption(edgeEventOptions, edge.event);
  const timeoutOptions = edge.timeout ? withCurrentOption(edgeTimeoutOptions, edge.timeout) : edgeTimeoutOptions;

  return (
    <div className="stack">
      <div className="card soft">
        <div className="cell-title">
          {fromNode.name} → {toNode.name}
        </div>
        <p className="muted" style={{ marginBottom: 0 }}>
          Directed transition · edge {edge.id}
        </p>
      </div>

      <div>
        <label className="label">Trigger Event</label>
        <select className="select" defaultValue={edge.event}>
          {eventOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Timeout</label>
        <select className="select" defaultValue={edge.timeout ?? ""}>
          <option value="">No timeout</option>
          {timeoutOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p className="hint">Used for transitions such as no-input timeout on idle standby.</p>
      </div>

      <div>
        <label className="label">Condition Expression</label>
        <input
          className="input code-input"
          defaultValue={edge.condition ?? ""}
          placeholder="e.g. idle_duration >= 15s"
        />
      </div>

      <div>
        <label className="label">Allow User Interrupt</label>
        <select className="select" defaultValue={edge.allowInterrupt ? "yes" : "no"}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    </div>
  );
}

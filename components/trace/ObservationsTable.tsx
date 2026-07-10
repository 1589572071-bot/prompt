"use client";

import type { FlatTraceSpan } from "@/lib/types";
import { truncateJson } from "./traceUtils";

interface ObservationsTableProps {
  observations: FlatTraceSpan[];
  onOpenObservation: (traceId: string, spanId: string) => void;
}

export function ObservationsTable({ observations, onOpenObservation }: ObservationsTableProps) {
  return (
    <div className="trace-table-wrap">
      <table className="trace-table">
        <thead>
          <tr>
            <th className="trace-col-check" />
            <th>Timestamp</th>
            <th>Trace Name</th>
            <th>Span Path</th>
            <th>Kind</th>
            <th>Duration</th>
            <th>Input</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {observations.map((observation) => (
            <tr
              className="trace-row-clickable"
              key={observation.id}
              onClick={() => onOpenObservation(observation.traceId, observation.id)}
            >
              <td className="trace-col-check" onClick={(event) => event.stopPropagation()}>
                <input aria-label={`Select ${observation.name}`} type="checkbox" />
              </td>
              <td className="trace-mono">{observation.timestamp}</td>
              <td>{observation.traceName}</td>
              <td>
                <button
                  className="trace-link"
                  onClick={() => onOpenObservation(observation.traceId, observation.id)}
                  type="button"
                >
                  {observation.spanPath}
                </button>
              </td>
              <td>
                <span className="trace-kind-pill">{observation.kind}</span>
              </td>
              <td className="trace-mono">{observation.durationMs}ms</td>
              <td className="trace-json-cell">
                <span className="trace-json-cell-inner" title={JSON.stringify(observation.input)}>
                  {truncateJson(observation.input)}
                </span>
              </td>
              <td className="trace-json-cell trace-output-cell">
                <span className="trace-json-cell-inner" title={JSON.stringify(observation.output)}>
                  {truncateJson(observation.output)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

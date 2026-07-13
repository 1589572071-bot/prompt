"use client";

import { buildTraceSpans, countSpans } from "@/lib/buildTraceSpans";
import type { TraceSnapshot } from "@/lib/types";
import { buildTraceInput, buildTraceOutput, traceDisplayName, truncateJson } from "./traceUtils";

export type TraceColumnKey =
  | "select"
  | "bookmark"
  | "timestamp"
  | "name"
  | "state"
  | "strategy"
  | "input"
  | "output"
  | "observations";

export const allTraceColumns: TraceColumnKey[] = [
  "select",
  "bookmark",
  "timestamp",
  "name",
  "state",
  "strategy",
  "input",
  "output",
  "observations"
];

interface TracesTableProps {
  traces: TraceSnapshot[];
  visibleColumns: TraceColumnKey[];
  bookmarks: Set<string>;
  onToggleBookmark: (traceId: string) => void;
  onOpenTrace: (traceId: string) => void;
}

export function TracesTable({
  traces,
  visibleColumns,
  bookmarks,
  onToggleBookmark,
  onOpenTrace
}: TracesTableProps) {
  const show = (column: TraceColumnKey) => visibleColumns.includes(column);

  return (
    <div className="trace-table-wrap">
      <table className="trace-table">
        <thead>
          <tr>
            {show("select") && <th className="trace-col-check" />}
            {show("bookmark") && <th className="trace-col-star" />}
            {show("timestamp") && <th className="trace-col-timestamp">Timestamp</th>}
            {show("name") && <th className="trace-col-name">Name</th>}
            {show("state") && <th>State</th>}
            {show("strategy") && <th>Strategy Decision</th>}
            {show("input") && <th className="trace-col-json">Input</th>}
            {show("output") && <th className="trace-col-json trace-col-output">Output</th>}
            {show("observations") && <th className="trace-col-obs">Observation Levels</th>}
          </tr>
        </thead>
        <tbody>
          {traces.map((trace) => {
            const observationCount = countSpans(buildTraceSpans(trace));

            return (
              <tr className="trace-row-clickable" key={trace.id} onClick={() => onOpenTrace(trace.id)}>
                {show("select") && (
                  <td className="trace-col-check" onClick={(event) => event.stopPropagation()}>
                    <input aria-label={`Select ${trace.turnId}`} type="checkbox" />
                  </td>
                )}
                {show("bookmark") && (
                  <td className="trace-col-star" onClick={(event) => event.stopPropagation()}>
                    <button
                      aria-label="Bookmark trace"
                      className={`trace-star ${bookmarks.has(trace.id) ? "active" : ""}`}
                      onClick={() => onToggleBookmark(trace.id)}
                      type="button"
                    >
                      ★
                    </button>
                  </td>
                )}
                {show("timestamp") && <td className="trace-mono trace-col-timestamp">{trace.createdAt}</td>}
                {show("name") && (
                  <td className="trace-col-name">
                    <button className="trace-link" onClick={() => onOpenTrace(trace.id)} type="button">
                      {traceDisplayName(trace.avatarName, trace.turnIndex)}
                    </button>
                  </td>
                )}
                {show("state") && (
                  <td>
                    <span className="tag tag-blue">{trace.stateNode}</span>
                  </td>
                )}
                {show("strategy") && (
                  <td>
                    <span className={`pill ${trace.strategy === "None" ? "" : "success"}`}>
                      {trace.strategy === "None" ? "No task strategy" : trace.strategy}
                    </span>
                  </td>
                )}
                {show("input") && (
                  <td className="trace-json-cell trace-col-json">
                    <span className="trace-json-cell-inner" title={JSON.stringify(buildTraceInput(trace))}>
                      {truncateJson(buildTraceInput(trace))}
                    </span>
                  </td>
                )}
                {show("output") && (
                  <td className="trace-json-cell trace-output-cell trace-col-json trace-col-output">
                    <span className="trace-json-cell-inner" title={JSON.stringify(buildTraceOutput(trace))}>
                      {truncateJson(buildTraceOutput(trace))}
                    </span>
                  </td>
                )}
                {show("observations") && (
                  <td className="trace-col-obs">
                    <span className="trace-obs-badge">{observationCount}</span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

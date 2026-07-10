"use client";

import { useMemo, useState } from "react";
import { collapseInput, maskUserId } from "@/lib/promptRenderer";

type ViewMode = "formatted" | "json";

interface TraceSpanPreviewProps {
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  showFull: boolean;
}

interface PathRow {
  path: string;
  value: string;
  type: "string" | "number" | "boolean" | "null" | "object" | "array";
}

function maskValue(key: string, value: unknown, showFull: boolean): unknown {
  if (showFull) return value;
  if (key === "userId" && typeof value === "string") return maskUserId(value);
  if (key === "userInput" && typeof value === "string") return collapseInput(value);
  if ((key === "fullPrompt" || key === "modelOutput" || key === "content") && typeof value === "string") {
    return collapseInput(value);
  }
  return value;
}

function maskObject(value: unknown, showFull: boolean, key = ""): unknown {
  if (showFull) return value;
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    return maskValue(key, value, showFull);
  }

  if (Array.isArray(value)) {
    return value.map((item) => maskObject(item, showFull));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([entryKey, nested]) => [
        entryKey,
        maskObject(nested, showFull, entryKey)
      ])
    );
  }

  return value;
}

function flattenObject(
  value: unknown,
  prefix = "",
  showFull: boolean,
  rows: PathRow[] = []
): PathRow[] {
  if (value === null || value === undefined) {
    rows.push({ path: prefix || "value", value: "null", type: "null" });
    return rows;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenObject(item, `${prefix}[${index}]`, showFull, rows);
    });
    return rows;
  }

  if (typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
      const nextPath = prefix ? `${prefix}.${key}` : key;
      const masked = maskValue(key, nested, showFull);

      if (masked !== null && typeof masked === "object") {
        flattenObject(masked, nextPath, showFull, rows);
        return;
      }

      rows.push({
        path: nextPath,
        value: String(masked),
        type:
          typeof masked === "string"
            ? "string"
            : typeof masked === "number"
              ? "number"
              : typeof masked === "boolean"
                ? "boolean"
                : "null"
      });
    });
    return rows;
  }

  rows.push({
    path: prefix || "value",
    value: String(value),
    type:
      typeof value === "string"
        ? "string"
        : typeof value === "number"
          ? "number"
          : typeof value === "boolean"
            ? "boolean"
            : "null"
  });
  return rows;
}

function PathValueTable({
  title,
  data,
  showFull,
  viewMode
}: {
  title: string;
  data: Record<string, unknown>;
  showFull: boolean;
  viewMode: ViewMode;
}) {
  const displayData = useMemo(
    () => maskObject(data, showFull) as Record<string, unknown>,
    [data, showFull]
  );
  const rows = useMemo(() => flattenObject(displayData, "", showFull), [displayData, showFull]);

  return (
    <section className="trace-preview-section">
      <div className="trace-preview-section-header">
        <h3>{title}</h3>
      </div>
      {viewMode === "json" ? (
        <pre className="trace-json-preview">{JSON.stringify(displayData, null, 2)}</pre>
      ) : (
        <table className="trace-path-table">
          <thead>
            <tr>
              <th>Path</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${title}-${row.path}`}>
                <td className="trace-path-key">{row.path}</td>
                <td>
                  <span className={`trace-value trace-value-${row.type}`}>{row.value}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export function TraceSpanPreview({ input, output, showFull }: TraceSpanPreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");

  return (
    <div className="trace-span-preview">
      <div className="trace-preview-toolbar">
        <div className="trace-detail-tabs">
          <button className="trace-detail-tab active" type="button">
            Preview
          </button>
          <button className="trace-detail-tab disabled" disabled title="Coming soon" type="button">
            Log View
          </button>
          <button className="trace-detail-tab disabled" disabled title="Coming soon" type="button">
            Scores
          </button>
        </div>
        <div className="trace-view-toggle">
          <button
            className={viewMode === "formatted" ? "active" : ""}
            onClick={() => setViewMode("formatted")}
            type="button"
          >
            Formatted
          </button>
          <button
            className={viewMode === "json" ? "active" : ""}
            onClick={() => setViewMode("json")}
            type="button"
          >
            JSON
          </button>
        </div>
      </div>

      <PathValueTable data={input} showFull={showFull} title="Input" viewMode={viewMode} />
      <PathValueTable data={output} showFull={showFull} title="Output" viewMode={viewMode} />

      <section className="trace-preview-section trace-corrected-output">
        <div className="trace-preview-section-header">
          <h3>Corrected Output</h3>
          <span className="trace-beta-pill">Beta</span>
        </div>
        <div className="trace-corrected-placeholder">Click to add corrected output (Coming soon)</div>
      </section>
    </div>
  );
}

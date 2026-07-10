"use client";

import { useMemo, useState } from "react";
import { traceSnapshots } from "@/lib/mockData";
import { collapseInput } from "@/lib/promptRenderer";
import { TraceDetailView } from "./TraceDetailView";

export function TraceTab() {
  const [search, setSearch] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [viewingId, setViewingId] = useState<string | null>(null);

  const sessions = useMemo(
    () => Array.from(new Set(traceSnapshots.map((trace) => trace.sessionId))),
    []
  );

  const filteredTraces = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return traceSnapshots
      .filter((trace) => sessionFilter === "all" || trace.sessionId === sessionFilter)
      .filter((trace) => {
        if (!keyword) return true;
        return (
          trace.turnId.toLowerCase().includes(keyword) ||
          trace.sessionId.toLowerCase().includes(keyword) ||
          trace.avatarName.toLowerCase().includes(keyword) ||
          trace.stateNode.toLowerCase().includes(keyword) ||
          trace.stateNodeId.toLowerCase().includes(keyword) ||
          trace.strategyIds.join(" ").toLowerCase().includes(keyword) ||
          trace.userInput.toLowerCase().includes(keyword) ||
          trace.modelOutput.toLowerCase().includes(keyword) ||
          trace.fullPrompt.toLowerCase().includes(keyword)
        );
      })
      .sort((a, b) => {
        if (a.sessionId !== b.sessionId) return a.sessionId.localeCompare(b.sessionId);
        return a.turnIndex - b.turnIndex;
      });
  }, [search, sessionFilter]);

  const viewingTrace = traceSnapshots.find((trace) => trace.id === viewingId);

  if (viewingTrace) {
    return <TraceDetailView onBack={() => setViewingId(null)} trace={viewingTrace} />;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Online Traceability</h1>

      <div className="admin-toolbar">
        <div className="row" style={{ flex: 1, gap: 12 }}>
          <input
            className="input admin-search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search turns, sessions, prompts, outputs"
            value={search}
          />
          <select className="select admin-filter" onChange={(event) => setSessionFilter(event.target.value)} value={sessionFilter}>
            <option value="all">All Sessions</option>
            {sessions.map((sessionId) => (
              <option key={sessionId} value={sessionId}>
                {sessionId}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Turn</th>
              <th>Session</th>
              <th>Avatar</th>
              <th>User Input</th>
              <th>Prompt Snapshot</th>
              <th>Model Output</th>
              <th>State</th>
              <th>Strategy IDs</th>
              <th>Tokens</th>
              <th>Latency</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTraces.map((trace) => (
              <tr key={trace.id}>
                <td>
                  <div className="cell-title">{trace.turnId}</div>
                  <div className="cell-subtitle">Turn {trace.turnIndex}</div>
                </td>
                <td>
                  <div className="cell-title">{trace.sessionId}</div>
                  <div className="cell-subtitle">{trace.environment}</div>
                </td>
                <td>{trace.avatarName}</td>
                <td className="cell-query">{collapseInput(trace.userInput)}</td>
                <td className="cell-query">{collapseInput(trace.fullPrompt)}</td>
                <td className="cell-query">{collapseInput(trace.modelOutput)}</td>
                <td>
                  <div className="cell-title">{trace.stateNode}</div>
                  <div className="cell-subtitle">{trace.stateNodeId}</div>
                </td>
                <td className="muted">{trace.strategyIds.length ? trace.strategyIds.join(", ") : "—"}</td>
                <td>{trace.totalTokens}</td>
                <td>
                  <div className="cell-title">{trace.promptCostMs}ms</div>
                  <div className="cell-subtitle">{trace.modelCostMs}ms model</div>
                </td>
                <td>{trace.createdAt}</td>
                <td>
                  <div className="action-group">
                    <button className="button action-button" onClick={() => setViewingId(trace.id)} type="button">
                      View
                    </button>
                    <button className="button action-button" type="button">
                      Export
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="hint" style={{ marginTop: 12 }}>
        Each row stores one turn-level assembly record: resolved state, bound strategy IDs, layered prompt snapshot,
        rendered Dynamic Context, Full Prompt, and model output.
      </p>
    </div>
  );
}

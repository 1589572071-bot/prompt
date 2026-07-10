"use client";

import { useMemo, useState } from "react";
import { sandboxCases } from "@/lib/mockData";
import { SandboxDetailView } from "./SandboxDetailView";

export function SandboxTab() {
  const [search, setSearch] = useState("");
  const [viewingId, setViewingId] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return sandboxCases;
    return sandboxCases.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.avatarName.toLowerCase().includes(keyword) ||
        item.userInput.toLowerCase().includes(keyword)
    );
  }, [search]);

  const viewingCase = sandboxCases.find((item) => item.id === viewingId);

  if (viewingCase) {
    return <SandboxDetailView key={viewingCase.id} onBack={() => setViewingId(null)} sandboxCase={viewingCase} />;
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Sandbox Simulation</h1>

      <div className="admin-toolbar">
        <input
          className="input admin-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search sandbox cases"
          value={search}
        />
        <button className="button primary admin-new-button" type="button">
          New Simulation
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Avatar</th>
              <th>State Node</th>
              <th>Query</th>
              <th>Tokens</th>
              <th>Tail Reinforcement</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="cell-title">{item.name}</div>
                  <div className="cell-subtitle">{item.id}</div>
                </td>
                <td>{item.avatarName}</td>
                <td>{item.stateNodeName}</td>
                <td className="cell-query">{item.userInput}</td>
                <td>{item.totalTokens}</td>
                <td>{item.enableTailReinforcement ? "On" : "Off"}</td>
                <td>
                  <span className={`status-badge ${item.status}`}>{item.status}</span>
                </td>
                <td>{item.updatedAt}</td>
                <td>
                  <div className="action-group">
                    <button className="button action-button" onClick={() => setViewingId(item.id)} type="button">
                      Run
                    </button>
                    <button className="button action-button danger-outline" type="button">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

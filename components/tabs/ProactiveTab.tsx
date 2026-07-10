"use client";

import { useMemo, useState } from "react";
import { proactiveStrategies, stateMachine } from "@/lib/mockData";
import { ProactiveDetailView } from "./ProactiveDetailView";

function getStateName(stateId: string) {
  return stateMachine.nodes.find((node) => node.id === stateId)?.name ?? stateId;
}

function textAtomSummary(name: string, sourceType: string, sourceScriptVersion?: string) {
  if (sourceType === "avatar_script_library") {
    return `Ref · ${name}${sourceScriptVersion ? ` ${sourceScriptVersion}` : ""}`;
  }
  return name;
}

export function ProactiveTab() {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredStrategies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return proactiveStrategies;
    return proactiveStrategies.filter(
      (strategy) =>
        strategy.name.toLowerCase().includes(keyword) ||
        strategy.id.toLowerCase().includes(keyword) ||
        getStateName(strategy.applicableStateId).toLowerCase().includes(keyword) ||
        strategy.textAtom.name.toLowerCase().includes(keyword)
    );
  }, [search]);

  const editingStrategy = proactiveStrategies.find((strategy) => strategy.id === editingId);

  if (editingStrategy) {
    return (
      <ProactiveDetailView key={editingStrategy.id} onBack={() => setEditingId(null)} strategy={editingStrategy} />
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Proactive Strategy</h1>

      <div className="admin-toolbar">
        <input
          className="input admin-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search strategies, states, text atoms"
          value={search}
        />
        <button className="button primary admin-new-button" type="button">
          New Strategy
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Bound State</th>
              <th>Text Atom</th>
              <th>Action</th>
              <th>Emotion</th>
              <th>Cooldown</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStrategies.map((strategy) => (
              <tr key={strategy.id}>
                <td>
                  <div className="cell-title">{strategy.name}</div>
                  <div className="cell-subtitle">{strategy.id}</div>
                </td>
                <td>{getStateName(strategy.applicableStateId)}</td>
                <td className="muted">
                  {textAtomSummary(
                    strategy.textAtom.name,
                    strategy.textAtom.sourceType,
                    strategy.textAtom.sourceScriptVersion
                  )}
                </td>
                <td>{strategy.actionToken}</td>
                <td>{strategy.emotionTag}</td>
                <td>{strategy.cooldown}</td>
                <td>
                  <span className={`status-badge ${strategy.enabled ? "active" : "draft"}`}>
                    {strategy.enabled ? "enabled" : "disabled"}
                  </span>
                </td>
                <td>{strategy.updatedAt}</td>
                <td>
                  <div className="action-group">
                    <button className="button action-button" onClick={() => setEditingId(strategy.id)} type="button">
                      Edit
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

      <p className="hint" style={{ marginTop: 12 }}>
        State transition timing lives in Tab 3 edges. Tab 4 defines what the avatar says and does after entering the bound
        state.
      </p>
    </div>
  );
}

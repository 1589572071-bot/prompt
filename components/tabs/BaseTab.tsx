"use client";

import { useMemo, useState } from "react";
import { bizStrategies as initialBizStrategies, systemBase } from "@/lib/mockData";
import { createDraftBizStrategy } from "@/lib/createDrafts";
import type { BizStrategy } from "@/lib/types";
import { AddButton } from "../AddButton";
import { BizStrategyDetailView } from "./BizStrategyDetailView";
import { SystemCoreDetailView } from "./SystemCoreDetailView";

export type BaseAssetId = "system-core" | "biz-strategies";

interface BaseTabProps {
  selectedId: BaseAssetId;
}

function truncate(text: string, max = 48) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export function BaseTab({ selectedId }: BaseTabProps) {
  const [strategies, setStrategies] = useState<BizStrategy[]>(initialBizStrategies);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredStrategies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return strategies;
    return strategies.filter(
      (strategy) =>
        strategy.name.toLowerCase().includes(keyword) ||
        strategy.id.toLowerCase().includes(keyword) ||
        strategy.type.toLowerCase().includes(keyword)
    );
  }, [search, strategies]);

  const editingStrategy = strategies.find((strategy) => strategy.id === editingId);

  function handleAddStrategy() {
    const draft = createDraftBizStrategy();
    setStrategies((current) => [...current, draft]);
    setEditingId(draft.id);
  }

  if (selectedId === "system-core") {
    if (editingId === "system-core") {
      return (
        <SystemCoreDetailView key="system-core-edit" onBack={() => setEditingId(null)} systemBase={systemBase} />
      );
    }

    return (
      <div className="admin-page">
        <h1 className="admin-title">System Core</h1>

        <div className="admin-toolbar">
          <input
            className="input admin-search"
            disabled
            placeholder="Search system core"
            value=""
          />
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Version</th>
                <th>Status</th>
                <th>Modules</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="cell-title">Algorithm Iron Rules</div>
                  <div className="cell-subtitle">{systemBase.id}</div>
                </td>
                <td>{systemBase.version}</td>
                <td>
                  <span className={`status-badge ${systemBase.status === "Published" ? "active" : "draft"}`}>
                    {systemBase.status === "Published" ? "active" : systemBase.status.toLowerCase()}
                  </span>
                </td>
                <td>Action Space · Guardrails</td>
                <td>{systemBase.updatedAt}</td>
                <td>
                  <div className="action-group">
                    <button className="button action-button" onClick={() => setEditingId("system-core")} type="button">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (editingStrategy) {
    return (
      <BizStrategyDetailView
        key={editingStrategy.id}
        onBack={() => setEditingId(null)}
        strategy={editingStrategy}
      />
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Business Strategies</h1>

      <div className="admin-toolbar">
        <input
          className="input admin-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search strategies"
          value={search}
        />
        <AddButton label="New strategy pack" onClick={handleAddStrategy} />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Version</th>
              <th>Status</th>
              <th>Visual Anchor</th>
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
                <td>
                  <span className="tag tag-blue">{strategy.type}</span>
                </td>
                <td>{strategy.version}</td>
                <td>
                  <span className={`status-badge ${strategy.enabled ? "active" : "draft"}`}>
                    {strategy.enabled ? "enabled" : "disabled"}
                  </span>
                </td>
                <td className="muted">{truncate(strategy.visualAnchor)}</td>
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
    </div>
  );
}

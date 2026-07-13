"use client";

import { useMemo, useState } from "react";
import { createDraftBizStrategy, createDraftProactiveStrategy } from "@/lib/createDrafts";
import type { BizStrategy, IdleMotion, ProactiveStrategy, StateMachine } from "@/lib/types";
import { AddButton } from "../AddButton";
import { RightDrawer } from "../RightDrawer";
import { BizStrategyDetailView } from "./BizStrategyDetailView";
import { ProactiveDetailView } from "./ProactiveDetailView";

function truncate(text: string, max = 48) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

type StrategyView = "business" | "proactive";

function getStateName(stateMachine: StateMachine, stateId: string) {
  return stateMachine.nodes.find((node) => node.id === stateId)?.name ?? stateId;
}

function directionSummary(directionPrompt: string, max = 48) {
  const firstLine = directionPrompt.split("\n").find((line) => line.trim()) ?? directionPrompt;
  if (firstLine.length <= max) return firstLine;
  return `${firstLine.slice(0, max)}…`;
}

interface StrategyTabProps {
  bizStrategies: BizStrategy[];
  idleMotions: IdleMotion[];
  onBizStrategiesChange: (strategies: BizStrategy[]) => void;
  onProactiveStrategiesChange: (strategies: ProactiveStrategy[]) => void;
  proactiveStrategies: ProactiveStrategy[];
  stateMachine: StateMachine;
}

export function StrategyTab({
  bizStrategies: strategies,
  idleMotions,
  onBizStrategiesChange,
  onProactiveStrategiesChange,
  proactiveStrategies,
  stateMachine
}: StrategyTabProps) {
  const [activeView, setActiveView] = useState<StrategyView>("business");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingProactiveId, setEditingProactiveId] = useState<string | null>(null);

  const motionNameById = useMemo(
    () => new Map(idleMotions.map((motion) => [motion.id, motion.name])),
    [idleMotions]
  );

  const filteredStrategies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return strategies;
    return strategies.filter(
      (strategy) =>
        strategy.name.toLowerCase().includes(keyword) ||
        strategy.id.toLowerCase().includes(keyword) ||
        strategy.type.toLowerCase().includes(keyword) ||
        strategy.activationMode.toLowerCase().includes(keyword)
    );
  }, [search, strategies]);

  const editingStrategy = strategies.find((strategy) => strategy.id === editingId);
  const filteredProactiveStrategies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return proactiveStrategies;
    return proactiveStrategies.filter(
      (strategy) =>
        strategy.name.toLowerCase().includes(keyword) ||
        strategy.id.toLowerCase().includes(keyword) ||
        getStateName(stateMachine, strategy.applicableStateId).toLowerCase().includes(keyword) ||
        strategy.directionPrompt.toLowerCase().includes(keyword)
    );
  }, [proactiveStrategies, search, stateMachine.nodes]);

  const editingProactiveStrategy = proactiveStrategies.find((strategy) => strategy.id === editingProactiveId);

  function handleAddStrategy() {
    const draft = createDraftBizStrategy();
    onBizStrategiesChange([...strategies, draft]);
    setEditingId(draft.id);
  }

  function handleAddProactiveStrategy() {
    const defaultStateId =
      stateMachine.nodes.find((node) => node.id === "proactive")?.id ??
      stateMachine.nodes[0]?.id ??
      "proactive";
    const draft = createDraftProactiveStrategy(defaultStateId);
    onProactiveStrategiesChange([...proactiveStrategies, draft]);
    setEditingProactiveId(draft.id);
  }

  return (
    <>
      <div className="admin-page">
      <h1 className="admin-title">Strategies</h1>

      <div className="trace-tab-switch" style={{ marginBottom: 16 }}>
        <button
          className={activeView === "business" ? "active" : ""}
          onClick={() => {
            setActiveView("business");
            setEditingProactiveId(null);
          }}
          type="button"
        >
          Business / Intent
        </button>
        <button
          className={activeView === "proactive" ? "active" : ""}
          onClick={() => {
            setActiveView("proactive");
            setEditingId(null);
          }}
          type="button"
        >
          Proactive
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          className="input admin-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder={activeView === "business" ? "Search strategies" : "Search proactive strategies"}
          value={search}
        />
        <AddButton
          label={activeView === "business" ? "New strategy pack" : "New proactive strategy"}
          onClick={activeView === "business" ? handleAddStrategy : handleAddProactiveStrategy}
        />
      </div>

      {activeView === "business" ? (
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Activation</th>
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
                <td>
                  <span className="pill">
                    {strategy.activationMode === "session" ? "Always in session" : "Semantic match"}
                  </span>
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
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Bound State</th>
                <th>Direction</th>
                <th>Motion</th>
                <th>Cooldown</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProactiveStrategies.map((strategy) => (
                <tr key={strategy.id}>
                  <td>
                    <div className="cell-title">{strategy.name}</div>
                    <div className="cell-subtitle">{strategy.id}</div>
                  </td>
                  <td>{getStateName(stateMachine, strategy.applicableStateId)}</td>
                  <td className="muted">{directionSummary(strategy.directionPrompt)}</td>
                  <td>{motionNameById.get(strategy.suggestedMotionId) ?? strategy.suggestedMotionId}</td>
                  <td>{strategy.cooldown}</td>
                  <td>
                    <span className={`status-badge ${strategy.enabled ? "active" : "draft"}`}>
                      {strategy.enabled ? "enabled" : "disabled"}
                    </span>
                  </td>
                  <td>{strategy.updatedAt}</td>
                  <td>
                    <div className="action-group">
                      <button
                        className="button action-button"
                        onClick={() => setEditingProactiveId(strategy.id)}
                        type="button"
                      >
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
      )}
      </div>

      {editingStrategy && (
        <RightDrawer ariaLabel={`Edit ${editingStrategy.name}`} onClose={() => setEditingId(null)}>
          <BizStrategyDetailView
            key={editingStrategy.id}
            onBack={() => setEditingId(null)}
            onStrategyChange={(updated) =>
              onBizStrategiesChange(strategies.map((strategy) => (strategy.id === updated.id ? updated : strategy)))
            }
            strategy={editingStrategy}
          />
        </RightDrawer>
      )}

      {editingProactiveStrategy && (
        <RightDrawer
          ariaLabel={`Edit ${editingProactiveStrategy.name}`}
          onClose={() => setEditingProactiveId(null)}
        >
          <ProactiveDetailView
            idleMotions={idleMotions}
            key={editingProactiveStrategy.id}
            onBack={() => setEditingProactiveId(null)}
            onStrategyChange={(updated) =>
              onProactiveStrategiesChange(
                proactiveStrategies.map((strategy) => (strategy.id === updated.id ? updated : strategy))
              )
            }
            stateMachine={stateMachine}
            strategy={editingProactiveStrategy}
          />
        </RightDrawer>
      )}
    </>
  );
}

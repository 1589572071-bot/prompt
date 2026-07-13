"use client";

import { useMemo, useState } from "react";
import { withCurrentOption } from "@/lib/strategyOptions";
import { cooldownOptions, priorityOptions } from "@/lib/proactiveOptions";
import { getProactiveMotionCandidates } from "@/lib/proactiveMotionOptions";
import type { IdleMotion, ProactiveStrategy, StateMachine } from "@/lib/types";

interface ProactiveDetailViewProps {
  idleMotions: IdleMotion[];
  strategy: ProactiveStrategy;
  onBack: () => void;
  onStrategyChange?: (strategy: ProactiveStrategy) => void;
  stateMachine: StateMachine;
}

export function ProactiveDetailView({
  idleMotions,
  strategy,
  onBack,
  onStrategyChange,
  stateMachine
}: ProactiveDetailViewProps) {
  const [current, setCurrent] = useState(strategy);

  const stateOptions = useMemo(
    () => stateMachine.nodes.map((node) => ({ id: node.id, name: node.name })),
    [stateMachine.nodes]
  );
  const motionOptions = useMemo(() => getProactiveMotionCandidates(idleMotions), [idleMotions]);
  const cooldownChoices = withCurrentOption(cooldownOptions, current.cooldown);
  const priorityChoices = withCurrentOption(priorityOptions, current.priority);
  const selectedMotion = motionOptions.find((motion) => motion.id === current.suggestedMotionId);

  function update(next: Partial<ProactiveStrategy>) {
    const updated = { ...current, ...next };
    setCurrent(updated);
    onStrategyChange?.(updated);
  }

  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Proactive Strategy
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit Strategy · {current.name}
          </h1>
        </div>
        <span className={`status-badge ${current.enabled ? "active" : "draft"}`}>
          {current.enabled ? "enabled" : "disabled"}
        </span>
      </div>

      <section className="card soft">
        <p className="eyebrow">Routing boundary</p>
        <p className="muted" style={{ marginBottom: 0 }}>
          Base decides when Proactive starts. This strategy defines opener direction and a suggested motion reference.
          Tone comes from Persona, not a separate emotion field.
        </p>
      </section>

      <section className="card">
        <h2 className="section-title">Strategy Metadata</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Name</label>
            <input className="input" onChange={(event) => update({ name: event.target.value })} value={current.name} />
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label className="label">Bound State</label>
              <select
                className="select"
                onChange={(event) => update({ applicableStateId: event.target.value })}
                value={current.applicableStateId}
              >
                {stateOptions.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Strategy Cooldown</label>
              <select
                className="select"
                onChange={(event) => update({ cooldown: event.target.value })}
                value={current.cooldown}
              >
                {cooldownChoices.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label className="label">Priority</label>
              <select
                className="select"
                onChange={(event) => update({ priority: event.target.value })}
                value={current.priority}
              >
                {priorityChoices.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Enable</label>
              <select
                className="select"
                onChange={(event) => update({ enabled: event.target.value === "enabled" })}
                value={current.enabled ? "enabled" : "disabled"}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Proactive Direction</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Direction Prompt</label>
            <textarea
              className="textarea"
              onChange={(event) => update({ directionPrompt: event.target.value })}
              rows={8}
              value={current.directionPrompt}
            />
          </div>
          <div>
            <label className="label">Example Phrases (reference only, one per line)</label>
            <textarea
              className="textarea"
              onChange={(event) =>
                update({
                  examplePhrases: event.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                })
              }
              rows={4}
              value={current.examplePhrases.join("\n")}
            />
          </div>
          <div>
            <label className="label">Forbidden Patterns (one per line)</label>
            <textarea
              className="textarea"
              onChange={(event) =>
                update({
                  forbiddenPatterns: event.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                })
              }
              rows={3}
              value={current.forbiddenPatterns.join("\n")}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Suggested Motion</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Opener Motion</label>
            <select
              className="select"
              onChange={(event) => update({ suggestedMotionId: event.target.value })}
              value={current.suggestedMotionId}
            >
              {motionOptions.map((motion) => (
                <option key={motion.id} value={motion.id}>
                  {motion.name} · {motion.chunk} chunks
                </option>
              ))}
            </select>
          </div>
          {selectedMotion && (
            <div className="card soft">
              <p className="muted" style={{ marginTop: 0 }}>
                {selectedMotion.description}
              </p>
              <p className="muted" style={{ marginBottom: 0 }}>
                {selectedMotion.actionPrompt.slice(0, 220)}
                {selectedMotion.actionPrompt.length > 220 ? "…" : ""}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

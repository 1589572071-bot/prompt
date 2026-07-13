"use client";

import { useState } from "react";
import { strategyTypeOptions, strategyVersionOptions, withCurrentOption } from "@/lib/strategyOptions";
import type { BizStrategy } from "@/lib/types";

interface BizStrategyDetailViewProps {
  strategy: BizStrategy;
  onBack: () => void;
  onStrategyChange?: (strategy: BizStrategy) => void;
}

export function BizStrategyDetailView({ strategy, onBack, onStrategyChange }: BizStrategyDetailViewProps) {
  const [current, setCurrent] = useState(strategy);
  const typeOptions = withCurrentOption(strategyTypeOptions, current.type);
  const versionOptions = withCurrentOption(strategyVersionOptions, current.version);

  function update(next: Partial<BizStrategy>) {
    const updated = { ...current, ...next };
    setCurrent(updated);
    onStrategyChange?.(updated);
  }

  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Business Strategies
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit Strategy · {current.name}
          </h1>
        </div>
        <div className="row">
          <span className={`status-badge ${current.enabled ? "active" : "draft"}`}>
            {current.enabled ? "enabled" : "disabled"}
          </span>
          <span className="tag tag-blue">{current.type}</span>
        </div>
      </div>

      <section className="card">
        <h2 className="section-title">Strategy Metadata</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Name</label>
            <input className="input" onChange={(event) => update({ name: event.target.value })} value={current.name} />
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label className="label">Type</label>
              <select className="select" onChange={(event) => update({ type: event.target.value })} value={current.type}>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Version</label>
              <select
                className="select"
                onChange={(event) => update({ version: event.target.value })}
                value={current.version}
              >
                {versionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Global Enable</label>
            <select
              className="select"
              onChange={(event) => update({ enabled: event.target.value === "enabled" })}
              value={current.enabled ? "enabled" : "disabled"}
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div>
            <label className="label">Activation Mode</label>
            <select
              className="select"
              onChange={(event) => update({ activationMode: event.target.value as BizStrategy["activationMode"] })}
              value={current.activationMode}
            >
              <option value="session">Session · always active in the scenario</option>
              <option value="intent">Intent · activate after semantic match</option>
            </select>
          </div>
        </div>
      </section>

      {current.activationMode === "intent" && (
        <section className="card">
          <h2 className="section-title">Intent Trigger</h2>
          <div className="stack form-stack">
            <div>
              <label className="label">Intent Name</label>
              <input
                className="input"
                onChange={(event) => update({ intentName: event.target.value })}
                value={current.intentName ?? ""}
              />
            </div>
            <div>
              <label className="label">Trigger Examples (one per line)</label>
              <textarea
                className="textarea"
                onChange={(event) =>
                  update({
                    triggerExamples: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean)
                  })
                }
                rows={5}
                value={current.triggerExamples.join("\n")}
              />
            </div>
            <div>
              <label className="label">Similarity Threshold</label>
              <input
                className="input"
                max={1}
                min={0}
                onChange={(event) => update({ similarityThreshold: Number(event.target.value) })}
                step={0.05}
                type="number"
                value={current.similarityThreshold ?? 0.5}
              />
            </div>
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="section-title">Prompt Blocks</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Visual Anchor Prompt</label>
            <textarea
              className="textarea"
              onChange={(event) => update({ visualAnchor: event.target.value })}
              rows={3}
              value={current.visualAnchor}
            />
          </div>
          <div>
            <label className="label">Pose & Motion Constraints</label>
            <textarea
              className="textarea"
              onChange={(event) => update({ poseConstraints: event.target.value })}
              rows={3}
              value={current.poseConstraints}
            />
          </div>
          <div>
            <label className="label">Product / Business Knowledge</label>
            <textarea
              className="textarea"
              onChange={(event) => update({ knowledgeBase: event.target.value })}
              rows={4}
              value={current.knowledgeBase}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

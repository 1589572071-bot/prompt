"use client";

import { strategyTypeOptions, strategyVersionOptions, withCurrentOption } from "@/lib/strategyOptions";
import type { BizStrategy } from "@/lib/types";

interface BizStrategyDetailViewProps {
  strategy: BizStrategy;
  onBack: () => void;
}

export function BizStrategyDetailView({ strategy, onBack }: BizStrategyDetailViewProps) {
  const typeOptions = withCurrentOption(strategyTypeOptions, strategy.type);
  const versionOptions = withCurrentOption(strategyVersionOptions, strategy.version);

  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Business Strategies
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit Strategy · {strategy.name}
          </h1>
        </div>
        <div className="row">
          <span className={`status-badge ${strategy.enabled ? "active" : "draft"}`}>
            {strategy.enabled ? "enabled" : "disabled"}
          </span>
          <span className="tag tag-blue">{strategy.type}</span>
        </div>
      </div>

      <section className="card">
        <h2 className="section-title">Strategy Metadata</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Name</label>
            <input className="input" defaultValue={strategy.name} />
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label className="label">Type</label>
              <select className="select" defaultValue={strategy.type}>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Version</label>
              <select className="select" defaultValue={strategy.version}>
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
            <select className="select" defaultValue={strategy.enabled ? "enabled" : "disabled"}>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Prompt Blocks</h2>
        <p className="muted">Business strategy pack content that can be bound to state orchestration nodes on demand.</p>
        <div className="stack form-stack">
          <div>
            <label className="label">Visual Anchor Prompt</label>
            <textarea className="textarea" defaultValue={strategy.visualAnchor} rows={3} />
          </div>
          <div>
            <label className="label">Pose & Motion Constraints</label>
            <textarea className="textarea" defaultValue={strategy.poseConstraints} rows={3} />
          </div>
          <div>
            <label className="label">Product / Business Knowledge</label>
            <textarea className="textarea" defaultValue={strategy.knowledgeBase} rows={4} />
          </div>
        </div>
      </section>
    </div>
  );
}

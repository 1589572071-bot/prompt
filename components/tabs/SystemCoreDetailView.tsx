"use client";

import type { SystemBase } from "@/lib/types";

interface SystemCoreDetailViewProps {
  systemBase: SystemBase;
  onBack: () => void;
}

export function SystemCoreDetailView({ systemBase, onBack }: SystemCoreDetailViewProps) {
  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to System Core
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit System Core
          </h1>
        </div>
        <span className={`status-badge ${systemBase.status === "Published" ? "active" : "draft"}`}>
          {systemBase.status === "Published" ? "active" : systemBase.status.toLowerCase()}
        </span>
      </div>

      <section className="card">
        <h2 className="section-title">Algorithm Iron Rules</h2>
        <p className="muted">Highest-priority system rules that cannot be overridden by business strategies.</p>
        <div className="stack form-stack">
          <div>
            <label className="label">Action Space</label>
            <textarea className="textarea code-input" defaultValue={systemBase.actionSpace} rows={5} />
          </div>
          <div>
            <label className="label">Guardrails</label>
            <textarea className="textarea code-input" defaultValue={systemBase.guardrails} rows={5} />
          </div>
        </div>
      </section>
    </div>
  );
}

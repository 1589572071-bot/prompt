"use client";

import type { SystemPromptAsset } from "@/lib/systemBaseCatalog";

interface SystemCoreDetailViewProps {
  onBack: () => void;
  onPromptChange?: (prompt: SystemPromptAsset) => void;
  prompt: SystemPromptAsset;
}

export function SystemCoreDetailView({ onBack, onPromptChange, prompt }: SystemCoreDetailViewProps) {
  function update(next: Partial<SystemPromptAsset>) {
    onPromptChange?.({ ...prompt, ...next });
  }

  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Prompts
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit · {prompt.name}
          </h1>
          <p className="muted">{prompt.id}</p>
        </div>
        <span className="status-badge active">production</span>
      </div>

      <section className="card">
        <h2 className="section-title">Prompt Metadata</h2>
        <div className="stack form-stack">
          <div className="grid two">
            <div>
              <label className="label">Type</label>
              <select
                className="select"
                onChange={(event) => update({ type: event.target.value as SystemPromptAsset["type"] })}
                value={prompt.type}
              >
                <option value="text">text</option>
                <option value="json">json</option>
                <option value="yaml">yaml</option>
              </select>
            </div>
            <div>
              <label className="label">Versions</label>
              <input
                className="input"
                onChange={(event) => update({ versions: Number(event.target.value) })}
                type="number"
                value={prompt.versions}
              />
            </div>
          </div>
          <div>
            <label className="label">Latest Version Created At</label>
            <input
              className="input"
              onChange={(event) => update({ latestVersionCreatedAt: event.target.value })}
              value={prompt.latestVersionCreatedAt}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Prompt</h2>
        <textarea
          className="textarea code-input"
          onChange={(event) => update({ content: event.target.value })}
          rows={22}
          value={prompt.content}
        />
      </section>
    </div>
  );
}

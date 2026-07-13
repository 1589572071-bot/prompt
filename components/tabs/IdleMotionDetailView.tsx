"use client";

import { useState } from "react";
import type { IdleMotion } from "@/lib/types";

interface IdleMotionDetailViewProps {
  motion: IdleMotion;
  onBack: () => void;
  onMotionChange?: (motion: IdleMotion) => void;
}

const categories: IdleMotion["category"][] = ["Breathing", "Gaze", "Posture", "Gesture"];

export function IdleMotionDetailView({ motion, onBack, onMotionChange }: IdleMotionDetailViewProps) {
  const [current, setCurrent] = useState(motion);

  function update(next: Partial<IdleMotion>) {
    setCurrent((value) => {
      const updated = { ...value, ...next };
      onMotionChange?.(updated);
      return updated;
    });
  }

  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Idle Motions
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit Idle Motion · {current.name}
          </h1>
          <p className="muted">{current.id}</p>
        </div>
        <span className={`status-badge ${current.status === "Published" ? "active" : "draft"}`}>
          {current.status === "Published" ? "active" : current.status.toLowerCase()}
        </span>
      </div>

      <section className="card">
        <h2 className="section-title">Motion Metadata</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Name</label>
            <input className="input" onChange={(event) => update({ name: event.target.value })} value={current.name} />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              className="select"
              onChange={(event) => update({ category: event.target.value as IdleMotion["category"] })}
              value={current.category}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Version</label>
            <input
              className="input"
              onChange={(event) => update({ version: event.target.value })}
              value={current.version}
            />
          </div>
          <div>
            <label className="label">Recommended Chunk Count</label>
            <input
              className="input"
              min={1}
              onChange={(event) => update({ chunk: Number(event.target.value) })}
              type="number"
              value={current.chunk}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Motion Prompt</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Description</label>
            <textarea
              className="textarea"
              onChange={(event) => update({ description: event.target.value })}
              rows={3}
              value={current.description}
            />
          </div>
          <div>
            <label className="label">Action Prompt</label>
            <textarea
              className="textarea"
              onChange={(event) => update({ actionPrompt: event.target.value })}
              rows={5}
              value={current.actionPrompt}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

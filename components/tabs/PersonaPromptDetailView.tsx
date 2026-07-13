"use client";

import { useState } from "react";
import type { PersonaPrompt } from "@/lib/types";

interface PersonaPromptDetailViewProps {
  prompt: PersonaPrompt;
  onBack: () => void;
  onPromptChange?: (prompt: PersonaPrompt) => void;
}

export function PersonaPromptDetailView({ prompt, onBack, onPromptChange }: PersonaPromptDetailViewProps) {
  const [name, setName] = useState(prompt.name);
  const [label, setLabel] = useState(prompt.label);
  const [version, setVersion] = useState(prompt.version);
  const [styleSummary, setStyleSummary] = useState(prompt.styleSummary);
  const [relationshipSummary, setRelationshipSummary] = useState(prompt.relationshipSummary);
  const [speakingStyleTags, setSpeakingStyleTags] = useState(prompt.speakingStyleTags.join(", "));
  const [forbiddenStyleTags, setForbiddenStyleTags] = useState(prompt.forbiddenStyleTags.join(", "));
  const [content, setContent] = useState(prompt.content);

  function emitChange(next: Partial<PersonaPrompt>) {
    onPromptChange?.({
      ...prompt,
      name,
      label,
      version,
      styleSummary,
      relationshipSummary,
      speakingStyleTags: speakingStyleTags.split(",").map((tag) => tag.trim()).filter(Boolean),
      forbiddenStyleTags: forbiddenStyleTags.split(",").map((tag) => tag.trim()).filter(Boolean),
      content,
      ...next
    });
  }

  return (
    <div className="stack persona-drawer-content">
      <div className="row between persona-drawer-header">
        <div>
          <p className="eyebrow">Persona Prompt</p>
          <h1 className="persona-drawer-title">Edit · {name}</h1>
          <p className="muted">{prompt.id}</p>
        </div>
        <div className="row">
          <span className={`status-badge ${prompt.status === "Published" ? "active" : "draft"}`}>
            {prompt.status === "Published" ? "active" : prompt.status.toLowerCase()}
          </span>
          <button aria-label="Close persona editor" className="persona-drawer-close" onClick={onBack} type="button">
            ×
          </button>
        </div>
      </div>

      <section className="card">
        <h2 className="section-title">Basic Info</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Name</label>
            <input
              className="input"
              onChange={(event) => {
                setName(event.target.value);
                emitChange({ name: event.target.value });
              }}
              value={name}
            />
          </div>
          <div>
            <label className="label">Label (shown on avatar list)</label>
            <input
              className="input"
              onChange={(event) => {
                setLabel(event.target.value);
                emitChange({ label: event.target.value });
              }}
              value={label}
            />
          </div>
          <div>
            <label className="label">Version</label>
            <input
              className="input"
              onChange={(event) => {
                setVersion(event.target.value);
                emitChange({ version: event.target.value });
              }}
              value={version}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Persona Summary</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Style Summary</label>
            <textarea
              className="textarea"
              onChange={(event) => {
                setStyleSummary(event.target.value);
                emitChange({ styleSummary: event.target.value });
              }}
              rows={3}
              value={styleSummary}
            />
          </div>
          <div>
            <label className="label">Relationship Summary</label>
            <textarea
              className="textarea"
              onChange={(event) => {
                setRelationshipSummary(event.target.value);
                emitChange({ relationshipSummary: event.target.value });
              }}
              rows={2}
              value={relationshipSummary}
            />
          </div>
          <div>
            <label className="label">Speaking Style Tags</label>
            <input
              className="input"
              onChange={(event) => {
                setSpeakingStyleTags(event.target.value);
                emitChange({
                  speakingStyleTags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
                });
              }}
              placeholder="friendly, casual, short"
              value={speakingStyleTags}
            />
          </div>
          <div>
            <label className="label">Forbidden Style Tags</label>
            <input
              className="input"
              onChange={(event) => {
                setForbiddenStyleTags(event.target.value);
                emitChange({
                  forbiddenStyleTags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
                });
              }}
              placeholder="salesy, robotic, body-shaming"
              value={forbiddenStyleTags}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Persona Prompt</h2>
        <textarea
          className="textarea"
          onChange={(event) => {
            setContent(event.target.value);
            emitChange({ content: event.target.value });
          }}
          rows={24}
          value={content}
        />
      </section>
    </div>
  );
}

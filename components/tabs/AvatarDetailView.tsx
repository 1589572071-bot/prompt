"use client";

import { useMemo, useState } from "react";
import { formatAvatarBoundaries } from "@/lib/avatarBoundaries";
import { languageOptions, ownerOptions, scenarioOptions } from "@/lib/avatarOptions";
import type { AvatarProfile, IdleMotion, PersonaPrompt } from "@/lib/types";

interface AvatarDetailViewProps {
  profile: AvatarProfile;
  idleMotions: IdleMotion[];
  personas: PersonaPrompt[];
  onBack: () => void;
  onProfileChange?: (profile: AvatarProfile) => void;
}

function findPersona(personas: PersonaPrompt[], personaPromptId: string) {
  return personas.find((prompt) => prompt.id === personaPromptId);
}

export function AvatarDetailView({ profile, idleMotions, personas, onBack, onProfileChange }: AvatarDetailViewProps) {
  const [personaPromptId, setPersonaPromptId] = useState(profile.personaPromptId);
  const [ttsUrl, setTtsUrl] = useState(profile.ttsUrl);
  const [idleMotionIds, setIdleMotionIds] = useState(profile.idleMotionIds);
  const [idleMotionPickerOpen, setIdleMotionPickerOpen] = useState(false);
  const [visualDescription, setVisualDescription] = useState(profile.visualDescription);
  const [backgroundDescription, setBackgroundDescription] = useState(profile.backgroundDescription);
  const [limitations, setLimitations] = useState(formatAvatarBoundaries(profile));

  const selectedPersona = useMemo(() => findPersona(personas, personaPromptId), [personas, personaPromptId]);

  function emitChange(next: Partial<AvatarProfile>) {
    onProfileChange?.({
      ...profile,
      personaPromptId,
      ttsUrl,
      idleMotionIds,
      visualDescription,
      backgroundDescription,
      personaLabel: findPersona(personas, personaPromptId)?.label ?? profile.personaLabel,
      ...next
    });
  }

  function handlePersonaChange(nextId: string) {
    setPersonaPromptId(nextId);
    const nextLabel = findPersona(personas, nextId)?.label ?? profile.personaLabel;
    onProfileChange?.({
      ...profile,
      personaPromptId: nextId,
      personaLabel: nextLabel,
      ttsUrl,
      idleMotionIds,
      visualDescription,
      backgroundDescription
    });
  }

  function handleIdleMotionChange(motionId: string, selected: boolean) {
    const nextIds = selected
      ? Array.from(new Set([...idleMotionIds, motionId]))
      : idleMotionIds.filter((id) => id !== motionId);
    setIdleMotionIds(nextIds);
    emitChange({ idleMotionIds: nextIds });
  }

  return (
    <div className="stack avatar-tab">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Character Center
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit Avatar · {profile.name}
          </h1>
          <img
            alt={`${profile.name} preview`}
            className="avatar-hero-image"
            src={profile.imageAsset.cardImageUrl}
          />
        </div>
        <span className={`status-badge ${profile.status === "Published" ? "active" : "draft"}`}>
          {profile.status === "Published" ? "active" : profile.status.toLowerCase()}
        </span>
      </div>

      <section className="card">
        <h2 className="section-title">Basic Info</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Scenario</label>
            <select className="select" defaultValue={profile.scenario}>
              {scenarioOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Language</label>
            <select className="select" defaultValue={profile.language}>
              {languageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Owner</label>
            <select className="select" defaultValue={profile.owner}>
              {ownerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Voice & TTS</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Voice Preset</label>
            <input className="input" defaultValue={profile.voice} />
          </div>
          <div>
            <label className="label">TTS Link</label>
            <input
              className="input"
              onBlur={() => emitChange({ ttsUrl })}
              onChange={(event) => setTtsUrl(event.target.value)}
              placeholder="Paste TTS endpoint or voice preview URL"
              type="url"
              value={ttsUrl}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Visual</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Image URL</label>
            <input className="input" defaultValue={profile.imageAsset.cardImageUrl} />
            <p className="muted" style={{ marginBottom: 0 }}>{profile.imageAsset.cardImageSize}</p>
          </div>
          <div>
            <label className="label">Visual Description</label>
            <textarea
              className="textarea"
              onBlur={() => emitChange({ visualDescription })}
              onChange={(event) => setVisualDescription(event.target.value)}
              rows={5}
              value={visualDescription}
            />
          </div>
          <div>
            <label className="label">Background Description</label>
            <textarea
              className="textarea"
              onBlur={() => emitChange({ backgroundDescription })}
              onChange={(event) => setBackgroundDescription(event.target.value)}
              rows={3}
              value={backgroundDescription}
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Persona Prompt</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Persona</label>
            <select
              className="select"
              onChange={(event) => handlePersonaChange(event.target.value)}
              value={personaPromptId}
            >
              {personas.map((prompt) => (
                <option key={prompt.id} value={prompt.id}>
                  {prompt.name} · {prompt.version}
                </option>
              ))}
            </select>
          </div>
          {selectedPersona && (
            <p className="muted">
              {selectedPersona.label} · {selectedPersona.id}
            </p>
          )}
        </div>
      </section>

      <section className="card">
        <div className="row between">
          <div>
            <h2 className="section-title">Idle Motions</h2>
            <p className="muted" style={{ margin: 0 }}>
              {idleMotionIds.length} selected
            </p>
          </div>
          <button
            aria-expanded={idleMotionPickerOpen}
            aria-label={idleMotionPickerOpen ? "Collapse idle motion picker" : "Add idle motions"}
            className="persona-drawer-close"
            onClick={() => setIdleMotionPickerOpen((value) => !value)}
            type="button"
          >
            {idleMotionPickerOpen ? "−" : "+"}
          </button>
        </div>
        <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
          {idleMotions
            .filter((motion) => idleMotionIds.includes(motion.id))
            .map((motion) => (
              <span className="pill success" key={motion.id}>
                {motion.name}
              </span>
            ))}
          {!idleMotionIds.length && <span className="muted">No idle motions selected.</span>}
        </div>

        {idleMotionPickerOpen && (
          <div className="stack" style={{ gap: 10, marginTop: 14, maxHeight: 360, overflow: "auto" }}>
            {idleMotions.map((motion) => (
              <label className="row card soft" key={motion.id} style={{ padding: 12 }}>
                <input
                  checked={idleMotionIds.includes(motion.id)}
                  disabled={motion.status !== "Published"}
                  onChange={(event) => handleIdleMotionChange(motion.id, event.target.checked)}
                  type="checkbox"
                />
                <span style={{ flex: 1 }}>
                  <strong>{motion.name}</strong>
                  <span className="muted" style={{ display: "block", marginTop: 4 }}>
                    {motion.description}
                  </span>
                </span>
                <span className="pill">{motion.chunk} chunks</span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="section-title">Boundaries</h2>
        <textarea
          className="textarea"
          onChange={(event) => setLimitations(event.target.value)}
          rows={8}
          value={limitations}
        />
      </section>
    </div>
  );
}

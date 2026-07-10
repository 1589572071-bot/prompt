"use client";

import { useMemo, useState } from "react";
import { languageOptions, ownerOptions, scenarioOptions } from "@/lib/avatarOptions";
import { scriptLibraryCatalog } from "@/lib/scriptLibraryCatalog";
import type { AvatarProfile, AvatarScript } from "@/lib/types";

interface AvatarDetailViewProps {
  profile: AvatarProfile;
  onBack: () => void;
}

function linesToArray(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(items: string[]) {
  return items.join("\n");
}

export function AvatarDetailView({ profile, onBack }: AvatarDetailViewProps) {
  const [selectedScripts, setSelectedScripts] = useState<AvatarScript[]>(profile.scripts);
  const [showScriptPicker, setShowScriptPicker] = useState(false);
  const [preferredActions, setPreferredActions] = useState(
    arrayToLines(profile.behaviorPreferences.preferred)
  );
  const [avoidedActions, setAvoidedActions] = useState(arrayToLines(profile.behaviorPreferences.avoided));
  const [backViewRule, setBackViewRule] = useState(profile.behaviorPreferences.backViewRule);
  const [boundaries, setBoundaries] = useState(arrayToLines(profile.boundaries));

  const availableScripts = useMemo(
    () => scriptLibraryCatalog.filter((script) => !selectedScripts.some((item) => item.name === script.name)),
    [selectedScripts]
  );

  function addScript(script: AvatarScript) {
    setSelectedScripts((current) => [...current, { ...script, version: profile.version }]);
    setShowScriptPicker(false);
  }

  function removeScript(scriptId: string) {
    setSelectedScripts((current) => current.filter((script) => script.id !== scriptId));
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
        <h2 className="section-title">Visual Asset</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Image URL</label>
            <input className="input" defaultValue={profile.imageAsset.cardImageUrl} />
          </div>
          <p className="muted">{profile.imageAsset.cardImageSize}</p>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Default Appearance</h2>
        <textarea className="textarea" defaultValue={profile.defaultAppearance} />
      </section>

      <section className="card">
        <h2 className="section-title">Persona</h2>
        <textarea className="textarea" defaultValue={profile.persona} />
      </section>

      <section className="card">
        <div className="row between">
          <h2 className="section-title">Script Library</h2>
          <div className="picker-wrap">
            <button
              aria-label="Add from library"
              className="button icon-button primary"
              onClick={() => setShowScriptPicker((open) => !open)}
              type="button"
            >
              +
            </button>
            {showScriptPicker && (
              <div className="picker-panel">
                <div className="picker-header">
                  <strong>Select from library</strong>
                  <span className="muted">{availableScripts.length} available</span>
                </div>
                <div className="picker-list">
                  {availableScripts.map((script) => (
                    <button className="picker-item" key={script.id} onClick={() => addScript(script)} type="button">
                      <strong>{script.name}</strong>
                      <p className="muted">{script.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="stack">
          {selectedScripts.map((script) => (
            <div className="card soft script-card" key={script.id}>
              <div className="row between">
                <strong>{script.name}</strong>
                <button className="button danger-text" onClick={() => removeScript(script.id)} type="button">
                  Remove
                </button>
              </div>
              <p>{script.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Behavior & Boundaries</h2>
        <div className="stack">
          <div>
            <label className="label">Preferred Actions</label>
            <textarea
              className="textarea code-input"
              onChange={(event) => setPreferredActions(event.target.value)}
              value={preferredActions}
            />
            <p className="hint">{linesToArray(preferredActions).length} rules configured</p>
          </div>
          <div>
            <label className="label">Actions to Avoid</label>
            <textarea
              className="textarea code-input"
              onChange={(event) => setAvoidedActions(event.target.value)}
              value={avoidedActions}
            />
          </div>
          <div>
            <label className="label">Back View Rule</label>
            <textarea
              className="textarea code-input"
              onChange={(event) => setBackViewRule(event.target.value)}
              value={backViewRule}
            />
          </div>
          <div>
            <label className="label">Boundaries</label>
            <textarea
              className="textarea code-input"
              onChange={(event) => setBoundaries(event.target.value)}
              value={boundaries}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

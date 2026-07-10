"use client";

import { useMemo, useState } from "react";
import { avatarProfile, stateMachine } from "@/lib/mockData";
import {
  actionTokenOptions,
  cooldownOptions,
  emotionTagOptions,
  priorityOptions
} from "@/lib/proactiveOptions";
import { getSemanticLockStatus } from "@/lib/proactiveValidation";
import { withCurrentOption } from "@/lib/strategyOptions";
import type { AvatarScript, ProactiveStrategy, ProactiveTextAtom } from "@/lib/types";

interface ProactiveDetailViewProps {
  strategy: ProactiveStrategy;
  onBack: () => void;
}

function textAtomLabel(textAtom: ProactiveTextAtom) {
  if (textAtom.sourceType === "avatar_script_library") {
    return `Ref · ${textAtom.name} ${textAtom.sourceScriptVersion ?? ""}`.trim();
  }
  return textAtom.name;
}

export function ProactiveDetailView({ strategy, onBack }: ProactiveDetailViewProps) {
  const [name, setName] = useState(strategy.name);
  const [applicableStateId, setApplicableStateId] = useState(strategy.applicableStateId);
  const [textAtom, setTextAtom] = useState<ProactiveTextAtom>(strategy.textAtom);
  const [actionToken, setActionToken] = useState(strategy.actionToken);
  const [emotionTag, setEmotionTag] = useState(strategy.emotionTag);
  const [cooldown, setCooldown] = useState(strategy.cooldown);
  const [priority, setPriority] = useState(strategy.priority);
  const [enabled, setEnabled] = useState(strategy.enabled);
  const [showScriptPicker, setShowScriptPicker] = useState(false);

  const stateOptions = useMemo(() => stateMachine.nodes.map((node) => ({ id: node.id, name: node.name })), []);
  const actionOptions = withCurrentOption(actionTokenOptions, actionToken);
  const emotionOptions = withCurrentOption(emotionTagOptions, emotionTag);
  const cooldownChoices = withCurrentOption(cooldownOptions, cooldown);
  const priorityChoices = withCurrentOption(priorityOptions, priority);
  const semanticLock = getSemanticLockStatus(emotionTag, actionToken);
  const boundState = stateOptions.find((node) => node.id === applicableStateId);

  function referenceScript(script: AvatarScript) {
    setTextAtom({
      id: `atom-ref-${script.id}`,
      name: script.name,
      text: script.text,
      sourceType: "avatar_script_library",
      sourceScriptId: script.id,
      sourceScriptVersion: script.version
    });
    setShowScriptPicker(false);
  }

  function useManualTextAtom() {
    setTextAtom({
      id: `atom-manual-${strategy.id}`,
      name: "Manual Text Atom",
      text: textAtom.text,
      sourceType: "manual"
    });
  }

  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Proactive Strategy
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit Strategy · {name}
          </h1>
        </div>
        <span className={`status-badge ${enabled ? "active" : "draft"}`}>{enabled ? "enabled" : "disabled"}</span>
      </div>

      <section className="card">
        <h2 className="section-title">Strategy Metadata</h2>
        <div className="stack form-stack">
          <div>
            <label className="label">Name</label>
            <input className="input" onChange={(event) => setName(event.target.value)} value={name} />
          </div>
          <div className="row">
            <div style={{ flex: 1 }}>
              <label className="label">Bound State</label>
              <select
                className="select"
                onChange={(event) => setApplicableStateId(event.target.value)}
                value={applicableStateId}
              >
                {stateOptions.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Cooldown</label>
              <select className="select" onChange={(event) => setCooldown(event.target.value)} value={cooldown}>
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
              <select className="select" onChange={(event) => setPriority(event.target.value)} value={priority}>
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
                onChange={(event) => setEnabled(event.target.value === "enabled")}
                value={enabled ? "enabled" : "disabled"}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
          <p className="hint">
            Transition timing for {boundState?.name ?? "this state"} is configured in Tab 3 state machine edges.
          </p>
        </div>
      </section>

      <section className="card">
        <div className="row between">
          <div>
            <h2 className="section-title">Text Atom</h2>
            <p className="muted">Reference Tab 2 scripts with version lock, or write proactive-only copy.</p>
          </div>
          <div className="row picker-wrap">
            <button className="button" onClick={useManualTextAtom} type="button">
              Use Manual Copy
            </button>
            <button className="button primary" onClick={() => setShowScriptPicker((open) => !open)} type="button">
              Reference Tab 2 Script
            </button>
            {showScriptPicker && (
              <div className="picker-panel">
                <div className="picker-header">
                  <strong>Tab 2 Script Library</strong>
                  <span className="muted">{avatarProfile.scripts.length} scripts</span>
                </div>
                <div className="picker-list">
                  {avatarProfile.scripts.map((script) => (
                    <button className="picker-item" key={script.id} onClick={() => referenceScript(script)} type="button">
                      <strong>
                        {script.name} · {script.version}
                      </strong>
                      <p className="muted">{script.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card soft">
          <div className="row between">
            <strong>{textAtomLabel(textAtom)}</strong>
            {textAtom.sourceType === "avatar_script_library" && (
              <span className="pill success">source_script_version locked</span>
            )}
          </div>
          <textarea
            className="textarea"
            onChange={(event) => setTextAtom((current) => ({ ...current, text: event.target.value }))}
            readOnly={textAtom.sourceType === "avatar_script_library"}
            rows={4}
            value={textAtom.text}
          />
          {textAtom.sourceType === "avatar_script_library" && (
            <p className="hint">Upgrade the reference version from this strategy when Tab 2 script changes.</p>
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Action & Emotion</h2>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label className="label">Action Token</label>
            <select className="select" onChange={(event) => setActionToken(event.target.value)} value={actionToken}>
              {actionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Emotion Tag</label>
            <select className="select" onChange={(event) => setEmotionTag(event.target.value)} value={emotionTag}>
              {emotionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Emotion-Action Guard</h2>
        <div className="row" style={{ flexWrap: "wrap" }}>
          {semanticLock.ok ? (
            <span className="pill success">No emotion-action conflicts detected</span>
          ) : (
            <span className="pill danger">{semanticLock.message}</span>
          )}
          {!semanticLock.ok && <span className="pill warning">Save will be blocked until the conflict is resolved</span>}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { avatarProfiles } from "@/lib/mockData";
import type { Environment, StudioTab } from "@/lib/types";
import { AvatarTab } from "./tabs/AvatarTab";
import { BaseTab, type BaseAssetId } from "./tabs/BaseTab";
import { ProactiveTab } from "./tabs/ProactiveTab";
import { SandboxTab } from "./tabs/SandboxTab";
import { StateTab } from "./tabs/StateTab";
import { TraceTab } from "./tabs/TraceTab";

const tabs: Array<{ id: StudioTab; label: string }> = [
  { id: "base", label: "Global Base" },
  { id: "avatar", label: "Character Center" },
  { id: "state", label: "State Orchestration" },
  { id: "proactive", label: "Proactive Strategy" },
  { id: "sandbox", label: "Sandbox Simulation" },
  { id: "trace", label: "Online Traceability" }
];

function showSecondaryRail(tab: StudioTab) {
  return tab === "base";
}

export function StudioShell() {
  const [activeTab, setActiveTab] = useState<StudioTab>("avatar");
  const [environment, setEnvironment] = useState<Environment>("Dev");
  const [selectedAvatarId, setSelectedAvatarId] = useState(avatarProfiles[0].id);
  const [selectedBaseAssetId, setSelectedBaseAssetId] = useState<BaseAssetId>("system-core");
  const selectedAvatar = useMemo(
    () => avatarProfiles.find((avatar) => avatar.id === selectedAvatarId) ?? avatarProfiles[0],
    [selectedAvatarId]
  );

  return (
    <div className="studio">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">OS</div>
          <div>
            <div>Orchestration Studio</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Digital Human Orchestration Studio MVP
            </div>
          </div>
        </div>
        <div className="topbar-controls">
          <select
            className="select"
            value={selectedAvatarId}
            onChange={(event) => setSelectedAvatarId(event.target.value)}
          >
            {avatarProfiles.map((avatar) => (
              <option key={avatar.id} value={avatar.id}>
                {avatar.name} {avatar.version}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={environment}
            onChange={(event) => setEnvironment(event.target.value as Environment)}
          >
            <option>Dev</option>
            <option>Staging</option>
            <option>Production</option>
          </select>
          <span className={`pill ${selectedAvatar.status === "Published" ? "success" : ""}`}>
            {selectedAvatar.status}
          </span>
          <button className="button">Save Draft</button>
          <button className="button primary">Merge / Publish</button>
        </div>
      </header>

      <div className={`workspace ${showSecondaryRail(activeTab) ? "" : "workspace-no-rail"}`}>
        <nav className="global-nav" aria-label="Global navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {showSecondaryRail(activeTab) && (
        <aside className="rail">
          <p className="eyebrow">Assets</p>
          <h2 className="section-title">{tabs.find((tab) => tab.id === activeTab)?.label}</h2>
          <div className="asset-list">
            <button
              className={`asset-item ${selectedBaseAssetId === "system-core" ? "active" : ""}`}
              onClick={() => setSelectedBaseAssetId("system-core")}
              type="button"
            >
              <strong>System Core</strong>
            </button>

            <button
              className={`asset-item ${selectedBaseAssetId === "biz-strategies" ? "active" : ""}`}
              onClick={() => setSelectedBaseAssetId("biz-strategies")}
              type="button"
            >
              <strong>Business Strategies</strong>
            </button>
          </div>
        </aside>
        )}

        <main className="main">
          {activeTab === "base" && <BaseTab key={selectedBaseAssetId} selectedId={selectedBaseAssetId} />}
          {activeTab === "avatar" && <AvatarTab />}
          {activeTab === "state" && <StateTab />}
          {activeTab === "proactive" && <ProactiveTab />}
          {activeTab === "sandbox" && <SandboxTab />}
          {activeTab === "trace" && <TraceTab />}
        </main>
      </div>
    </div>
  );
}

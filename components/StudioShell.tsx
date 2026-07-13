"use client";

import { useMemo, useState } from "react";
import { createDefaultConfig, applyRuntimePolicies } from "@/lib/runtimeConfig";
import { systemBaseModuleGroups, systemBaseModules } from "@/lib/systemBaseCatalog";
import type { Environment, StudioTab } from "@/lib/types";
import { AvatarTab } from "./tabs/AvatarTab";
import { BaseTab, type BaseAssetId } from "./tabs/BaseTab";
import { IdleMotionTab } from "./tabs/IdleMotionTab";
import { PersonaTab } from "./tabs/PersonaTab";
import { SandboxTab } from "./tabs/SandboxTab";
import { StrategyTab } from "./tabs/StrategyTab";
import { TraceTab } from "./tabs/TraceTab";

const tabs: Array<{ id: StudioTab; label: string }> = [
  { id: "base", label: "Base" },
  { id: "persona", label: "Personas" },
  { id: "idleMotion", label: "Idle Motions" },
  { id: "avatar", label: "Characters" },
  { id: "strategy", label: "Strategies" },
  { id: "sandbox", label: "Sandbox" },
  { id: "trace", label: "Tracing" }
];

function showSecondaryRail(tab: StudioTab) {
  return tab === "base";
}

export function StudioShell() {
  const [config, setConfig] = useState(createDefaultConfig);
  const [activeTab, setActiveTab] = useState<StudioTab>("avatar");
  const [environment, setEnvironment] = useState<Environment>("Dev");
  const [selectedAvatarId, setSelectedAvatarId] = useState(config.avatars[0].id);
  const [selectedBaseAssetId, setSelectedBaseAssetId] = useState<BaseAssetId>("algorithm-rules");
  const selectedAvatar = useMemo(
    () => config.avatars.find((avatar) => avatar.id === selectedAvatarId) ?? config.avatars[0],
    [config.avatars, selectedAvatarId]
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
            {config.avatars.map((avatar) => (
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
        <aside className="rail rail-compact">
          <div className="asset-list">
            {systemBaseModuleGroups.map((group) => (
              <div className="rail-group" key={group.id}>
                <p className="rail-group-label">{group.label}</p>
                {systemBaseModules
                  .filter((module) => module.groupId === group.id)
                  .map((module) => (
                    <button
                      className={`asset-item asset-item-compact ${selectedBaseAssetId === module.id ? "active" : ""}`}
                      key={module.id}
                      onClick={() => setSelectedBaseAssetId(module.id)}
                      title={module.name}
                      type="button"
                    >
                      {module.railLabel}
                    </button>
                  ))}
                {group.id === "runtime" && (
                  <button
                    className={`asset-item asset-item-compact ${selectedBaseAssetId === "runtime-states" ? "active" : ""}`}
                    onClick={() => setSelectedBaseAssetId("runtime-states")}
                    title="Runtime States"
                    type="button"
                  >
                    States
                  </button>
                )}
              </div>
            ))}
          </div>
        </aside>
        )}

        <main className="main">
          {activeTab === "base" && (
            <BaseTab
              key={selectedBaseAssetId}
              bizStrategies={config.bizStrategies}
              onPromptsChange={(systemPromptAssets) =>
                setConfig((current) => applyRuntimePolicies({ ...current, systemPromptAssets }))
              }
              onSelect={setSelectedBaseAssetId}
              onStateMachineChange={(stateMachine) => setConfig((current) => ({ ...current, stateMachine }))}
              proactiveStrategies={config.proactiveStrategies}
              prompts={config.systemPromptAssets}
              selectedId={selectedBaseAssetId}
              stateMachine={config.stateMachine}
            />
          )}
          {activeTab === "persona" && (
            <PersonaTab
              onPromptsChange={(personas) => setConfig((current) => ({ ...current, personas }))}
              prompts={config.personas}
            />
          )}
          {activeTab === "idleMotion" && (
            <IdleMotionTab
              motions={config.idleMotions}
              onMotionsChange={(idleMotions) => setConfig((current) => ({ ...current, idleMotions }))}
            />
          )}
          {activeTab === "avatar" && (
            <AvatarTab
              avatars={config.avatars}
              idleMotions={config.idleMotions}
              onAvatarsChange={(avatars) => setConfig((current) => ({ ...current, avatars }))}
              personas={config.personas}
            />
          )}
          {activeTab === "strategy" && (
            <StrategyTab
              bizStrategies={config.bizStrategies}
              idleMotions={config.idleMotions}
              onBizStrategiesChange={(bizStrategies) => setConfig((current) => ({ ...current, bizStrategies }))}
              onProactiveStrategiesChange={(proactiveStrategies) =>
                setConfig((current) => ({ ...current, proactiveStrategies }))
              }
              proactiveStrategies={config.proactiveStrategies}
              stateMachine={config.stateMachine}
            />
          )}
          {activeTab === "sandbox" && <SandboxTab config={config} />}
          {activeTab === "trace" && <TraceTab config={config} />}
        </main>
      </div>
    </div>
  );
}

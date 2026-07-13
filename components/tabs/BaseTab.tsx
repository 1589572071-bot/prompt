"use client";

import { useState } from "react";
import {
  getSystemBaseModule,
  systemBaseModules,
  type SystemPromptAsset,
  type SystemBaseModuleId
} from "@/lib/systemBaseCatalog";
import type { BizStrategy, ProactiveStrategy, StateMachine } from "@/lib/types";
import { AddButton } from "../AddButton";
import { RightDrawer } from "../RightDrawer";
import { StateTab } from "./StateTab";
import { SystemCoreDetailView } from "./SystemCoreDetailView";

export type BaseAssetId = SystemBaseModuleId | "runtime-states";

interface BaseTabProps {
  bizStrategies: BizStrategy[];
  onPromptsChange: (prompts: SystemPromptAsset[]) => void;
  onSelect: (id: BaseAssetId) => void;
  onStateMachineChange: (stateMachine: StateMachine) => void;
  proactiveStrategies: ProactiveStrategy[];
  prompts: SystemPromptAsset[];
  selectedId: BaseAssetId;
  stateMachine: StateMachine;
}

export function BaseTab({
  bizStrategies,
  onPromptsChange,
  onSelect,
  onStateMachineChange,
  proactiveStrategies,
  prompts,
  selectedId,
  stateMachine
}: BaseTabProps) {
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const selectedModule = selectedId === "runtime-states" ? systemBaseModules[0] : getSystemBaseModule(selectedId);
  const promptAssets = selectedId === "runtime-states" ? [] : prompts.filter((prompt) => prompt.moduleId === selectedId);
  const editingPrompt = promptAssets.find((prompt) => prompt.id === editingPromptId) ?? null;

  function handleAddPrompt() {
    if (selectedId === "runtime-states") return;
    const now = new Date();
    const id = `prompt-${selectedId}-${Date.now()}`;
    const draft: SystemPromptAsset = {
      id,
      moduleId: selectedId,
      name: `new_${selectedId.replace(/-/g, "_")}_prompt`,
      versions: 1,
      type: "text",
      latestVersionCreatedAt: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`,
      observations: 0,
      tags: [],
      content: "Write prompt content here.",
      variables: []
    };
    onPromptsChange([...prompts, draft]);
    setEditingPromptId(id);
  }

  if (selectedId === "runtime-states") {
    return (
      <StateTab
        bizStrategies={bizStrategies}
        onStateMachineChange={onStateMachineChange}
        proactiveStrategies={proactiveStrategies}
        stateMachine={stateMachine}
      />
    );
  }

  return (
    <>
      <div className="admin-page">
      <h1 className="admin-title">{selectedModule.name}</h1>

      <div className="admin-toolbar">
        <input className="input admin-search" disabled placeholder="Search prompts" value="" />
        <AddButton label="New prompt" onClick={handleAddPrompt} />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Versions</th>
              <th>Type</th>
              <th>Latest Version Created At</th>
              <th>Number of Observations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promptAssets.map((prompt) => (
              <tr key={prompt.id}>
                <td>
                  <div className="cell-title">{prompt.name}</div>
                </td>
                <td>{prompt.versions}</td>
                <td>{prompt.type}</td>
                <td>{prompt.latestVersionCreatedAt}</td>
                <td>{prompt.observations}</td>
                <td>
                  <div className="action-group">
                    <button className="button action-button" onClick={() => setEditingPromptId(prompt.id)} type="button">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {editingPrompt && (
        <RightDrawer ariaLabel={`Edit ${editingPrompt.name}`} onClose={() => setEditingPromptId(null)}>
          <SystemCoreDetailView
            key={editingPrompt.id}
            onBack={() => setEditingPromptId(null)}
            onPromptChange={(updated) =>
              onPromptsChange(prompts.map((prompt) => (prompt.id === updated.id ? updated : prompt)))
            }
            prompt={editingPrompt}
          />
        </RightDrawer>
      )}
    </>
  );
}

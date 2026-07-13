"use client";

import { useMemo, useState } from "react";
import { createDraftPersonaPrompt } from "@/lib/createPersonaDraft";
import type { PersonaPrompt } from "@/lib/types";
import { AddButton } from "../AddButton";
import { PersonaPromptDetailView } from "./PersonaPromptDetailView";

interface PersonaTabProps {
  onPromptsChange: (prompts: PersonaPrompt[]) => void;
  prompts: PersonaPrompt[];
}

export function PersonaTab({ onPromptsChange, prompts }: PersonaTabProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredPrompts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return prompts;
    return prompts.filter(
      (prompt) =>
        prompt.name.toLowerCase().includes(keyword) ||
        prompt.id.toLowerCase().includes(keyword) ||
        prompt.label.toLowerCase().includes(keyword)
    );
  }, [prompts, search]);

  const editingPrompt = prompts.find((prompt) => prompt.id === editingId);

  function handleAddPrompt() {
    const draft = createDraftPersonaPrompt();
    onPromptsChange([...prompts, draft]);
    setEditingId(draft.id);
  }

  return (
    <>
      <div className="admin-page">
        <h1 className="admin-title">Persona Prompts</h1>

        <div className="admin-toolbar">
          <input
            className="input admin-search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search persona prompts"
            value={search}
          />
          <AddButton label="New persona prompt" onClick={handleAddPrompt} />
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Label</th>
                <th>Version</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrompts.map((prompt) => (
                <tr key={prompt.id}>
                  <td>
                    <div className="cell-title">{prompt.name}</div>
                    <div className="cell-subtitle">{prompt.id}</div>
                  </td>
                  <td>{prompt.label}</td>
                  <td>{prompt.version}</td>
                  <td>
                    <span className={`status-badge ${prompt.status === "Published" ? "active" : "draft"}`}>
                      {prompt.status === "Published" ? "active" : prompt.status.toLowerCase()}
                    </span>
                  </td>
                  <td>{prompt.updatedAt}</td>
                  <td>
                    <div className="action-group">
                      <button className="button action-button" onClick={() => setEditingId(prompt.id)} type="button">
                        Edit
                      </button>
                      <button className="button action-button danger-outline" type="button">
                        Delete
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
        <div className="persona-drawer-backdrop" onClick={() => setEditingId(null)} role="presentation">
          <aside
            aria-label={`Edit ${editingPrompt.name}`}
            aria-modal="true"
            className="persona-drawer"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <PersonaPromptDetailView
              key={editingPrompt.id}
              onBack={() => setEditingId(null)}
              onPromptChange={(updated) =>
                onPromptsChange(prompts.map((prompt) => (prompt.id === updated.id ? updated : prompt)))
              }
              prompt={editingPrompt}
            />
          </aside>
        </div>
      )}
    </>
  );
}

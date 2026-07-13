"use client";

import { useMemo, useState } from "react";
import { createDraftAvatar } from "@/lib/createDrafts";
import type { AvatarProfile, IdleMotion, PersonaPrompt } from "@/lib/types";
import { AddButton } from "../AddButton";
import { RightDrawer } from "../RightDrawer";
import { AvatarDetailView } from "@/components/tabs/AvatarDetailView";

interface AvatarTabProps {
  avatars: AvatarProfile[];
  idleMotions: IdleMotion[];
  onAvatarsChange: (avatars: AvatarProfile[]) => void;
  personas: PersonaPrompt[];
}

export function AvatarTab({ avatars, idleMotions, onAvatarsChange, personas }: AvatarTabProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredAvatars = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return avatars;
    return avatars.filter(
      (avatar) =>
        avatar.name.toLowerCase().includes(keyword) ||
        avatar.id.toLowerCase().includes(keyword) ||
        avatar.personaLabel.toLowerCase().includes(keyword)
    );
  }, [avatars, search]);

  const editingProfile = avatars.find((avatar) => avatar.id === editingId);

  function handleAddAvatar() {
    const draft = createDraftAvatar(avatars.length);
    onAvatarsChange([...avatars, draft]);
    setEditingId(draft.id);
  }

  return (
    <>
      <div className="admin-page">
      <h1 className="admin-title">Character Center</h1>

      <div className="admin-toolbar">
        <input
          className="input admin-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search avatars"
          value={search}
        />
        <AddButton label="New avatar" onClick={handleAddAvatar} />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Name</th>
              <th>Studio</th>
              <th>Voice</th>
              <th>Persona</th>
              <th>Status</th>
              <th>Sort</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAvatars.map((avatar) => (
              <tr key={avatar.id}>
                <td>
                  <img
                    alt={`${avatar.name} preview`}
                    className="table-thumb"
                    src={avatar.imageAsset.cardImageUrl}
                  />
                </td>
                <td>
                  <div className="cell-title">{avatar.name}</div>
                  <div className="cell-subtitle">{avatar.id}</div>
                </td>
                <td>
                  <span className="tag tag-blue">{avatar.studio}</span>
                </td>
                <td>{avatar.voice}</td>
                <td>{avatar.personaLabel}</td>
                <td>
                  <span className={`status-badge ${avatar.status === "Published" ? "active" : "draft"}`}>
                    {avatar.status === "Published" ? "active" : avatar.status.toLowerCase()}
                  </span>
                </td>
                <td>{avatar.sort}</td>
                <td>{avatar.updatedAt}</td>
                <td>
                  <div className="action-group">
                    <button className="button action-button" onClick={() => setEditingId(avatar.id)} type="button">
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

      {editingProfile && (
        <RightDrawer ariaLabel={`Edit ${editingProfile.name}`} onClose={() => setEditingId(null)}>
          <AvatarDetailView
            key={editingProfile.id}
            onBack={() => setEditingId(null)}
            onProfileChange={(updated: AvatarProfile) =>
              onAvatarsChange(avatars.map((avatar) => (avatar.id === updated.id ? updated : avatar)))
            }
            profile={editingProfile}
            idleMotions={idleMotions}
            personas={personas}
          />
        </RightDrawer>
      )}
    </>
  );
}

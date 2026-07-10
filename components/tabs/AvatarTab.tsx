"use client";

import { useMemo, useState } from "react";
import { avatarProfiles as initialAvatars } from "@/lib/mockData";
import { createDraftAvatar } from "@/lib/createDrafts";
import type { AvatarProfile } from "@/lib/types";
import { AddButton } from "../AddButton";
import { AvatarDetailView } from "./AvatarDetailView";

export function AvatarTab() {
  const [avatars, setAvatars] = useState<AvatarProfile[]>(initialAvatars);
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
    setAvatars((current) => [...current, draft]);
    setEditingId(draft.id);
  }

  if (editingProfile) {
    return <AvatarDetailView key={editingProfile.id} profile={editingProfile} onBack={() => setEditingId(null)} />;
  }

  return (
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
  );
}

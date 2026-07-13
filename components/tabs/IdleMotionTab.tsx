"use client";

import { useMemo, useState } from "react";
import { createIdleMotionDraft } from "@/lib/createIdleMotionDraft";
import type { IdleMotion } from "@/lib/types";
import { AddButton } from "../AddButton";
import { RightDrawer } from "../RightDrawer";
import { IdleMotionDetailView } from "./IdleMotionDetailView";

interface IdleMotionTabProps {
  motions: IdleMotion[];
  onMotionsChange: (motions: IdleMotion[]) => void;
}

export function IdleMotionTab({ motions, onMotionsChange }: IdleMotionTabProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredMotions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return motions;
    return motions.filter(
      (motion) =>
        motion.name.toLowerCase().includes(keyword) ||
        motion.id.toLowerCase().includes(keyword) ||
        motion.category.toLowerCase().includes(keyword)
    );
  }, [motions, search]);

  const editingMotion = motions.find((motion) => motion.id === editingId);

  function handleAddMotion() {
    const draft = createIdleMotionDraft();
    onMotionsChange([...motions, draft]);
    setEditingId(draft.id);
  }

  return (
    <>
      <div className="admin-page">
      <h1 className="admin-title">Idle Motions</h1>

      <div className="admin-toolbar">
        <input
          className="input admin-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search idle motions"
          value={search}
        />
        <AddButton label="New idle motion" onClick={handleAddMotion} />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Recommended Chunks</th>
              <th>Version</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMotions.map((motion) => (
              <tr key={motion.id}>
                <td>
                  <div className="cell-title">{motion.name}</div>
                </td>
                <td>
                  <span className="tag tag-blue">{motion.category}</span>
                </td>
                <td>{motion.chunk}</td>
                <td>{motion.version}</td>
                <td>
                  <span className={`status-badge ${motion.status === "Published" ? "active" : "draft"}`}>
                    {motion.status === "Published" ? "active" : motion.status.toLowerCase()}
                  </span>
                </td>
                <td>{motion.updatedAt}</td>
                <td>
                  <div className="action-group">
                    <button className="button action-button" onClick={() => setEditingId(motion.id)} type="button">
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

      {editingMotion && (
        <RightDrawer ariaLabel={`Edit ${editingMotion.name}`} onClose={() => setEditingId(null)}>
          <IdleMotionDetailView
            key={editingMotion.id}
            motion={editingMotion}
            onBack={() => setEditingId(null)}
            onMotionChange={(updated) =>
              onMotionsChange(motions.map((motion) => (motion.id === updated.id ? updated : motion)))
            }
          />
        </RightDrawer>
      )}
    </>
  );
}

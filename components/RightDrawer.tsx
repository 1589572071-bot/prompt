"use client";

import type { ReactNode } from "react";

interface RightDrawerProps {
  ariaLabel: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}

export function RightDrawer({ ariaLabel, children, onClose, wide = true }: RightDrawerProps) {
  return (
    <div className="edit-drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        aria-label={ariaLabel}
        aria-modal="true"
        className={`edit-drawer ${wide ? "wide" : ""}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="edit-drawer-content">{children}</div>
      </aside>
    </div>
  );
}

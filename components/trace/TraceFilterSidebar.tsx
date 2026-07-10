"use client";

import type { TraceFilters } from "./traceUtils";
import type { TraceSnapshot } from "@/lib/types";

interface TraceFilterSidebarProps {
  traces: TraceSnapshot[];
  filters: TraceFilters;
  onChange: (filters: TraceFilters) => void;
}

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterGroup({
  title,
  values,
  selected,
  onToggle
}: {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <details className="trace-filter-group" open>
      <summary>{title}</summary>
      <div className="trace-filter-options">
        {values.map((value) => (
          <label className="trace-filter-option" key={value}>
            <input
              checked={selected.includes(value)}
              onChange={() => onToggle(value)}
              type="checkbox"
            />
            <span>{value}</span>
          </label>
        ))}
      </div>
    </details>
  );
}

export function TraceFilterSidebar({ traces, filters, onChange }: TraceFilterSidebarProps) {
  const environments = Array.from(new Set(traces.map((trace) => trace.environment))).sort();
  const traceNames = Array.from(
    new Set(traces.map((trace) => `${trace.avatarName} · Turn ${trace.turnIndex}`))
  ).sort();
  const sessionIds = Array.from(new Set(traces.map((trace) => trace.sessionId))).sort();
  const userIds = Array.from(new Set(traces.map((trace) => trace.userId))).sort();
  const avatarNames = Array.from(new Set(traces.map((trace) => trace.avatarName))).sort();
  const stateNodes = Array.from(new Set(traces.map((trace) => trace.stateNode))).sort();

  return (
    <aside className="trace-sidebar">
      <div className="trace-sidebar-title">Filters</div>
      <FilterGroup
        onToggle={(value) => onChange({ ...filters, environments: toggleValue(filters.environments, value) })}
        selected={filters.environments}
        title="Environment"
        values={environments}
      />
      <FilterGroup
        onToggle={(value) => onChange({ ...filters, traceNames: toggleValue(filters.traceNames, value) })}
        selected={filters.traceNames}
        title="Traces"
        values={traceNames}
      />
      <FilterGroup
        onToggle={(value) => onChange({ ...filters, sessionIds: toggleValue(filters.sessionIds, value) })}
        selected={filters.sessionIds}
        title="Session"
        values={sessionIds}
      />
      <FilterGroup
        onToggle={(value) => onChange({ ...filters, userIds: toggleValue(filters.userIds, value) })}
        selected={filters.userIds}
        title="User"
        values={userIds}
      />
      <FilterGroup
        onToggle={(value) => onChange({ ...filters, avatarNames: toggleValue(filters.avatarNames, value) })}
        selected={filters.avatarNames}
        title="Avatar"
        values={avatarNames}
      />
      <FilterGroup
        onToggle={(value) => onChange({ ...filters, stateNodes: toggleValue(filters.stateNodes, value) })}
        selected={filters.stateNodes}
        title="State"
        values={stateNodes}
      />
    </aside>
  );
}

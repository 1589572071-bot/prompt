"use client";

import { useMemo, useState } from "react";
import { buildTraceSpans, flattenSpans } from "@/lib/buildTraceSpans";
import type { TraceSnapshot } from "@/lib/types";
import { ObservationsTable } from "./ObservationsTable";
import { TraceFilterSidebar } from "./TraceFilterSidebar";
import { allTraceColumns, TracesTable, type TraceColumnKey } from "./TracesTable";
import {
  defaultTraceFilters,
  exportJson,
  matchesTimeRange,
  traceDisplayName,
  type TraceFilters,
  type TraceListTab,
  type TraceTimeRange
} from "./traceUtils";

interface TraceListLayoutProps {
  traces: TraceSnapshot[];
  onOpenTrace: (traceId: string, spanId?: string) => void;
}

const PAGE_SIZE = 50;

function matchesFilters(trace: TraceSnapshot, filters: TraceFilters) {
  const traceName = traceDisplayName(trace.avatarName, trace.turnIndex);
  if (filters.environments.length && !filters.environments.includes(trace.environment)) return false;
  if (filters.traceNames.length && !filters.traceNames.includes(traceName)) return false;
  if (filters.sessionIds.length && !filters.sessionIds.includes(trace.sessionId)) return false;
  if (filters.userIds.length && !filters.userIds.includes(trace.userId)) return false;
  if (filters.avatarNames.length && !filters.avatarNames.includes(trace.avatarName)) return false;
  if (filters.stateNodes.length && !filters.stateNodes.includes(trace.stateNode)) return false;
  return true;
}

export function TraceListLayout({ traces, onOpenTrace }: TraceListLayoutProps) {
  const [activeTab, setActiveTab] = useState<TraceListTab>("traces");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState<TraceFilters>(defaultTraceFilters);
  const [timeRange, setTimeRange] = useState<TraceTimeRange>("all");
  const [visibleColumns, setVisibleColumns] = useState<TraceColumnKey[]>(allTraceColumns);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const filteredTraces = useMemo(() => {
    return traces
      .filter((trace) => matchesFilters(trace, filters))
      .filter((trace) => matchesTimeRange(trace.createdAt, timeRange))
      .sort((a, b) => {
        if (a.sessionId !== b.sessionId) return a.sessionId.localeCompare(b.sessionId);
        return a.turnIndex - b.turnIndex;
      });
  }, [filters, timeRange, traces]);

  const filteredObservations = useMemo(() => {
    const allowedTraceIds = new Set(filteredTraces.map((trace) => trace.id));
    return traces
      .filter((trace) => allowedTraceIds.has(trace.id))
      .flatMap((trace) => flattenSpans(trace, buildTraceSpans(trace)));
  }, [filteredTraces, traces]);

  const currentItems = activeTab === "traces" ? filteredTraces : filteredObservations;
  const totalPages = Math.max(1, Math.ceil(currentItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pagedTraces = filteredTraces.slice(pageStart, pageStart + PAGE_SIZE);
  const pagedObservations = filteredObservations.slice(pageStart, pageStart + PAGE_SIZE);

  const toggleBookmark = (traceId: string) => {
    setBookmarks((current) => {
      const next = new Set(current);
      if (next.has(traceId)) next.delete(traceId);
      else next.add(traceId);
      return next;
    });
  };

  const toggleColumn = (column: TraceColumnKey) => {
    setVisibleColumns((current) =>
      current.includes(column) ? current.filter((item) => item !== column) : [...current, column]
    );
  };

  const handleRefresh = () => {
    setFilters(defaultTraceFilters);
    setTimeRange("all");
    setPage(1);
  };

  const handleExport = () => {
    if (activeTab === "traces") {
      exportJson("traces-export.json", filteredTraces);
      return;
    }
    exportJson("observations-export.json", filteredObservations);
  };

  return (
    <div className="trace-workspace">
      <div className="trace-page-header">
        <div>
          <h1 className="trace-title">Tracing</h1>
          <p className="trace-subtitle">Online turn assembly records and span-level observations</p>
        </div>
      </div>

      <div className="grid three" style={{ marginBottom: 16 }}>
        <div className="card soft">
          <div className="row between">
            <strong>Idle</strong>
            <span className="pill">No task strategy</span>
          </div>
        </div>
        <div className="card soft">
          <div className="row between">
            <strong>Proactive</strong>
            <span className="pill success">Proactive strategy</span>
          </div>
        </div>
        <div className="card soft">
          <div className="row between">
            <strong>Interaction</strong>
            <span className="pill success">Intent strategy or none</span>
          </div>
        </div>
      </div>

      <div className={`trace-layout ${filtersOpen ? "" : "filters-collapsed"}`}>
        {filtersOpen && <TraceFilterSidebar filters={filters} onChange={setFilters} traces={traces} />}

        <div className="trace-main">
          <div className="trace-toolbar">
            <div className="trace-toolbar-row">
              <div className="trace-toolbar-left">
                <button
                  className="button trace-toolbar-button"
                  onClick={() => setFiltersOpen((value) => !value)}
                  type="button"
                >
                  {filtersOpen ? "Hide filters" : "Show filters"}
                </button>
                <div className="trace-tab-switch">
                  <button
                    className={activeTab === "traces" ? "active" : ""}
                    onClick={() => {
                      setActiveTab("traces");
                      setPage(1);
                    }}
                    type="button"
                  >
                    Traces
                  </button>
                  <button
                    className={activeTab === "observations" ? "active" : ""}
                    onClick={() => {
                      setActiveTab("observations");
                      setPage(1);
                    }}
                    type="button"
                  >
                    Observations
                  </button>
                </div>
              </div>

              <div className="trace-toolbar-actions">
                <select
                  className="select trace-time-range"
                  onChange={(event) => {
                    setTimeRange(event.target.value as TraceTimeRange);
                    setPage(1);
                  }}
                  value={timeRange}
                >
                  <option value="1d">Past 1 day</option>
                  <option value="7d">Past 7 days</option>
                  <option value="all">All time</option>
                </select>
                <button className="button trace-toolbar-button" onClick={handleRefresh} type="button">
                  Refresh
                </button>
                <div className="trace-columns-menu">
                  <button
                    className="button trace-toolbar-button"
                    onClick={() => setColumnsOpen((value) => !value)}
                    type="button"
                  >
                    Columns {visibleColumns.length}/{allTraceColumns.length}
                  </button>
                  {columnsOpen && activeTab === "traces" && (
                    <div className="trace-columns-popover">
                      {allTraceColumns.map((column) => (
                        <label className="trace-filter-option" key={column}>
                          <input
                            checked={visibleColumns.includes(column)}
                            onChange={() => toggleColumn(column)}
                            type="checkbox"
                          />
                          <span>{column}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <button className="button trace-toolbar-button" onClick={handleExport} type="button">
                  Export
                </button>
              </div>
            </div>
          </div>

          {activeTab === "traces" ? (
            <TracesTable
              bookmarks={bookmarks}
              onOpenTrace={(traceId) => onOpenTrace(traceId)}
              onToggleBookmark={toggleBookmark}
              traces={pagedTraces}
              visibleColumns={visibleColumns}
            />
          ) : (
            <ObservationsTable
              observations={pagedObservations}
              onOpenObservation={(traceId, spanId) => onOpenTrace(traceId, spanId)}
            />
          )}

          <div className="trace-pagination">
            <span>
              Rows per page: {PAGE_SIZE} · Page {safePage} of {totalPages}
            </span>
            <div className="trace-pagination-actions">
              <button
                className="button trace-toolbar-button"
                disabled={safePage <= 1}
                onClick={() => setPage(1)}
                type="button"
              >
                First
              </button>
              <button
                className="button trace-toolbar-button"
                disabled={safePage <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                type="button"
              >
                Previous
              </button>
              <button
                className="button trace-toolbar-button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                type="button"
              >
                Next
              </button>
              <button
                className="button trace-toolbar-button"
                disabled={safePage >= totalPages}
                onClick={() => setPage(totalPages)}
                type="button"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

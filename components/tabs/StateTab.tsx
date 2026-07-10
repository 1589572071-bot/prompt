"use client";

import { useMemo, useState } from "react";
import { bizStrategies, proactiveStrategies, stateMachine } from "@/lib/mockData";
import { createDraftStateEdge, createDraftStateNode } from "@/lib/createDrafts";
import { interruptBufferPolicies } from "@/lib/stateOptions";
import type { StateEdge, StateNode } from "@/lib/types";
import { AddButton } from "../AddButton";
import { StateEdgeDetailView } from "./StateEdgeDetailView";
import { StateNodeDetailView, summarizeStrategies, useStateTypeOptions } from "./StateNodeDetailView";

function getPolicyLabel(node: StateNode) {
  const policy = node.interruptBufferPolicy ?? (node.interruptLock ? "fade_1_5s" : "none");
  return interruptBufferPolicies.find((item) => item.id === policy)?.label ?? policy;
}

function getNodeName(nodes: StateNode[], nodeId: string) {
  return nodes.find((node) => node.id === nodeId)?.name ?? nodeId;
}

export function StateTab() {
  const [nodes, setNodes] = useState<StateNode[]>(stateMachine.nodes);
  const [edges, setEdges] = useState<StateEdge[]>(stateMachine.edges);
  const [search, setSearch] = useState("");
  const [transitionSearch, setTransitionSearch] = useState("");
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);

  const stateTypeOptions = useStateTypeOptions(nodes, stateMachine.customTypes);

  const filteredNodes = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return nodes;
    return nodes.filter(
      (node) =>
        node.name.toLowerCase().includes(keyword) ||
        node.id.toLowerCase().includes(keyword) ||
        node.type.toLowerCase().includes(keyword)
    );
  }, [nodes, search]);

  const filteredEdges = useMemo(() => {
    const keyword = transitionSearch.trim().toLowerCase();
    if (!keyword) return edges;
    return edges.filter((edge) => {
      const fromName = getNodeName(nodes, edge.from).toLowerCase();
      const toName = getNodeName(nodes, edge.to).toLowerCase();
      return (
        edge.id.toLowerCase().includes(keyword) ||
        edge.event.toLowerCase().includes(keyword) ||
        fromName.includes(keyword) ||
        toName.includes(keyword)
      );
    });
  }, [edges, nodes, transitionSearch]);

  const editingNode = nodes.find((node) => node.id === editingNodeId);
  const editingEdge = edges.find((edge) => edge.id === editingEdgeId);
  const editingEdgeFrom = editingEdge ? nodes.find((node) => node.id === editingEdge.from) : undefined;
  const editingEdgeTo = editingEdge ? nodes.find((node) => node.id === editingEdge.to) : undefined;

  function handleAddState() {
    const draft = createDraftStateNode(nodes);
    setNodes((current) => [...current, draft]);
    setEditingNodeId(draft.id);
  }

  function handleAddTransition() {
    if (!nodes.length) return;
    const draft = createDraftStateEdge(nodes);
    setEdges((current) => [...current, draft]);
    setEditingEdgeId(draft.id);
  }

  if (editingNode) {
    return (
      <StateNodeDetailView
        key={editingNode.id}
        node={editingNode}
        onBack={() => setEditingNodeId(null)}
        stateTypeOptions={stateTypeOptions}
      />
    );
  }

  if (editingEdge && editingEdgeFrom && editingEdgeTo) {
    return (
      <StateEdgeDetailView
        edge={editingEdge}
        fromNode={editingEdgeFrom}
        onBack={() => setEditingEdgeId(null)}
        toNode={editingEdgeTo}
      />
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">State Orchestration</h1>
      <p className="muted" style={{ marginTop: -8 }}>
        Manage runtime states and transition rules for prompt routing. Machine version {stateMachine.version}.
      </p>

      <div className="admin-toolbar">
        <input
          className="input admin-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search states"
          value={search}
        />
        <AddButton label="New state" onClick={handleAddState} />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Role</th>
              <th>Strategy Packs</th>
              <th>Proactive</th>
              <th>Interrupt Policy</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNodes.map((node) => (
              <tr key={node.id}>
                <td>
                  <div className="cell-title">{node.name}</div>
                  <div className="cell-subtitle">{node.id}</div>
                </td>
                <td>{node.type}</td>
                <td>
                  {node.initial && <span className="status-badge active">initial</span>}
                  {node.terminal && <span className="status-badge draft">terminal</span>}
                  {!node.initial && !node.terminal && <span className="muted">—</span>}
                </td>
                <td className="muted">{summarizeStrategies(node.strategyIds, bizStrategies)}</td>
                <td className="muted">{summarizeStrategies(node.proactiveStrategyIds, proactiveStrategies)}</td>
                <td className="muted">{getPolicyLabel(node)}</td>
                <td>
                  <div className="action-group">
                    <button className="button action-button" onClick={() => setEditingNodeId(node.id)} type="button">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section-header">
        <h2 className="admin-subtitle">Transitions</h2>
        <p className="muted">Configure when the runtime moves between states, including timeout and interrupt rules.</p>
      </div>

      <div className="admin-toolbar">
        <input
          className="input admin-search"
          onChange={(event) => setTransitionSearch(event.target.value)}
          placeholder="Search transitions"
          value={transitionSearch}
        />
        <AddButton label="New transition" onClick={handleAddTransition} />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Trigger Event</th>
              <th>Timeout</th>
              <th>Condition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEdges.map((edge) => (
              <tr key={edge.id}>
                <td>{getNodeName(nodes, edge.from)}</td>
                <td>{getNodeName(nodes, edge.to)}</td>
                <td>{edge.event}</td>
                <td>{edge.timeout ?? "—"}</td>
                <td className="muted">{edge.condition ?? "—"}</td>
                <td>
                  <div className="action-group">
                    <button className="button action-button" onClick={() => setEditingEdgeId(edge.id)} type="button">
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
  );
}

"use client";

import { useMemo, useState } from "react";
import { interruptBufferPolicies } from "@/lib/stateOptions";
import type { InterruptBufferPolicyId } from "@/lib/stateOptions";
import type { BizStrategy, ProactiveStrategy, StateNode } from "@/lib/types";
import { StateNodeInspector } from "./StateNodeInspector";

interface StateNodeDetailViewProps {
  bizStrategies: BizStrategy[];
  node: StateNode;
  onBack: () => void;
  onNodeChange?: (node: StateNode) => void;
  proactiveStrategies: ProactiveStrategy[];
  scenarioStrategyIds: string[];
  stateTypeOptions: string[];
}

function getPolicyLabel(node: StateNode) {
  const policy = node.interruptBufferPolicy ?? (node.interruptLock ? "fade_1_5s" : "none");
  return interruptBufferPolicies.find((item) => item.id === policy)?.label ?? policy;
}

export function StateNodeDetailView({
  bizStrategies,
  node,
  onBack,
  onNodeChange,
  proactiveStrategies,
  scenarioStrategyIds,
  stateTypeOptions
}: StateNodeDetailViewProps) {
  const [currentNode, setCurrentNode] = useState(node);

  function emitChange(next: StateNode) {
    setCurrentNode(next);
    onNodeChange?.(next);
  }

  function updatePolicy(policy: InterruptBufferPolicyId) {
    emitChange({
      ...currentNode,
      interruptBufferPolicy: policy,
      interruptLock: policy !== "none"
    });
  }

  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Runtime States
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            Edit State · {currentNode.name}
          </h1>
        </div>
        <div className="row">
          {currentNode.initial && <span className="status-badge active">initial</span>}
          {currentNode.terminal && <span className="status-badge draft">terminal</span>}
          <span className="tag tag-blue">{getPolicyLabel(currentNode)}</span>
        </div>
      </div>

      <section className="card">
        <StateNodeInspector
          bizStrategies={bizStrategies}
          node={currentNode}
          onPolicyChange={updatePolicy}
          proactiveStrategies={proactiveStrategies}
          scenarioStrategyIds={scenarioStrategyIds}
          stateTypeOptions={stateTypeOptions}
        />
      </section>
    </div>
  );
}

export function summarizeStrategies(strategyIds: string[], catalog: Array<{ id: string; name: string }>) {
  if (!strategyIds.length) return "None";
  return strategyIds
    .map((id) => catalog.find((item) => item.id === id)?.name ?? id)
    .join(", ");
}

export function useStateTypeOptions(nodes: StateNode[], customTypes: string[]) {
  return useMemo(() => {
    const types = new Set([...nodes.map((node) => node.type), ...customTypes]);
    return Array.from(types);
  }, [customTypes, nodes]);
}

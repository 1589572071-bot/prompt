"use client";

import { bizStrategies, proactiveStrategies } from "@/lib/mockData";
import {
  getNodeBehaviorCategory,
  supportsBusinessStrategies,
  supportsProactiveStrategies
} from "@/lib/stateOrchestration";
import {
  idleContextVariables,
  interactionContextVariables,
  interruptBufferPolicies
} from "@/lib/stateOptions";
import type { InterruptBufferPolicyId } from "@/lib/stateOptions";
import type { StateNode } from "@/lib/types";

interface StateNodeInspectorProps {
  node: StateNode;
  stateTypeOptions: string[];
  onPolicyChange: (policy: InterruptBufferPolicyId) => void;
}

export function StateNodeInspector({ node, stateTypeOptions, onPolicyChange }: StateNodeInspectorProps) {
  const category = getNodeBehaviorCategory(node);
  const showBusinessStrategies = supportsBusinessStrategies(category);
  const showProactiveStrategies = supportsProactiveStrategies(category);
  const contextVariables = category === "idle" ? idleContextVariables : interactionContextVariables;
  const policy = node.interruptBufferPolicy ?? (node.interruptLock ? "fade_1_5s" : "none");

  return (
    <div className="stack">
      <div>
        <label className="label">Node Type</label>
        <select className="select" defaultValue={node.type}>
          {stateTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Node Description</label>
        <textarea className="textarea" defaultValue={node.description} rows={3} />
      </div>

      {category === "idle" ? (
        <div>
          <label className="label">Context Variables</label>
          <div className="card soft">
            <p className="muted" style={{ marginTop: 0 }}>
              Idle nodes only declare runtime placeholders. The system wraps them into Dynamic Context automatically.
            </p>
            <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
              {contextVariables.map((variable) => (
                <span className="pill" key={variable}>
                  {`{{ ${variable} }}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : category === "fallback" ? (
        <div>
          <label className="label">Fallback Template</label>
          <textarea className="textarea code-input" defaultValue={node.dynamicTemplate} readOnly rows={4} />
          <p className="hint">Fallback copy is managed by the platform guardrail layer.</p>
        </div>
      ) : (
        <div>
          <label className="label">Dynamic Context Template</label>
          <textarea className="textarea code-input" defaultValue={node.dynamicTemplate} rows={4} />
          <div className="row" style={{ flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {contextVariables.map((variable) => (
              <span className="pill" key={variable}>
                {`{{ ${variable} }}`}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="label">Attached Strategy Packs</label>
        {!showBusinessStrategies ? (
          <div className="card soft inspector-disabled-block">
            <p className="muted" style={{ margin: 0 }}>
              Business strategy packs are disabled in {node.name}. They activate only in interaction-oriented states.
            </p>
          </div>
        ) : (
          <div className="stack" style={{ gap: 8 }}>
            {bizStrategies.map((strategy) => (
              <label className="row" key={strategy.id}>
                <input defaultChecked={node.strategyIds.includes(strategy.id)} type="checkbox" />
                {strategy.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="label">Attached Proactive Strategies</label>
        {!showProactiveStrategies ? (
          <div className="card soft inspector-disabled-block">
            <p className="muted" style={{ margin: 0 }}>
              Proactive strategies bind to the Proactive Active node. Configure transition timing in the Transitions table.
            </p>
          </div>
        ) : (
          <div className="stack" style={{ gap: 8 }}>
            {proactiveStrategies.map((strategy) => (
              <label className="row" key={strategy.id}>
                <input defaultChecked={node.proactiveStrategyIds.includes(strategy.id)} type="checkbox" />
                {strategy.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="label">Interrupt Buffer Lock</label>
        <select
          className="select"
          onChange={(event) => onPolicyChange(event.target.value as InterruptBufferPolicyId)}
          value={policy}
        >
          {interruptBufferPolicies.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="hint">
          Policy B injects the previous micro-expression buffer into the next Dynamic Context turn.
        </p>
      </div>

      <div className="row" style={{ flexWrap: "wrap" }}>
        <span className="pill success">Variable Validation Passed</span>
      </div>
    </div>
  );
}

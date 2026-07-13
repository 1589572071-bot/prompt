"use client";

import {
  getNodeBehaviorCategory,
  type NodeBehaviorCategory,
  supportsBusinessStrategies,
  supportsProactiveStrategies
} from "@/lib/stateOrchestration";
import {
  idleContextVariables,
  interactionContextVariables,
  interruptBufferPolicies
} from "@/lib/stateOptions";
import type { InterruptBufferPolicyId } from "@/lib/stateOptions";
import type { BizStrategy, ProactiveStrategy, StateNode } from "@/lib/types";

interface StateNodeInspectorProps {
  bizStrategies: BizStrategy[];
  node: StateNode;
  proactiveStrategies: ProactiveStrategy[];
  scenarioStrategyIds: string[];
  stateTypeOptions: string[];
  onPolicyChange: (policy: InterruptBufferPolicyId) => void;
}

export function StateNodeInspector({
  bizStrategies,
  node,
  proactiveStrategies,
  scenarioStrategyIds,
  stateTypeOptions,
  onPolicyChange
}: StateNodeInspectorProps) {
  const category = getNodeBehaviorCategory(node);
  const showBusinessStrategies = supportsBusinessStrategies(category);
  const showProactiveStrategies = supportsProactiveStrategies(category);
  const sessionStrategies = bizStrategies.filter(
    (strategy) => scenarioStrategyIds.includes(strategy.id) && strategy.activationMode === "session"
  );
  const intentStrategies = bizStrategies.filter((strategy) => strategy.activationMode === "intent");
  const contextVariables = category === "idle" ? idleContextVariables : interactionContextVariables;
  const policy = node.interruptBufferPolicy ?? (node.interruptLock ? "fade_1_5s" : "none");
  const policyLabel = interruptBufferPolicies.find((option) => option.id === policy)?.label ?? policy;
  const attachedIntentStrategies = intentStrategies.filter((strategy) => node.strategyIds.includes(strategy.id));
  const attachedProactiveStrategies = proactiveStrategies.filter((strategy) =>
    node.proactiveStrategyIds.includes(strategy.id)
  );

  const roleLabels: Record<NodeBehaviorCategory, string> = {
    idle: "Idle · no user input",
    proactive: "Proactive · silence timeout",
    interaction: "Interaction · user input",
    fallback: "Fallback · safe recovery",
    custom: "Custom runtime state"
  };

  return (
    <div className="stack">
      <section className="card soft">
        <div className="row between">
          <div>
            <p className="eyebrow">Runtime Role</p>
            <h2 className="section-title">{roleLabels[category]}</h2>
          </div>
          <span className="pill">{node.type}</span>
        </div>
        <p className="muted" style={{ marginBottom: 0 }}>{node.description}</p>
      </section>

      <section className="card">
        <h2 className="section-title">Available Variables</h2>
        <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
          {contextVariables.map((variable) => (
            <span className="pill" key={variable}>
              {`{{ ${variable} }}`}
            </span>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Bindings</h2>
        <div className="stack" style={{ gap: 14 }}>
          <div>
            <label className="label">Session Scenario Base</label>
          {sessionStrategies.map((strategy) => (
            <div className="row between card soft" key={strategy.id} style={{ padding: 10 }}>
              <span>{strategy.name}</span>
              <span className="pill success">Always active</span>
            </div>
          ))}
          </div>

          <div>
            <label className="label">Intent Strategy Candidates</label>
            {showBusinessStrategies && attachedIntentStrategies.length ? (
              <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
                {attachedIntentStrategies.map((strategy) => (
                  <span className="pill success" key={strategy.id}>
                    {strategy.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="muted">None</span>
            )}
          </div>

          <div>
            <label className="label">Proactive Strategies</label>
            {showProactiveStrategies && attachedProactiveStrategies.length ? (
              <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
                {attachedProactiveStrategies.map((strategy) => (
                  <span className="pill success" key={strategy.id}>
                    {strategy.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="muted">None</span>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Interrupt Policy</h2>
        <span className="pill">{policyLabel}</span>
      </section>

      <section className="card">
        <h2 className="section-title">Advanced</h2>
        <div className="stack form-stack">
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
          </div>
        </div>
      </section>
    </div>
  );
}

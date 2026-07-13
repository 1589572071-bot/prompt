"use client";

import { useMemo, useState } from "react";
import { renderPrompt } from "@/lib/promptRenderer";
import type { OrchestrationConfig } from "@/lib/runtimeConfig";
import type { SandboxCase } from "@/lib/types";

const heatColors = ["#edf3ff", "#dce8ff", "#c8dafd", "#abc5fb", "#8caaf7"];

interface SandboxDetailViewProps {
  config: OrchestrationConfig;
  sandboxCase: SandboxCase;
  onBack: () => void;
}

export function SandboxDetailView({ config, sandboxCase, onBack }: SandboxDetailViewProps) {
  const [userInput, setUserInput] = useState(sandboxCase.userInput);
  const [selectedStateId, setSelectedStateId] = useState(sandboxCase.stateNodeId);
  const [enableTailReinforcement, setEnableTailReinforcement] = useState(sandboxCase.enableTailReinforcement);

  const result = useMemo(
    () =>
      renderPrompt({
        userInput,
        selectedStateId,
        enableTailReinforcement,
        avatarId: sandboxCase.avatarId,
        config
      }),
    [userInput, selectedStateId, enableTailReinforcement, sandboxCase.avatarId, config]
  );

  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Sandbox Simulation
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            {sandboxCase.name}
          </h1>
        </div>
        <span className={`status-badge ${sandboxCase.status}`}>{sandboxCase.status}</span>
      </div>

      <section className="card">
        <div className="grid three">
          <div>
            <label className="label">Test Input</label>
            <input className="input" onChange={(event) => setUserInput(event.target.value)} value={userInput} />
          </div>
          <div>
            <label className="label">State Node</label>
            <select className="select" onChange={(event) => setSelectedStateId(event.target.value)} value={selectedStateId}>
              {config.stateMachine.nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Tail Reinforcement</label>
            <label className="row card soft" style={{ padding: 10 }}>
              <input
                checked={enableTailReinforcement}
                onChange={(event) => setEnableTailReinforcement(event.target.checked)}
                type="checkbox"
              />
              Enable in sandbox
            </label>
          </div>
        </div>
      </section>

      <div className="grid three">
        <section className="card">
          <h2 className="section-title">Matched Intent</h2>
          <span className="pill success">{result.intent}</span>
        </section>
        <section className="card">
          <h2 className="section-title">Expected Intent</h2>
          <span className="pill">{sandboxCase.expectedIntent}</span>
        </section>
        <section className="card">
          <h2 className="section-title">Expected Tools</h2>
          <p className="muted" style={{ margin: 0 }}>
            {sandboxCase.expectedToolCalls.length ? sandboxCase.expectedToolCalls.join(", ") : "none"}
          </p>
        </section>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "0.9fr 1.1fr" }}>
        <section className="card">
          <div className="row between">
            <h2 className="section-title">Prompt Layers</h2>
            <span className="pill">{result.totalTokens} tokens</span>
          </div>
          <div className="stack">
            {result.layers.map((layer) => (
              <div className="prompt-layer" key={layer.name}>
                <div className="row between">
                  <strong>{layer.name}</strong>
                  <span className="pill">{layer.tokenCount} tokens</span>
                </div>
                <p>{layer.content.slice(0, 180)}{layer.content.length > 180 ? "..." : ""}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">Full Prompt</h2>
          <div className="code-preview">{result.fullPrompt}</div>
        </section>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <section className="card">
          <h2 className="section-title">Tool Call Plan</h2>
          <div className="stack">
            {result.toolCalls.map((call, index) => (
              <div className="prompt-layer" key={`${call.tool}-${index}`}>
                <div className="row between">
                  <strong>{call.tool}</strong>
                  <span className="pill">{index + 1}</span>
                </div>
                <p className="muted">{call.reason}</p>
                <div className="code-preview">{JSON.stringify(call.inputs, null, 2)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="section-title">Structured Output Contract</h2>
          <div className="code-preview">{JSON.stringify(result.structuredOutput, null, 2)}</div>
        </section>
      </div>

      <section className="card">
        <h2 className="section-title">Heatmap</h2>
        <div className="heat">
          {result.layers.map((layer, index) => (
            <div className="heat-cell" key={layer.name} style={{ background: heatColors[Math.min(index, 4)] }}>
              {layer.name}
              <div className="muted" style={{ marginTop: 8 }}>
                {layer.tokenCount} tokens
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

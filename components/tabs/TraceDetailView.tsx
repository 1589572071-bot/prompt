"use client";

import { useState } from "react";
import { interruptBufferPolicies } from "@/lib/stateOptions";
import { collapseInput, maskUserId } from "@/lib/promptRenderer";
import type { TraceSnapshot } from "@/lib/types";

interface TraceDetailViewProps {
  trace: TraceSnapshot;
  onBack: () => void;
}

function formatPolicy(policyId: string) {
  return interruptBufferPolicies.find((item) => item.id === policyId)?.label ?? policyId;
}

export function TraceDetailView({ trace, onBack }: TraceDetailViewProps) {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="stack">
      <div className="row between">
        <div>
          <button className="button" onClick={onBack} type="button">
            Back to Online Traceability
          </button>
          <h1 className="admin-title" style={{ marginTop: 12 }}>
            {trace.turnId}
          </h1>
          <p className="muted">
            {trace.sessionId} · {trace.avatarName} · Turn {trace.turnIndex}
          </p>
        </div>
        <button className="button action-button" onClick={() => setShowFull((value) => !value)} type="button">
          {showFull ? "Show Masked View" : "View Full Snapshot"}
        </button>
      </div>

      <section className="card">
        <h2 className="section-title">Turn Assembly Record</h2>
        <p className="muted">Runtime routing and prompt assembly captured for this online turn.</p>
        <div className="grid three">
          <div>
            <span className="label">User ID</span>
            <strong>{showFull ? trace.userId : maskUserId(trace.userId)}</strong>
          </div>
          <div>
            <span className="label">State</span>
            <strong>{trace.stateNode}</strong>
            <div className="cell-subtitle">{trace.stateNodeId}</div>
          </div>
          <div>
            <span className="label">Strategy Packs</span>
            <strong>{trace.strategy}</strong>
            <div className="cell-subtitle">{trace.strategyIds.join(", ") || "none"}</div>
          </div>
        </div>
        <div className="grid three" style={{ marginTop: 16 }}>
          <div>
            <span className="label">Proactive Strategies</span>
            <strong>{trace.proactiveStrategyIds.length ? trace.proactiveStrategyIds.join(", ") : "None"}</strong>
          </div>
          <div>
            <span className="label">Interrupt Buffer</span>
            <strong>{formatPolicy(trace.interruptBufferPolicy)}</strong>
          </div>
          <div>
            <span className="label">Assembly Cost</span>
            <strong>{trace.promptCostMs}ms</strong>
            <div className="cell-subtitle">{trace.totalTokens} tokens · model {trace.modelCostMs}ms</div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">User Input</h2>
        <p>{showFull ? trace.userInput : collapseInput(trace.userInput)}</p>
      </section>

      <section className="card">
        <div className="row between">
          <h2 className="section-title">Prompt Layers</h2>
          <span className="pill">{trace.totalTokens} tokens</span>
        </div>
        <div className="stack">
          {trace.promptLayers.map((layer) => (
            <div className="prompt-layer" key={layer.name}>
              <div className="row between">
                <strong>{layer.name}</strong>
                <span className="pill">{layer.tokenCount} tokens</span>
              </div>
              <p>{showFull ? layer.content : collapseInput(layer.content)}</p>
              {layer.warning && <span className="pill warning">{layer.warning}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Dynamic Context Rendered</h2>
        <p className="muted">Template variables resolved for the current state before model inference.</p>
        <div className="code-preview">
          {showFull ? trace.dynamicContextRendered : collapseInput(trace.dynamicContextRendered)}
        </div>
        {trace.unresolvedVariables.length > 0 && (
          <span className="pill warning" style={{ marginTop: 12 }}>
            Unresolved: {trace.unresolvedVariables.join(", ")}
          </span>
        )}
      </section>

      <section className="card">
        <h2 className="section-title">Full Prompt</h2>
        <p className="muted">Final concatenation sent to the model for this turn.</p>
        <div className="code-preview">{showFull ? trace.fullPrompt : collapseInput(trace.fullPrompt)}</div>
      </section>

      <section className="card">
        <h2 className="section-title">Model Output</h2>
        <p className="muted">Digital human response generated from this prompt snapshot.</p>
        <div className="code-preview">{showFull ? trace.modelOutput : collapseInput(trace.modelOutput)}</div>
        <div className="row" style={{ marginTop: 12 }}>
          <span className="tag tag-blue">{trace.actionToken}</span>
          <span className="pill">{trace.environment}</span>
        </div>
      </section>

      {showFull && (
        <section className="card soft">
          <span className="pill warning">Audit Logged</span>
          <p>Full snapshot view recorded with viewer, time, session ID, turn ID, and field scope.</p>
        </section>
      )}
    </div>
  );
}

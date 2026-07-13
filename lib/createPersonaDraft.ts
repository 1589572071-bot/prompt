import type { PersonaPrompt } from "./types";

function draftId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function todayLabel() {
  const now = new Date();
  return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
}

export function createDraftPersonaPrompt(): PersonaPrompt {
  const id = draftId("persona");
  return {
    id,
    name: "New Persona Prompt",
    label: "Custom Persona",
    version: "v0.1",
    status: "Draft",
    styleSummary: "",
    relationshipSummary: "",
    speakingStyleTags: [],
    forbiddenStyleTags: [],
    content: "Describe the persona prompt here.",
    updatedAt: todayLabel()
  };
}

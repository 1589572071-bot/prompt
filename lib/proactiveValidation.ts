const sadEmotions = new Set(["sad", "apology", "fault", "empathetic"]);
const aggressiveActions = new Set(["[ACT:laugh]", "[ACT:wave]"]);

export function checkEmotionActionConflict(emotionTag: string, actionToken: string): string | null {
  if (sadEmotions.has(emotionTag) && aggressiveActions.has(actionToken)) {
    return "Emotion and action conflict: subdued emotion cannot pair with an exaggerated action.";
  }
  return null;
}

export function getSemanticLockStatus(emotionTag: string, actionToken: string) {
  const conflict = checkEmotionActionConflict(emotionTag, actionToken);
  return {
    ok: !conflict,
    message: conflict
  };
}

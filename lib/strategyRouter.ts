import type { BizStrategy } from "./types";

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "do",
  "for",
  "i",
  "is",
  "it",
  "me",
  "of",
  "on",
  "please",
  "the",
  "this",
  "to",
  "you"
]);

function tokenize(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((token) => token.length > 1 && !stopWords.has(token))
  );
}

export function semanticSimilarity(input: string, example: string) {
  const inputTokens = tokenize(input);
  const exampleTokens = tokenize(example);
  if (!inputTokens.size || !exampleTokens.size) return 0;

  let overlap = 0;
  inputTokens.forEach((token) => {
    if (exampleTokens.has(token)) overlap += 1;
  });

  return overlap / Math.min(inputTokens.size, exampleTokens.size);
}

export interface StrategyMatch {
  strategy: BizStrategy;
  score: number;
}

export function matchIntentStrategies(userInput: string, candidates: BizStrategy[]): StrategyMatch[] {
  return candidates
    .filter((strategy) => strategy.enabled && strategy.activationMode === "intent")
    .map((strategy) => {
      const score = Math.max(0, ...strategy.triggerExamples.map((example) => semanticSimilarity(userInput, example)));
      return { strategy, score };
    })
    .filter(({ strategy, score }) => score >= (strategy.similarityThreshold ?? 0.5))
    .sort((left, right) => right.score - left.score)
    .slice(0, 1);
}

export function getSessionStrategies(ids: string[], catalog: BizStrategy[]) {
  return catalog.filter(
    (strategy) => ids.includes(strategy.id) && strategy.enabled && strategy.activationMode === "session"
  );
}

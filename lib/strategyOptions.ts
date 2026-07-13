export const strategyTypeOptions = [
  "Scenario",
  "Intent",
  "Try-on",
  "Campaign",
  "Product Showcase",
  "Support Q&A",
  "Brand Presentation",
  "Companion Chat"
] as const;

export const strategyVersionOptions = ["v0.9", "v1.0", "v1.1", "v1.2", "v1.3", "v2.0"] as const;

export function withCurrentOption<T extends string>(options: readonly T[], current: string): T[] {
  if (options.includes(current as T)) {
    return [...options];
  }
  return [current as T, ...options];
}

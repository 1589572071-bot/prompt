import type { AvatarProfile } from "./types";

/** Merge Boundaries + legacy behavior fields — matches Edit Avatar UI single box. */
export function formatAvatarBoundaries(profile: AvatarProfile): string {
  const parts: string[] = [...profile.boundaries];

  const { preferred, avoided, backViewRule } = profile.behaviorPreferences;
  if (preferred.length || avoided.length || backViewRule) {
    if (parts.length) parts.push("");
    if (preferred.length) parts.push(...preferred);
    if (avoided.length) {
      if (preferred.length) parts.push("");
      parts.push(...avoided);
    }
    if (backViewRule) {
      if (preferred.length || avoided.length) parts.push("");
      parts.push(backViewRule);
    }
  }

  return parts.join("\n");
}

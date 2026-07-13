import type { AvatarProfile } from "./types";

export function formatAvatarAppearance(profile: AvatarProfile): string {
  const sections = [`Visual Description:\n${profile.visualDescription}`];

  if (profile.backgroundDescription.trim()) {
    sections.push(`Background Description:\n${profile.backgroundDescription}`);
  }

  return sections.join("\n\n");
}

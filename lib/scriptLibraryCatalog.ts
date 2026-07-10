import type { AvatarScript } from "./types";

/** Platform-level avatar script library for avatar selection */
export const scriptLibraryCatalog: AvatarScript[] = [
  {
    id: "lib-fit",
    name: "Fit Description",
    category: "Fit",
    text: "The cut here follows the natural waistline, which gives a clean proportion.",
    applicableState: "Product Showcase",
    version: "v1.0",
    enabled: true
  },
  {
    id: "lib-texture",
    name: "Texture Close-Up",
    category: "Texture",
    text: "You can see the quilting is quite thick, which makes it feel insulating without being bulky.",
    applicableState: "Try-on Display",
    version: "v1.0",
    enabled: true
  },
  {
    id: "lib-neutral",
    name: "Neutral Acknowledgment",
    category: "Greeting",
    text: "Hi there, happy to show you what I have on today — let me know what you'd like to see.",
    applicableState: "User Interaction",
    version: "v1.0",
    enabled: true
  },
  {
    id: "lib-price",
    name: "Price Explanation",
    category: "Sales",
    text: "The current price includes the limited-time discount, and I can walk you through the details.",
    applicableState: "Product Showcase",
    version: "v1.0",
    enabled: true
  },
  {
    id: "lib-size",
    name: "Size Recommendation",
    category: "Service",
    text: "If you share your usual size, I can suggest the best fit based on the cut and fabric stretch.",
    applicableState: "User Interaction",
    version: "v1.0",
    enabled: true
  },
  {
    id: "lib-return",
    name: "Return Policy",
    category: "Service",
    text: "Returns are accepted within the policy window as long as the item stays in original condition.",
    applicableState: "Support Q&A",
    version: "v1.0",
    enabled: true
  },
  {
    id: "lib-compare",
    name: "Product Comparison",
    category: "Sales",
    text: "Let me compare these two options by fit, fabric, and use case so you can decide more easily.",
    applicableState: "Product Comparison",
    version: "v1.0",
    enabled: true
  }
];

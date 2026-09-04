export interface ToolDef {
  /** Display name stored in DB (technologies). */
  name: string;
  /** Short code shown in the little icon tile (e.g. "Ai"). */
  short: string;
  /** Brand-ish accent color for the tile. */
  color: string;
}

/**
 * Preset tools for packaging/design projects, each with a compact icon tile.
 * The name is what gets stored in the project's technologies list.
 */
export const DESIGN_TOOLS: ToolDef[] = [
  { name: "Adobe Illustrator", short: "Ai", color: "#ff9a00" },
  { name: "Adobe Photoshop", short: "Ps", color: "#31a8ff" },
  { name: "Adobe InDesign", short: "Id", color: "#ff3366" },
  { name: "Figma", short: "Fg", color: "#a259ff" },
  { name: "Affinity Designer", short: "Af", color: "#1b7dff" },
  { name: "Affinity Photo", short: "Ap", color: "#ff8a00" },
  { name: "Pacdora", short: "Pd", color: "#58c9e4" },
  { name: "Blender", short: "Bl", color: "#ea7600" },
  { name: "Cinema 4D", short: "C4", color: "#1a6fff" },
  { name: "Gemini", short: "Ge", color: "#4285f4" },
  { name: "ChatGPT", short: "Gt", color: "#10a37f" },
  { name: "Midjourney", short: "Mj", color: "#9b8cff" },
  { name: "Notion", short: "No", color: "#e6e6e6" },
];

/** Find a preset by name (case-insensitive). */
export function toolDef(name: string): ToolDef | undefined {
  return DESIGN_TOOLS.find(
    (t) => t.name.toLowerCase() === name.trim().toLowerCase(),
  );
}

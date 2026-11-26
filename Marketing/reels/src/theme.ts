import { colors } from "./brand.ts";
import type { Theme } from "./reels.ts";

export const themes: Record<Theme, { bg: [string, string]; text: string; hi: string; glow: string; particle: "snow" | "ember" }> = {
  sky: { bg: [colors.sky, colors.blueDark], text: colors.white, hi: colors.yellow, glow: "#86c5ea", particle: "snow" },
  navy: { bg: ["#262b42", colors.navyDeep], text: colors.white, hi: colors.yellow, glow: colors.blue, particle: "snow" },
  red: { bg: [colors.redBright, "#7d1f22"], text: colors.white, hi: colors.yellow, glow: "#ff8a8a", particle: "ember" },
  ice: { bg: [colors.white, "#b9def4"], text: colors.navy, hi: colors.red, glow: colors.sky, particle: "snow" },
  warm: { bg: [colors.orange, "#a92b2f"], text: colors.white, hi: colors.yellow, glow: colors.yellow, particle: "ember" },
};

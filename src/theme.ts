export const COLORS = {
  navy: "#142D4E",
  navyDeep: "#0B1B30",
  green: "#19B77A",
  greenDark: "#0E7A51",
  gold: "#FFC247",
  blue: "#398CE5",
  coral: "#F16B75",
  cream: "#F7F4EC",
  paper: "#FFFDF8",
  ink: "#10233B",
  muted: "#5C6F86",
  line: "#DCE3EC",
  white: "#FFFFFF",
} as const;

/** Plain family name used by the font loader / FontFace API. */
export const FONT_FAMILY_NAME = "Noto Sans Bengali";

/** CSS stack used by components. */
export const FONT_FAMILY =
  `"${FONT_FAMILY_NAME}", "Noto Sans", "Segoe UI", sans-serif`;

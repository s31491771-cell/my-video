import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {COLORS} from "../theme";

type Props = {
  accent?: string;
  tone?: "light" | "dark";
};

/**
 * Shared background: soft palette wash, a slowly drifting dot grid and a
 * vignette. Kept low-contrast so Bengali type stays readable on top.
 */
export const Backdrop: React.FC<Props> = ({accent = COLORS.blue, tone = "light"}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 110) * 26;
  const lift = Math.cos(frame / 140) * 18;

  const dark = tone === "dark";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? COLORS.navyDeep : COLORS.cream,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 620px at ${18 + drift / 10}% ${
            14 + lift / 10
          }%, ${accent}${dark ? "3A" : "2E"} 0%, transparent 62%),
            radial-gradient(780px 560px at ${84 - drift / 12}% ${86 - lift / 12}%, ${
              COLORS.gold
            }${dark ? "26" : "33"} 0%, transparent 64%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${
            dark ? "rgba(255,255,255,0.16)" : "rgba(20,45,78,0.16)"
          } 1.6px, transparent 1.6px)`,
          backgroundSize: "56px 56px",
          backgroundPosition: `${drift}px ${lift}px`,
          opacity: dark ? 0.5 : 0.55,
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0.75) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: dark
            ? "radial-gradient(120% 100% at 50% 50%, transparent 42%, rgba(0,0,0,0.55) 100%)"
            : "radial-gradient(120% 100% at 50% 50%, transparent 48%, rgba(20,45,78,0.14) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** A soft rounded panel used for content cards. */
export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
  tone?: "light" | "dark";
}> = ({children, style, accent = COLORS.blue, tone = "light"}) => (
  <div
    style={{
      position: "relative",
      background: tone === "dark" ? "rgba(255,255,255,0.08)" : COLORS.paper,
      borderRadius: 32,
      padding: "38px 44px",
      boxShadow:
        tone === "dark"
          ? "0 24px 60px rgba(0,0,0,0.35)"
          : "0 26px 70px rgba(20,45,78,0.14)",
      border:
        tone === "dark"
          ? "1px solid rgba(255,255,255,0.16)"
          : `1px solid ${COLORS.line}`,
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 10,
        background: accent,
      }}
    />
    {children}
  </div>
);

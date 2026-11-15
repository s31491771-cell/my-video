import React from "react";
import {spring, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, FONT_FAMILY} from "../theme";

type Props = {
  name: string;
  color: string;
  delay?: number;
  mood?: "happy" | "worried";
  scale?: number;
  subtitle?: string;
};

/**
 * Simple flat 2D avatar (no external art). Everything is drawn with divs so the
 * character stays crisp at any render resolution.
 */
export const Character: React.FC<Props> = ({
  name,
  color,
  delay = 0,
  mood = "happy",
  scale = 1,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 14, stiffness: 110, mass: 0.8},
  });
  const bob = Math.sin((frame - delay) / 22) * 6;
  const worried = mood === "worried";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        transform: `scale(${pop * scale}) translateY(${bob}px)`,
        opacity: pop,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div style={{position: "relative", width: 260, height: 300}}>
        <div
          style={{
            position: "absolute",
            left: 50,
            bottom: 0,
            width: 160,
            height: 122,
            borderRadius: "84px 84px 26px 26px",
            background: color,
            boxShadow: "0 18px 40px rgba(20,45,78,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 74,
            top: 34,
            width: 112,
            height: 124,
            borderRadius: "56px 56px 50px 50px",
            background: "#F6C9A3",
            border: `5px solid ${COLORS.paper}`,
            boxShadow: "0 12px 26px rgba(20,45,78,0.16)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 40,
              width: 18,
              height: 18,
              borderRadius: 999,
              background: COLORS.navy,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 20,
              top: 40,
              width: 18,
              height: 18,
              borderRadius: 999,
              background: COLORS.navy,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 76,
              width: 52,
              height: worried ? 14 : 22,
              borderRadius: worried ? 4 : "0 0 30px 30px",
              background: COLORS.navy,
              opacity: 0.78,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 62,
            top: 16,
            width: 136,
            height: 44,
            borderRadius: "70px 70px 18px 18px",
            background: COLORS.navy,
          }}
        />
      </div>
      <div style={{fontSize: 40, fontWeight: 800, color: COLORS.navy}}>{name}</div>
      {subtitle ? (
        <div style={{fontSize: 26, color: COLORS.muted, fontWeight: 500}}>{subtitle}</div>
      ) : null}
    </div>
  );
};

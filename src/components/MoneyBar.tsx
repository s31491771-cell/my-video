import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS} from "../theme";

type Props = {
  label: string;
  value: string;
  ratio: number;
  color: string;
  delay?: number;
  sublabel?: string;
  height?: number;
};

/** Horizontal comparison bar with a spring-driven fill. */
export const MoneyBar: React.FC<Props> = ({
  label,
  value,
  ratio,
  color,
  delay = 0,
  sublabel,
  height = 92,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.9},
    durationInFrames: 40,
  });
  const width = Math.max(0.04, ratio) * 100 * grow;

  return (
    <div style={{width: "100%"}}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{fontSize: 34, fontWeight: 700, color: COLORS.navy}}>{label}</div>
        <div
          style={{
            fontSize: 54,
            fontWeight: 800,
            color,
            opacity: interpolate(grow, [0, 0.25], [0, 1], {extrapolateRight: "clamp"}),
          }}
        >
          {value}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height,
          borderRadius: 22,
          background: "rgba(20,45,78,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            borderRadius: 22,
            background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
            boxShadow: `0 12px 30px ${color}55`,
          }}
        />
      </div>
      {sublabel ? (
        <div style={{marginTop: 10, fontSize: 26, color: COLORS.muted}}>{sublabel}</div>
      ) : null}
    </div>
  );
};

import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {COLORS} from "../theme";

type Props = {
  width?: number;
  color?: string;
  delay?: number;
  thickness?: number;
  direction?: "right" | "down";
};

/** Hand-drawn style arrow whose shaft draws itself in. */
export const FlowArrow: React.FC<Props> = ({
  width = 180,
  color = COLORS.blue,
  delay = 0,
  thickness = 8,
  direction = "right",
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotate = direction === "down" ? 90 : 0;

  return (
    <div
      style={{
        width,
        height: 60,
        display: "flex",
        alignItems: "center",
        transform: `rotate(${rotate}deg)`,
        opacity: p,
      }}
    >
      <div
        style={{
          width: "100%",
          height: thickness,
          borderRadius: 999,
          background: color,
          transform: `scaleX(${p})`,
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: `${thickness * 2.6}px solid transparent`,
          borderBottom: `${thickness * 2.6}px solid transparent`,
          borderLeft: `${thickness * 3.2}px solid ${color}`,
          marginLeft: -2,
          transform: `scale(${p})`,
        }}
      />
    </div>
  );
};

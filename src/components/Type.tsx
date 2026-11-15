import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, FONT_FAMILY} from "../theme";

export const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = COLORS.blue,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      fontSize: 30,
      fontWeight: 700,
      letterSpacing: 1,
      color,
      textTransform: "uppercase",
    }}
  >
    <span
      style={{
        width: 52,
        height: 6,
        borderRadius: 999,
        background: color,
        display: "inline-block",
      }}
    />
    {children}
  </div>
);

export const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  maxWidth?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({children, size = 96, color = COLORS.navy, maxWidth, align = "left", style}) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.42,
      color,
      maxWidth,
      textAlign: align,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({children, size = 38, color = COLORS.muted, weight = 500, style}) => (
  <div
    style={{
      fontSize: size,
      lineHeight: 1.6,
      color,
      fontWeight: weight,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  fg?: string;
  size?: number;
}> = ({children, color = COLORS.navy, fg = COLORS.white, size = 28}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "10px 26px 12px",
      borderRadius: 999,
      background: color,
      color: fg,
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1.4,
    }}
  >
    {children}
  </span>
);

/** Value that counts up from zero after `delay` frames. */
export const Counter: React.FC<{
  to: number;
  from?: number;
  delay?: number;
  formatter: (value: number) => string;
  style?: React.CSSProperties;
}> = ({to, from = 0, delay = 0, formatter, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.9},
    durationInFrames: 42,
  });
  const value = interpolate(progress, [0, 1], [from, to]);
  return <div style={style}>{formatter(value)}</div>;
};

export const useEnter = (delay = 0, distance = 56) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.8},
    durationInFrames: 30,
  });
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(t, [0, 1], [distance, 0])}px)`,
  } satisfies React.CSSProperties;
};

export const Stage: React.FC<{
  children: React.ReactNode;
  padding?: string;
  justify?: "flex-start" | "center" | "space-between";
  gap?: number;
}> = ({children, padding = "84px 108px", justify = "space-between", gap = 0}) => (
  <AbsoluteFill
    style={{
      padding,
      display: "flex",
      flexDirection: "column",
      justifyContent: justify,
      gap,
      fontFamily: FONT_FAMILY,
    }}
  >
    {children}
  </AbsoluteFill>
);

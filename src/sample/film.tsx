import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS, FONT_FAMILY} from "../theme";
import {Mood, SampleScene} from "./plan";

export const EASE = Easing.bezier(0.22, 0.08, 0.16, 1);

export const MOOD = {
  warm: {
    top: "#1a1006",
    bottom: "#3a2413",
    accent: "#FFC247",
    glow: "#E2725B",
    fog: "#F0A35E",
    ink: "#FFF6E6",
  },
  cool: {
    top: "#04141d",
    bottom: "#0a2a39",
    accent: "#6FD8EC",
    glow: "#398CE5",
    fog: "#7FE3F0",
    ink: "#EAF8FF",
  },
  dark: {
    top: "#03080f",
    bottom: "#0a1828",
    accent: "#FFC247",
    glow: "#F16B75",
    fog: "#4B82BC",
    ink: "#F4F1E8",
  },
  green: {
    top: "#03110d",
    bottom: "#07261b",
    accent: "#34D394",
    glow: "#FFC247",
    fog: "#69E2B4",
    ink: "#ECFFF7",
  },
} as const;

export type Palette = (typeof MOOD)[Mood];

export const paletteFor = (scene: SampleScene): Palette => MOOD[scene.mood];

/* ------------------------------------------------------------------ */
/* Camera + film layers                                                */
/* ------------------------------------------------------------------ */

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='320' height='320' filter='url(%23n)' opacity='0.55'/></svg>\")",
      backgroundSize: "320px 320px",
      opacity: 0.07,
      mixBlendMode: "overlay",
      pointerEvents: "none",
    }}
  />
);

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(120% 100% at 50% 46%, transparent 38%, rgba(0,0,0,0.34) 72%, rgba(0,0,0,0.72) 100%)",
      pointerEvents: "none",
    }}
  />
);

const Dust: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden"}}>
      {Array.from({length: 30}).map((_, index) => {
        const seed = ((index * 73) % 101) / 101;
        const seed2 = ((index * 37) % 89) / 89;
        const size = 1.5 + seed2 * 2.6;
        const x = (seed * 1920 + frame * (0.18 + seed2 * 0.34)) % 1920;
        const y = (seed2 * 1080 - frame * (0.1 + seed * 0.22) + 1080) % 1080;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: 999,
              background: accent,
              opacity: 0.1 + seed * 0.24,
              filter: "blur(0.6px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Skyline: React.FC<{accent: string}> = ({accent}) => {
  const buildings = [
    [0, 250, 120, 420], [110, 330, 92, 340], [200, 200, 150, 470],
    [345, 300, 84, 370], [425, 240, 130, 430], [550, 355, 96, 315],
    [640, 190, 170, 480], [805, 300, 88, 370], [890, 260, 140, 410],
    [1025, 340, 100, 330], [1120, 210, 160, 460], [1275, 300, 90, 370],
    [1360, 250, 150, 420], [1505, 330, 92, 340], [1592, 200, 160, 470],
    [1747, 280, 130, 390],
  ];
  const windows = Array.from({length: 90}).map((_, index) => {
    const b = buildings[index % buildings.length];
    const col = index % 3;
    const row = Math.floor(index / 3);
    return {
      x: b[0] + 16 + col * 26 + ((index * 13) % 8),
      y: b[1] + 26 + ((row * 41) % Math.max(40, b[3] - 70)),
      key: index,
    };
  });
  return (
    <svg
      width={1920}
      height={640}
      viewBox="0 0 1920 640"
      style={{position: "absolute", left: 0, bottom: 0, opacity: 0.5}}
    >
      <defs>
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#02060a" stopOpacity="0" />
          <stop offset="0.55" stopColor="#02060a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#010305" stopOpacity="0.98" />
        </linearGradient>
      </defs>
      <g>
        {buildings.map(([x, y, w, h], index) => (
          <rect key={index} x={x} y={y} width={w} height={h} fill="#03070b" />
        ))}
        {windows.map((w) => (
          <rect key={w.key} x={w.x} y={w.y} width={5} height={3} fill={accent} opacity={0.3} />
        ))}
      </g>
      <rect x="0" y="0" width="1920" height="640" fill="url(#skyFade)" />
    </svg>
  );
};

export const FilmFrame: React.FC<{
  scene: SampleScene;
  children: React.ReactNode;
  skyline?: boolean;
  lightSide?: "left" | "right";
}> = ({scene, children, skyline = false, lightSide = "right"}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const palette = paletteFor(scene);
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const [s0, x0, y0] = scene.camera.from;
  const [s1, x1, y1] = scene.camera.to;
  const scale = interpolate(progress, [0, 1], [s0, s1]);
  const x = interpolate(progress, [0, 1], [x0, x1]) + Math.sin(frame / 90) * 3;
  const y = interpolate(progress, [0, 1], [y0, y1]) + Math.cos(frame / 110) * 3;

  return (
    <AbsoluteFill style={{backgroundColor: "#02060a", overflow: "hidden"}}>
      <AbsoluteFill
        style={{
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transformOrigin: "50% 52%",
        }}
      >
        <AbsoluteFill
          style={{
            background: `linear-gradient(160deg, ${palette.top} 0%, ${palette.bottom} 58%, #010407 100%)`,
          }}
        />

        {/* soft colour volumes */}
        <AbsoluteFill
          style={{
            background: `
              radial-gradient(760px 640px at ${lightSide === "right" ? "82%" : "18%"} 24%, ${palette.glow}38 0%, transparent 66%),
              radial-gradient(900px 700px at ${lightSide === "right" ? "18%" : "82%"} 78%, ${palette.accent}1f 0%, transparent 64%),
              radial-gradient(520px 420px at 50% 110%, ${palette.fog}22 0%, transparent 70%)`,
          }}
        />

        {skyline ? <Skyline accent={palette.accent} /> : null}

        <Dust accent={palette.accent} />

        {/* diagonal light shaft */}
        <div
          style={{
            position: "absolute",
            top: -420,
            left: lightSide === "right" ? 1080 : -180,
            width: 520,
            height: 2000,
            transform: "rotate(18deg)",
            background: `linear-gradient(180deg, ${palette.accent}00 0%, ${palette.accent}20 38%, ${palette.accent}0a 66%, transparent 100%)`,
            filter: "blur(28px)",
          }}
        />

        {children}
      </AbsoluteFill>

      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

export const Reveal: React.FC<{
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({delay = 0, y = 34, blur = 8, duration = 20, style, children}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, Math.max(1, duration)], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translate3d(0, ${(1 - p) * y}px, 0)`,
        filter: `blur(${(1 - p) * blur}px)`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Kicker: React.FC<{
  children: React.ReactNode;
  color: string;
  delay?: number;
}> = ({children, color, delay = 0}) => (
  <Reveal delay={delay} y={18} blur={4}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: 2.5,
        color,
      }}
    >
      <span style={{width: 54, height: 2, background: color, display: "inline-block"}} />
      {children}
    </div>
  </Reveal>
);

export const ChapterTag: React.FC<{scene: SampleScene; color: string}> = ({scene, color}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [6, 30], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 104,
        top: 100,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 3,
        color: "rgba(255,255,255,0.62)",
      }}
    >
      <span style={{color}}>অধ্যায় {scene.chapter}</span>
      <span style={{width: 60, height: 1, background: "rgba(255,255,255,0.28)"}} />
      <span>{scene.chapterLabel}</span>
    </div>
  );
};

export const Watermark: React.FC<{color: string}> = ({color}) => (
  <div
    style={{
      position: "absolute",
      right: 104,
      bottom: 96,
      textAlign: "right",
      opacity: 0.34,
      letterSpacing: 3,
      color,
    }}
  >
    <div style={{fontSize: 18, fontWeight: 700}}>PAY YOURSELF FIRST</div>
    <div style={{fontSize: 17, color: "rgba(255,255,255,0.72)", marginTop: 4}}>
      একটি অর্থনীতির গল্প
    </div>
  </div>
);

export const Amount: React.FC<{
  value: string;
  label: string;
  delay: number;
  color: string;
  size?: number;
  align?: "left" | "center";
  prefix?: string;
}> = ({value, label, delay, color, size = 186, align = "left", prefix = "৳"}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame - (delay + 14), [0, 26], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{textAlign: align}}>
      <Reveal delay={delay} y={48} blur={16} duration={24}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: align === "center" ? "center" : "flex-start",
            gap: 14,
            textShadow: `0 0 80px ${color}44`,
          }}
        >
          <span
            style={{
              fontSize: size * 0.46,
              fontWeight: 700,
              color,
              lineHeight: 1.25,
              marginTop: size * 0.14,
              opacity: 0.9,
            }}
          >
            {prefix}
          </span>
          <span
            style={{
              fontSize: size,
              fontWeight: 800,
              color,
              lineHeight: 1.12,
              letterSpacing: -2,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </span>
        </div>
      </Reveal>
      <div
        style={{
          height: 3,
          marginTop: 12,
          transform: `scaleX(${grow})`,
          transformOrigin: align === "center" ? "center" : "left",
          background: `linear-gradient(90deg, ${color} 0%, ${color}00 100%)`,
        }}
      />
      <Reveal delay={delay + 16} y={14} blur={0}>
        <div
          style={{
            marginTop: 16,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 1.5,
            color: "rgba(255,255,255,0.66)",
            textAlign: align,
          }}
        >
          {label}
        </div>
      </Reveal>
    </div>
  );
};

export const Portrait: React.FC<{
  who: "rakib" | "suman";
  delay: number;
  height: number;
  glow: string;
  from?: -1 | 1;
  style?: React.CSSProperties;
  opacity?: number;
  grayscale?: boolean;
}> = ({who, delay, height, glow, from = 1, style, opacity = 1, grayscale = false}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame - delay, [0, 26], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const float = Math.sin((frame - delay) / 42) * 4;
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        opacity: enter * opacity,
        transform: `translate3d(${(1 - enter) * from * 70}px, ${(1 - enter) * 46 + float}px, 0) scale(${
          1.03 - enter * 0.03
        })`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: height * 0.95,
          height: height * 0.9,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${glow}55 0%, ${glow}18 45%, transparent 70%)`,
          filter: "blur(34px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -6,
          width: height * 0.62,
          height: 34,
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.62) 0%, transparent 72%)",
          filter: "blur(12px)",
        }}
      />
      <Img
        src={staticFile(`images/${who}.png`)}
        style={{
          height,
          width: "auto",
          display: "block",
          position: "relative",
          filter: `drop-shadow(0 34px 54px rgba(0,0,0,0.55)) contrast(1.05) saturate(${
            grayscale ? 0.4 : 1.04
          })`,
        }}
      />
    </div>
  );
};

export const Rule: React.FC<{color: string; delay?: number; width?: number}> = ({
  color,
  delay = 0,
  width = 220,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 24], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width,
        height: 2,
        background: `linear-gradient(90deg, ${color}, ${color}22)`,
        transform: `scaleX(${p})`,
        transformOrigin: "left",
      }}
    />
  );
};

export const Folio: React.FC<{color: string}> = ({color}) => (
  <div
    style={{
      position: "absolute",
      left: 104,
      bottom: 96,
      display: "flex",
      alignItems: "center",
      gap: 14,
      fontSize: 18,
      letterSpacing: 3,
      color: "rgba(255,255,255,0.4)",
      fontWeight: 600,
    }}
  >
    <span style={{width: 34, height: 1, background: color, opacity: 0.8}} />
    একটি বাংলা ফাইন্যান্স ডকুমেন্টারি
  </div>
);

/* Global cinematic frame: letterbox bars live outside the scenes so they never
   flicker during a dissolve. */
export const Letterbox: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: "none"}}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 62,
        background: "#000",
        boxShadow: "0 1px 0 rgba(255,194,71,0.16)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 62,
        background: "#000",
        boxShadow: "0 -1px 0 rgba(255,194,71,0.16)",
      }}
    />
  </AbsoluteFill>
);

export const sampleFont: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  color: COLORS.white,
};

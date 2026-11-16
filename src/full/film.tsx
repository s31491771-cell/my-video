import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {StoryScene, cueFrame} from "../story";
import {
  C,
  Decor,
  EASE,
  Folio,
  PaperGrain,
  Palette,
  Reveal,
  Watermark,
  sampleFont,
} from "../sample/film";

/* ------------------------------------------------------------------ */
/* Palette + camera driven by the scene accent                         */
/* ------------------------------------------------------------------ */

const PALETTES: Record<string, Omit<Palette, "accent">> = {
  "#398CE5": {bg: "#F5F6EE", tint: "#DCE8F6", accent2: C.green, ink: C.ink, sand: C.sand},
  "#FFC247": {bg: "#FAF4E8", tint: "#F7E9C0", accent2: C.coral, ink: C.ink, sand: C.sand},
  "#19B77A": {bg: "#F3F6EB", tint: "#DCEFD7", accent2: C.blue, ink: C.ink, sand: C.sand},
  "#F16B75": {bg: "#FAF4E8", tint: "#F6DEDA", accent2: C.sun, ink: C.ink, sand: C.sand},
};

const DEFAULT_PALETTE: Omit<Palette, "accent"> = {
  bg: "#FAF4E8",
  tint: "#F6DEDA",
  accent2: C.sun,
  ink: C.ink,
  sand: C.sand,
};

export const paletteForAccent = (accent: string): Palette => {
  const base = PALETTES[accent.toUpperCase()] ?? DEFAULT_PALETTE;
  return {...base, accent};
};

const sceneNumber = (scene: StoryScene): number => {
  const value = Number(scene.id.replace(/\D/g, ""));
  return Number.isFinite(value) ? value : 1;
};

type Camera = {from: [number, number, number]; to: [number, number, number]};

const CAMERAS: Camera[] = [
  {from: [1.03, -22, -8], to: [1.075, 12, 6]},
  {from: [1.065, 18, 4], to: [1.012, -20, -10]},
  {from: [1.02, 12, 10], to: [1.06, -14, -8]},
  {from: [1.055, -14, -6], to: [1.008, 18, 8]},
];

const cameraFor = (scene: StoryScene): Camera => CAMERAS[sceneNumber(scene) % CAMERAS.length];

/* ------------------------------------------------------------------ */
/* Chapters                                                            */
/* ------------------------------------------------------------------ */

const CHAPTERS: {to: number; no: string; label: string}[] = [
  {to: 5, no: "০১", label: "শুরু"},
  {to: 12, no: "০২", label: "প্রশ্ন"},
  {to: 20, no: "০৩", label: "আসল রহস্য"},
  {to: 30, no: "০৪", label: "সুমনের মাস"},
  {to: 39, no: "০৫", label: "রাকিবের নিয়ম"},
  {to: 45, no: "০৬", label: "২০/৮০ নিয়ম"},
  {to: 51, no: "০৭", label: "তিন স্তর"},
  {to: 55, no: "০৮", label: "১০ বছরের হিসাব"},
  {to: 60, no: "০৯", label: "ফাঁদ"},
  {to: 66, no: "১০", label: "অটোমেশন"},
  {to: 71, no: "১১", label: "আজই শুরু"},
  {to: 75, no: "১২", label: "শেষ কথা"},
];

export const chapterFor = (scene: StoryScene) => {
  const n = sceneNumber(scene);
  return CHAPTERS.find((chapter) => n <= chapter.to) ?? CHAPTERS[CHAPTERS.length - 1];
};

const ChapterTagFull: React.FC<{scene: StoryScene; color: string}> = ({scene, color}) => {
  const frame = useCurrentFrame();
  const chapter = chapterFor(scene);
  const p = interpolate(frame, [4, 20], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 104,
        top: 64,
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: 2.6,
        color: C.inkFaint,
        ...sampleFont,
      }}
    >
      <span style={{color, letterSpacing: 1}}>অধ্যায় {chapter.no}</span>
      <span style={{width: 46, height: 2, background: "rgba(16,40,72,0.22)"}} />
      <span>{chapter.label}</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Frame                                                               */
/* ------------------------------------------------------------------ */

export const FullFrame: React.FC<{
  scene: StoryScene;
  children: React.ReactNode;
  decor?: "left" | "right" | "quiet";
  watermark?: boolean;
  camera?: Camera;
}> = ({scene, children, decor, watermark = true, camera}) => {
  const frame = useCurrentFrame();
  const palette = paletteForAccent(scene.accent);
  const progress = interpolate(frame, [0, Math.max(1, scene.durationInFrames)], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chosen = camera ?? cameraFor(scene);
  const [s0, x0, y0] = chosen.from;
  const [s1, x1, y1] = chosen.to;
  const rawScale = interpolate(progress, [0, 1], [s0, s1]);
  const scale = 1 + (rawScale - 1) * 0.32;
  const x = interpolate(progress, [0, 1], [x0, x1]) * 0.32;
  const y = interpolate(progress, [0, 1], [y0, y1]) * 0.32;

  return (
    <AbsoluteFill style={{backgroundColor: palette.bg, overflow: "hidden"}}>
      <AbsoluteFill
        style={{
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transformOrigin: "50% 50%",
        }}
      >
        <Decor palette={palette} variant={decor ?? (sceneNumber(scene) % 3 === 0 ? "left" : "right")} />
        <ChapterTagFull scene={scene} color={palette.accent} />
        {children}
        <Folio color={palette.accent} />
        {watermark ? <Watermark color={palette.accent} /> : null}
      </AbsoluteFill>
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Cue helpers + text fitting                                          */
/* ------------------------------------------------------------------ */

export const cueOf = (scene: StoryScene, index: number): number =>
  cueFrame(scene, scene.cueIds[Math.min(index, scene.cueIds.length - 1)]);

export const lastCue = (scene: StoryScene): number => cueOf(scene, scene.cueIds.length - 1);

/**
 * Frame at which a named visual element should appear. The story generator
 * stores an explicit `beats` map on every scene (element -> SRT cue id), so a
 * card is revealed on the exact sentence that speaks it rather than on a
 * positional guess. Falls back to the old cue index when no beat exists.
 */
export const beatOf = (scene: StoryScene, key: string, fallbackIndex = 0): number => {
  const beats = (scene.data as {beats?: Record<string, number>} | undefined)?.beats;
  const cueId = beats?.[key];
  if (typeof cueId === "number" && cueId > 0) return cueFrame(scene, cueId);
  return cueOf(scene, fallbackIndex);
};

export const lastBeat = (scene: StoryScene, key: string): number => beatOf(scene, key, scene.cueIds.length - 1);

/**
 * Frame for a beat that may be missing from the story data. Used for list
 * items (tiers, chips) that should fall back to the moment their parent
 * element appears.
 */
export const beatOr = (scene: StoryScene, key: string, fallbackFrame: number): number => {
  const beats = (scene.data as {beats?: Record<string, number>} | undefined)?.beats;
  const cueId = beats?.[key];
  if (typeof cueId === "number" && cueId > 0) return cueFrame(scene, cueId);
  return fallbackFrame;
};

export const headlineSize = (
  text: string,
  width: number,
  max = 76,
  min = 42,
  lines = 2,
): number => {
  const raw = (width * lines) / (Math.max(8, text.length) * 0.6);
  return Math.round(Math.max(min, Math.min(max, raw)));
};

export const stripTaka = (value: string): string => value.replace(/^৳\s*/, "");

/* ------------------------------------------------------------------ */
/* Text measurement — reserve the space of a line before it is spoken   */
/* ------------------------------------------------------------------ */

const lineCache = new Map<string, number>();

/**
 * Number of lines a Bengali string needs at a given width, measured with the
 * real font in the browser. Templates use it to reserve the height of a slot
 * so that a line which is spoken later does not push the layout around when
 * it finally appears.
 */
export const measureLines = (text: string, size: number, width: number, weight = 800): number => {
  const clean = text.trim();
  if (!clean) return 0;
  const key = `${clean}|${size}|${width}|${weight}`;
  const cached = lineCache.get(key);
  if (cached !== undefined) return cached;
  let lines = 1;
  try {
    const context = document.createElement("canvas").getContext("2d");
    if (context) {
      context.font = `${weight} ${size}px "Noto Sans Bengali", sans-serif`;
      let current = "";
      for (const word of clean.split(/\s+/)) {
        const candidate = current ? `${current} ${word}` : word;
        if (context.measureText(candidate).width <= width) {
          current = candidate;
        } else {
          lines += 1;
          current = word;
        }
      }
    }
  } catch {
    // Measurement is a layout nicety; fall back to a single line.
  }
  lineCache.set(key, lines);
  return lines;
};

/** Height (px) a text block occupies, used as the reserved slot height. */
export const textBlockHeight = (
  text: string,
  size: number,
  width: number,
  weight = 800,
  lineHeight = 1.3,
): number => measureLines(text, size, width, weight) * size * lineHeight;

export const Taka: React.FC<{value: string; size?: number; color?: string}> = ({
  value,
  size = 72,
  color = C.ink,
}) => (
  <div style={{display: "flex", alignItems: "flex-start", gap: 8, color}}>
    <span style={{fontSize: size * 0.42, fontWeight: 700, marginTop: size * 0.18, color}}>৳</span>
    <span
      style={{
        fontSize: size,
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: -1.5,
        fontVariantNumeric: "tabular-nums",
        color,
      }}
    >
      {stripTaka(value)}
    </span>
  </div>
);

export const Headline: React.FC<{
  text: string;
  size: number;
  color?: string;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({text, size, color = C.ink, align = "left", style}) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.3,
      letterSpacing: -0.6,
      color,
      textAlign: align,
      ...style,
    }}
  >
    {text}
  </div>
);

export const Body: React.FC<{
  text: string;
  size?: number;
  color?: string;
  weight?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({text, size = 30, color = C.inkSoft, weight = 600, align = "left", style}) => (
  <div style={{fontSize: size, fontWeight: weight, lineHeight: 1.55, color, textAlign: align, ...style}}>
    {text}
  </div>
);

export const Stage: React.FC<{
  top?: number;
  left?: number;
  width?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({top = 150, left = 104, width, children, style}) => (
  <div style={{position: "absolute", left, top, width, ...sampleFont, ...style}}>{children}</div>
);

/* ------------------------------------------------------------------ */
/* Extra flat artwork                                                  */
/* ------------------------------------------------------------------ */

export const EngineArt: React.FC<{width?: number; color?: string}> = ({width = 300, color = C.blue}) => (
  <svg width={width} height={width * 0.72} viewBox="0 0 300 216" fill="none">
    <rect x="24" y="70" width="208" height="82" rx="18" fill={C.ink} />
    <rect x="66" y="34" width="120" height="44" rx="12" fill={color} />
    <rect x="238" y="90" width="42" height="34" rx="9" fill={color} />
    <circle cx="92" cy="170" r="30" fill={C.ink} />
    <circle cx="92" cy="170" r="13" fill={C.paper} />
    <circle cx="196" cy="170" r="30" fill={C.ink} />
    <circle cx="196" cy="170" r="13" fill={C.paper} />
    <path d="M44 100h40M44 118h30" stroke={C.paper} strokeWidth="8" strokeLinecap="round" opacity="0.55" />
  </svg>
);

export const FuelArt: React.FC<{width?: number; color?: string}> = ({width = 210, color = C.sun}) => (
  <svg width={width} height={width * 1.12} viewBox="0 0 210 235" fill="none">
    <path
      d="M105 14C105 14 186 108 186 156c0 46-36 76-81 76S24 202 24 156C24 108 105 14 105 14Z"
      fill={color}
    />
    <path
      d="M72 158c12-24 26-30 44-30 15 0 26 8 32 22"
      stroke={C.paper}
      strokeWidth="12"
      strokeLinecap="round"
      opacity="0.9"
    />
    <circle cx="146" cy="74" r="12" fill={C.paper} opacity="0.65" />
  </svg>
);

export const BrainArt: React.FC<{width?: number; color?: string}> = ({width = 260, color = C.coral}) => (
  <svg width={width} height={width * 0.9} viewBox="0 0 260 234" fill="none">
    <path
      d="M96 26C62 26 41 51 44 81 21 92 15 128 35 147 27 177 55 204 86 198 100 217 132 222 148 206 172 221 205 204 205 176 232 165 240 129 219 110 230 80 207 51 176 51 165 29 127 15 108 35Z"
      fill={`${color}2e`}
    />
    <path
      d="M98 52C79 55 71 71 76 87 57 95 57 119 73 130 68 149 84 165 103 160 111 176 132 178 143 165 159 175 180 165 178 147 196 139 196 115 178 108 183 89 165 76 149 81 138 63 114 49 98 52Z"
      fill="none"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M117 84v64M98 105c11 5 16 10 19 18M141 105c-11 5-16 10-19 18"
      fill="none"
      stroke={color}
      strokeWidth="7"
      strokeLinecap="round"
    />
  </svg>
);

export const AutomationArt: React.FC<{width?: number; color?: string}> = ({width = 260, color = C.green}) => (
  <svg width={width} height={width * 0.9} viewBox="0 0 260 234" fill="none">
    <circle cx="130" cy="117" r="88" fill={`${color}26`} />
    <path d="M130 38a79 79 0 0 1 75 54" stroke={color} strokeWidth="16" strokeLinecap="round" />
    <path d="M214 92l14-34-36 6Z" fill={color} />
    <path d="M130 196a79 79 0 0 1-75-54" stroke={color} strokeWidth="16" strokeLinecap="round" />
    <path d="M46 142l-14 34 36-6Z" fill={color} />
    <circle cx="130" cy="117" r="22" fill={color} />
  </svg>
);

export const CalendarArt: React.FC<{width?: number; color?: string}> = ({width = 240, color = C.coral}) => (
  <svg width={width} height={width * 0.88} viewBox="0 0 240 210" fill="none">
    <rect x="18" y="34" width="204" height="160" rx="22" fill={C.card} stroke={C.ink} strokeWidth="5" />
    <rect x="18" y="34" width="204" height="46" rx="22" fill={color} />
    <rect x="18" y="62" width="204" height="18" fill={color} />
    <path d="M70 18v34M170 18v34" stroke={C.ink} strokeWidth="9" strokeLinecap="round" />
    <g fill={C.ink} opacity="0.22">
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect key={`${row}-${col}`} x={42 + col * 42} y={102 + row * 30} width="24" height="16" rx="4" />
        ))
      )}
    </g>
    <path d="M64 154l42 42M106 154l-42 42" stroke={color} strokeWidth="11" strokeLinecap="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Configurable bright phone mockup                                    */
/* ------------------------------------------------------------------ */

export const PhonePanel: React.FC<{
  width?: number;
  delay?: number;
  amount: string;
  remaining: string;
  accent: string;
  kicker?: string;
}> = ({width = 380, delay = 0, amount, remaining, accent, kicker = "অটো-সেভ"}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, Math.max(1, 18)], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const height = width * 2.02;
  const rows = [
    {label: "বেতন জমা", value: "আজ", color: C.blue},
    {label: kicker, value: `৳ ${stripTaka(amount)}`, color: accent},
    {label: "খরচের জন্য বাকি", value: `৳ ${stripTaka(remaining)}`, color: C.ink},
  ];
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 52,
        background: C.ink,
        padding: 12,
        boxShadow: "0 30px 60px rgba(16,40,72,0.26)",
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px) scale(${0.96 + p * 0.04})`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 42,
          background: C.paper,
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "hidden",
          ...sampleFont,
        }}
      >
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: C.inkSoft}}>
          <span>৯:৪১</span>
          <span style={{letterSpacing: 1}}>▮▮▯ ⏻</span>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <div style={{fontSize: 13, color: C.inkSoft}}>আমার ব্যাংক</div>
            <div style={{fontSize: 21, fontWeight: 800, color: C.ink}}>অটো ট্রান্সফার</div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 99,
              background: C.sand,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
              color: C.ink,
            }}
          >
            রা
          </div>
        </div>
        <div style={{background: accent, borderRadius: 18, padding: "16px 18px", color: "#fff"}}>
          <div style={{fontSize: 12, opacity: 0.88}}>প্রতি মাসে বিনিয়োগ</div>
          <div style={{fontSize: 31, fontWeight: 800, marginTop: 3}}>৳ {stripTaka(amount)}</div>
          <div style={{fontSize: 11, opacity: 0.9, marginTop: 4}}>বেতন আসার দিনেই</div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{fontSize: 14, fontWeight: 700, color: C.ink}}>অটো-সেভ</div>
          <div
            style={{
              width: 48,
              height: 26,
              borderRadius: 99,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: 3,
            }}
          >
            <span style={{width: 20, height: 20, borderRadius: 99, background: "#fff"}} />
          </div>
        </div>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              border: `1.5px solid ${C.line}`,
              borderRadius: 14,
              padding: "11px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{fontSize: 12, color: C.inkSoft}}>{row.label}</span>
            <span style={{fontSize: 14, fontWeight: 800, color: row.color, whiteSpace: "nowrap"}}>{row.value}</span>
          </div>
        ))}
        <div style={{display: "flex", flexDirection: "column", gap: 7}}>
          <div style={{display: "flex", justifyContent: "space-between", fontSize: 11, color: C.inkSoft}}>
            <span>এই মাসের লক্ষ্য</span>
            <span style={{fontWeight: 700, color: C.ink}}>সম্পন্ন</span>
          </div>
          <div style={{height: 9, borderRadius: 99, background: C.line}}>
            <div style={{width: "100%", height: "100%", borderRadius: 99, background: accent}} />
          </div>
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-around",
            paddingTop: 10,
            borderTop: `1.5px solid ${C.line}`,
          }}
        >
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              style={{
                width: index === 0 ? 26 : 9,
                height: 9,
                borderRadius: 99,
                background: index === 0 ? accent : C.line,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Bright growth curve                                                 */
/* ------------------------------------------------------------------ */

export const GrowthCurve: React.FC<{
  width?: number;
  height?: number;
  color: string;
  delay?: number;
  years?: number;
}> = ({width = 800, height = 380, color, delay = 0, years = 10}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({fps, frame: frame - delay, config: {damping: 200, mass: 0.9}, durationInFrames: 46});
  const padL = 34;
  const padB = 48;
  const plotW = width - padL * 2;
  const plotH = height - padB - 18;
  const points = Array.from({length: 61}, (_, index) => {
    const t = index / 60;
    const e = (Math.exp(2.7 * t) - 1) / (Math.exp(2.7) - 1);
    return {x: padL + t * plotW, y: 18 + (1 - e) * plotH};
  });
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${padL + plotW} ${18 + plotH} L${padL} ${18 + plotH} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <clipPath id={`reveal-${delay}-${width}`}>
          <rect x="0" y="0" width={Math.max(1, p * width)} height={height} />
        </clipPath>
      </defs>
      <g stroke={C.line} strokeWidth="1.5">
        {[0, 1, 2, 3].map((row) => (
          <line key={row} x1={padL} x2={padL + plotW} y1={18 + (row * plotH) / 3} y2={18 + (row * plotH) / 3} />
        ))}
        {[0, 1, 2].map((col) => (
          <line key={col} x1={padL + (col * plotW) / 2} x2={padL + (col * plotW) / 2} y1={18} y2={18 + plotH} />
        ))}
      </g>
      <g clipPath={`url(#reveal-${delay}-${width})`}>
        <path d={area} fill={`${color}1f`} />
        <path d={line} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g fill={C.inkSoft} fontSize="21" fontWeight="600" fontFamily={sampleFont.fontFamily as string}>
        {[0, 1, 2].map((col) => (
          <text key={col} x={padL + (col * plotW) / 2} y={height - 12} textAnchor="middle">
            {col === 0 ? "০" : col === 1 ? `${years / 2}` : `${years}`} বছর
          </text>
        ))}
      </g>
      <circle cx={padL} cy={18 + plotH} r="8" fill={C.ink} />
      <circle cx={padL + plotW} cy={points[points.length - 1].y} r="11" fill={color} opacity={p} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Small reusable pieces                                               */
/* ------------------------------------------------------------------ */

export const RevealAt: React.FC<{
  scene: StoryScene;
  cue: number;
  y?: number;
  duration?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({scene, cue, y = 20, duration = 14, style, children}) => (
  <Reveal delay={cueOf(scene, cue)} y={y} duration={duration} style={style}>
    {children}
  </Reveal>
);

export const ChapterWatermark: React.FC = () => null;

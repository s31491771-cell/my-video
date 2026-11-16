import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {FONT_FAMILY} from "../theme";
import {Mood, SampleScene} from "./plan";

export const EASE = Easing.bezier(0.2, 0.7, 0.2, 1);

/* ------------------------------------------------------------------ */
/* Bright editorial palette (paper + navy ink + flat accents)          */
/* ------------------------------------------------------------------ */

export const C = {
  paper: "#F7F4EC",
  paperWarm: "#FBF6EA",
  card: "#FFFDF8",
  ink: "#102848",
  inkSoft: "#4B5C71",
  inkFaint: "#8A96A4",
  line: "#DED8C9",
  green: "#18B878",
  greenDeep: "#0E8F5C",
  blue: "#3080E0",
  coral: "#F06060",
  sand: "#F0D8C0",
  sun: "#F2C14E",
} as const;

type Palette = {
  bg: string;
  tint: string;
  accent: string;
  accent2: string;
  ink: string;
  sand: string;
};

export const MOOD: Record<Mood, Palette> = {
  warm: {
    bg: "#FAF4E8",
    tint: "#F6E2C8",
    accent: C.coral,
    accent2: C.sun,
    ink: C.ink,
    sand: C.sand,
  },
  cool: {
    bg: "#F5F6EE",
    tint: "#DCE8F6",
    accent: C.blue,
    accent2: C.green,
    ink: C.ink,
    sand: C.sand,
  },
  dark: {
    bg: "#F7F4EC",
    tint: "#E4E6EA",
    accent: C.ink,
    accent2: C.coral,
    ink: C.ink,
    sand: C.sand,
  },
  green: {
    bg: "#F3F6EB",
    tint: "#DCEFD7",
    accent: C.green,
    accent2: C.blue,
    ink: C.ink,
    sand: C.sand,
  },
};

export const paletteFor = (scene: SampleScene): Palette => MOOD[scene.mood];

/* ------------------------------------------------------------------ */
/* Paper backdrop                                                      */
/* ------------------------------------------------------------------ */

const PaperGrain: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='300' height='300' filter='url(%23n)' opacity='0.5'/></svg>\")",
      backgroundSize: "300px 300px",
      opacity: 0.045,
      mixBlendMode: "multiply",
      pointerEvents: "none",
    }}
  />
);

const DotGrid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: "radial-gradient(rgba(16,40,72,0.10) 1.4px, transparent 1.5px)",
      backgroundSize: "46px 46px",
      backgroundPosition: "12px 16px",
      opacity: 0.5,
      pointerEvents: "none",
      maskImage: "radial-gradient(120% 90% at 50% 30%, black 20%, transparent 78%)",
    }}
  />
);

const Spark: React.FC<{x: number; y: number; size: number; color: string; opacity?: number}> = ({
  x,
  y,
  size,
  color,
  opacity = 0.7,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{position: "absolute", left: x, top: y, opacity}}
  >
    <path d="M12 2v20M2 12h20" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

const Decor: React.FC<{palette: Palette; variant?: "left" | "right" | "top" | "quiet"}> = ({
  palette,
  variant = "right",
}) => {
  const flip = variant === "left";
  const quiet = variant === "quiet";
  return (
    <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden"}}>
      {/* broad pastel field */}
      {quiet ? (
        <svg
          width={760}
          height={760}
          viewBox="0 0 760 760"
          style={{position: "absolute", right: -220, top: -240, opacity: 0.5}}
        >
          <circle cx="380" cy="380" r="300" fill="none" stroke={palette.tint} strokeWidth="70" />
        </svg>
      ) : (
        <div
          style={{
            position: "absolute",
            width: 640,
            height: 640,
            borderRadius: "50%",
            left: flip ? -260 : 1540,
            top: -180,
            background: palette.tint,
            opacity: 0.75,
          }}
        />
      )}
      {/* sand block bottom corner */}
      {quiet ? null : (
        <div
          style={{
            position: "absolute",
            width: 470,
            height: 300,
            left: flip ? 1420 : -170,
            bottom: -150,
            borderRadius: 48,
            background: palette.sand,
            opacity: 0.5,
            transform: "rotate(-9deg)",
          }}
        />
      )}
      {/* thin arc + dots */}
      <svg
        width={520}
        height={520}
        viewBox="0 0 520 520"
        style={{
          position: "absolute",
          right: flip ? undefined : -140,
          left: flip ? -140 : undefined,
          bottom: -190,
          opacity: 0.28,
        }}
      >
        <circle cx="260" cy="260" r="196" fill="none" stroke={palette.accent} strokeWidth="3" />
        <circle cx="260" cy="260" r="140" fill="none" stroke={palette.accent} strokeWidth="3" strokeDasharray="4 18" />
      </svg>
      <Spark x={flip ? 1460 : 250} y={880} size={34} color={palette.accent} opacity={0.55} />
      <Spark x={flip ? 1600 : 140} y={190} size={24} color={C.ink} opacity={0.3} />
      <Spark x={flip ? 1330 : 1770} y={760} size={20} color={palette.accent2} opacity={0.8} />
      <DotGrid />
    </AbsoluteFill>
  );
};

export const FilmFrame: React.FC<{
  scene: SampleScene;
  children: React.ReactNode;
  decor?: "left" | "right" | "top" | "quiet";
}> = ({scene, children, decor = "right"}) => {
  const frame = useCurrentFrame();
  const palette = paletteFor(scene);
  const progress = interpolate(frame, [0, Math.max(1, scene.durationInFrames)], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const [s0, x0, y0] = scene.camera.from;
  const [s1, x1, y1] = scene.camera.to;
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
        <Decor palette={palette} variant={decor} />
        {children}
      </AbsoluteFill>
      <PaperGrain />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Typography + reveal                                                 */
/* ------------------------------------------------------------------ */

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

export const Reveal: React.FC<{
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
  scaleFrom?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({delay = 0, y = 22, blur = 0, duration = 14, scaleFrom = 0.97, style, children}) => {
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
        transform: `translate3d(0, ${(1 - p) * y}px, 0) scale(${scaleFrom + p * (1 - scaleFrom)})`,
        filter: blur > 0 ? `blur(${(1 - p) * blur}px)` : undefined,
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
  <Reveal delay={delay} y={10} duration={12} scaleFrom={0.98}>
    <div style={{display: "flex", alignItems: "center", gap: 14}}>
      <span style={{width: 34, height: 8, borderRadius: 99, background: color}} />
      <span
        style={{
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: 2,
          color: C.inkSoft,
          lineHeight: 1.35,
        }}
      >
        {children}
      </span>
    </div>
  </Reveal>
);

export const ChapterTag: React.FC<{scene: SampleScene; color: string}> = ({scene, color}) => {
  const frame = useCurrentFrame();
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
      }}
    >
      <span style={{color, letterSpacing: 1}}>অধ্যায় {scene.chapter}</span>
      <span style={{width: 46, height: 2, background: "rgba(16,40,72,0.22)"}} />
      <span>{scene.chapterLabel}</span>
    </div>
  );
};

export const Watermark: React.FC<{color: string}> = ({color}) => (
  <div
    style={{
      position: "absolute",
      right: 104,
      bottom: 62,
      textAlign: "right",
      opacity: 0.5,
      letterSpacing: 3,
    }}
  >
    <div style={{fontSize: 17, fontWeight: 800, color: C.ink}}>PAY YOURSELF FIRST</div>
    <div style={{fontSize: 16, color: C.inkSoft, marginTop: 5, letterSpacing: 1}}>
      একটি অর্থনীতির গল্প
    </div>
    <span style={{display: "block", width: 42, height: 3, background: color, marginLeft: "auto", marginTop: 8}} />
  </div>
);

export const Folio: React.FC<{color: string}> = ({color}) => (
  <div
    style={{
      position: "absolute",
      left: 104,
      bottom: 66,
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontSize: 17,
      letterSpacing: 2,
      color: C.inkFaint,
      fontWeight: 600,
    }}
  >
    <span style={{width: 28, height: 2, background: color}} />
    একটি বাংলা ফাইন্যান্স ডকুমেন্টারি
  </div>
);

export const Rule: React.FC<{color: string; delay?: number; width?: number}> = ({
  color,
  delay = 0,
  width = 220,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, Math.max(1, 18)], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width,
        height: 8,
        borderRadius: 99,
        background: color,
        transform: `scaleX(${p})`,
        transformOrigin: "left",
      }}
    />
  );
};

export const Highlight: React.FC<{color: string; children: React.ReactNode}> = ({color, children}) => (
  <span
    style={{
      backgroundImage: `linear-gradient(180deg, transparent 60%, ${color}4d 60%, ${color}4d 94%, transparent 94%)`,
      padding: "0 6px",
    }}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* Amount + cards                                                      */
/* ------------------------------------------------------------------ */

export const Amount: React.FC<{
  value: string;
  label: string;
  delay: number;
  color: string;
  valueColor?: string;
  size?: number;
  align?: "left" | "center" | "right";
  prefix?: string;
}> = ({
  value,
  label,
  delay,
  color,
  valueColor = C.ink,
  size = 140,
  align = "left",
  prefix = "৳",
}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame - (delay + 10), [0, Math.max(1, 20)], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const justify = align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
  return (
    <div style={{textAlign: align}}>
      <Reveal delay={delay} y={26} duration={16}>
        <div style={{display: "flex", alignItems: "flex-start", justifyContent: justify, gap: 10}}>
          <span
            style={{
              fontSize: size * 0.4,
              fontWeight: 700,
              color,
              lineHeight: 1.2,
              marginTop: size * 0.22,
            }}
          >
            {prefix}
          </span>
          <span
            style={{
              fontSize: size,
              fontWeight: 800,
              color: valueColor,
              lineHeight: 1.08,
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
          height: 10,
          borderRadius: 99,
          marginTop: 6,
          width: "100%",
          maxWidth: size * 4,
          marginLeft: align === "center" ? "auto" : align === "right" ? "auto" : 0,
          marginRight: align === "center" ? "auto" : 0,
          transform: `scaleX(${grow})`,
          transformOrigin: align === "center" ? "center" : align === "right" ? "right" : "left",
          background: color,
          opacity: 0.9,
        }}
      />
      <Reveal delay={delay + 12} y={10} duration={12}>
        <div
          style={{
            marginTop: 16,
            fontSize: 27,
            fontWeight: 600,
            letterSpacing: 0.6,
            color: C.inkSoft,
            textAlign: align,
            lineHeight: 1.45,
          }}
        >
          {label}
        </div>
      </Reveal>
    </div>
  );
};

export const Card: React.FC<{
  accent?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  filled?: boolean;
}> = ({accent = C.line, style, children, filled = false}) => (
  <div
    style={{
      background: filled ? C.ink : C.card,
      border: filled ? "none" : `1.5px solid ${C.line}`,
      borderRadius: 28,
      boxShadow: filled ? "0 22px 40px rgba(16,40,72,0.22)" : "0 18px 36px rgba(16,40,72,0.08)",
      padding: 34,
      position: "relative",
      overflow: "hidden",
      borderTop: filled ? "none" : `6px solid ${accent}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  color: string;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({children, color, dark = false, style}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 18px",
      borderRadius: 99,
      background: dark ? "rgba(255,255,255,0.10)" : `${color}1a`,
      border: `1.5px solid ${dark ? "rgba(255,255,255,0.22)" : `${color}59`}`,
      fontSize: 21,
      fontWeight: 700,
      color: dark ? C.card : C.ink,
      lineHeight: 1.3,
      ...style,
    }}
  >
    <span style={{width: 9, height: 9, borderRadius: 99, background: color}} />
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Flat icons                                                          */
/* ------------------------------------------------------------------ */

export type GlyphName =
  | "check"
  | "cross"
  | "city"
  | "money"
  | "cart"
  | "clock"
  | "warn"
  | "up"
  | "spark"
  | "phone";

export const Glyph: React.FC<{name: GlyphName; size?: number; color?: string; strokeWidth?: number}> = ({
  name,
  size = 40,
  color = C.ink,
  strokeWidth = 2,
}) => {
  const paths: Record<GlyphName, React.ReactNode> = {
    check: <path d="M5 12.5l4.5 4.5L19 7" />,
    cross: <path d="M6 6l12 12M18 6L6 18" />,
    city: (
      <>
        <path d="M3 21h18" />
        <path d="M6 21V8h12v13" />
        <path d="M9 12h2M13 12h2M9 16h2M13 16h2" />
      </>
    ),
    money: (
      <>
        <rect x="3" y="7" width="18" height="11" rx="2.5" />
        <circle cx="12" cy="12.5" r="2.6" />
        <path d="M6.5 10.5v4M17.5 10.5v4" />
      </>
    ),
    cart: (
      <>
        <path d="M4 5h2l2.2 10.5h9.6L20 8H7" />
        <circle cx="9.5" cy="19" r="1.4" />
        <circle cx="17" cy="19" r="1.4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3.2 2" />
      </>
    ),
    warn: (
      <>
        <path d="M12 3.5L21.5 20H2.5L12 3.5z" />
        <path d="M12 9v5M12 17.2v.1" />
      </>
    ),
    up: <path d="M4 17l6-6 4 4 6-7M15 8h5v5" />,
    spark: <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />,
    phone: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="2.4" />
        <path d="M10.5 18.5h3" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <g stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  );
};

export const IconBadge: React.FC<{
  name: GlyphName;
  color: string;
  size?: number;
  filled?: boolean;
}> = ({name, color, size = 62, filled = false}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 19,
      background: filled ? color : `${color}1f`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Glyph name={name} size={size * 0.52} color={filled ? C.card : color} strokeWidth={2.4} />
  </div>
);

/* ------------------------------------------------------------------ */
/* Sticker portraits                                                   */
/* ------------------------------------------------------------------ */

export const Portrait: React.FC<{
  who: "rakib" | "suman";
  delay: number;
  height: number;
  tint: string;
  tone?: string;
  from?: -1 | 1;
  style?: React.CSSProperties;
  opacity?: number;
  grayscale?: boolean;
}> = ({who, delay, height, tint, tone = "rgba(16,40,72,0.16)", from = 1, style, opacity = 1, grayscale = false}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, Math.max(1, 16)], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const float = Math.sin((frame - delay) / 52) * 3;
  return (
    <div
      style={{
        position: "relative",
        width: "fit-content",
        opacity: p * opacity,
        transform: `translate3d(${(1 - p) * from * 44}px, ${(1 - p) * 26 + float}px, 0)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -6,
          width: height * 0.8,
          height: height * 0.88,
          transform: "translateX(-50%)",
          background: tint,
          borderRadius: "50% 50% 46% 46% / 54% 54% 46% 46%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: height * 0.03,
          width: height * 0.9,
          height: height * 0.9,
          transform: "translateX(-50%)",
          border: `2.5px dashed ${tone}`,
          borderRadius: "50%",
          opacity: 0.55,
        }}
      />
      <Img
        src={staticFile(`images/${who}.png`)}
        style={{
          height,
          width: "auto",
          display: "block",
          position: "relative",
          filter: `drop-shadow(0 18px 26px rgba(16,40,72,0.22))${grayscale ? " grayscale(1)" : ""}`,
        }}
      />
    </div>
  );
};

export const NameTag: React.FC<{
  name: string;
  role?: string;
  color: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({name, role, color, delay = 0, style}) => (
  <Reveal delay={delay} y={12} duration={12} style={style}>
    <div
      style={{
        background: C.card,
        border: `1.5px solid ${C.line}`,
        borderRadius: 16,
        padding: "10px 24px",
        boxShadow: "0 12px 24px rgba(16,40,72,0.08)",
        display: "inline-flex",
        alignItems: "baseline",
        gap: 12,
      }}
    >
      <span style={{width: 10, height: 10, borderRadius: 99, background: color, alignSelf: "center"}} />
      <span style={{fontSize: 33, fontWeight: 800, color: C.ink}}>{name}</span>
      {role ? <span style={{fontSize: 21, color: C.inkSoft}}>{role}</span> : null}
    </div>
  </Reveal>
);

/* ------------------------------------------------------------------ */
/* Charts + data graphics                                              */
/* ------------------------------------------------------------------ */

export const BarChart: React.FC<{
  items: {label: string; value: number; display: string; color: string}[];
  max: number;
  height?: number;
  delay?: number;
  gap?: number;
  barWidth?: number;
}> = ({items, max, height = 260, delay = 0, gap = 48, barWidth = 130}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-around", gap, height, width: "100%"}}>
      {items.map((item, index) => {
        const grow = interpolate(frame - (delay + index * 4), [0, Math.max(1, 22)], [0, 1], {
          easing: EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const barHeight = Math.max(8, (item.value / max) * (height - 74));
        return (
          <div
            key={item.label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            <div
              style={{
                fontSize: 27,
                fontWeight: 800,
                color: C.ink,
                marginBottom: 10,
                opacity: grow,
                whiteSpace: "nowrap",
              }}
            >
              {item.display}
            </div>
            <div
              style={{
                width: barWidth,
                height: barHeight * grow,
                background: item.color,
                borderRadius: "14px 14px 6px 6px",
                boxShadow: `0 10px 20px ${item.color}33`,
              }}
            />
            <div style={{fontSize: 23, color: C.inkSoft, marginTop: 12, fontWeight: 600}}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Donut: React.FC<{
  size?: number;
  stroke?: number;
  progress: number;
  color: string;
  track?: string;
  children?: React.ReactNode;
}> = ({size = 250, stroke = 26, progress, color, track = "#E7E0D1", children}) => {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <div style={{position: "relative", width: size, height: size, flexShrink: 0}}>
      <svg width={size} height={size} style={{transform: "rotate(-90deg)"}}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamp01(progress))}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Timeline: React.FC<{
  from: string;
  to: string;
  color: string;
  delay?: number;
  width?: number;
}> = ({from, to, color, delay = 0, width = 1660}) => {
  const frame = useCurrentFrame();
  const p = spring({fps: 30, frame: frame - delay, config: {damping: 26, stiffness: 70, mass: 0.8}});
  return (
    <div style={{position: "relative", width, height: 110}}>
      <div
        style={{
          position: "absolute",
          left: 6,
          right: 6,
          top: 44,
          height: 4,
          borderRadius: 99,
          background: C.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 44,
          height: 4,
          borderRadius: 99,
          width: clamp01(p) * (width - 12),
          background: color,
        }}
      />
      <div style={{position: "absolute", left: 0, top: 31, display: "flex", alignItems: "center", gap: 14}}>
        <span style={{width: 30, height: 30, borderRadius: 99, background: C.ink, border: `7px solid ${C.paper}`}} />
        <span style={{fontSize: 24, fontWeight: 700, color: C.inkSoft}}>{from}</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 22,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: clamp01(p),
        }}
      >
        <span style={{fontSize: 24, fontWeight: 700, color: C.inkSoft}}>{to}</span>
        <span style={{width: 42, height: 42, borderRadius: 99, background: color, border: `7px solid ${C.paper}`}} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Phone mockup                                                        */
/* ------------------------------------------------------------------ */

export const PhoneMockup: React.FC<{
  width?: number;
  delay?: number;
  accent?: string;
  style?: React.CSSProperties;
}> = ({width = 370, delay = 0, accent = C.green, style}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, Math.max(1, 18)], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const height = width * 2.02;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 52,
        background: C.ink,
        padding: 12,
        boxShadow: "0 30px 60px rgba(16,40,72,0.28)",
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px) scale(${0.96 + p * 0.04})`,
        ...style,
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
          gap: 14,
          overflow: "hidden",
        }}
      >
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: C.inkSoft}}>
          <span>৯:৪১</span>
          <span style={{letterSpacing: 1}}>▮▮▯ ⏻</span>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <div style={{fontSize: 13, color: C.inkSoft}}>সেভিংস অ্যাপ</div>
            <div style={{fontSize: 21, fontWeight: 800, color: C.ink}}>আমার সঞ্চয়</div>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
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
          <div style={{fontSize: 12, opacity: 0.85}}>মোট সঞ্চয়</div>
          <div style={{fontSize: 29, fontWeight: 800, marginTop: 3}}>৳ ১,৪০,০০০</div>
          <div style={{fontSize: 11, opacity: 0.9, marginTop: 4}}>+ ৳ ৫,০০০ এই মাসে</div>
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
        <div
          style={{
            border: `1.5px solid ${C.line}`,
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{fontSize: 12, color: C.inkSoft}}>প্রতি মাসে</span>
          <span style={{fontSize: 15, fontWeight: 800, color: C.ink}}>৳ ৫,০০০</span>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 7}}>
          <div style={{display: "flex", justifyContent: "space-between", fontSize: 11, color: C.inkSoft}}>
            <span>এই মাসের লক্ষ্য</span>
            <span style={{fontWeight: 700, color: C.ink}}>৭২%</span>
          </div>
          <div style={{height: 9, borderRadius: 99, background: C.line}}>
            <div style={{width: "72%", height: "100%", borderRadius: 99, background: accent}} />
          </div>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 9, marginTop: 2}}>
          {["মোবাইল রিচার্জ", "বাজার খরচ", "যাতায়াত"].map((row, index) => (
            <div
              key={row}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                fontSize: 12,
                color: C.inkSoft,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 7,
                  background: index === 0 ? `${C.blue}22` : index === 1 ? `${C.coral}22` : `${C.green}22`,
                }}
              />
              {row}
              <span style={{marginLeft: "auto", color: C.ink, fontWeight: 700}}>
                {index === 0 ? "৳ ৩০০" : index === 1 ? "৳ ৪,২০০" : "৳ ১,২০০"}
              </span>
            </div>
          ))}
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
/* Flat illustration: Dhaka rooftops                                   */
/* ------------------------------------------------------------------ */

export const RooftopScene: React.FC<{width?: number; color?: string}> = ({width = 740, color = C.coral}) => (
  <svg width={width} height={width * 0.78} viewBox="0 0 740 578" fill="none">
    {/* sun */}
    <circle cx="586" cy="132" r="86" fill={C.sun} opacity="0.9" />
    <circle cx="586" cy="132" r="110" stroke={C.sun} strokeWidth="3" strokeDasharray="3 14" opacity="0.55" />
    {/* clouds */}
    <g opacity="0.9">
      <rect x="86" y="92" width="128" height="30" rx="15" fill="#FFFFFF" />
      <rect x="112" y="70" width="80" height="28" rx="14" fill="#FFFFFF" />
      <rect x="330" y="52" width="96" height="24" rx="12" fill="#FFFFFF" />
    </g>
    {/* birds */}
    <g stroke={C.ink} strokeWidth="3" strokeLinecap="round">
      <path d="M150 178c9-9 17-9 26 0" />
      <path d="M191 164c8-8 15-8 23 0" />
      <path d="M262 200c7-7 13-7 20 0" />
    </g>
    {/* back buildings */}
    <g stroke={C.ink} strokeWidth="4" strokeLinejoin="round">
      <rect x="64" y="268" width="156" height="238" fill="#EFE3CE" />
      <rect x="212" y="216" width="132" height="290" fill={C.sand} />
      <rect x="336" y="286" width="120" height="220" fill="#EFE3CE" />
      <rect x="448" y="238" width="168" height="268" fill={C.sand} />
    </g>
    {/* windows */}
    <g fill={C.ink} opacity="0.75">
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect key={`a-${row}-${col}`} x={88 + col * 40} y={300 + row * 54} width="20" height="26" rx="3" />
        ))
      )}
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => (
          <rect key={`b-${row}-${col}`} x={236 + col * 44} y={252 + row * 58} width="22" height="28" rx="3" />
        ))
      )}
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => (
          <rect key={`c-${row}-${col}`} x={472 + col * 52} y={276 + row * 58} width="24" height="30" rx="3" />
        ))
      )}
    </g>
    {/* water tank + dish */}
    <g stroke={C.ink} strokeWidth="4">
      <rect x="248" y="168" width="58" height="42" rx="9" fill={C.blue} />
      <path d="M262 210v8M292 210v8" />
      <circle cx="530" cy="196" r="26" fill="#FFFFFF" />
      <path d="M530 222v16" />
      <path d="M506 196h-22" />
    </g>
    {/* laundry line */}
    <g>
      <path d="M64 214c60 30 120 30 180 4" stroke={C.ink} strokeWidth="3" />
      <path d="M92 218l6 40h30l6-36" fill={color} stroke={C.ink} strokeWidth="3" strokeLinejoin="round" />
      <path d="M148 226l4 36h28l4-32" fill={C.green} stroke={C.ink} strokeWidth="3" strokeLinejoin="round" />
      <path d="M200 222l2 30h26l2-26" fill={C.blue} stroke={C.ink} strokeWidth="3" strokeLinejoin="round" />
    </g>
    {/* rooftop parapet */}
    <rect x="0" y="488" width="740" height="90" fill="#E8D5B8" stroke={C.ink} strokeWidth="4" />
    <g fill={C.ink} opacity="0.35">
      <rect x="26" y="512" width="86" height="6" rx="3" />
      <rect x="132" y="512" width="54" height="6" rx="3" />
      <rect x="600" y="512" width="108" height="6" rx="3" />
    </g>
    {/* plant */}
    <g stroke={C.ink} strokeWidth="4" strokeLinejoin="round">
      <path d="M604 488v-44" />
      <path d="M604 462c-30-4-40-28-26-48 22 4 32 26 26 48z" fill={C.green} />
      <path d="M604 452c28-6 38-30 24-48-22 4-30 26-24 48z" fill={C.green} />
      <path d="M578 488h52l-8 54h-36z" fill={color} />
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Shared text style                                                     */
/* ------------------------------------------------------------------ */

export const sampleFont: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  color: C.ink,
};

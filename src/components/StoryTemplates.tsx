import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Character} from "./Character";
import {Panel} from "./Backdrop";
import {FlowArrow} from "./FlowArrow";
import {GrowthChart} from "./GrowthChart";
import {PhoneCard} from "./PhoneCard";
import {Body, Chip, Counter, Kicker, Stage, Title, useEnter} from "./Type";
import {COLORS} from "../theme";
import {StoryScene, cueFrame} from "../story";

/**
 * Every template is driven by `scene.cueIds`: the first item of a scene enters
 * on the first SRT cue, the next on the next cue, and so on. This is what keeps
 * the graphics on the exact spoken syllable instead of a guessed offset.
 */
const useBeat = (scene: StoryScene, index: number, distance = 46) =>
  useEnter(
    cueFrame(scene, scene.cueIds[Math.min(index, scene.cueIds.length - 1)]),
    distance,
  );

const Timed: React.FC<{
  scene: StoryScene;
  cueIndex: number;
  distance?: number;
  children: React.ReactNode;
}> = ({scene, cueIndex, distance = 36, children}) => {
  const style = useEnter(
    cueFrame(scene, scene.cueIds[Math.min(cueIndex, scene.cueIds.length - 1)]),
    distance,
  );
  return <div style={style}>{children}</div>;
};

const cardStyle: React.CSSProperties = {
  background: COLORS.paper,
  borderRadius: 28,
  border: `1px solid ${COLORS.line}`,
  boxShadow: "0 22px 54px rgba(20,45,78,0.12)",
};

const headlineSize = (text: string, normal = 74, small = 60) =>
  text.length > 58 ? small : normal;

const Signal: React.FC<{scene: StoryScene; size?: number}> = ({scene, size = 34}) => {
  const d = scene.data as {kicker?: string};
  return (
    <Kicker color={scene.accent}>
      <span style={{fontSize: size}}>{d.kicker ?? ""}</span>
    </Kicker>
  );
};

/* ------------------------------------------------------------------ */
/* 1. Opening                                                         */
/* ------------------------------------------------------------------ */
const Opening: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    year: string;
    city: string;
    names: string[];
    age: string;
  };
  const year = useBeat(scene, 0, 26);
  const city = useBeat(scene, 1, 26);
  const names = useBeat(scene, 2, 34);
  const age = useBeat(scene, 3, 26);
  const characterDelay = cueFrame(scene, scene.cueIds[2]);
  const colors = [COLORS.green, COLORS.coral];

  return (
    <Stage padding="64px 104px" justify="center" gap={30}>
      <div style={{display: "flex", alignItems: "center", gap: 20}}>
        <div style={year}>
          <Chip color={scene.accent} fg={COLORS.white} size={38}>
            {d.year}
          </Chip>
        </div>
        <div style={city}>
          <Body size={36} weight={700} color={COLORS.navy}>
            {d.city}
          </Body>
        </div>
      </div>

      <div style={{display: "flex", alignItems: "center", gap: 54}}>
        <div style={{flex: 1}}>
          <div style={names}>
            <Title size={98} maxWidth={880}>
              দুই বন্ধু,
              <br />
              <span style={{color: scene.accent}}>একই বেতন</span>
            </Title>
          </div>
          <div style={{...age, marginTop: 28, display: "flex", alignItems: "center", gap: 18}}>
            <Chip color={COLORS.gold} fg={COLORS.navy} size={34}>
              বয়স {d.age}
            </Chip>
            <Body size={34} weight={600} color={COLORS.navy}>
              {d.names[0]} আর {d.names[1]}
            </Body>
          </div>
        </div>

        <div style={{display: "flex", gap: 26}}>
          {d.names.map((name, index) => (
            <div key={name} style={cardStyle}>
              <Panel
                accent={colors[index % colors.length]}
                style={{
                  width: 286,
                  padding: "28px 22px",
                  boxShadow: "none",
                  border: "none",
                  background: "transparent",
                }}
              >
                <Character
                  name={name}
                  color={colors[index % colors.length]}
                  delay={characterDelay}
                  mood="happy"
                  scale={0.72}
                />
              </Panel>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Statement                                                       */
/* ------------------------------------------------------------------ */
const Statement: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    sub?: string;
    big?: string;
    bigLabel?: string;
    character?: "rakib" | "suman" | "both";
    tone?: "light" | "dark";
  };
  const dark = d.tone === "dark";
  const signal = useBeat(scene, 0, 24);
  const head = useBeat(scene, 0, 44);
  const sub = useBeat(scene, 1, 38);
  const big = useBeat(scene, 1, 42);
  const characterStyle = useBeat(scene, 2, 54);

  const characters =
    d.character === "both"
      ? [
          {name: "রাকিব", color: COLORS.green, mood: "happy" as const},
          {name: "সুমন", color: COLORS.coral, mood: "happy" as const},
        ]
      : d.character === "rakib"
        ? [{name: "রাকিব", color: COLORS.green, mood: "happy" as const}]
        : d.character === "suman"
          ? [{name: "সুমন", color: COLORS.coral, mood: "worried" as const}]
          : [];

  return (
    <Stage padding="66px 104px" justify="center" gap={18}>
      <div style={signal}>
        <Signal scene={scene} />
      </div>
      <div
        style={{
          ...cardStyle,
          background: dark ? COLORS.navy : COLORS.paper,
          border: dark ? "1px solid rgba(255,255,255,0.14)" : cardStyle.border,
          padding: "44px 54px",
          display: "flex",
          alignItems: "center",
          gap: 48,
          overflow: "hidden",
        }}
      >
        <div style={{flex: 1}}>
          <div style={head}>
            <Title
              size={headlineSize(d.headline, 74, 58)}
              color={dark ? COLORS.white : COLORS.navy}
              maxWidth={1180}
            >
              {d.headline}
            </Title>
          </div>
          {d.sub ? (
            <div style={{...sub, marginTop: 18}}>
              <Body
                size={34}
                weight={600}
                color={dark ? "rgba(255,255,255,0.78)" : COLORS.muted}
              >
                {d.sub}
              </Body>
            </div>
          ) : null}
          {d.big ? (
            <div
              style={{
                ...big,
                marginTop: 26,
                display: "flex",
                alignItems: "baseline",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: d.big.length > 14 ? 62 : 92,
                  fontWeight: 800,
                  color: scene.accent,
                  lineHeight: 1.35,
                }}
              >
                {d.big}
              </div>
              {d.bigLabel ? (
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: dark ? "rgba(255,255,255,0.66)" : COLORS.muted,
                  }}
                >
                  {d.bigLabel}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {characters.length > 0 ? (
          <div style={{...characterStyle, display: "flex", gap: 10}}>
            {characters.map((c) => (
              <Character
                key={c.name}
                name={c.name}
                color={c.color}
                mood={c.mood}
                delay={cueFrame(scene, scene.cueIds[Math.min(2, scene.cueIds.length - 2)])}
                scale={0.66}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Compare                                                         */
/* ------------------------------------------------------------------ */
const Compare: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    left: {name: string; value: string; note: string; color: string; mood: "happy" | "worried"};
    right: {name: string; value: string; note: string; color: string; mood: "happy" | "worried"};
    chip?: string;
  };
  const head = useBeat(scene, 0, 40);
  const left = useBeat(scene, 0, 50);
  const right = useBeat(scene, 1, 50);
  const chip = useBeat(scene, 1, 30);
  const sides = [d.left, d.right];
  const styles = [left, right];

  return (
    <Stage padding="62px 94px" gap={22}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 66, 54)} style={{marginTop: 10}}>
          {d.headline}
        </Title>
      </div>

      <div style={{display: "flex", gap: 30, flex: 1, minHeight: 0}}>
        {sides.map((side, index) => (
          <div key={side.name} style={{...styles[index], flex: 1}}>
            <Panel
              accent={side.color}
              style={{
                height: "100%",
                padding: "26px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <div style={{display: "flex", alignItems: "center", gap: 12}}>
                <Character
                  name={side.name}
                  color={side.color}
                  mood={side.mood}
                  delay={0}
                  scale={0.42}
                />
                <div>
                  <div style={{fontSize: 26, color: COLORS.muted, fontWeight: 600}}>
                    {side.name}
                  </div>
                  <div
                    style={{
                      fontSize: 52,
                      fontWeight: 800,
                      color: side.color,
                      lineHeight: 1.3,
                    }}
                  >
                    {side.value}
                  </div>
                  <div style={{fontSize: 25, color: COLORS.muted, fontWeight: 600}}>
                    {side.note}
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        ))}
      </div>

      {d.chip ? (
        <div style={{...chip, display: "flex", justifyContent: "center"}}>
          <Chip color={scene.accent} fg={COLORS.white} size={34}>
            {d.chip}
          </Chip>
        </div>
      ) : null}
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Question                                                        */
/* ------------------------------------------------------------------ */
const Question: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    question: string;
    answer: string;
    sub?: string;
  };
  const signal = useBeat(scene, 0, 24);
  const question = useBeat(scene, 0, 44);
  const answer = useBeat(scene, 1, 40);
  const sub = useBeat(scene, 1, 32);

  return (
    <Stage padding="74px 118px" justify="center" gap={18}>
      <div style={signal}>
        <Signal scene={scene} />
      </div>
      <div style={{display: "flex", alignItems: "center", gap: 34}}>
        <div
          style={{
            flex: "0 0 auto",
            width: 124,
            height: 124,
            borderRadius: 999,
            background: scene.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 76,
            fontWeight: 800,
            color: COLORS.white,
            boxShadow: "0 18px 40px rgba(20,45,78,0.18)",
          }}
        >
          ?
        </div>
        <div style={{...question, flex: 1}}>
          <Title size={headlineSize(d.question, 68, 54)} maxWidth={1320}>
            {d.question}
          </Title>
        </div>
      </div>

      <div style={{...answer, marginTop: 28, display: "flex", flexWrap: "wrap", gap: 16}}>
        <Chip color={COLORS.navy} fg={COLORS.white} size={40}>
          {d.answer}
        </Chip>
      </div>
      {d.sub ? (
        <div style={{...sub, marginTop: 8}}>
          <Body size={32} weight={600} color={COLORS.muted}>
            {d.sub}
          </Body>
        </div>
      ) : null}
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Habit                                                           */
/* ------------------------------------------------------------------ */
const Habit: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    percent: number;
    kicker: string;
    headline: string;
    sub: string;
    cta: string;
  };
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ringIn = spring({
    frame: frame - cueFrame(scene, scene.cueIds[0]),
    fps,
    config: {damping: 200, mass: 0.9},
    durationInFrames: 38,
  });
  const head = useBeat(scene, 0, 40);
  const sub = useBeat(scene, 1, 34);
  const cta = useBeat(scene, 1, 26);

  return (
    <Stage padding="70px 104px" justify="center">
      <div style={{display: "flex", alignItems: "center", gap: 76}}>
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 999,
            padding: 18,
            background: `conic-gradient(${scene.accent} ${d.percent * ringIn}%, rgba(20,45,78,0.10) 0)`,
            boxShadow: "0 28px 70px rgba(20,45,78,0.18)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 999,
              background: COLORS.paper,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <div style={{fontSize: 108, fontWeight: 800, color: COLORS.navy, lineHeight: 1.2}}>
              <Counter
                to={d.percent}
                delay={cueFrame(scene, scene.cueIds[0])}
                formatter={(v) => `${Math.round(v)}%`}
              />
            </div>
            <div style={{fontSize: 26, color: COLORS.muted, fontWeight: 600}}>মানুষ</div>
          </div>
        </div>

        <div style={{flex: 1}}>
          <div style={head}>
            <Signal scene={scene} />
            <Title size={headlineSize(d.headline, 76, 60)} style={{marginTop: 12}}>
              {d.headline}
            </Title>
          </div>
          <div style={{...sub, marginTop: 18}}>
            <Body size={36} weight={600} color={COLORS.muted}>
              {d.sub}
            </Body>
          </div>
          <div style={{...cta, marginTop: 24}}>
            <Chip color={scene.accent} fg={COLORS.white} size={32}>
              {d.cta}
            </Chip>
          </div>
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 6. Engine                                                          */
/* ------------------------------------------------------------------ */
const EngineIcon: React.FC<{color: string}> = ({color}) => (
  <svg width="210" height="150" viewBox="0 0 210 150">
    <rect x="18" y="44" width="150" height="58" rx="14" fill={COLORS.navy} />
    <rect x="44" y="20" width="86" height="30" rx="8" fill={color} />
    <circle cx="62" cy="112" r="22" fill={COLORS.navy} />
    <circle cx="62" cy="112" r="10" fill={COLORS.paper} />
    <circle cx="142" cy="112" r="22" fill={COLORS.navy} />
    <circle cx="142" cy="112" r="10" fill={COLORS.paper} />
    <rect x="168" y="56" width="28" height="22" rx="6" fill={color} />
  </svg>
);

const FuelIcon: React.FC<{color: string}> = ({color}) => (
  <svg width="150" height="170" viewBox="0 0 150 170">
    <path
      d="M75 12 C75 12 132 78 132 112 C132 144 106 166 75 166 C44 166 18 144 18 112 C18 78 75 12 75 12 Z"
      fill={color}
    />
    <path
      d="M52 112 C60 96 70 92 82 92 C92 92 100 98 104 108"
      fill="none"
      stroke={COLORS.white}
      strokeWidth="9"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

const Engine: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    sub: string;
    leftTitle: string;
    leftValue: string;
    rightTitle: string;
    rightValue: string;
  };
  const head = useBeat(scene, 0, 40);
  const left = useBeat(scene, 0, 48);
  const right = useBeat(scene, 1, 48);

  return (
    <Stage padding="64px 104px" justify="center" gap={26}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 70, 56)} style={{marginTop: 10}}>
          {d.headline}
        </Title>
        <Body size={32} weight={600} color={COLORS.muted} style={{marginTop: 10}}>
          {d.sub}
        </Body>
      </div>

      <div style={{display: "flex", alignItems: "center", gap: 20}}>
        <div style={{...left, flex: 1}}>
          <Panel accent={scene.accent} style={{padding: "26px 34px"}}>
            <div style={{display: "flex", alignItems: "center", gap: 20}}>
              <EngineIcon color={scene.accent} />
              <div>
                <div style={{fontSize: 28, color: COLORS.muted, fontWeight: 600}}>
                  {d.leftTitle}
                </div>
                <div style={{fontSize: 38, fontWeight: 800, color: COLORS.navy}}>
                  {d.leftValue}
                </div>
              </div>
            </div>
          </Panel>
        </div>
        <FlowArrow width={120} color={scene.accent} delay={cueFrame(scene, scene.cueIds[0]) + 14} />
        <div style={{...right, flex: 1}}>
          <Panel accent={COLORS.gold} style={{padding: "26px 34px"}}>
            <div style={{display: "flex", alignItems: "center", gap: 20}}>
              <FuelIcon color={COLORS.gold} />
              <div>
                <div style={{fontSize: 28, color: COLORS.muted, fontWeight: 600}}>
                  {d.rightTitle}
                </div>
                <div style={{fontSize: 38, fontWeight: 800, color: COLORS.navy}}>
                  {d.rightValue}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 7. Ledger                                                          */
/* ------------------------------------------------------------------ */
const Ledger: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    salary: string;
    rows: {label: string; value: string}[];
    remaining: string;
    remainingLabel: string;
  };
  const head = useBeat(scene, 0, 36);
  const salary = useBeat(scene, 0, 34);
  const remaining = useBeat(scene, Math.min(d.rows.length, scene.cueIds.length - 1), 40);

  return (
    <Stage padding="58px 98px" gap={20}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 60, 50)} style={{marginTop: 8}}>
          {d.headline}
        </Title>
      </div>

      <div style={{display: "flex", gap: 34, flex: 1, minHeight: 0}}>
        <div style={{flex: 1.35, display: "flex", flexDirection: "column", gap: 14}}>
          <div
            style={{
              ...salary,
              ...cardStyle,
              padding: "20px 30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(25,183,122,0.10)",
              border: `1px solid ${COLORS.green}`,
            }}
          >
            <Body size={28} weight={700} color={COLORS.navy}>
              বেতন এলো
            </Body>
            <div style={{fontSize: 44, fontWeight: 800, color: COLORS.green}}>
              {d.salary}
            </div>
          </div>

          {d.rows.map((row, index) => (
            <Timed key={`${row.label}-${index}`} scene={scene} cueIndex={index} distance={26}>
              <div
                style={{
                  ...cardStyle,
                  padding: "14px 30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 20,
                  boxShadow: "0 12px 28px rgba(20,45,78,0.08)",
                }}
              >
                <Body size={27} weight={600} color={COLORS.navy}>
                  {row.label}
                </Body>
                <div style={{fontSize: 32, fontWeight: 800, color: COLORS.coral}}>
                  − ৳ {row.value}
                </div>
              </div>
            </Timed>
          ))}
        </div>

        <div
          style={{
            ...remaining,
            flex: 0.65,
            ...cardStyle,
            padding: "26px 30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: COLORS.navy,
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <div style={{fontSize: 28, color: "rgba(255,255,255,0.72)", fontWeight: 600}}>
            {d.remainingLabel}
          </div>
          <div style={{fontSize: 70, fontWeight: 800, color: COLORS.gold, lineHeight: 1.3}}>
            {d.remaining}
          </div>
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 8. Sequence                                                        */
/* ------------------------------------------------------------------ */
const SequenceScene: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    steps: string[];
    outcome?: string;
    character?: "rakib" | "suman";
  };
  const head = useBeat(scene, 0, 36);
  const outcome = useBeat(scene, scene.cueIds.length - 1, 30);

  return (
    <Stage padding="62px 100px" justify="center" gap={30}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 64, 52)} style={{marginTop: 8}}>
          {d.headline}
        </Title>
      </div>

      <div style={{display: "flex", alignItems: "center", gap: 8}}>
        {d.steps.map((step, index) => (
          <React.Fragment key={step}>
            <Timed scene={scene} cueIndex={index} distance={40}>
              <div
                style={{
                  ...cardStyle,
                  width: 320,
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  borderTop: `8px solid ${index === d.steps.length - 1 ? COLORS.green : scene.accent}`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    background: scene.accent,
                    color: COLORS.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    fontWeight: 800,
                  }}
                >
                  {index + 1}
                </div>
                <Body size={30} weight={700} color={COLORS.navy}>
                  {step}
                </Body>
              </div>
            </Timed>
            {index < d.steps.length - 1 ? (
              <FlowArrow
                width={86}
                color={scene.accent}
                delay={cueFrame(scene, scene.cueIds[Math.min(index + 1, scene.cueIds.length - 1)]) - 10}
              />
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 28}}>
        {d.outcome ? (
          <div style={outcome}>
            <Chip color={COLORS.navy} fg={COLORS.white} size={32}>
              {d.outcome}
            </Chip>
          </div>
        ) : null}
        {d.character ? (
          <div style={outcome}>
            <Character
              name={d.character === "rakib" ? "রাকিব" : "সুমন"}
              color={d.character === "rakib" ? COLORS.green : COLORS.coral}
              mood={d.character === "rakib" ? "happy" : "worried"}
              delay={cueFrame(scene, scene.cueIds[0])}
              scale={0.5}
            />
          </div>
        ) : null}
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 9. Rule                                                            */
/* ------------------------------------------------------------------ */
const Rule: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    percent: number;
    sub?: string;
    leftLabel: string;
    rightLabel: string;
  };
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = cueFrame(scene, scene.cueIds[Math.min(1, scene.cueIds.length - 1)]);
  const grow = spring({
    frame: frame - start,
    fps,
    config: {damping: 200, mass: 0.9},
    durationInFrames: 40,
  });
  const head = useBeat(scene, 0, 38);
  const bar = useBeat(scene, 1, 30);
  const sub = useBeat(scene, 1, 26);

  return (
    <Stage padding="70px 110px" justify="center" gap={30}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 66, 54)} style={{marginTop: 10}}>
          {d.headline}
        </Title>
      </div>

      <div style={bar}>
        <div
          style={{
            display: "flex",
            height: 118,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 22px 54px rgba(20,45,78,0.16)",
          }}
        >
          <div
            style={{
              width: `${d.percent * grow}%`,
              minWidth: d.percent * grow > 4 ? 0 : 0,
              background: COLORS.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              color: COLORS.white,
            }}
          >
            {d.percent * grow > 10 ? `${d.percent}%` : ""}
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(20,45,78,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.navy,
            }}
          >
            {100 - d.percent}%
          </div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", marginTop: 14}}>
          <Body size={30} weight={700} color={COLORS.green}>
            {d.leftLabel}
          </Body>
          <Body size={30} weight={700} color={COLORS.muted}>
            {d.rightLabel}
          </Body>
        </div>
      </div>

      {d.sub ? (
        <div style={{...sub, display: "flex", justifyContent: "center"}}>
          <Chip color={scene.accent} fg={COLORS.white} size={32}>
            {d.sub}
          </Chip>
        </div>
      ) : null}
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 10. Tiers                                                          */
/* ------------------------------------------------------------------ */
const Tiers: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    tiers: {title: string; pct: string; amount: string; note: string}[];
    active: number;
    sub?: string;
  };
  const head = useBeat(scene, 0, 36);
  const sub = useBeat(scene, 1, 30);

  return (
    <Stage padding="58px 92px" justify="center" gap={26}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 62, 50)} style={{marginTop: 8}}>
          {d.headline}
        </Title>
      </div>

      <div style={{display: "flex", gap: 26}}>
        {d.tiers.map((tier, index) => {
          const active = d.active === index;
          return (
            <Timed key={tier.title} scene={scene} cueIndex={index} distance={44}>
              <div
                style={{
                  ...cardStyle,
                  width: 470,
                  padding: "30px 28px",
                  border: active ? `4px solid ${scene.accent}` : `1px solid ${COLORS.line}`,
                  background: active ? COLORS.navy : COLORS.paper,
                  transform: active ? "translateY(-8px)" : undefined,
                  boxShadow: active
                    ? "0 30px 70px rgba(20,45,78,0.28)"
                    : "0 18px 44px rgba(20,45,78,0.10)",
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: active ? scene.accent : COLORS.muted,
                  }}
                >
                  {tier.title}
                </div>
                <div
                  style={{
                    fontSize: 78,
                    fontWeight: 800,
                    lineHeight: 1.3,
                    color: active ? COLORS.white : COLORS.navy,
                  }}
                >
                  {tier.pct}
                </div>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 800,
                    color: active ? COLORS.gold : COLORS.green,
                  }}
                >
                  ৳ {tier.amount}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 25,
                    fontWeight: 600,
                    color: active ? "rgba(255,255,255,0.72)" : COLORS.muted,
                  }}
                >
                  {tier.note}
                </div>
              </div>
            </Timed>
          );
        })}
      </div>

      {d.sub ? (
        <div style={{...sub, display: "flex", justifyContent: "center"}}>
          <Chip color={scene.accent} fg={COLORS.white} size={32}>
            {d.sub}
          </Chip>
        </div>
      ) : null}
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 11. Growth                                                         */
/* ------------------------------------------------------------------ */
const Growth: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    monthly: string;
    rate: string;
    total: string;
    own: string;
    profit: string;
    extra?: string;
  };
  const head = useBeat(scene, 0, 32);
  const total = useBeat(scene, 1, 40);
  const split = useBeat(scene, 2, 32);
  const extra = useBeat(scene, scene.cueIds.length - 1, 28);

  return (
    <Stage padding="52px 92px" justify="center" gap={18}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 58, 48)} style={{marginTop: 6}}>
          {d.headline}
        </Title>
      </div>

      <div style={{display: "flex", gap: 30, alignItems: "center"}}>
        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 16}}>
          <div
            style={{
              ...total,
              ...cardStyle,
              padding: "24px 30px",
              background: COLORS.navy,
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <div style={{fontSize: 26, color: "rgba(255,255,255,0.70)", fontWeight: 600}}>
              ১০ বছরে মোট
            </div>
            <div style={{fontSize: 66, fontWeight: 800, color: COLORS.gold, lineHeight: 1.35}}>
              ৳ {d.total}
            </div>
          </div>

          <div style={{...split, display: "flex", gap: 16}}>
            <div style={{...cardStyle, flex: 1, padding: "18px 22px"}}>
              <div style={{fontSize: 24, color: COLORS.muted, fontWeight: 600}}>নিজের টাকা</div>
              <div style={{fontSize: 36, fontWeight: 800, color: COLORS.blue}}>৳ {d.own}</div>
            </div>
            <div style={{...cardStyle, flex: 1, padding: "18px 22px"}}>
              <div style={{fontSize: 24, color: COLORS.muted, fontWeight: 600}}>শুধু লাভ</div>
              <div style={{fontSize: 36, fontWeight: 800, color: COLORS.green}}>৳ {d.profit}</div>
            </div>
          </div>

          <div style={{display: "flex", gap: 14}}>
            <Chip color={COLORS.blue} fg={COLORS.white} size={26}>
              মাসে ৳ {d.monthly}
            </Chip>
            <Chip color={COLORS.green} fg={COLORS.white} size={26}>
              রিটার্ন {d.rate}
            </Chip>
          </div>

          {d.extra ? (
            <div style={extra}>
              <Body size={28} weight={600} color={COLORS.muted}>
                {d.extra}
              </Body>
            </div>
          ) : null}
        </div>

        <div style={{flex: 1.25}}>
          <Panel accent={scene.accent} style={{padding: "18px 22px"}}>
            <GrowthChart
              width={770}
              height={400}
              delay={cueFrame(scene, scene.cueIds[1])}
            />
          </Panel>
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 12. Trap                                                           */
/* ------------------------------------------------------------------ */
const BrainIcon: React.FC<{color: string}> = ({color}) => (
  <svg width="190" height="170" viewBox="0 0 190 170">
    <path
      d="M70 20 C45 20 30 38 32 60 C16 68 12 94 26 108 C20 130 40 150 62 146 C72 160 96 164 108 152 C126 162 150 150 150 130 C170 122 176 96 160 82 C168 60 152 38 130 38 C122 22 94 12 80 26 Z"
      fill={color}
      opacity="0.18"
    />
    <path
      d="M72 38 C58 40 52 52 56 64 C42 70 42 88 54 96 C50 110 62 122 76 118 C82 130 98 132 106 122 C118 130 134 122 132 108 C146 102 146 84 132 78 C136 64 122 54 110 58 C102 44 84 34 72 38 Z"
      fill="none"
      stroke={color}
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path d="M86 62 V110 M72 78 C80 82 84 86 86 92 M104 78 C96 82 92 86 90 92"
      fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const AutomationIcon: React.FC<{color: string}> = ({color}) => (
  <svg width="190" height="170" viewBox="0 0 190 170">
    <circle cx="95" cy="85" r="62" fill={color} opacity="0.16" />
    <path d="M95 30 A55 55 0 0 1 150 85" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
    <path d="M150 85 L162 62 L136 62 Z" fill={color} />
    <path d="M95 140 A55 55 0 0 1 40 85" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
    <path d="M40 85 L28 108 L54 108 Z" fill={color} />
    <circle cx="95" cy="85" r="16" fill={color} />
  </svg>
);

const Trap: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    steps: string[];
    sub: string;
    mode: "brain" | "automation";
  };
  const head = useBeat(scene, 0, 36);
  const sub = useBeat(scene, scene.cueIds.length - 1, 30);

  return (
    <Stage padding="58px 96px" justify="center" gap={24}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 60, 48)} style={{marginTop: 8}}>
          {d.headline}
        </Title>
      </div>

      <div style={{display: "flex", alignItems: "center", gap: 46}}>
        <div
          style={{
            ...cardStyle,
            width: 330,
            height: 330,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: d.mode === "automation" ? "rgba(25,183,122,0.10)" : "rgba(241,107,117,0.10)",
            border: `2px solid ${scene.accent}`,
          }}
        >
          {d.mode === "automation" ? (
            <AutomationIcon color={scene.accent} />
          ) : (
            <BrainIcon color={scene.accent} />
          )}
        </div>

        <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 14}}>
          {d.steps.map((step, index) => (
            <Timed key={step} scene={scene} cueIndex={index} distance={26}>
              <div
                style={{
                  ...cardStyle,
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  borderRadius: 20,
                  boxShadow: "0 12px 28px rgba(20,45,78,0.08)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: scene.accent,
                    color: COLORS.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  {index + 1}
                </div>
                <Body size={28} weight={600} color={COLORS.navy}>
                  {step}
                </Body>
              </div>
            </Timed>
          ))}
        </div>
      </div>

      <div style={{...sub, display: "flex", justifyContent: "center"}}>
        <Chip color={scene.accent} fg={COLORS.white} size={30}>
          {d.sub}
        </Chip>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 13. Phone                                                          */
/* ------------------------------------------------------------------ */
const Phone: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    amount: string;
    income: string;
    steps: string[];
  };
  const head = useBeat(scene, 0, 36);
  const phone = useBeat(scene, 0, 54);
  const steps = d.steps;

  return (
    <Stage padding="54px 94px" justify="center">
      <div style={{display: "flex", alignItems: "center", gap: 60}}>
        <div style={{flex: 1}}>
          <div style={head}>
            <Signal scene={scene} />
            <Title size={headlineSize(d.headline, 62, 50)} style={{marginTop: 10}}>
              {d.headline}
            </Title>
          </div>

          <div style={{marginTop: 26, display: "flex", flexDirection: "column", gap: 12}}>
            {steps.map((step, index) => (
              <Timed key={step} scene={scene} cueIndex={index} distance={26}>
                <div style={{display: "flex", alignItems: "center", gap: 16}}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      background: scene.accent,
                      color: COLORS.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </div>
                  <Body size={30} weight={600} color={COLORS.navy}>
                    {step}
                  </Body>
                </div>
              </Timed>
            ))}
          </div>

          <div style={{marginTop: 24, display: "flex", gap: 14}}>
            <Chip color={COLORS.blue} fg={COLORS.white} size={28}>
              মাসিক আয় ৳ {d.income}
            </Chip>
            <Chip color={COLORS.green} fg={COLORS.white} size={28}>
              বিনিয়োগ ৳ {d.amount}
            </Chip>
          </div>
        </div>

        <div style={{...phone, flex: "0 0 auto", transform: "scale(0.9)", transformOrigin: "center"}}>
          <PhoneCard
            amount={d.amount}
            delay={cueFrame(scene, scene.cueIds[0])}
            toggleDelay={12}
          />
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 14. Wait                                                           */
/* ------------------------------------------------------------------ */
const Wait: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    excuses: string[];
    sub: string;
  };
  const head = useBeat(scene, 0, 36);
  const sub = useBeat(scene, scene.cueIds.length - 1, 28);

  return (
    <Stage padding="66px 104px" justify="center" gap={26}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 68, 54)} style={{marginTop: 8}}>
          {d.headline}
        </Title>
      </div>

      <div style={{display: "flex", gap: 24}}>
        {d.excuses.map((excuse, index) => (
          <Timed key={excuse} scene={scene} cueIndex={index} distance={40}>
            <div
              style={{
                ...cardStyle,
                width: 460,
                minHeight: 150,
                padding: "24px 26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "line-through",
                textDecorationColor: COLORS.coral,
                textDecorationThickness: 4,
              }}
            >
              <Body size={30} weight={700} color={COLORS.navy} style={{textAlign: "center"}}>
                {excuse}
              </Body>
            </div>
          </Timed>
        ))}
      </div>

      <div style={{...sub, display: "flex", justifyContent: "center"}}>
        <Chip color={scene.accent} fg={COLORS.white} size={32}>
          {d.sub}
        </Chip>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 15. CTA                                                            */
/* ------------------------------------------------------------------ */
const Cta: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {
    kicker: string;
    headline: string;
    options: string[];
    next: string;
  };
  const head = useBeat(scene, 0, 40);
  const options = useBeat(scene, 1, 34);
  const next = useBeat(scene, 2, 30);

  return (
    <Stage padding="66px 104px" justify="center" gap={26}>
      <div style={head}>
        <Signal scene={scene} />
        <Title size={headlineSize(d.headline, 66, 52)} style={{marginTop: 8}}>
          {d.headline}
        </Title>
      </div>

      <div style={{...options, display: "flex", gap: 22}}>
        {d.options.map((option, index) => (
          <div
            key={option}
            style={{
              ...cardStyle,
              padding: "20px 34px",
              background: index === 1 ? scene.accent : COLORS.paper,
              border: `2px solid ${scene.accent}`,
            }}
          >
            <div
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: index === 1 ? COLORS.white : COLORS.navy,
              }}
            >
              {option}
            </div>
          </div>
        ))}
      </div>

      <div style={{...next, display: "flex", alignItems: "center", gap: 18}}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            background: COLORS.coral,
            color: COLORS.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          ▶
        </div>
        <Body size={32} weight={600} color={COLORS.navy}>
          {d.next}
        </Body>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 16. Outro + quote                                                  */
/* ------------------------------------------------------------------ */
const Outro: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {headline: string; sub: string; signature: string};
  const head = useBeat(scene, 0, 40);
  const sub = useBeat(scene, 1, 34);

  return (
    <Stage padding="80px 130px" justify="center" gap={30}>
      <div style={{...head, textAlign: "center"}}>
        <Title size={96} align="center">
          {d.headline}
        </Title>
      </div>
      <div style={{...sub, display: "flex", justifyContent: "center"}}>
        <Chip color={scene.accent} fg={COLORS.white} size={42}>
          {d.signature}
        </Chip>
      </div>
      <div style={{...sub, display: "flex", justifyContent: "center"}}>
        <Body size={38} weight={600} color={COLORS.navy}>
          {d.sub}
        </Body>
      </div>
    </Stage>
  );
};

const Quote: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as {quote: string; sub: string};
  const quote = useBeat(scene, 0, 40);
  const sub = useBeat(scene, 1, 32);

  return (
    <Stage padding="90px 130px" justify="center" gap={16}>
      <div style={{fontSize: 150, lineHeight: 0.8, color: scene.accent, fontWeight: 800}}>“</div>
      <div style={quote}>
        <Title size={76} maxWidth={1400}>
          {d.quote}
        </Title>
      </div>
      <div style={sub}>
        <Body size={38} weight={600} color={COLORS.muted}>
          {d.sub}
        </Body>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Dispatcher                                                         */
/* ------------------------------------------------------------------ */
export const SceneRenderer: React.FC<{scene: StoryScene}> = ({scene}) => {
  switch (scene.type) {
    case "opening":
      return <Opening scene={scene} />;
    case "compare":
      return <Compare scene={scene} />;
    case "question":
      return <Question scene={scene} />;
    case "habit":
      return <Habit scene={scene} />;
    case "engine":
      return <Engine scene={scene} />;
    case "ledger":
      return <Ledger scene={scene} />;
    case "sequence":
      return <SequenceScene scene={scene} />;
    case "rule":
      return <Rule scene={scene} />;
    case "tiers":
      return <Tiers scene={scene} />;
    case "growth":
      return <Growth scene={scene} />;
    case "trap":
      return <Trap scene={scene} />;
    case "phone":
      return <Phone scene={scene} />;
    case "wait":
      return <Wait scene={scene} />;
    case "cta":
      return <Cta scene={scene} />;
    case "outro":
      return <Outro scene={scene} />;
    case "quote":
      return <Quote scene={scene} />;
    case "statement":
    default:
      return <Statement scene={scene} />;
  }
};

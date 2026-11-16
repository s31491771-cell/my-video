import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Amount,
  ChapterTag,
  FilmFrame,
  Folio,
  Kicker,
  Letterbox,
  Portrait,
  Reveal,
  Rule,
  Watermark,
  paletteFor,
  sampleFont,
} from "./film";
import {SAMPLE_FRAMES, SAMPLE_SECONDS, SampleScene, cueFrame, sceneById} from "./plan";

const FADE = 9; // cross-dissolve overlap in frames

/* ------------------------------------------------------------------ */
/* Scene components                                                    */
/* ------------------------------------------------------------------ */

const P01: React.FC = () => {
  const scene = sceneById("P01");
  const p = paletteFor(scene);
  const frame = useCurrentFrame();
  const yearScale = interpolate(frame, [cueFrame(scene, 1) - 2, cueFrame(scene, 1) + 30], [1.14, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <FilmFrame scene={scene} skyline>
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <div style={{position: "absolute", left: 150, top: 250, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 1) - 4}>
          {(scene.data as {tag: string}).tag}
        </Kicker>
        <Reveal delay={cueFrame(scene, 1)} y={60} blur={18} duration={26}>
          <div
            style={{
              marginTop: 24,
              fontSize: 260,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: -6,
              color: p.ink,
              transform: `scale(${yearScale})`,
              transformOrigin: "left bottom",
              textShadow: `0 0 80px ${p.glow}44`,
            }}
          >
            {(scene.data as {year: string}).year}
          </div>
        </Reveal>
        <Rule color={p.accent} delay={cueFrame(scene, 1) + 10} width={360} />
        <Reveal delay={cueFrame(scene, 2)} y={30} blur={10} duration={22}>
          <div
            style={{
              marginTop: 36,
              fontSize: 74,
              fontWeight: 700,
              color: p.ink,
              letterSpacing: 1,
            }}
          >
            {(scene.data as {city: string}).city}
          </div>
        </Reveal>
        <Reveal delay={cueFrame(scene, 2) + 10} y={22} blur={6}>
          <div style={{marginTop: 18, fontSize: 34, color: "rgba(255,246,230,0.7)", lineHeight: 1.5}}>
            দুই বন্ধুর গল্প — একই শুরু, ভিন্ন পরিণতি
          </div>
        </Reveal>
      </div>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const P02: React.FC = () => {
  const scene = sceneById("P02");
  const p = paletteFor(scene);
  const names = (scene.data as {names: string[]; age: string; line: string}).names;
  return (
    <FilmFrame scene={scene}>
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <div style={{position: "absolute", inset: 0, ...sampleFont}}>
        <div style={{position: "absolute", left: 104, top: 250}}>
          <Kicker color={p.accent} delay={cueFrame(scene, 3) - 2}>
            {(scene.data as {line: string}).line}
          </Kicker>
          <Reveal delay={cueFrame(scene, 4) + 2} y={24}>
            <div style={{marginTop: 28, fontSize: 46, fontWeight: 700, color: p.ink}}>
              বয়স {(scene.data as {age: string}).age}
            </div>
          </Reveal>
        </div>

        {/* Rakib left */}
        <div style={{position: "absolute", left: 250, bottom: 50}}>
          <Portrait who="rakib" delay={cueFrame(scene, 3)} height={760} glow={p.glow} from={-1} />
          <Reveal delay={cueFrame(scene, 3) + 8} y={18} style={{textAlign: "center", marginTop: -28}}>
            <div style={{fontSize: 58, fontWeight: 800, color: p.ink}}>{names[0]}</div>
            <div style={{fontSize: 26, color: p.accent, marginTop: 4, letterSpacing: 2}}>রাকিব</div>
          </Reveal>
        </div>

        {/* Suman right */}
        <div style={{position: "absolute", right: 250, bottom: 50}}>
          <Portrait who="suman" delay={cueFrame(scene, 3) + 4} height={760} glow={p.accent} from={1} />
          <Reveal delay={cueFrame(scene, 3) + 12} y={18} style={{textAlign: "center", marginTop: -28}}>
            <div style={{fontSize: 58, fontWeight: 800, color: p.ink}}>{names[1]}</div>
            <div style={{fontSize: 26, color: p.accent, marginTop: 4, letterSpacing: 2}}>সুমন</div>
          </Reveal>
        </div>

        {/* center connector */}
        <Reveal delay={cueFrame(scene, 3) + 16} y={0} blur={0}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "54%",
              transform: "translate(-50%, -50%)",
              width: 120,
              height: 120,
              borderRadius: 999,
              border: `2px solid ${p.accent}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 800,
              color: p.accent,
              background: `${p.accent}14`,
              backdropFilter: "blur(6px)",
            }}
          >
            ও
          </div>
        </Reveal>
      </div>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const P03: React.FC = () => {
  const scene = sceneById("P03");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; title: string; salary: string; salaryNote: string};
  return (
    <FilmFrame scene={scene} skyline lightSide="left">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <div style={{position: "absolute", left: 120, top: 250, width: 760, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 5) - 2}>
          {d.kicker}
        </Kicker>
        <Reveal delay={cueFrame(scene, 5)} y={30} blur={10}>
          <div style={{marginTop: 28, fontSize: 60, fontWeight: 800, lineHeight: 1.25, color: p.ink}}>
            {d.title}
          </div>
        </Reveal>
        <Reveal delay={cueFrame(scene, 5) + 10} y={18}>
          <div style={{marginTop: 26, fontSize: 32, color: "rgba(234,248,255,0.7)", lineHeight: 1.5}}>
            দুজনেই একই অফিসে চাকরি করে
          </div>
        </Reveal>
        <div style={{marginTop: 60}}>
          <Amount value={d.salary} label={d.salaryNote} delay={cueFrame(scene, 6)} color={p.accent} size={170} />
        </div>
      </div>

      {/* both characters together, smaller, right side */}
      <div style={{position: "absolute", right: 80, bottom: 50, display: "flex", alignItems: "flex-end", gap: 10}}>
        <Portrait who="rakib" delay={cueFrame(scene, 5) + 4} height={700} glow={p.glow} from={1} />
        <Portrait who="suman" delay={cueFrame(scene, 5) + 8} height={700} glow={p.accent} from={1} />
      </div>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const P04: React.FC = () => {
  const scene = sceneById("P04");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; lines: string[]; note: string};
  return (
    <FilmFrame scene={scene} skyline lightSide="right">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <div style={{position: "absolute", left: 150, top: 260, right: 150, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 7) - 2}>
          {d.kicker}
        </Kicker>
        <div style={{marginTop: 50, display: "flex", flexDirection: "column", gap: 34}}>
          {d.lines.map((line, index) => {
            const delay = cueFrame(scene, index === 2 ? 8 : 7) + (index === 0 ? 0 : index === 1 ? 10 : 0);
            const active = index === 2;
            return (
              <Reveal key={line} delay={delay} y={28} blur={8}>
                <div style={{display: "flex", alignItems: "center", gap: 26}}>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 999,
                      background: active ? p.glow : p.accent,
                      boxShadow: `0 0 24px ${active ? p.glow : p.accent}88`,
                    }}
                  />
                  <div
                    style={{
                      fontSize: active ? 88 : 76,
                      fontWeight: 800,
                      color: p.ink,
                      lineHeight: 1.1,
                    }}
                  >
                    {line}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={cueFrame(scene, 8) + 10} y={18}>
          <div
            style={{
              marginTop: 54,
              fontSize: 30,
              color: "rgba(234,248,255,0.65)",
              borderLeft: `3px solid ${p.accent}`,
              paddingLeft: 18,
              lineHeight: 1.5,
            }}
          >
            {d.note}
          </div>
        </Reveal>
      </div>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const P05: React.FC = () => {
  const scene = sceneById("P05");
  const p = paletteFor(scene);
  const d = scene.data as {year: string; kicker: string; headline: string; headline2: string};
  const frame = useCurrentFrame();
  const divider = interpolate(frame, [cueFrame(scene, 10), cueFrame(scene, 10) + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <FilmFrame scene={scene} lightSide="left">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <div style={{position: "absolute", inset: 0, ...sampleFont}}>
        <div style={{position: "absolute", left: 150, top: 230}}>
          <Kicker color={p.accent} delay={cueFrame(scene, 9) - 2}>
            {d.kicker}
          </Kicker>
          <Reveal delay={cueFrame(scene, 9)} y={60} blur={18} duration={26}>
            <div
              style={{
                marginTop: 18,
                fontSize: 240,
                fontWeight: 800,
                lineHeight: 0.9,
                color: p.ink,
                letterSpacing: -6,
              }}
            >
              {d.year}
            </div>
          </Reveal>
        </div>
        <div
          style={{
            position: "absolute",
            left: 150,
            right: 150,
            top: 560,
            height: 2,
            background: `linear-gradient(90deg, ${p.accent}00, ${p.accent}, ${p.glow}, ${p.accent}00)`,
            transform: `scaleX(${divider})`,
          }}
        />
        <div style={{position: "absolute", left: 150, right: 150, top: 610}}>
          <Reveal delay={cueFrame(scene, 10)} y={30} blur={10}>
            <div style={{fontSize: 64, fontWeight: 800, color: p.ink, lineHeight: 1.25}}>{d.headline}</div>
          </Reveal>
          <Reveal delay={cueFrame(scene, 10) + 10} y={30} blur={10}>
            <div style={{fontSize: 64, fontWeight: 800, color: p.glow, lineHeight: 1.25, marginTop: 12}}>
              {d.headline2}
            </div>
          </Reveal>
        </div>
      </div>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const P06: React.FC = () => {
  const scene = sceneById("P06");
  const p = paletteFor(scene);
  const d = scene.data as {name: string; label: string; amount: string; caption: string};
  return (
    <FilmFrame scene={scene} lightSide="right">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <div style={{position: "absolute", left: 130, top: 260, width: 820, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 11) - 4}>
          {d.label}
        </Kicker>
        <Reveal delay={cueFrame(scene, 11) - 2} y={20}>
          <div style={{marginTop: 18, fontSize: 54, fontWeight: 700, color: "rgba(244,241,232,0.82)"}}>
            {d.name}
          </div>
        </Reveal>
        <div style={{marginTop: 40}}>
          <Amount value={d.amount} label={d.caption} delay={cueFrame(scene, 11) + 2} color="#34D394" size={175} />
        </div>
      </div>
      <div style={{position: "absolute", right: 140, bottom: 50}}>
        <Portrait who="rakib" delay={cueFrame(scene, 11) - 2} height={820} glow="#34D394" from={1} />
      </div>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const P07: React.FC = () => {
  const scene = sceneById("P07");
  const p = paletteFor(scene);
  const d = scene.data as {text: string; sub: string};
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 7) * 0.015;
  return (
    <FilmFrame scene={scene}>
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", ...sampleFont}}>
        <Reveal delay={cueFrame(scene, 12)} y={40} blur={14} duration={18}>
          <div
            style={{
              fontSize: 170,
              fontWeight: 800,
              color: p.ink,
              transform: `scale(${pulse})`,
              textShadow: `0 0 90px ${p.glow}55`,
            }}
          >
            {d.text}
          </div>
        </Reveal>
        <Reveal delay={cueFrame(scene, 12) + 8} y={18}>
          <div style={{marginTop: 18, fontSize: 34, color: "rgba(244,241,232,0.55)", letterSpacing: 1}}>
            {d.sub}
          </div>
        </Reveal>
      </AbsoluteFill>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const P08: React.FC = () => {
  const scene = sceneById("P08");
  const p = paletteFor(scene);
  const d = scene.data as {name: string; label: string; amount: string; debt: string; debtLabel: string};
  return (
    <FilmFrame scene={scene} lightSide="left">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <div style={{position: "absolute", left: 140, bottom: 50}}>
        <Portrait who="suman" delay={cueFrame(scene, 13) - 2} height={820} glow={p.glow} from={-1} />
      </div>
      <div style={{position: "absolute", right: 140, top: 240, width: 780, textAlign: "right", ...sampleFont}}>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
          <Kicker color={p.glow} delay={cueFrame(scene, 13) - 2}>
            {d.label}
          </Kicker>
        </div>
        <Reveal delay={cueFrame(scene, 13)} y={20} style={{textAlign: "right"}}>
          <div style={{marginTop: 18, fontSize: 54, fontWeight: 700, color: "rgba(244,241,232,0.82)"}}>
            {d.name}
          </div>
        </Reveal>
        <div style={{marginTop: 34, display: "flex", justifyContent: "flex-end"}}>
          <Amount
            value={d.amount}
            label="ব্যাংক অ্যাকাউন্টে"
            delay={cueFrame(scene, 13) + 4}
            color={p.accent}
            size={150}
            align="center"
          />
        </div>
        <Reveal delay={cueFrame(scene, 14)} y={30} blur={10}>
          <div
            style={{
              marginTop: 46,
              marginLeft: "auto",
              width: 520,
              padding: "22px 28px",
              borderRadius: 18,
              border: `1px solid ${p.glow}66`,
              background: `linear-gradient(135deg, ${p.glow}22, rgba(10,10,18,0.5))`,
              textAlign: "left",
            }}
          >
            <div style={{fontSize: 22, letterSpacing: 2, color: p.glow, fontWeight: 700}}>মাথার ওপর ঋণ</div>
            <div style={{marginTop: 8, fontSize: 68, fontWeight: 800, color: p.glow}}>৳ {d.debt}</div>
            <div style={{marginTop: 4, fontSize: 24, color: "rgba(244,241,232,0.7)"}}>{d.debtLabel}</div>
          </div>
        </Reveal>
      </div>
      <Watermark color={p.glow} />
    </FilmFrame>
  );
};

const P09: React.FC = () => {
  const scene = sceneById("P09");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; lines: string[]; payoff: string};
  return (
    <FilmFrame scene={scene}>
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <AbsoluteFill style={{padding: "220px 150px 120px", ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 15) - 2}>
          {d.kicker}
        </Kicker>
        <div style={{marginTop: 36}}>
          <Reveal delay={cueFrame(scene, 15)} y={26} blur={8}>
            <div style={{fontSize: 66, fontWeight: 700, color: "rgba(244,241,232,0.88)", lineHeight: 1.3}}>
              {d.lines[0]}
            </div>
          </Reveal>
          <Reveal delay={cueFrame(scene, 16)} y={26} blur={8}>
            <div style={{fontSize: 66, fontWeight: 700, color: "rgba(244,241,232,0.88)", lineHeight: 1.3, marginTop: 12}}>
              {d.lines[1]}
            </div>
          </Reveal>
        </div>
        <Reveal delay={cueFrame(scene, 17)} y={40} blur={14} duration={24}>
          <div
            style={{
              marginTop: 50,
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.2,
              color: p.accent,
              textShadow: `0 0 70px ${p.accent}33`,
            }}
          >
            {d.payoff}
          </div>
        </Reveal>
        <Rule color={p.accent} delay={cueFrame(scene, 17) + 10} width={420} />
      </AbsoluteFill>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const P10: React.FC = () => {
  const scene = sceneById("P10");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; nos: string[]; answer: string; note: string};
  const frame = useCurrentFrame();
  const pulse = interpolate(frame, [cueFrame(scene, 20), cueFrame(scene, 20) + 20], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <FilmFrame scene={scene} lightSide="right">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <AbsoluteFill style={{padding: "220px 150px 120px", ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 18) - 2}>
          {d.kicker}
        </Kicker>
        <div style={{marginTop: 40, display: "flex", flexDirection: "column", gap: 22}}>
          {d.nos.map((text, index) => (
            <Reveal key={text} delay={cueFrame(scene, 18 + index)} y={24} blur={8}>
              <div style={{display: "flex", alignItems: "center", gap: 22}}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    border: "2px solid #F16B75",
                    color: "#F16B75",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: 800,
                  }}
                >
                  ✕
                </div>
                <div
                  style={{
                    fontSize: 54,
                    fontWeight: 700,
                    color: "rgba(236,255,247,0.82)",
                    textDecoration: "line-through",
                    textDecorationColor: "#F16B7588",
                  }}
                >
                  {text}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={cueFrame(scene, 20)} y={36} blur={12} duration={22}>
          <div style={{marginTop: 54, transform: `scale(${pulse})`, transformOrigin: "left center"}}>
            <div style={{fontSize: 30, letterSpacing: 3, color: p.glow, fontWeight: 700, marginBottom: 10}}>
              উত্তরটা হলো
            </div>
            <div
              style={{
                fontSize: 110,
                fontWeight: 800,
                lineHeight: 1.05,
                color: p.accent,
                textShadow: `0 0 90px ${p.accent}44`,
              }}
            >
              {d.answer}
            </div>
          </div>
        </Reveal>
        <Reveal delay={cueFrame(scene, 20) + 10} y={16}>
          <div style={{marginTop: 22, fontSize: 28, color: "rgba(236,255,247,0.58)"}}>{d.note}</div>
        </Reveal>
      </AbsoluteFill>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const P11: React.FC = () => {
  const scene = sceneById("P11");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; minutes: string; title: string; note: string; outro: string};
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const ring = spring({fps, frame: frame - cueFrame(scene, 22), config: {damping: 14, stiffness: 90}});
  return (
    <FilmFrame scene={scene}>
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", textAlign: "center", ...sampleFont}}>
        <div style={{width: 1100}}>
          <div style={{display: "flex", justifyContent: "center"}}>
            <Kicker color={p.accent} delay={cueFrame(scene, 21) - 2}>
              {d.kicker}
            </Kicker>
          </div>
          <Reveal delay={cueFrame(scene, 21)} y={30} blur={10}>
            <div style={{marginTop: 26, fontSize: 56, fontWeight: 700, color: p.ink, lineHeight: 1.3}}>
              এমন একটি অভ্যাস, যেটা আপনি আজ রাতে
            </div>
          </Reveal>
          <div style={{marginTop: 34, display: "flex", alignItems: "center", justifyContent: "center", gap: 28}}>
            <Reveal delay={cueFrame(scene, 22)} y={40} blur={14}>
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: 999,
                  border: `4px solid ${p.accent}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${0.8 + ring * 0.2})`,
                  boxShadow: `0 0 0 18px ${p.accent}18, 0 0 80px ${p.accent}33`,
                  background: `${p.accent}12`,
                }}
              >
                <span style={{fontSize: 110, fontWeight: 800, lineHeight: 1, color: p.accent}}>{d.minutes}</span>
                <span style={{fontSize: 26, fontWeight: 700, color: p.ink, letterSpacing: 2}}>মিনিট</span>
              </div>
            </Reveal>
            <Reveal delay={cueFrame(scene, 22) + 4} y={24} blur={8}>
              <div style={{textAlign: "left"}}>
                <div style={{fontSize: 72, fontWeight: 800, color: p.ink, lineHeight: 1.15}}>{d.title}</div>
                <div style={{marginTop: 14, fontSize: 34, color: p.glow, fontWeight: 700}}>{d.note}</div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={cueFrame(scene, 22) + 16} y={18}>
            <div style={{marginTop: 40, fontSize: 26, color: "rgba(236,255,247,0.55)", letterSpacing: 2}}>
              {d.outro}
            </div>
          </Reveal>
        </div>
      </AbsoluteFill>
      <Watermark color={p.accent} />
    </FilmFrame>
  );
};

const SCENE_COMPONENTS: Record<SampleScene["id"], React.FC> = {
  P01,
  P02,
  P03,
  P04,
  P05,
  P06,
  P07,
  P08,
  P09,
  P10,
  P11,
};

/* ------------------------------------------------------------------ */
/* Audio: voice + quiet score + SFX                                    */
/* ------------------------------------------------------------------ */

type Sfx = {at: number; src: string; volume: number; dur?: number};

const SFX: Sfx[] = [
  // scene whooshes / entries
  {at: 0.02, src: "sfx/whoosh.wav", volume: 0.16},
  {at: 3.38, src: "sfx/swipe.wav", volume: 0.13},
  {at: 7.14, src: "sfx/whoosh.wav", volume: 0.14},
  {at: 12.47, src: "sfx/swipe.wav", volume: 0.12},
  {at: 16.66, src: "sfx/whoosh.wav", volume: 0.15},
  {at: 23.59, src: "sfx/whoosh.wav", volume: 0.14},
  {at: 26.98, src: "sfx/riser.wav", volume: 0.1},
  {at: 28.19, src: "sfx/whoosh.wav", volume: 0.13},
  {at: 35.14, src: "sfx/swipe.wav", volume: 0.12},
  {at: 44.29, src: "sfx/whoosh.wav", volume: 0.13},
  {at: 51.96, src: "sfx/swipe.wav", volume: 0.12},
  // cue-locked beats
  {at: 0.25, src: "sfx/tick.wav", volume: 0.1},
  {at: 1.78, src: "sfx/pop.wav", volume: 0.09},
  {at: 3.63, src: "sfx/pop.wav", volume: 0.1},
  {at: 5.41, src: "sfx/tick.wav", volume: 0.09},
  {at: 7.39, src: "sfx/pop.wav", volume: 0.09},
  {at: 9.8, src: "sfx/ding.wav", volume: 0.15},
  {at: 12.72, src: "sfx/tick.wav", volume: 0.09},
  {at: 15.18, src: "sfx/pop.wav", volume: 0.09},
  {at: 16.91, src: "sfx/riser.wav", volume: 0.1},
  {at: 19.63, src: "sfx/tick.wav", volume: 0.09},
  {at: 23.84, src: "sfx/ding.wav", volume: 0.16},
  {at: 27.23, src: "sfx/pop.wav", volume: 0.1},
  {at: 28.44, src: "sfx/pop.wav", volume: 0.09},
  {at: 31.31, src: "sfx/warn.wav", volume: 0.12},
  {at: 35.39, src: "sfx/tick.wav", volume: 0.09},
  {at: 38.8, src: "sfx/tick.wav", volume: 0.09},
  {at: 40.9, src: "sfx/riser.wav", volume: 0.1},
  {at: 44.54, src: "sfx/click.wav", volume: 0.09},
  {at: 46.91, src: "sfx/click.wav", volume: 0.09},
  {at: 49.54, src: "sfx/ding.wav", volume: 0.15},
  {at: 52.21, src: "sfx/pop.wav", volume: 0.09},
  {at: 55.29, src: "sfx/ding.wav", volume: 0.14},
];

const SampleAudio: React.FC = () => (
  <>
    <Audio src={staticFile("audio/voiceover-sample.wav")} volume={1} />
    <Audio src={staticFile("audio/score-sample.wav")} volume={0.12} />
    {SFX.map((cue, index) => {
      const from = Math.round(cue.at * 30);
      return (
        <Sequence
          key={`${cue.src}-${index}`}
          from={from}
          durationInFrames={Math.max(1, SAMPLE_FRAMES - from)}
          name={`SFX ${cue.src} @${cue.at}s`}
        >
          <Audio src={staticFile(`audio/${cue.src}`)} volume={cue.volume} />
        </Sequence>
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

export const Sample60: React.FC = () => {
  const scenes = [
    sceneById("P01"),
    sceneById("P02"),
    sceneById("P03"),
    sceneById("P04"),
    sceneById("P05"),
    sceneById("P06"),
    sceneById("P07"),
    sceneById("P08"),
    sceneById("P09"),
    sceneById("P10"),
    sceneById("P11"),
  ];

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      {scenes.map((scene, index) => {
        const Comp = SCENE_COMPONENTS[scene.id];
        const fadeIn = index === 0 ? 1 : interpolate(
          0,
          [0, 0],
          [0, 0]
        );
        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
            name={`${scene.id} ${scene.kind}`}
          >
            <SceneFade index={index} duration={scene.durationInFrames}>
              <Comp />
            </SceneFade>
          </Sequence>
        );
      })}
      <SampleAudio />
      <Letterbox />
    </AbsoluteFill>
  );
};

const SceneFade: React.FC<{index: number; duration: number; children: React.ReactNode}> = ({
  index,
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = index === 0 ? 1 : interpolate(frame, [0, FADE], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const fadeOut = interpolate(frame, [duration - FADE, duration], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>{children}</AbsoluteFill>;
};

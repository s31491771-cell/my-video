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
  BarChart,
  C,
  Card,
  ChapterTag,
  Chip,
  Donut,
  FilmFrame,
  Folio,
  Highlight,
  IconBadge,
  Kicker,
  NameTag,
  PhoneMockup,
  Portrait,
  Reveal,
  RooftopScene,
  Rule,
  Timeline,
  Watermark,
  paletteFor,
  sampleFont,
} from "./film";
import {SAMPLE_FRAMES, SampleScene, cueFrame, sceneById} from "./plan";

/* ------------------------------------------------------------------ */
/* P01 — 2015, Mirpur: opening                                         */
/* ------------------------------------------------------------------ */

const P01: React.FC = () => {
  const scene = sceneById("P01");
  const p = paletteFor(scene);
  const d = scene.data as {year: string; city: string; tag: string};
  return (
    <FilmFrame scene={scene} decor="right">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <Watermark color={p.accent} />

      <div style={{position: "absolute", left: 130, top: 236, width: 840, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 1) - 4}>
          {d.tag}
        </Kicker>
        <div style={{position: "relative", marginTop: 22}}>
          <div
            style={{
              position: "absolute",
              left: -20,
              bottom: 32,
              width: 610,
              height: 148,
              borderRadius: 24,
              background: p.tint,
              transform: "rotate(-2deg)",
            }}
          />
          <Reveal delay={cueFrame(scene, 1)} y={42} duration={20}>
            <div
              style={{
                position: "relative",
                fontSize: 228,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -4,
                color: C.ink,
              }}
            >
              {d.year}
            </div>
          </Reveal>
        </div>
        <div style={{marginTop: 22}}>
          <Rule color={p.accent} delay={cueFrame(scene, 1) + 10} width={330} />
        </div>
        <Reveal delay={cueFrame(scene, 2)} y={24} duration={16}>
          <div style={{marginTop: 26, fontSize: 68, fontWeight: 800, letterSpacing: 0.5}}>{d.city}</div>
        </Reveal>
        <Reveal delay={cueFrame(scene, 2) + 8} y={14} duration={14}>
          <div style={{marginTop: 14, fontSize: 31, color: C.inkSoft, lineHeight: 1.6}}>
            দুই বন্ধুর গল্প — একই শুরু, ভিন্ন পরিণতি
          </div>
        </Reveal>
      </div>

      <Reveal delay={cueFrame(scene, 1) + 6} y={34} duration={24} style={{position: "absolute", right: 96, top: 196}}>
        <RooftopScene width={730} color={p.accent} />
      </Reveal>
      <Reveal delay={cueFrame(scene, 2) + 4} y={12} duration={12} style={{position: "absolute", right: 116, top: 812}}>
        <Chip color={p.accent}>ঢাকা · ২০১৫</Chip>
      </Reveal>
    </FilmFrame>
  );
};

/* ------------------------------------------------------------------ */
/* P02 — the two friends                                               */
/* ------------------------------------------------------------------ */

const P02: React.FC = () => {
  const scene = sceneById("P02");
  const p = paletteFor(scene);
  const d = scene.data as {names: string[]; age: string; line: string};
  return (
    <FilmFrame scene={scene} decor="quiet">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />

      <div style={{position: "absolute", left: 130, top: 176, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 3) - 4}>
          {d.line}
        </Kicker>
        <Reveal delay={cueFrame(scene, 4)} y={18} duration={14}>
          <div style={{marginTop: 18, fontSize: 46, fontWeight: 700, color: C.ink}}>বয়স {d.age}</div>
        </Reveal>
      </div>

      <div
        style={{
          position: "absolute",
          left: 168,
          bottom: 86,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...sampleFont,
        }}
      >
        <Portrait
          who="rakib"
          delay={cueFrame(scene, 3)}
          height={612}
          tint={`${C.green}2e`}
          tone={`${C.green}66`}
          from={-1}
        />
        <NameTag name={d.names[0]} role="সঞ্চয় করে" color={C.green} delay={cueFrame(scene, 3) + 8} style={{marginTop: 4}} />
      </div>

      <div
        style={{
          position: "absolute",
          right: 168,
          bottom: 86,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...sampleFont,
        }}
      >
        <Portrait
          who="suman"
          delay={cueFrame(scene, 3) + 4}
          height={612}
          tint={`${C.coral}26`}
          tone={`${C.coral}59`}
          from={1}
        />
        <NameTag name={d.names[1]} role="খরচ করে" color={C.coral} delay={cueFrame(scene, 3) + 12} style={{marginTop: 4}} />
      </div>

      <Reveal delay={cueFrame(scene, 3) + 16} y={0} duration={12}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "43%",
            transform: "translate(-50%, -50%)",
            width: 124,
            height: 124,
            borderRadius: 999,
            background: C.card,
            border: `3px solid ${C.ink}`,
            boxShadow: "0 14px 26px rgba(16,40,72,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 46,
            fontWeight: 800,
            color: C.ink,
            ...sampleFont,
          }}
        >
          ও
        </div>
      </Reveal>
    </FilmFrame>
  );
};

/* ------------------------------------------------------------------ */
/* P03 — same office, same salary                                      */
/* ------------------------------------------------------------------ */

const P03: React.FC = () => {
  const scene = sceneById("P03");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; title: string; salary: string; salaryNote: string};
  return (
    <FilmFrame scene={scene} decor="left">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />

      <div style={{position: "absolute", left: 130, top: 206, width: 690, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 5) - 4}>
          {d.kicker}
        </Kicker>
        <Reveal delay={cueFrame(scene, 5)} y={26} duration={16}>
          <div style={{marginTop: 22, fontSize: 58, fontWeight: 800, lineHeight: 1.32}}>{d.title}</div>
        </Reveal>

        <Reveal delay={cueFrame(scene, 6) - 4} y={26} duration={18}>
          <Card accent={C.green} style={{width: 620, marginTop: 40}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <span style={{fontSize: 23, fontWeight: 700, color: C.inkSoft}}>একই অফিস · একই পদ</span>
              <Chip color={C.green}>দুজনেই</Chip>
            </div>
            <div style={{marginTop: 8}}>
              <Amount
                value={d.salary}
                label={d.salaryNote}
                delay={cueFrame(scene, 6) + 2}
                color={C.green}
                size={132}
              />
            </div>
          </Card>
        </Reveal>
      </div>

      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 76,
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
        }}
      >
        <Portrait who="rakib" delay={cueFrame(scene, 5) + 2} height={636} tint={`${C.green}26`} from={1} />
        <Portrait
          who="suman"
          delay={cueFrame(scene, 5) + 6}
          height={636}
          tint={`${C.blue}22`}
          from={1}
          style={{marginLeft: -18}}
        />
      </div>
    </FilmFrame>
  );
};

/* ------------------------------------------------------------------ */
/* P04 — same life                                                     */
/* ------------------------------------------------------------------ */

const P04: React.FC = () => {
  const scene = sceneById("P04");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; lines: string[]; note: string};
  const rows = [
    {name: d.lines[0], icon: "city" as const, color: C.blue},
    {name: d.lines[1], icon: "money" as const, color: C.green},
    {name: d.lines[2], icon: "cart" as const, color: C.coral},
  ];
  const delays = [cueFrame(scene, 7), cueFrame(scene, 7) + 10, cueFrame(scene, 8)];
  return (
    <FilmFrame scene={scene} decor="right">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <Watermark color={p.accent} />

      <div style={{position: "absolute", left: 130, top: 186, width: 1020, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 7) - 4}>
          {d.kicker}
        </Kicker>
        <div style={{marginTop: 34, display: "flex", flexDirection: "column", gap: 20}}>
          {rows.map((row, index) => {
            const active = index === 2;
            return (
              <Reveal key={row.name} delay={delays[index]} y={22} duration={14}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: "20px 30px",
                    background: C.card,
                    border: `1.5px solid ${active ? `${p.accent}80` : C.line}`,
                    borderLeft: `8px solid ${row.color}`,
                    borderRadius: 20,
                    boxShadow: "0 12px 26px rgba(16,40,72,0.06)",
                  }}
                >
                  <IconBadge name={row.icon} color={row.color} size={62} />
                  <div style={{fontSize: 50, fontWeight: 800, color: C.ink}}>{row.name}</div>
                  {active ? (
                    <div style={{marginLeft: "auto"}}>
                      <Chip color={p.accent}>হুবহু এক</Chip>
                    </div>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={cueFrame(scene, 8) + 12} y={14} duration={14}>
          <div style={{marginTop: 26, fontSize: 28, color: C.inkSoft, lineHeight: 1.55}}>{d.note}</div>
        </Reveal>
      </div>

      <Reveal delay={cueFrame(scene, 7) + 6} y={30} duration={18} style={{position: "absolute", right: 110, top: 300}}>
        <Card accent={C.ink} style={{width: 620}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{fontSize: 30, fontWeight: 800, color: C.ink}}>শুরুটা হুবহু এক</div>
            <Chip color={C.ink}>২০১৫</Chip>
          </div>
          <div style={{marginTop: 24}}>
            <BarChart
              items={[
                {label: "রাকিব", value: 30000, display: "৳৩০,০০০", color: C.green},
                {label: "সুমন", value: 30000, display: "৳৩০,০০০", color: C.blue},
              ]}
              max={30000}
              height={240}
              delay={cueFrame(scene, 7) + 18}
              barWidth={108}
            />
          </div>
          <div
            style={{
              marginTop: 12,
              paddingTop: 16,
              borderTop: `1.5px dashed ${C.line}`,
              fontSize: 24,
              color: C.inkSoft,
              textAlign: "center",
            }}
          >
            একই বেতন, একই জীবনযাত্রা
          </div>
        </Card>
      </Reveal>
    </FilmFrame>
  );
};

/* ------------------------------------------------------------------ */
/* P05 — ten years later                                               */
/* ------------------------------------------------------------------ */

const P05: React.FC = () => {
  const scene = sceneById("P05");
  const p = paletteFor(scene);
  const d = scene.data as {year: string; kicker: string; headline: string; headline2: string};
  return (
    <FilmFrame scene={scene} decor="quiet">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <Watermark color={p.accent} />

      <div style={{position: "absolute", left: 130, top: 198, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 9) - 4}>
          {d.kicker}
        </Kicker>
        <div style={{position: "relative", marginTop: 18}}>
          <div
            style={{
              position: "absolute",
              left: -24,
              bottom: 32,
              width: 566,
              height: 150,
              borderRadius: 26,
              background: C.sand,
              transform: "rotate(-3deg)",
            }}
          />
          <Reveal delay={cueFrame(scene, 9)} y={46} duration={20}>
            <div
              style={{
                position: "relative",
                fontSize: 232,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -5,
                color: C.ink,
              }}
            >
              {d.year}
            </div>
          </Reveal>
        </div>
      </div>

      <div style={{position: "absolute", left: 930, top: 300, width: 860, ...sampleFont}}>
        <Reveal delay={cueFrame(scene, 9)} y={24} duration={16}>
          <div style={{fontSize: 62, fontWeight: 800, color: C.ink, lineHeight: 1.3}}>{d.headline}</div>
        </Reveal>
        <Reveal delay={cueFrame(scene, 10)} y={30} duration={16}>
          <div style={{fontSize: 64, fontWeight: 800, color: p.accent2, lineHeight: 1.3, marginTop: 18}}>
            {d.headline2}
          </div>
        </Reveal>
      </div>

      <div style={{position: "absolute", left: 130, top: 790, ...sampleFont}}>
        <Timeline from="২০১৫ · শুরু" to="২০২৫ · এখন" color={p.accent} delay={cueFrame(scene, 10) + 6} width={1660} />
      </div>
    </FilmFrame>
  );
};

/* ------------------------------------------------------------------ */
/* P06 — Rakib's account                                               */
/* ------------------------------------------------------------------ */

const P06: React.FC = () => {
  const scene = sceneById("P06");
  const p = paletteFor(scene);
  const d = scene.data as {name: string; label: string; amount: string; caption: string};
  return (
    <FilmFrame scene={scene} decor="right">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />

      <div style={{position: "absolute", left: 140, top: 236, width: 820, ...sampleFont}}>
        <Kicker color={C.green} delay={cueFrame(scene, 11) - 4}>
          {d.label}
        </Kicker>
        <div style={{marginTop: 18}}>
          <Amount
            value={d.amount}
            label={d.caption}
            delay={cueFrame(scene, 11)}
            color={C.green}
            size={140}
          />
        </div>
        <Reveal delay={cueFrame(scene, 11) + 10} y={14} duration={12}>
          <Chip color={C.green} style={{marginTop: 30}}>
            দশ বছরের ধৈর্য
          </Chip>
        </Reveal>
      </div>

      <div style={{position: "absolute", right: 130, bottom: 74}}>
        <Portrait
          who="rakib"
          delay={cueFrame(scene, 11) - 4}
          height={790}
          tint={`${C.green}2b`}
          tone={`${C.green}66`}
          from={1}
        />
      </div>
    </FilmFrame>
  );
};

/* ------------------------------------------------------------------ */
/* P07 — "and Suman?"                                                  */
/* ------------------------------------------------------------------ */

const P07: React.FC = () => {
  const scene = sceneById("P07");
  const p = paletteFor(scene);
  const d = scene.data as {text: string; sub: string};
  const text = d.text.replace("?", "");
  return (
    <FilmFrame scene={scene} decor="quiet">
      <ChapterTag scene={scene} color={p.accent} />
      <AdaptiveCenter>
        <div style={{position: "relative", textAlign: "center", ...sampleFont}}>
          <div
            style={{
              position: "absolute",
              left: -90,
              top: -54,
              width: 800,
              height: 320,
              borderRadius: 40,
              background: C.sand,
              transform: "rotate(-3deg)",
            }}
          />
          <Reveal delay={5} y={30} duration={14}>
            <div style={{position: "relative", fontSize: 196, fontWeight: 800, color: C.ink, lineHeight: 1.1}}>
              {text}
              <span style={{color: C.coral}}>?</span>
            </div>
          </Reveal>
          <Reveal delay={16} y={16} duration={14}>
            <div style={{marginTop: 6, fontSize: 38, color: C.inkSoft, fontWeight: 600}}>{d.sub}</div>
          </Reveal>
        </div>
      </AdaptiveCenter>
    </FilmFrame>
  );
};

const AdaptiveCenter: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>{children}</AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* P08 — Suman's account + debt                                        */
/* ------------------------------------------------------------------ */

const P08: React.FC = () => {
  const scene = sceneById("P08");
  const p = paletteFor(scene);
  const d = scene.data as {name: string; label: string; amount: string; debt: string; debtLabel: string};
  return (
    <FilmFrame scene={scene} decor="left">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <Watermark color={p.accent} />

      <div style={{position: "absolute", left: 116, bottom: 82}}>
        <Portrait
          who="suman"
          delay={cueFrame(scene, 13) - 4}
          height={766}
          tint={`${C.coral}24`}
          tone={`${C.coral}59`}
          from={-1}
        />
      </div>

      <div style={{position: "absolute", right: 104, top: 196, width: 830, ...sampleFont}}>
        <Kicker color={C.coral} delay={cueFrame(scene, 13) - 4}>
          {d.label}
        </Kicker>
        <Reveal delay={cueFrame(scene, 13)} y={14} duration={12}>
          <div style={{marginTop: 10, fontSize: 45, fontWeight: 700, color: C.ink}}>{d.name}</div>
        </Reveal>

        <Reveal delay={cueFrame(scene, 13) + 2} y={26} duration={16}>
          <Card accent={C.blue} style={{width: 800, marginTop: 22}}>
            <Amount
              value={d.amount}
              label="ব্যাংক অ্যাকাউন্টে"
              delay={cueFrame(scene, 13) + 6}
              color={C.blue}
              size={124}
            />
          </Card>
        </Reveal>

        <Reveal delay={cueFrame(scene, 14)} y={30} duration={16}>
          <Card filled style={{width: 800, marginTop: 22, padding: "26px 34px"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <div>
                <div style={{fontSize: 22, color: "rgba(255,255,255,0.62)", fontWeight: 600}}>মাথার ওপর ঋণ</div>
                <div style={{marginTop: 4, fontSize: 72, fontWeight: 800, color: C.coral, lineHeight: 1.1}}>
                  ৳ {d.debt}
                </div>
                <div style={{marginTop: 2, fontSize: 21, color: "rgba(255,255,255,0.5)"}}>{d.debtLabel}</div>
              </div>
              <IconBadge name="warn" color={C.coral} filled size={66} />
            </div>
          </Card>
        </Reveal>
      </div>
    </FilmFrame>
  );
};

/* ------------------------------------------------------------------ */
/* P09 — the question + gap chart                                      */
/* ------------------------------------------------------------------ */

const P09: React.FC = () => {
  const scene = sceneById("P09");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; lines: string[]; payoff: string};
  return (
    <FilmFrame scene={scene} decor="quiet">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <Watermark color={p.accent} />

      <div style={{position: "absolute", left: 130, top: 186, width: 880, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 15) - 4}>
          {d.kicker}
        </Kicker>
        <div style={{marginTop: 30}}>
          <Reveal delay={cueFrame(scene, 15)} y={22} duration={14}>
            <div style={{fontSize: 58, fontWeight: 700, color: C.ink, lineHeight: 1.35}}>{d.lines[0]}</div>
          </Reveal>
          <Reveal delay={cueFrame(scene, 16)} y={22} duration={14}>
            <div style={{fontSize: 58, fontWeight: 700, color: C.ink, lineHeight: 1.35, marginTop: 6}}>
              {d.lines[1]}
            </div>
          </Reveal>
        </div>
        <Reveal delay={cueFrame(scene, 17)} y={34} duration={18}>
          <div style={{marginTop: 40, fontSize: 74, fontWeight: 800, lineHeight: 1.3, color: C.ink}}>
            তাহলে{" "}
            <Highlight color={C.coral}>
              <span style={{color: C.coral}}>১৩ লাখ টাকার</span>
            </Highlight>{" "}
            পার্থক্যটা কোথা থেকে এলো?
          </div>
        </Reveal>
      </div>

      <Reveal delay={cueFrame(scene, 16)} y={30} duration={18} style={{position: "absolute", right: 104, top: 224}}>
        <Card accent={C.coral} style={{width: 700}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <span style={{fontSize: 26, fontWeight: 800, color: C.ink}}>দশ বছরে জমা</span>
            <Chip color={C.coral}>পার্থক্য</Chip>
          </div>
          <div style={{marginTop: 22}}>
            <BarChart
              items={[
                {label: "রাকিব", value: 1400000, display: "৳১৪,০০,০০০", color: C.green},
                {label: "সুমন", value: 80000, display: "৳৮০,০০০", color: C.coral},
              ]}
              max={1400000}
              height={310}
              delay={cueFrame(scene, 16) + 6}
              barWidth={124}
            />
          </div>
          <div
            style={{
              marginTop: 18,
              padding: "14px 20px",
              borderRadius: 14,
              background: `${C.coral}12`,
              border: `1.5px dashed ${C.coral}66`,
              fontSize: 24,
              fontWeight: 700,
              color: C.ink,
              textAlign: "center",
            }}
          >
            তফাত — ১৩ লাখ টাকারও বেশি
          </div>
        </Card>
      </Reveal>
    </FilmFrame>
  );
};

/* ------------------------------------------------------------------ */
/* P10 — the answer + phone                                            */
/* ------------------------------------------------------------------ */

const P10: React.FC = () => {
  const scene = sceneById("P10");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; nos: string[]; answer: string; note: string};
  return (
    <FilmFrame scene={scene} decor="right">
      <ChapterTag scene={scene} color={p.accent} />
      <Folio color={p.accent} />
      <Watermark color={p.accent} />

      <div style={{position: "absolute", left: 130, top: 178, width: 900, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 18) - 4}>
          {d.kicker}
        </Kicker>
        <div style={{marginTop: 28, display: "flex", flexDirection: "column", gap: 16}}>
          {d.nos.map((text, index) => (
            <Reveal key={text} delay={cueFrame(scene, 18 + index)} y={20} duration={13}>
              <div style={{display: "flex", alignItems: "center", gap: 18}}>
                <IconBadge name="cross" color={C.coral} size={48} />
                <div
                  style={{
                    fontSize: 50,
                    fontWeight: 700,
                    color: C.inkSoft,
                    textDecoration: "line-through",
                    textDecorationColor: `${C.coral}99`,
                    textDecorationThickness: 3,
                  }}
                >
                  {text}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={cueFrame(scene, 20)} y={30} duration={18}>
          <Card accent={C.green} style={{width: 880, marginTop: 34, background: "#F2F8EC"}}>
            <div style={{fontSize: 25, fontWeight: 700, color: C.inkSoft}}>উত্তরটা হলো</div>
            <div style={{marginTop: 6, fontSize: 84, fontWeight: 800, lineHeight: 1.16, color: C.ink}}>
              একটি মাত্র <Highlight color={C.green}>অভ্যাস</Highlight>
            </div>
            <div style={{marginTop: 10, fontSize: 26, color: C.inkSoft, lineHeight: 1.5}}>{d.note}</div>
          </Card>
        </Reveal>
      </div>

      <div style={{position: "absolute", right: 128, top: 150}}>
        <PhoneMockup width={366} delay={cueFrame(scene, 18) - 4} accent={C.green} />
      </div>
      <Reveal
        delay={cueFrame(scene, 19) + 6}
        y={10}
        duration={12}
        style={{position: "absolute", right: 520, top: 300}}
      >
        <div style={{transform: "rotate(-6deg)"}}>
          <Chip color={C.green}>অটো-সেভ চালু</Chip>
        </div>
      </Reveal>
    </FilmFrame>
  );
};

/* ------------------------------------------------------------------ */
/* P11 — ten minutes + closing card                                    */
/* ------------------------------------------------------------------ */

const P11: React.FC = () => {
  const scene = sceneById("P11");
  const p = paletteFor(scene);
  const d = scene.data as {kicker: string; minutes: string; title: string; note: string; outro: string};
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const ring = spring({
    fps,
    frame: frame - cueFrame(scene, 22),
    config: {damping: 18, stiffness: 70, mass: 0.9},
  });
  return (
    <FilmFrame scene={scene} decor="left">
      <ChapterTag scene={scene} color={p.accent} />

      <div style={{position: "absolute", left: 130, top: 186, width: 960, ...sampleFont}}>
        <Kicker color={p.accent} delay={cueFrame(scene, 21) - 4}>
          {d.kicker}
        </Kicker>
        <Reveal delay={cueFrame(scene, 21)} y={26} duration={16}>
          <div style={{marginTop: 20, fontSize: 56, fontWeight: 700, lineHeight: 1.4, color: C.ink}}>
            এমন একটি অভ্যাস, যেটা আপনি আজ রাতে
          </div>
        </Reveal>

        <div style={{marginTop: 26, display: "flex", alignItems: "center", gap: 42}}>
          <Reveal delay={cueFrame(scene, 22)} y={26} duration={16}>
            <Donut size={244} stroke={26} progress={ring} color={C.green}>
              <div style={{fontSize: 96, fontWeight: 800, color: C.ink, lineHeight: 1}}>{d.minutes}</div>
              <div style={{fontSize: 25, fontWeight: 700, color: C.inkSoft, marginTop: 4}}>মিনিট</div>
            </Donut>
          </Reveal>
          <Reveal delay={cueFrame(scene, 22) + 6} y={22} duration={14}>
            <div style={{maxWidth: 664}}>
              <div style={{fontSize: 60, fontWeight: 800, lineHeight: 1.28, color: C.ink}}>{d.title}</div>
              <div style={{marginTop: 14, fontSize: 32, fontWeight: 700, color: p.accent}}>{d.note}</div>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal
        delay={cueFrame(scene, 22) + 16}
        y={26}
        duration={16}
        style={{position: "absolute", left: 130, top: 862}}
      >
        <div
          style={{
            width: 1660,
            height: 138,
            borderRadius: 30,
            background: C.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 46px",
            boxShadow: "0 26px 50px rgba(16,40,72,0.28)",
            ...sampleFont,
          }}
        >
          <div>
            <div style={{fontSize: 36, fontWeight: 800, color: C.paper, letterSpacing: 5}}>PAY YOURSELF FIRST</div>
            <div style={{fontSize: 20, color: "rgba(247,244,236,0.6)", letterSpacing: 1, marginTop: 6}}>
              একটি বাংলা ফাইন্যান্স ডকুমেন্টারি
            </div>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 20}}>
            <span style={{fontSize: 24, color: C.paper, fontWeight: 600}}>{d.outro}</span>
            <span
              style={{
                width: 46,
                height: 46,
                borderRadius: 99,
                background: C.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: C.ink,
                fontWeight: 800,
              }}
            >
              →
            </span>
          </div>
        </div>
      </Reveal>
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
/* Timeline — hard cuts, like the reference edit                       */
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
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      {scenes.map((scene, index) => {
        const Comp = SCENE_COMPONENTS[scene.id];
        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationInFrames}
            name={`${scene.id} ${scene.kind}`}
          >
            <SceneCut index={index}>
              <Comp />
            </SceneCut>
          </Sequence>
        );
      })}
      <SampleAudio />
    </AbsoluteFill>
  );
};

/* Hard cut. Only the very first frame of the film fades up from paper. */
const SceneCut: React.FC<{index: number; children: React.ReactNode}> = ({index, children}) => {
  const frame = useCurrentFrame();
  const fadeIn =
    index === 0
      ? interpolate(frame, [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  return <AbsoluteFill style={{opacity: fadeIn}}>{children}</AbsoluteFill>;
};

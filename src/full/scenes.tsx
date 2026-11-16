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
import {DURATION_IN_FRAMES, FPS, SFX_CUES} from "../timing";
import {StoryScene} from "../story";
import {SCENES} from "../story";
import {
  C,
  Card,
  Chip,
  Donut,
  Glyph,
  IconBadge,
  Kicker,
  NameTag,
  Portrait,
  Reveal,
  RooftopScene,
  Rule,
  sampleFont,
} from "../sample/film";
import {
  AutomationArt,
  Body,
  BrainArt,
  CalendarArt,
  EngineArt,
  FuelArt,
  FullFrame,
  GrowthCurve,
  Headline,
  PhonePanel,
  Stage,
  Taka,
  beatOf,
  beatOr,
  cueOf,
  headlineSize,
  paletteForAccent,
  textBlockHeight,
} from "./film";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Data = any;

const who = (name: string): "rakib" | "suman" => (name.includes("রাকিব") ? "rakib" : "suman");
const tintFor = (name: string): string => (who(name) === "rakib" ? `${C.green}2b` : `${C.coral}26`);
const toneFor = (name: string): string => (who(name) === "rakib" ? `${C.green}70` : `${C.coral}70`);
const inkFor = (name: string): string => (who(name) === "rakib" ? C.green : C.coral);
const bengali = (value: number | string): string =>
  String(value).replace(/[0-9]/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);

/**
 * Delay for the n-th item of a list that starts revealing at cue `startIndex`.
 * When a scene has fewer cues than items, extras stagger 10 frames (~0.33 s)
 * after the last cue instead of all popping on the same frame.
 */
const itemCue = (scene: StoryScene, index: number, startIndex = 0): number => {
  const last = scene.cueIds.length - 1;
  const target = startIndex + index;
  const overflow = Math.max(0, target - last);
  return cueOf(scene, Math.min(target, last)) + overflow * 10;
};

/** Cue for the n-th item of a list, using the explicit story beats when set. */
const itemBeat = (scene: StoryScene, key: string, index: number, startIndex = 0): number => {
  const beats = (scene.data as Data)?.beats ?? {};
  return beats[`${key}${index}`] ? beatOf(scene, `${key}${index}`) : itemCue(scene, index, startIndex);
};

/* ------------------------------------------------------------------ */
/* 1. Opening                                                          */
/* ------------------------------------------------------------------ */

const Opening: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  return (
    <FullFrame scene={scene}>
      <Stage left={130} top={190} width={930}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>একটি সত্যি গল্পের শুরু</Kicker>
        </Reveal>
        <div style={{position: "relative", marginTop: 16}}>
          <div
            style={{
              position: "absolute",
              left: -18,
              bottom: 28,
              width: 620,
              height: 146,
              borderRadius: 24,
              background: p.tint,
              transform: "rotate(-2deg)",
            }}
          />
          <Reveal delay={beatOf(scene, "year", 0)} y={42} duration={20}>
            <div style={{position: "relative", fontSize: 206, fontWeight: 800, lineHeight: 1, letterSpacing: -4, color: C.ink}}>
              {d.year}
            </div>
          </Reveal>
        </div>
        <Rule color={p.accent} delay={beatOf(scene, "year", 0) + 10} width={330} />
        <Reveal delay={beatOf(scene, "city", 1)} y={24} duration={16}>
          <div style={{marginTop: 18, fontSize: 62, fontWeight: 800, color: C.ink}}>{d.city}</div>
        </Reveal>
        <Reveal delay={beatOf(scene, "names", 2)} y={24} duration={16}>
          <div style={{marginTop: 26, display: "flex", gap: 34, alignItems: "flex-end"}}>
            {[d.names[0], d.names[1]].map((name: string, index: number) => (
              <div key={name} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Portrait
                  who={who(name)}
                  delay={beatOf(scene, "names", 2) + index * 5}
                  height={252}
                  tint={tintFor(name)}
                  tone={toneFor(name)}
                  from={index === 0 ? -1 : 1}
                />
                <NameTag
                  name={name}
                  role={index === 0 ? "সঞ্চয় করে" : "খরচ করে"}
                  color={inkFor(name)}
                  delay={beatOf(scene, "names", 2) + 8 + index * 5}
                  style={{marginTop: 2}}
                />
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={beatOf(scene, "age", 3)} y={12} duration={12}>
          <Chip color={p.accent} style={{marginTop: 20}}>
            বয়স {d.age} · একই অফিস
          </Chip>
        </Reveal>
      </Stage>

      <Reveal delay={beatOf(scene, "year", 0) + 6} y={30} duration={22} style={{position: "absolute", right: 66, top: 196}}>
        <RooftopScene width={640} color={p.accent} />
      </Reveal>
      <Reveal delay={beatOf(scene, "names", 2) + 8} y={10} duration={12} style={{position: "absolute", right: 150, top: 760}}>
        <Chip color={p.accent}>ঢাকা · {d.year}</Chip>
      </Reveal>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Statement                                                        */
/* ------------------------------------------------------------------ */

const StatementSide: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const key = `${d.kicker ?? ""} ${d.headline ?? ""} ${d.big ?? ""}`;
  const cue = beatOf(scene, "side", 1);
  const cardStyle: React.CSSProperties = {width: 620, padding: "30px 34px"};

  if (d.big && d.big.startsWith("৳")) {
    return (
      <Stage left={1220} top={310} width={640}>
        <Reveal delay={cue} y={34} duration={18}>
          <Card accent={p.accent} style={cardStyle}>
            <div style={{fontSize: 24, fontWeight: 700, color: C.inkSoft}}>{d.bigLabel ?? "মূল সংখ্যা"}</div>
            <div style={{marginTop: 14}}>
              <Taka value={d.big} size={76} color={p.accent} />
            </div>
            <div style={{marginTop: 18, height: 8, borderRadius: 99, background: `${p.accent}44`, width: "72%"}} />
            <div style={{marginTop: 14, fontSize: 23, color: C.inkSoft, lineHeight: 1.5}}>{d.sub ?? ""}</div>
          </Card>
        </Reveal>
      </Stage>
    );
  }

  if (/মিনিট/.test(key)) {
    return (
      <Stage left={1220} top={300} width={640}>
        <Reveal delay={cue} y={34} duration={18}>
          <Card accent={p.accent} style={{...cardStyle, display: "flex", alignItems: "center", gap: 30}}>
            <Donut size={230} stroke={24} progress={1} color={p.accent}>
              <div style={{fontSize: 84, fontWeight: 800, color: C.ink, lineHeight: 1}}>১০</div>
              <div style={{fontSize: 22, fontWeight: 700, color: C.inkSoft}}>মিনিট</div>
            </Donut>
            <div style={{flex: 1}}>
              <div style={{fontSize: 30, fontWeight: 800, color: C.ink, lineHeight: 1.35}}>
                {d.sideNote ?? "আজ রাতেই"}
              </div>
              <div style={{marginTop: 8, fontSize: 22, color: C.inkSoft, lineHeight: 1.5}}>
                {d.sideNote ? "আপনার জীবনযাত্রায় বদল আসবে" : "কাল নয়, পরের মাসে নয়"}
              </div>
            </div>
          </Card>
        </Reveal>
      </Stage>
    );
  }

  if (/শূন্য/.test(key)) {
    return (
      <Stage left={1260} top={290} width={560}>
        <Reveal delay={cue} y={34} duration={18}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Donut size={330} stroke={30} progress={1} color={C.coral}>
              <div style={{fontSize: 132, fontWeight: 800, color: C.ink, lineHeight: 1}}>০</div>
              <div style={{fontSize: 24, fontWeight: 700, color: C.inkSoft}}>সঞ্চয়</div>
            </Donut>
            <Chip color={C.coral} style={{marginTop: 24}}>
              {d.sideNote ?? "১২ মাসে শূন্য"}
            </Chip>
          </div>
        </Reveal>
      </Stage>
    );
  }

  if (/অটোমেশন|অটোমেটিক/.test(key)) {
    return (
      <Stage left={1250} top={330} width={570}>
        <Reveal delay={cue} y={34} duration={18}>
          <Card accent={p.accent} style={{...cardStyle, width: 560, display: "flex", alignItems: "center", gap: 26}}>
            <AutomationArt width={220} color={p.accent} />
            <div>
              <div style={{fontSize: 30, fontWeight: 800, color: C.ink, lineHeight: 1.35}}>অটোমেশন</div>
              <div style={{marginTop: 8, fontSize: 22, color: C.inkSoft, lineHeight: 1.5}}>ইচ্ছাশক্তি নয়</div>
            </div>
          </Card>
        </Reveal>
      </Stage>
    );
  }

  if (/পরের মাস|অপেক্ষা|ক্যালেন্ডার/.test(key)) {
    return (
      <Stage left={1260} top={300} width={560}>
        <Reveal delay={cue} y={34} duration={18}>
          <Card accent={p.accent} style={{...cardStyle, width: 540, display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
            <CalendarArt width={250} color={p.accent} />
            <div style={{fontSize: 26, fontWeight: 800, color: C.ink}}>সেই পরের মাস</div>
            <div style={{fontSize: 22, color: C.inkSoft}}>কখনো আসে না</div>
          </Card>
        </Reveal>
      </Stage>
    );
  }

  if (/সিস্টেম|ভুল|কঠিন/.test(key)) {
    const word = /সিস্টেম/.test(key) ? "সিস্টেম" : /ভুল/.test(key) ? "ভুল" : "কঠিন";
    return (
      <Stage left={1230} top={300} width={630}>
        <Reveal delay={cue} y={34} duration={18}>
          <Card filled style={{...cardStyle, width: 620}}>
            <div style={{fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 1}}>মনে রাখুন</div>
            <div style={{marginTop: 10, fontSize: 88, fontWeight: 800, color: p.accent, lineHeight: 1.15}}>{word}</div>
            <div style={{marginTop: 26, display: "flex", alignItems: "center", gap: 14}}>
              <span style={{width: 54, height: 5, borderRadius: 99, background: p.accent}} />
              <span style={{width: 18, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.28)"}} />
              <span style={{width: 9, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.18)"}} />
            </div>
          </Card>
        </Reveal>
      </Stage>
    );
  }

  if (/৬০ সেকেন্ড|প্রমাণ/.test(key)) {
    return (
      <Stage left={1240} top={310} width={620}>
        <Reveal delay={cue} y={34} duration={18}>
          <Card accent={p.accent} style={{...cardStyle, display: "flex", alignItems: "center", gap: 28}}>
            <div style={{fontSize: 112, fontWeight: 800, color: p.accent, lineHeight: 1}}>৬০</div>
            <div>
              <div style={{fontSize: 30, fontWeight: 800, color: C.ink}}>সেকেন্ড</div>
              <div style={{marginTop: 6, fontSize: 22, color: C.inkSoft, lineHeight: 1.5}}>পুরো হিসাবটা দেখুন</div>
            </div>
          </Card>
        </Reveal>
      </Stage>
    );
  }

  if (d.big) {
    return (
      <Stage left={1220} top={310} width={640}>
        <Reveal delay={cue} y={34} duration={18}>
          <Card accent={p.accent} style={{...cardStyle, background: "#FBF7EC"}}>
            <div style={{fontSize: 20, fontWeight: 700, color: C.inkSoft, letterSpacing: 1}}>{d.bigLabel ?? ""}</div>
            <div style={{marginTop: 12, fontSize: d.big.length > 18 ? 44 : 62, fontWeight: 800, color: p.accent, lineHeight: 1.3}}>
              {d.big}
            </div>
            <div style={{marginTop: 16, height: 8, borderRadius: 99, background: `${p.accent}44`, width: "64%"}} />
          </Card>
        </Reveal>
      </Stage>
    );
  }

  return (
    <Stage left={1250} top={330} width={600}>
      <Reveal delay={cue} y={34} duration={18}>
        <Card accent={p.accent} style={{...cardStyle, width: 570, display: "flex", flexDirection: "column", gap: 24}}>
          <div style={{display: "flex", alignItems: "center", gap: 18}}>
            <IconBadge name="spark" color={p.accent} size={66} />
            <div style={{flex: 1}}>
              <div style={{height: 12, width: "76%", borderRadius: 99, background: `${C.ink}1f`}} />
              <div style={{marginTop: 12, height: 12, width: "52%", borderRadius: 99, background: `${C.ink}14`}} />
            </div>
          </div>
          <div style={{height: 9, width: 168, borderRadius: 99, background: p.accent}} />
          <div style={{display: "flex", flexDirection: "column", gap: 13}}>
            {["88%", "70%", "79%"].map((width, index) => (
              <div
                key={width}
                style={{
                  height: 9,
                  width,
                  borderRadius: 99,
                  background: `rgba(16,40,72,${0.12 - index * 0.02})`,
                }}
              />
            ))}
          </div>
        </Card>
      </Reveal>
    </Stage>
  );
};

const Statement: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const dark = d.tone === "dark";
  const size = headlineSize(d.headline ?? "", 1000, 72, 44, 2);
  const hasCharacter = Boolean(d.character);
  const both = d.character === "both";
  const bigIsMoney = typeof d.big === "string" && d.big.startsWith("৳");

  // The headline keeps its slot reserved even when it is spoken later, so the
  // lines underneath never jump.
  const headlineReserve = textBlockHeight(d.headline ?? "", size, 1000, 800, 1.32) + 18;

  // Every supporting line is bound to the cue that speaks it and the list is
  // ordered by that cue, so the screen follows the sentence in the air.
  const secondary = [
    {key: "sub", kind: "text", text: d.sub as string | undefined, size: 31, width: 940},
    {key: "foot", kind: "text", text: d.foot as string | undefined, size: 29, width: 940},
    {key: "note", kind: "text", text: d.note as string | undefined, size: 27, width: 940},
    ...(d.big && hasCharacter
      ? [{key: "big", kind: "big", text: d.big as string, size: 82, width: 700}]
      : []),
  ]
    .filter((item) => Boolean(item.text))
    .map((item) => ({
      ...item,
      frame:
        item.kind === "big"
          ? beatOf(scene, "big", 1) + 4
          : beatOf(scene, item.key, 1),
      reserve:
        item.kind === "big"
          ? (bigIsMoney ? 108 : 96) + 28
          : textBlockHeight(item.text as string, item.size, item.width, 600, 1.55) + 22,
    }))
    .sort((a, b) => a.frame - b.frame);

  const secondaryReserve = secondary.reduce((sum, item) => sum + item.reserve, 0);

  return (
    <FullFrame scene={scene}>
      <Stage left={120} top={168} width={1010}>
        <Reveal delay={beatOf(scene, "kicker", 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <div style={{minHeight: headlineReserve}}>
          <Reveal delay={beatOf(scene, "headline", 0)} y={30} duration={16}>
            <Headline text={d.headline ?? ""} size={size} style={{marginTop: 18, maxWidth: 1000}} />
          </Reveal>
        </div>
        {dark ? (
          <Reveal delay={beatOf(scene, "headline", 0) + 8} y={8} duration={12}>
            <div style={{marginTop: 14, width: 170, height: 9, borderRadius: 99, background: p.accent}} />
          </Reveal>
        ) : null}
        <div style={{minHeight: secondaryReserve}}>
          {secondary.map((item) =>
            item.kind === "big" ? (
              <Reveal key={item.key} delay={item.frame} y={26} duration={16}>
                <div style={{marginTop: 28}}>
                  {bigIsMoney ? (
                    <Taka value={item.text as string} size={82} color={p.accent} />
                  ) : (
                    <div style={{display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap"}}>
                      <div
                        style={{
                          fontSize: (item.text as string).length > 20 ? 44 : (item.text as string).length > 12 ? 54 : 70,
                          fontWeight: 800,
                          color: p.accent,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.text}
                      </div>
                      {d.bigLabel ? <div style={{fontSize: 24, fontWeight: 700, color: C.inkSoft}}>{d.bigLabel}</div> : null}
                    </div>
                  )}
                </div>
              </Reveal>
            ) : (
              <Reveal key={item.key} delay={item.frame} y={20} duration={14}>
                <Body text={item.text as string} size={item.size} style={{marginTop: 22, maxWidth: item.width}} />
              </Reveal>
            ),
          )}
        </div>
        {hasCharacter ? (
          <Reveal delay={beatOf(scene, "character", 2)} y={12} duration={12}>
            <div style={{marginTop: 28, display: "flex", alignItems: "center", gap: 12}}>
              <IconBadge name="clock" color={p.accent} size={48} />
              <div style={{fontSize: 25, fontWeight: 700, color: C.inkSoft}}>
                {both ? "রাকিব আর সুমন" : d.character === "rakib" ? "রাকিব" : "সুমন"}
              </div>
            </div>
          </Reveal>
        ) : null}
      </Stage>

      {hasCharacter ? (
        <div
          style={{
            position: "absolute",
            right: both ? 70 : 120,
            bottom: 74,
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          {both ? (
            <>
              <Portrait who="rakib" delay={beatOf(scene, "character", 2)} height={540} tint={`${C.green}2b`} tone={`${C.green}70`} from={1} />
              <Portrait who="suman" delay={beatOf(scene, "character", 2) + 5} height={540} tint={`${C.coral}26`} tone={`${C.coral}70`} from={1} style={{marginLeft: -14}} />
            </>
          ) : (
            <Portrait
              who={d.character === "rakib" ? "rakib" : "suman"}
              delay={beatOf(scene, "character", 2)}
              height={650}
              tint={d.character === "rakib" ? `${C.green}2b` : `${C.coral}26`}
              tone={d.character === "rakib" ? `${C.green}70` : `${C.coral}70`}
              from={1}
            />
          )}
        </div>
      ) : (
        <StatementSide scene={scene} />
      )}
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Compare                                                          */
/* ------------------------------------------------------------------ */

type Side = {name: string; value: string; note: string; color: string; mood: string};

const CompareCard: React.FC<{scene: StoryScene; side: Side; cue: number; delay: number}> = ({scene, side, cue, delay}) => (
  <Reveal delay={cue} y={44} duration={18}>
    <Card accent={side.color} style={{width: 800, height: 480, padding: "30px 34px"}}>
      <div style={{display: "flex", gap: 28, alignItems: "center"}}>
        <div style={{flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Portrait who={who(side.name)} delay={delay} height={280} tint={tintFor(side.name)} tone={toneFor(side.name)} from={who(side.name) === "rakib" ? -1 : 1} />
          <NameTag name={side.name} color={side.color} delay={delay + 5} style={{marginTop: -2}} />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 24, fontWeight: 700, color: C.inkSoft}}>{side.note}</div>
          <div
            style={{
              marginTop: 8,
              fontSize: side.value.length > 12 ? 44 : 58,
              fontWeight: 800,
              lineHeight: 1.25,
              color: side.color,
              letterSpacing: -0.5,
            }}
          >
            {side.value}
          </div>
          <div style={{marginTop: 16, height: 9, borderRadius: 99, background: `${side.color}55`, width: "62%"}} />
        </div>
      </div>
    </Card>
  </Reveal>
);

const Compare: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const size = headlineSize(d.headline ?? "", 1500, 66, 46, 1);
  return (
    <FullFrame scene={scene} decor="quiet">
      <Stage left={110} top={158} width={1660}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={26} duration={16}>
          <Headline text={d.headline ?? ""} size={size} style={{marginTop: 14}} />
        </Reveal>
      </Stage>
      <div style={{position: "absolute", left: 104, top: 306, display: "flex", gap: 96}}>
        <CompareCard scene={scene} side={d.left as Side} cue={beatOf(scene, "left", 0)} delay={beatOf(scene, "left", 0)} />
        <CompareCard scene={scene} side={d.right as Side} cue={beatOf(scene, "right", 1)} delay={beatOf(scene, "right", 1)} />
      </div>
      <Reveal delay={beatOf(scene, "left", 0) + 12} y={10} duration={12} style={{position: "absolute", left: 896, top: 490}}>
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 999,
            background: C.card,
            border: `3px solid ${C.ink}`,
            boxShadow: "0 14px 26px rgba(16,40,72,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 800,
            color: C.ink,
            ...sampleFont,
          }}
        >
          বনাম
        </div>
      </Reveal>
      {d.chip ? (
        <Reveal delay={beatOf(scene, "chip", 1) + 6} y={12} duration={12} style={{position: "absolute", left: 0, right: 0, top: 832}}>
          <div style={{display: "flex", justifyContent: "center"}}>
            <Chip color={p.accent} style={{fontSize: 26, padding: "12px 26px"}}>
              {d.chip}
            </Chip>
          </div>
        </Reveal>
      ) : null}
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Question                                                         */
/* ------------------------------------------------------------------ */

const Question: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const size = headlineSize(d.question ?? "", 1460, 72, 44, 2);
  return (
    <FullFrame scene={scene} decor="quiet">
      <div
        style={{
          position: "absolute",
          right: 104,
          top: 116,
          fontSize: 520,
          fontWeight: 800,
          lineHeight: 0.8,
          color: `${p.accent}18`,
          ...sampleFont,
        }}
      >
        ?
      </div>
      <Stage left={126} top={188} width={1450}>
        <Reveal delay={beatOf(scene, "kicker", 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        {/* Lead-in line, spoken just before the question itself. */}
        <div style={{minHeight: d.note ? textBlockHeight(d.note, 30, 1420, 600, 1.4) + 12 : 0}}>
          {d.note ? (
            <Reveal delay={beatOf(scene, "note", 0)} y={16} duration={14}>
              <Body text={d.note} size={30} style={{marginTop: 14, maxWidth: 1420}} />
            </Reveal>
          ) : null}
        </div>
        <div style={{minHeight: textBlockHeight(d.question ?? "", size, 1460, 800, 1.32) + 20}}>
          <Reveal delay={beatOf(scene, "question", 0)} y={30} duration={18}>
            <Headline text={d.question ?? ""} size={size} style={{marginTop: 20}} />
          </Reveal>
        </div>
        <Reveal delay={beatOf(scene, "question", 0) + 10} y={8} duration={12}>
          <div style={{marginTop: 24, width: 210, height: 9, borderRadius: 99, background: p.accent}} />
        </Reveal>
      </Stage>
      {d.answer ? (
        <Reveal delay={beatOf(scene, "answer", 1)} y={30} duration={16} style={{position: "absolute", left: 126, top: 690, width: 1360}}>
          <Card accent={p.accent} style={{padding: "26px 38px", display: "flex", alignItems: "center", gap: 30}}>
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: 22,
                background: p.accent,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Glyph name="check" size={40} color="#fff" strokeWidth={2.6} />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 20, fontWeight: 700, color: C.inkSoft, letterSpacing: 1}}>উত্তর</div>
              <div style={{marginTop: 2, fontSize: d.answer.length > 26 ? 38 : 46, fontWeight: 800, color: C.ink, lineHeight: 1.3}}>
                {d.answer}
              </div>
              {d.sub ? <div style={{marginTop: 6, fontSize: 24, color: C.inkSoft}}>{d.sub}</div> : null}
            </div>
          </Card>
        </Reveal>
      ) : null}
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Habit                                                            */
/* ------------------------------------------------------------------ */

const Habit: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = spring({fps, frame: frame - beatOf(scene, "percent", 0), config: {damping: 200, mass: 0.9}, durationInFrames: 44});
  const shown = Math.round(d.percent * ring);
  return (
    <FullFrame scene={scene} decor="quiet">
      <div style={{position: "absolute", left: 142, top: 300}}>
        <Reveal delay={beatOf(scene, "percent", 0)} y={30} duration={18}>
          <div style={{position: "relative"}}>
            <div style={{position: "absolute", inset: -26, borderRadius: 999, border: `2px dashed ${p.accent}55`}} />
            <Donut size={400} stroke={38} progress={ring} color={p.accent}>
              <div style={{fontSize: 116, fontWeight: 800, color: C.ink, lineHeight: 1}}>{bengali(shown)}%</div>
              <div style={{fontSize: 26, fontWeight: 700, color: C.inkSoft, marginTop: 4}}>মানুষ</div>
            </Donut>
          </div>
        </Reveal>
      </div>
      <Stage left={720} top={250} width={1040}>
        <Reveal delay={beatOf(scene, "kicker", 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <div
          style={{
            minHeight:
              textBlockHeight(
                d.headline ?? "",
                headlineSize(d.headline ?? "", 960, 70, 44, 2),
                960,
                800,
                1.32,
              ) + 18,
          }}
        >
          <Reveal delay={beatOf(scene, "headline", 0)} y={28} duration={16}>
            <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 960, 70, 44, 2)} style={{marginTop: 18}} />
          </Reveal>
        </div>
        <Reveal delay={beatOf(scene, "sub", 1)} y={20} duration={14}>
          <Body text={d.sub ?? ""} size={34} style={{marginTop: 20}} />
        </Reveal>
        <Reveal delay={beatOf(scene, "cta", 1) + 6} y={12} duration={12}>
          <Chip color={p.accent} style={{marginTop: 24, fontSize: 25}}>
            {d.cta}
          </Chip>
        </Reveal>
      </Stage>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 6. Engine                                                           */
/* ------------------------------------------------------------------ */

const Engine: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  return (
    <FullFrame scene={scene}>
      <Stage left={110} top={170} width={1680}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={26} duration={16}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1400, 64, 44, 1)} style={{marginTop: 14}} />
        </Reveal>
        <Reveal delay={beatOf(scene, "sub", 1)} y={18} duration={14}>
          <Body text={d.sub ?? ""} size={30} style={{marginTop: 10}} />
        </Reveal>
      </Stage>

      <Reveal delay={beatOf(scene, "left", 0)} y={38} duration={18} style={{position: "absolute", left: 104, top: 380}}>
        <Card accent={p.accent} style={{width: 760, height: 400, display: "flex", alignItems: "center", gap: 22}}>
          <EngineArt width={280} color={p.accent} />
          <div style={{flex: 1}}>
            <div style={{fontSize: 26, fontWeight: 700, color: C.inkSoft}}>{d.leftTitle}</div>
            <div style={{marginTop: 8, fontSize: 38, fontWeight: 800, color: C.ink, lineHeight: 1.35}}>{d.leftValue}</div>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={beatOf(scene, "left", 0) + 12} y={0} duration={12} style={{position: "absolute", left: 902, top: 540}}>
        <svg width="120" height="70" viewBox="0 0 120 70">
          <path d="M8 35h88" stroke={p.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray="10 10" />
          <path d="M86 16l22 19-22 19" fill="none" stroke={p.accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Reveal>

      <Reveal delay={beatOf(scene, "right", 1)} y={38} duration={18} style={{position: "absolute", left: 1056, top: 380}}>
        <Card accent={C.sun} style={{width: 760, height: 400, display: "flex", alignItems: "center", gap: 22}}>
          <FuelArt width={210} color={C.sun} />
          <div style={{flex: 1}}>
            <div style={{fontSize: 26, fontWeight: 700, color: C.inkSoft}}>{d.rightTitle}</div>
            <div style={{marginTop: 8, fontSize: 38, fontWeight: 800, color: C.ink, lineHeight: 1.35}}>{d.rightValue}</div>
          </div>
        </Card>
      </Reveal>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 7. Ledger                                                           */
/* ------------------------------------------------------------------ */

const Ledger: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const rows: {label: string; value: string}[] = d.rows ?? [];
  return (
    <FullFrame scene={scene}>
      <Stage left={116} top={158} width={1660}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={24} duration={14}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1560, 56, 40, 1)} style={{marginTop: 12}} />
        </Reveal>
      </Stage>

      {d.salary ? (
        <Reveal delay={beatOf(scene, "salary", 0)} y={26} duration={16} style={{position: "absolute", left: 116, top: 318}}>
          <div
            style={{
              width: 1040,
              height: 96,
              borderRadius: 24,
              background: `${C.green}14`,
              border: `1.5px solid ${C.green}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 34px",
              ...sampleFont,
            }}
          >
            <div style={{fontSize: 26, fontWeight: 700, color: C.ink}}>{d.salaryLabel ?? "বেতন এলো"}</div>
            <div style={{fontSize: 46, fontWeight: 800, color: C.green}}>{d.salary}</div>
          </div>
        </Reveal>
      ) : null}

      {rows.length > 0 ? (
        <div style={{position: "absolute", left: 116, top: 440, display: "flex", flexDirection: "column", gap: 12}}>
          {rows.map((row, index) => (
            <Reveal key={`${row.label}-${index}`} delay={itemBeat(scene, "row", index, 1)} y={24} duration={13}>
              <div
                style={{
                  width: 1040,
                  height: 88,
                  borderRadius: 20,
                  background: C.card,
                  border: `1.5px solid ${C.line}`,
                  boxShadow: "0 12px 26px rgba(16,40,72,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 30px",
                  ...sampleFont,
                }}
              >
                <div style={{fontSize: 28, fontWeight: 600, color: C.ink}}>{row.label}</div>
                <div style={{fontSize: 32, fontWeight: 800, color: C.coral}}>− ৳ {row.value}</div>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal delay={beatOf(scene, "book", scene.cueIds.length - 1)} y={30} duration={16} style={{position: "absolute", left: 116, top: 440}}>
          <div
            style={{
              width: 1040,
              height: 300,
              borderRadius: 24,
              background: C.card,
              border: `1.5px solid ${C.line}`,
              borderTop: `6px solid ${p.accent}`,
              boxShadow: "0 18px 36px rgba(16,40,72,0.08)",
              padding: "30px 34px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 20,
              ...sampleFont,
            }}
          >
            <div style={{fontSize: 24, fontWeight: 700, color: C.inkSoft, letterSpacing: 1}}>মাসের খাতা</div>
            {[0, 1, 2].map((index) => (
              <div key={index} style={{display: "flex", alignItems: "center", gap: 18}}>
                <span style={{width: 11, height: 11, borderRadius: 99, background: `${p.accent}66`, flexShrink: 0}} />
                <div style={{flex: 1, borderTop: `2px dashed ${C.line}`}} />
                <span style={{width: 96, height: 12, borderRadius: 99, background: `${C.ink}10`, flexShrink: 0}} />
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {d.remaining ? (
        <Reveal delay={beatOf(scene, "remainingLabel", scene.cueIds.length - 1)} y={30} duration={18} style={{position: "absolute", left: 1200, top: 318}}>
          <Card filled style={{width: 590, height: 480, display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <div style={{fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.66)"}}>{d.remainingLabel}</div>
            <div style={{marginTop: 14}}>
              <Reveal delay={beatOf(scene, "remaining", scene.cueIds.length - 1)} y={18} duration={16}>
                <Taka value={d.remaining} size={76} color={p.accent} />
              </Reveal>
            </div>
            <div style={{marginTop: 22, height: 9, width: 170, borderRadius: 99, background: p.accent}} />
            <div style={{marginTop: 20, display: "flex", alignItems: "center", gap: 12}}>
              <IconBadge name={d.remaining === "৳ ০" ? "cross" : "money"} color={p.accent} size={50} filled />
              <div style={{fontSize: 21, color: "rgba(255,255,255,0.6)"}}>মাসের হিসাব</div>
            </div>
          </Card>
        </Reveal>
      ) : null}
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 8. Sequence                                                         */
/* ------------------------------------------------------------------ */

const SequenceScene: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const steps: string[] = d.steps ?? [];
  return (
    <FullFrame scene={scene}>
      <Stage left={110} top={168} width={1320}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={26} duration={16}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1260, 60, 42, 2)} style={{marginTop: 14}} />
        </Reveal>
      </Stage>

      {d.character ? (
        <div style={{position: "absolute", right: 104, top: 130}}>
          <Portrait
            who={d.character === "rakib" ? "rakib" : "suman"}
            delay={beatOf(scene, "headline", 0) + 4}
            height={250}
            tint={d.character === "rakib" ? `${C.green}2b` : `${C.coral}26`}
            tone={d.character === "rakib" ? `${C.green}70` : `${C.coral}70`}
            from={1}
          />
        </div>
      ) : null}

      <div style={{position: "absolute", left: 104, top: 396, display: "flex", alignItems: "center", gap: 22}}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <Reveal delay={itemBeat(scene, "step", index)} y={36} duration={15}>
              <Card
                accent={index === steps.length - 1 ? C.green : p.accent}
                style={{width: 496, height: 270, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18}}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 99,
                    background: index === steps.length - 1 ? C.green : p.accent,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    fontWeight: 800,
                  }}
                >
                  {bengali(index + 1)}
                </div>
                <div style={{fontSize: 34, fontWeight: 800, color: C.ink, lineHeight: 1.35}}>{step}</div>
              </Card>
            </Reveal>
            {index < steps.length - 1 ? (
              <Reveal delay={itemBeat(scene, "step", index + 1) - 4} y={0} duration={10}>
                <svg width="54" height="42" viewBox="0 0 54 42">
                  <path d="M4 21h36" stroke={p.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray="8 8" />
                  <path d="M34 8l14 13-14 13" fill="none" stroke={p.accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Reveal>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      {d.outcome ? (
        <Reveal delay={beatOf(scene, "outcome", scene.cueIds.length - 1)} y={20} duration={14} style={{position: "absolute", left: 0, right: 0, top: 730}}>
          <div style={{display: "flex", justifyContent: "center"}}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                padding: "18px 34px",
                borderRadius: 99,
                background: C.ink,
                color: C.paper,
                fontSize: 31,
                fontWeight: 800,
                boxShadow: "0 20px 40px rgba(16,40,72,0.22)",
                ...sampleFont,
              }}
            >
              <span style={{width: 12, height: 12, borderRadius: 99, background: p.accent}} />
              {d.outcome}
            </div>
          </div>
        </Reveal>
      ) : null}
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 9. Rule                                                             */
/* ------------------------------------------------------------------ */

const RuleScene: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = spring({fps, frame: frame - beatOf(scene, "bar", 1), config: {damping: 200, mass: 0.9}, durationInFrames: 44});
  return (
    <FullFrame scene={scene} decor="quiet">
      <Stage left={110} top={180} width={1680}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={26} duration={16}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1500, 64, 44, 1)} style={{marginTop: 14}} />
        </Reveal>
      </Stage>

      <Reveal delay={beatOf(scene, "bar", 1)} y={30} duration={16} style={{position: "absolute", left: 104, top: 430, width: 1712}}>
        <div style={{display: "flex", height: 158, borderRadius: 28, overflow: "hidden", boxShadow: "0 24px 54px rgba(16,40,72,0.16)"}}>
          <div
            style={{
              width: `${Math.max(2, d.percent * grow)}%`,
              background: C.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 50,
              fontWeight: 800,
              color: "#fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {bengali(d.percent)}%
          </div>
          <div
            style={{
              flex: 1,
              background: `${C.ink}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 50,
              fontWeight: 800,
              color: C.ink,
            }}
          >
            {bengali(100 - d.percent)}%
          </div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", marginTop: 18}}>
          <div style={{fontSize: 31, fontWeight: 800, color: C.green}}>{d.leftLabel}</div>
          <div style={{fontSize: 31, fontWeight: 800, color: C.inkSoft}}>{d.rightLabel}</div>
        </div>
      </Reveal>

      <Reveal delay={beatOf(scene, "sub", 1) + 10} y={16} duration={14} style={{position: "absolute", left: 0, right: 0, top: 742}}>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Chip color={p.accent} style={{fontSize: 26, padding: "12px 26px"}}>
            {d.sub}
          </Chip>
        </div>
      </Reveal>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 10. Tiers                                                           */
/* ------------------------------------------------------------------ */

const Tiers: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const tiers: {title: string; pct: string; amount: string; note: string}[] = d.tiers ?? [];
  return (
    <FullFrame scene={scene}>
      <Stage left={104} top={158} width={1680}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={26} duration={16}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1580, 60, 42, 1)} style={{marginTop: 14}} />
        </Reveal>
      </Stage>

      <div style={{position: "absolute", left: 104, top: 342, display: "flex", gap: 24}}>
        {tiers.map((tier, index) => {
          const active = d.active === index;
          return (
            <Reveal
              key={tier.title}
              delay={beatOr(scene, `tier${index}`, beatOf(scene, "headline", 0))}
              y={42}
              duration={16}
            >
              <div
                style={{
                  width: 540,
                  height: 418,
                  borderRadius: 28,
                  padding: "32px 32px",
                  background: active ? C.ink : C.card,
                  border: active ? `3px solid ${p.accent}` : `1.5px solid ${C.line}`,
                  borderTop: active ? `8px solid ${p.accent}` : `8px solid ${p.accent}88`,
                  boxShadow: active ? "0 30px 60px rgba(16,40,72,0.26)" : "0 16px 34px rgba(16,40,72,0.08)",
                  transform: active ? "translateY(-10px)" : undefined,
                  ...sampleFont,
                }}
              >
                <div style={{fontSize: 26, fontWeight: 700, color: active ? p.accent : C.inkSoft}}>{tier.title}</div>
                <div style={{marginTop: 10, fontSize: 78, fontWeight: 800, color: active ? "#fff" : C.ink, lineHeight: 1.15}}>
                  {tier.pct}
                </div>
                <div style={{marginTop: 4, fontSize: 38, fontWeight: 800, color: active ? p.accent : C.green}}>
                  ৳ {tier.amount}
                </div>
                <div style={{marginTop: 14, height: 7, width: 120, borderRadius: 99, background: active ? p.accent : C.line}} />
                <div style={{marginTop: 14, fontSize: 24, fontWeight: 600, color: active ? "rgba(255,255,255,0.68)" : C.inkSoft}}>
                  {tier.note}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {d.sub ? (
        <Reveal delay={beatOf(scene, "sub", scene.cueIds.length - 1)} y={16} duration={14} style={{position: "absolute", left: 0, right: 0, top: 812}}>
          <div style={{display: "flex", justifyContent: "center"}}>
            <Chip color={p.accent} style={{fontSize: 26, padding: "12px 26px"}}>
              {d.sub}
            </Chip>
          </div>
        </Reveal>
      ) : null}

      {d.note ? (
        <Reveal delay={beatOf(scene, "note", scene.cueIds.length - 1)} y={16} duration={14} style={{position: "absolute", left: 0, right: 0, top: 886}}>
          <div style={{display: "flex", justifyContent: "center"}}>
            <Chip color={C.ink} style={{fontSize: 26, padding: "12px 26px", color: C.paper}}>
              {d.note}
            </Chip>
          </div>
        </Reveal>
      ) : null}
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 11. Growth                                                          */
/* ------------------------------------------------------------------ */

const Growth: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  return (
    <FullFrame scene={scene}>
      <Stage left={104} top={158} width={1500}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={26} duration={16}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1440, 58, 40, 1)} style={{marginTop: 12}} />
        </Reveal>
      </Stage>

      <div style={{position: "absolute", left: 104, top: 330, width: 720}}>
        {d.total ? (
          <Reveal delay={beatOf(scene, "total", 0)} y={30} duration={16}>
            <div
              style={{
                borderRadius: 26,
                background: C.ink,
                padding: "26px 32px",
                boxShadow: "0 24px 50px rgba(16,40,72,0.24)",
                ...sampleFont,
              }}
            >
              <div style={{fontSize: 23, fontWeight: 700, color: "rgba(255,255,255,0.62)"}}>১০ বছরে মোট</div>
              <div style={{marginTop: 6}}>
                <Taka value={d.total} size={62} color={p.accent} />
              </div>
            </div>
          </Reveal>
        ) : null}
        {d.own || d.profit ? (
          <div style={{display: "flex", gap: 16, marginTop: d.total ? 16 : 0}}>
            {[
              d.own ? {key: "own", label: "নিজের টাকা", value: d.own, color: C.blue} : null,
              d.profit ? {key: "profit", label: "শুধু লাভ", value: d.profit, color: C.green} : null,
            ]
              .filter(Boolean)
              .map((item) => {
                const entry = item as {key: string; label: string; value: string; color: string};
                return (
                  <Reveal key={entry.key} delay={beatOf(scene, entry.key, 1)} y={24} duration={14} style={{flex: 1}}>
                    <div
                      style={{
                        background: C.card,
                        border: `1.5px solid ${C.line}`,
                        borderRadius: 20,
                        padding: "18px 22px",
                        boxShadow: "0 12px 26px rgba(16,40,72,0.06)",
                        ...sampleFont,
                      }}
                    >
                      <div style={{fontSize: 21, fontWeight: 600, color: C.inkSoft}}>{entry.label}</div>
                      <div style={{marginTop: 4, fontSize: 28, fontWeight: 800, color: entry.color, whiteSpace: "nowrap"}}>৳ {entry.value}</div>
                    </div>
                  </Reveal>
                );
              })}
          </div>
        ) : null}
        {d.monthly || d.rate ? (
          <Reveal delay={beatOf(scene, "chips", 1) + 6} y={16} duration={12}>
            <div style={{display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap"}}>
              {d.monthly ? <Chip color={C.blue}>মাসে ৳ {d.monthly}</Chip> : null}
              {d.rate ? <Chip color={C.green}>রিটার্ন {d.rate}</Chip> : null}
            </div>
          </Reveal>
        ) : null}
        {Array.isArray(d.chips) && (d.chips as string[]).length > 0 ? (
          <div style={{display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap"}}>
            {(d.chips as string[]).map((chip, index) => (
              <Reveal
                key={chip}
                delay={beatOr(scene, `chip${index}`, beatOf(scene, "chips", 1))}
                y={16}
                duration={12}
              >
                <Chip color={C.gold}>{chip}</Chip>
              </Reveal>
            ))}
          </div>
        ) : null}
        {d.extra ? (
          <Reveal delay={beatOf(scene, "extra", scene.cueIds.length - 1)} y={14} duration={12}>
            <Body text={d.extra} size={25} style={{marginTop: 16}} />
          </Reveal>
        ) : null}
      </div>

      <Reveal delay={beatOf(scene, "headline", 0) + 6} y={30} duration={18} style={{position: "absolute", left: 880, top: 320, width: 936}}>
        <Card accent={p.accent} style={{padding: "20px 22px", width: 936}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{fontSize: 24, fontWeight: 800, color: C.ink}}>বৃদ্ধির ধরন</div>
            <Chip color={p.accent}>১০ বছর</Chip>
          </div>
          <div style={{marginTop: 4}}>
            <GrowthCurve width={870} height={398} color={p.accent} delay={beatOf(scene, "headline", 0) + 10} />
          </div>
        </Card>
      </Reveal>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 12. Trap                                                            */
/* ------------------------------------------------------------------ */

const Trap: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const automation = d.mode === "automation";
  const steps: string[] = d.steps ?? [];
  return (
    <FullFrame scene={scene}>
      <Stage left={104} top={158} width={1680}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={26} duration={16}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1600, 56, 40, 2)} style={{marginTop: 14}} />
        </Reveal>
      </Stage>

      <Reveal delay={beatOf(scene, "headline", 0) + 4} y={34} duration={16} style={{position: "absolute", left: 104, top: 402}}>
        <div
          style={{
            width: 370,
            height: 370,
            borderRadius: 34,
            background: automation ? `${C.green}10` : `${C.coral}10`,
            border: `2px solid ${p.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 22px 46px rgba(16,40,72,0.10)",
          }}
        >
          {automation ? <AutomationArt width={270} color={p.accent} /> : <BrainArt width={280} color={p.accent} />}
        </div>
      </Reveal>

      <div style={{position: "absolute", left: 570, top: 382, width: 1240, display: "flex", flexDirection: "column", gap: 14}}>
        {steps.map((step, index) => (
          <Reveal key={step} delay={itemBeat(scene, "step", index)} y={26} duration={13}>
            <div
              style={{
                height: 96,
                borderRadius: 22,
                background: C.card,
                border: `1.5px solid ${C.line}`,
                boxShadow: "0 12px 28px rgba(16,40,72,0.07)",
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "0 28px",
                ...sampleFont,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 99,
                  background: p.accent,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 23,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {bengali(index + 1)}
              </div>
              <div style={{fontSize: 29, fontWeight: 600, color: C.ink, lineHeight: 1.4}}>{step}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {d.sub ? (
        <Reveal delay={beatOf(scene, "sub", scene.cueIds.length - 1)} y={18} duration={14} style={{position: "absolute", left: 0, right: 0, top: 832}}>
          <div style={{display: "flex", justifyContent: "center"}}>
            <Chip color={p.accent} style={{fontSize: 26, padding: "12px 26px"}}>
              {d.sub}
            </Chip>
          </div>
        </Reveal>
      ) : null}
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 13. Phone                                                           */
/* ------------------------------------------------------------------ */

const Phone: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const steps: string[] = d.steps ?? [];
  return (
    <FullFrame scene={scene}>
      <Stage left={120} top={170} width={1060}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={26} duration={16}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1010, 60, 42, 2)} style={{marginTop: 16}} />
        </Reveal>
        <div style={{marginTop: 34, display: "flex", flexDirection: "column", gap: 14}}>
          {steps.map((step, index) => (
            <Reveal key={step} delay={itemBeat(scene, "step", index)} y={22} duration={13}>
              <div style={{display: "flex", alignItems: "center", gap: 18}}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 99,
                    background: p.accent,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {bengali(index + 1)}
                </div>
                <div style={{fontSize: 30, fontWeight: 700, color: C.ink, lineHeight: 1.4}}>{step}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={beatOf(scene, "step2", 2)} y={14} duration={12}>
          <div style={{display: "flex", alignItems: "center", gap: 14, marginTop: 28}}>
            <div style={{width: 210, height: 8, borderRadius: 99, background: p.accent}} />
            <div style={{width: 44, height: 8, borderRadius: 99, background: `${C.ink}18`}} />
          </div>
        </Reveal>
      </Stage>

      <div style={{position: "absolute", right: 126, top: 156}}>
        <PhonePanel width={378} delay={beatOf(scene, "phone", 0)} amount={d.amount} remaining={d.income} accent={p.accent} />
      </div>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 14. Wait                                                            */
/* ------------------------------------------------------------------ */

const Wait: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const excuses: string[] = d.excuses ?? [];
  return (
    <FullFrame scene={scene} decor="quiet">
      <div style={{position: "absolute", right: 100, top: 130, opacity: 0.4}}>
        <CalendarArt width={150} color={p.accent} />
      </div>
      <Stage left={116} top={170} width={1600}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={26} duration={16}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1520, 66, 44, 1)} style={{marginTop: 14}} />
        </Reveal>
      </Stage>

      <div style={{position: "absolute", left: 116, top: 392, display: "flex", gap: 28}}>
        {excuses.map((excuse, index) => (
          <Reveal key={excuse} delay={itemBeat(scene, "excuse", index)} y={36} duration={14}>
            <div
              style={{
                width: 528,
                height: 190,
                borderRadius: 26,
                background: C.card,
                border: `1.5px solid ${C.line}`,
                borderTop: `7px solid ${p.accent}`,
                boxShadow: "0 16px 34px rgba(16,40,72,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 28px",
                textAlign: "center",
                ...sampleFont,
              }}
            >
              <div
                style={{
                  fontSize: 29,
                  fontWeight: 700,
                  color: C.ink,
                  lineHeight: 1.5,
                  textDecoration: "line-through",
                  textDecorationColor: `${C.coral}cc`,
                  textDecorationThickness: 4,
                }}
              >
                {excuse}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={beatOf(scene, "sub", scene.cueIds.length - 1)} y={18} duration={14} style={{position: "absolute", left: 0, right: 0, top: 700}}>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Chip color={p.accent} style={{fontSize: 27, padding: "13px 28px"}}>
            {d.sub}
          </Chip>
        </div>
      </Reveal>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 15. CTA                                                             */
/* ------------------------------------------------------------------ */

const Cta: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const options: string[] = d.options ?? [];
  return (
    <FullFrame scene={scene} decor="quiet">
      <Stage left={120} top={184} width={1680} style={{textAlign: "center"}}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <div style={{display: "flex", justifyContent: "center"}}>
            <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
          </div>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={28} duration={16}>
          <Headline
            text={d.headline ?? ""}
            size={headlineSize(d.headline ?? "", 1500, 68, 44, 2)}
            align="center"
            style={{marginTop: 18}}
          />
        </Reveal>
      </Stage>

      <Reveal delay={beatOf(scene, "options", 1)} y={30} duration={16} style={{position: "absolute", left: 0, right: 0, top: 508}}>
        <div style={{display: "flex", justifyContent: "center", gap: 24}}>
          {options.map((option, index) => (
            <div
              key={option}
              style={{
                padding: "24px 44px",
                borderRadius: 24,
                background: index === 1 ? p.accent : C.card,
                border: `2px solid ${p.accent}`,
                boxShadow: index === 1 ? `0 22px 44px ${p.accent}44` : "0 14px 30px rgba(16,40,72,0.08)",
                ...sampleFont,
              }}
            >
              <div style={{fontSize: 46, fontWeight: 800, color: index === 1 ? "#fff" : C.ink}}>{option}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={beatOf(scene, "next", 2)} y={22} duration={14} style={{position: "absolute", left: 0, right: 0, top: 700}}>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 18}}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              background: C.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...sampleFont,
            }}
          >
            <Glyph name="spark" size={30} color={p.accent} strokeWidth={2.4} />
          </div>
          <div style={{fontSize: 31, fontWeight: 700, color: C.ink}}>{d.next}</div>
        </div>
      </Reveal>

      <Reveal delay={beatOf(scene, "next", 2) + 8} y={16} duration={14} style={{position: "absolute", left: 104, right: 104, top: 836}}>
        <div
          style={{
            height: 104,
            borderRadius: 26,
            background: C.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            boxShadow: "0 24px 44px rgba(16,40,72,0.24)",
            ...sampleFont,
          }}
        >
          <div style={{fontSize: 30, fontWeight: 800, color: C.paper, letterSpacing: 4}}>PAY YOURSELF FIRST</div>
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            <span style={{width: 12, height: 12, borderRadius: 99, background: p.accent}} />
            <span style={{fontSize: 23, color: "rgba(247,244,236,0.66)"}}>নিজেকে আগে টাকা দিন</span>
          </div>
        </div>
      </Reveal>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 16. Outro                                                           */
/* ------------------------------------------------------------------ */

const Outro: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  return (
    <FullFrame scene={scene} decor="quiet" watermark={false}>
      <div style={{position: "absolute", left: 96, bottom: 92}}>
        <Portrait who="rakib" delay={cueOf(scene, 0) + 6} height={400} tint={`${C.green}2b`} tone={`${C.green}70`} from={-1} opacity={0.95} />
      </div>
      <div style={{position: "absolute", right: 96, bottom: 92}}>
        <Portrait who="suman" delay={cueOf(scene, 0) + 10} height={400} tint={`${C.coral}26`} tone={`${C.coral}70`} from={1} opacity={0.95} />
      </div>

      <Stage left={330} top={228} width={1260} style={{textAlign: "center"}}>
        <Reveal delay={cueOf(scene, 0) - 4} y={10} duration={12}>
          <div style={{display: "flex", justifyContent: "center"}}>
            <Chip color={p.accent}>ধন্যবাদ</Chip>
          </div>
        </Reveal>
        <Reveal delay={beatOf(scene, "headline", 0)} y={32} duration={18}>
          <Headline text={d.headline ?? ""} size={headlineSize(d.headline ?? "", 1180, 92, 48, 2)} align="center" style={{marginTop: 22}} />
        </Reveal>
        <Reveal delay={beatOf(scene, "sub", 1)} y={22} duration={14}>
          <Body text={d.sub ?? ""} size={37} align="center" color={C.ink} weight={700} style={{marginTop: 20}} />
        </Reveal>
        <Reveal delay={beatOf(scene, "sub", 1) + 8} y={24} duration={16}>
          <div
            style={{
              marginTop: 30,
              display: "inline-flex",
              alignItems: "center",
              gap: 20,
              padding: "20px 34px",
              borderRadius: 24,
              background: C.ink,
              boxShadow: "0 24px 46px rgba(16,40,72,0.26)",
              ...sampleFont,
            }}
          >
            <span style={{width: 14, height: 46, borderRadius: 99, background: p.accent}} />
            <div style={{textAlign: "left"}}>
              <div style={{fontSize: 30, fontWeight: 800, color: C.paper, letterSpacing: 3}}>{d.signature}</div>
              <div style={{fontSize: 19, color: "rgba(247,244,236,0.58)", marginTop: 3}}>একটি বাংলা ফাইন্যান্স ডকুমেন্টারি</div>
            </div>
          </div>
        </Reveal>
      </Stage>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* 17. Quote                                                           */
/* ------------------------------------------------------------------ */

const Quote: React.FC<{scene: StoryScene}> = ({scene}) => {
  const d = scene.data as Data;
  const p = paletteForAccent(scene.accent);
  const quote = String(d.quote ?? "").replace(/^[“"']/, "").trim();
  return (
    <FullFrame scene={scene} decor="quiet">
      <Reveal delay={beatOf(scene, "kicker", 0) - 4} y={12} duration={12} style={{position: "absolute", left: 260, top: 196}}>
        <Kicker color={p.accent}>{d.kicker ?? ""}</Kicker>
      </Reveal>
      <div style={{position: "absolute", left: 214, top: 306, width: 980, height: 270, borderRadius: 34, background: C.sand, opacity: 0.55, transform: "rotate(-2deg)"}} />
      <Reveal delay={beatOf(scene, "kicker", 0) - 4} y={16} duration={14} style={{position: "absolute", left: 180, top: 168}}>
        <div style={{fontSize: 210, lineHeight: 0.8, fontWeight: 800, color: p.accent, ...sampleFont}}>“</div>
      </Reveal>
      <Stage left={260} top={276} width={1160}>
        <Reveal delay={beatOf(scene, "quote", 0)} y={26} duration={16}>
          <div style={{fontSize: headlineSize(quote, 1080, 78, 48, 1), fontWeight: 800, color: C.ink, lineHeight: 1.4}}>
            {quote}
          </div>
        </Reveal>
        <Reveal delay={beatOf(scene, "sub", 1)} y={18} duration={14}>
          <div style={{marginTop: 20, fontSize: 40, fontWeight: 600, color: C.inkSoft}}>{d.sub}</div>
        </Reveal>
        <Reveal delay={beatOf(scene, "sub", 1) + 8} y={10} duration={12}>
          <div style={{marginTop: 26, display: "flex", alignItems: "center", gap: 14}}>
            <span style={{width: 42, height: 4, background: p.accent}} />
            <span style={{fontSize: 23, fontWeight: 700, letterSpacing: 1, color: C.inkFaint}}>সুমনের কথা</span>
          </div>
        </Reveal>
      </Stage>
      <div style={{position: "absolute", right: 128, bottom: 104}}>
        <Portrait who="suman" delay={cueOf(scene, 0) + 6} height={390} tint={`${C.coral}26`} tone={`${C.coral}70`} from={1} opacity={0.92} />
      </div>
    </FullFrame>
  );
};

/* ------------------------------------------------------------------ */
/* Dispatcher                                                          */
/* ------------------------------------------------------------------ */

export const FullScene: React.FC<{scene: StoryScene}> = ({scene}) => {
  switch (scene.type) {
    case "opening":
      return <Opening scene={scene} />;
    case "statement":
      return <Statement scene={scene} />;
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
      return <RuleScene scene={scene} />;
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
    default:
      return <Statement scene={scene} />;
  }
};

/* ------------------------------------------------------------------ */
/* Audio: full narration + quiet full score + planned SFX              */
/* ------------------------------------------------------------------ */

const FullAudio: React.FC = () => (
  <>
    <Audio src={staticFile("audio/voiceover.wav")} volume={1} />
    <Audio src={staticFile("audio/score-full.wav")} volume={0.12} />
    {SFX_CUES.map((cue, index) => {
      const from = Math.round(cue.atSeconds * FPS);
      return (
        <Sequence
          key={`sfx-${cue.sound}-${index}`}
          from={from}
          durationInFrames={Math.max(1, DURATION_IN_FRAMES - from)}
          name={`SFX ${cue.sound} @ ${cue.atSeconds}s`}
        >
          <Audio src={staticFile(`audio/sfx/${cue.sound}.wav`)} volume={cue.gain} />
        </Sequence>
      );
    })}
  </>
);

/* ------------------------------------------------------------------ */
/* Timeline — hard cuts, 75 scenes                                     */
/* ------------------------------------------------------------------ */

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

export const FullVideo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.paper}}>
    {SCENES.map((scene, index) => (
      <Sequence
        key={scene.id}
        from={scene.startFrame}
        durationInFrames={scene.durationInFrames}
        name={`${scene.id} ${scene.type}`}
      >
        <SceneCut index={index}>
          <FullScene scene={scene} />
        </SceneCut>
      </Sequence>
    ))}
    <FullAudio />
  </AbsoluteFill>
);

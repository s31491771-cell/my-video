import React from "react";
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

const bn = (value: number) =>
  Math.round(value)
    .toString()
    .replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

const Mini: React.FC<{label: string; value: string; color: string; delay: number}> = ({
  label,
  value,
  color,
  delay,
}) => {
  const enter = useEnter(delay);
  return (
    <div
      style={{
        ...enter,
        width: 330,
        borderRadius: 28,
        background: COLORS.paper,
        border: `1px solid ${COLORS.line}`,
        padding: "28px 30px",
        boxShadow: "0 18px 44px rgba(20,45,78,0.10)",
      }}
    >
      <div style={{fontSize: 26, color: COLORS.muted, fontWeight: 600}}>{label}</div>
      <div style={{fontSize: 52, fontWeight: 800, color, marginTop: 6, lineHeight: 1.3}}>
        {value}
      </div>
    </div>
  );
};

/**
 * Voiceover: "মাসে ৬,০০০ টাকা" 31.40 s, "১২% রিটার্নে" 32.78 s,
 * "১০ বছরে ১৪ লাখ" 34.06 s.
 * Scene starts at 30.933 s (frame 928).
 */
export const Scene06Math: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const header = useEnter(14);
  const result = spring({
    frame: frame - 96,
    fps,
    config: {damping: 16, stiffness: 100},
  });
  const count = spring({
    frame: frame - 98,
    fps,
    config: {damping: 200, mass: 1},
    durationInFrames: 40,
  });

  return (
    <AbsoluteFill>
      <Stage justify="space-between">
        <div style={header}>
          <Kicker color={COLORS.blue}>হিসাবটা দেখুন</Kicker>
          <Title size={76} style={{marginTop: 14}}>
            মাসে ৬,০০০ টাকা, ১২% রিটার্নে
          </Title>
        </div>

        <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 22}}>
          <Mini label="প্রতি মাসে" value="৳ ৬,০০০" color={COLORS.navy} delay={14} />
          <div style={{fontSize: 52, fontWeight: 800, color: COLORS.blue}}>×</div>
          <Mini label="বার্ষিক রিটার্ন" value="১২%" color={COLORS.blue} delay={55} />
          <div style={{fontSize: 52, fontWeight: 800, color: COLORS.blue}}>×</div>
          <Mini label="সময়" value="১০ বছর" color={COLORS.navy} delay={94} />
        </div>

        <div
          style={{
            transform: `scale(${0.9 + result * 0.1})`,
            opacity: result,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: COLORS.navy,
            borderRadius: 32,
            padding: "34px 52px",
            boxShadow: "0 30px 70px rgba(20,45,78,0.30)",
          }}
        >
          <div style={{display: "flex", flexDirection: "column", gap: 6}}>
            <div style={{fontSize: 28, color: "rgba(255,255,255,0.72)"}}>১০ বছরে জমা হবে</div>
            <div style={{fontSize: 84, fontWeight: 800, color: COLORS.gold, lineHeight: 1.25}}>
              ৳ {bn(1400000 * count)}
            </div>
          </div>
          <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10}}>
            <div style={{fontSize: 28, color: "rgba(255,255,255,0.72)"}}>মোট বিনিয়োগ</div>
            <div style={{fontSize: 44, fontWeight: 700, color: COLORS.white}}>৭,২০,০০০ টাকা</div>
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

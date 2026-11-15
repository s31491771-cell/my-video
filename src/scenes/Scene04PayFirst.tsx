import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {FlowArrow} from "../components/FlowArrow";
import {Body, Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

export const Scene04PayFirst: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const header = useEnter(0);
  const card = useEnter(12);
  const right = useEnter(30);

  const split = spring({
    frame: frame - 22,
    fps,
    config: {damping: 200, mass: 0.9},
    durationInFrames: 34,
  });
  const investWidth = interpolate(split, [0, 1], [0, 20]);

  return (
    <AbsoluteFill>
      <Stage>
        <div style={header}>
          <Kicker color={COLORS.green}>রাকিবের নিয়ম</Kicker>
          <Title size={80} style={{marginTop: 16}}>
            বেতন আসার <span style={{color: COLORS.green}}>১০ মিনিটের মধ্যে</span>
          </Title>
        </div>

        <div style={{display: "flex", alignItems: "center", gap: 64}}>
          <div style={{...card, flex: 1, maxWidth: 860}}>
            <div
              style={{
                background: COLORS.paper,
                borderRadius: 28,
                padding: "34px 38px",
                border: `1px solid ${COLORS.line}`,
                boxShadow: "0 24px 60px rgba(20,45,78,0.12)",
              }}
            >
              <div style={{fontSize: 28, color: COLORS.muted, fontWeight: 600}}>এই মাসের বেতন</div>
              <div style={{fontSize: 76, fontWeight: 800, color: COLORS.navy, marginTop: 4}}>
                ৳ ৩০,০০০
              </div>
              <div
                style={{
                  marginTop: 26,
                  height: 78,
                  borderRadius: 18,
                  background: "rgba(20,45,78,0.10)",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${investWidth}%`,
                    background: COLORS.green,
                    height: "100%",
                    display: investWidth > 8 ? "flex" : "none",
                    alignItems: "center",
                    paddingLeft: 22,
                    color: COLORS.white,
                    fontSize: 26,
                    fontWeight: 700,
                  }}
                >
                  ২০%
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 14,
                  fontSize: 28,
                  color: COLORS.muted,
                }}
              >
                <span>বিনিয়োগ ৬,০০০ টাকা</span>
                <span>খরচ ২৪,০০০ টাকা</span>
              </div>
            </div>
          </div>

          <FlowArrow width={140} color={COLORS.green} delay={34} />

          <div style={{...right, display: "flex", flexDirection: "column", gap: 22, maxWidth: 520}}>
            <Chip color={COLORS.green} size={32}>
              ইনভেস্টমেন্টে যায়
            </Chip>
            <Body size={34} weight={600} color={COLORS.navy}>
              ২০% আলাদা করে বিনিয়োগে পাঠায়
            </Body>
            <Body size={28} color={COLORS.muted}>
              তারপর বাকি টাকা দিয়ে খরচ করে
            </Body>
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

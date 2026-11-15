import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {FlowArrow} from "../components/FlowArrow";
import {Chip, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

/**
 * Voiceover: "পার্থক্য?" 12.86 s, "একটি অভ্যাস" 14.24 s,
 * "সুমন আগে খরচ করে" 15.64 s, "পরে যা থাকে জমায়" 17.28 s.
 * Scene starts at 12.600 s (frame 378).
 */
export const Scene03Habit: React.FC = () => {
  const frame = useCurrentFrame();
  const question = useEnter(6, 30);
  const answer = useEnter(46, 30);
  const flowLeft = useEnter(92);
  const flowArrow = useEnter(122);
  const flowRight = useEnter(140);
  const underline = interpolate(frame, [50, 66], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Stage justify="center" gap={64}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 22}}>
          <div style={question}>
            <Title size={86} align="center">
              পার্থক্য?
            </Title>
          </div>
          <div style={{...answer, display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Title size={118} align="center" color={COLORS.navy}>
              একটি <span style={{color: COLORS.coral}}>অভ্যাস।</span>
            </Title>
            <div
              style={{
                height: 12,
                width: 520 * underline,
                borderRadius: 999,
                background: COLORS.gold,
                marginTop: 8,
              }}
            />
          </div>
        </div>

        <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 28}}>
          <div style={flowLeft}>
            <Chip color={COLORS.coral} size={34}>
              আগে খরচ
            </Chip>
          </div>
          <div style={flowArrow}>
            <FlowArrow width={150} color={COLORS.coral} delay={122} />
          </div>
          <div style={flowRight}>
            <Chip color={COLORS.navy} size={34}>
              পরে যা থাকে জমা
            </Chip>
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

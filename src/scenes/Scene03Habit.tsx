import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {FlowArrow} from "../components/FlowArrow";
import {Body, Chip, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

export const Scene03Habit: React.FC = () => {
  const frame = useCurrentFrame();
  const question = useEnter(0, 30);
  const answer = useEnter(22, 30);
  const flow = useEnter(38);
  const underline = interpolate(frame, [30, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Stage justify="center" gap={56}>
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

        <div style={{...flow, display: "flex", alignItems: "center", justifyContent: "center", gap: 28}}>
          <Chip color={COLORS.coral} size={34}>
            আগে খরচ
          </Chip>
          <FlowArrow width={150} color={COLORS.coral} delay={44} />
          <Chip color={COLORS.navy} size={34}>
            পরে যা থাকে জমা
          </Chip>
        </div>

        <Body size={32} color={COLORS.muted} style={{textAlign: "center", opacity: flow.opacity}}>
          সুমনের অভ্যাস এটাই
        </Body>
      </Stage>
    </AbsoluteFill>
  );
};

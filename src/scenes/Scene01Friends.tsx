import React from "react";
import {AbsoluteFill} from "remotion";
import {Character} from "../components/Character";
import {Panel} from "../components/Backdrop";
import {Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

/**
 * Voiceover: "দুই বন্ধু, রাকিব আর সুমন" 0.16-2.46 s,
 * then "দুজনের বেতন ৩০ হাজার টাকা" 2.94-5.14 s.
 * Names arrive with the first line; salary chips arrive on 2.94 s (frame 88).
 */
export const Scene01Friends: React.FC = () => {
  const header = useEnter(0);
  const left = useEnter(2);
  const right = useEnter(8);
  const salaryLeft = useEnter(86);
  const salaryRight = useEnter(90);

  return (
    <AbsoluteFill>
      <Stage>
        <div style={header}>
          <Kicker color={COLORS.blue}>আজকের গল্প</Kicker>
          <Title size={88} style={{marginTop: 16}}>
            দুই বন্ধু, <span style={{color: COLORS.blue}}>একই বেতন</span>
          </Title>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            gap: 56,
            width: "100%",
          }}
        >
          <div style={{...left, flex: 1, maxWidth: 760}}>
            <Panel accent={COLORS.green} style={{height: "100%"}}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 28,
                }}
              >
                <Character name="রাকিব" color={COLORS.green} delay={2} mood="happy" scale={0.92} />
                <div style={{...salaryLeft, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start"}}>
                  <Chip color={COLORS.green}>বেতন ৩০,০০০ টাকা</Chip>
                </div>
              </div>
            </Panel>
          </div>

          <div style={{...right, flex: 1, maxWidth: 760}}>
            <Panel accent={COLORS.coral} style={{height: "100%"}}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 28,
                }}
              >
                <Character name="সুমন" color={COLORS.coral} delay={8} mood="happy" scale={0.92} />
                <div style={{...salaryRight, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start"}}>
                  <Chip color={COLORS.coral}>বেতন ৩০,০০০ টাকা</Chip>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

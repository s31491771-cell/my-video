import React from "react";
import {AbsoluteFill} from "remotion";
import {Character} from "../components/Character";
import {Panel} from "../components/Backdrop";
import {Body, Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

export const Scene01Friends: React.FC = () => {
  const header = useEnter(0);
  const left = useEnter(12);
  const right = useEnter(20);

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
                <Character name="রাকিব" color={COLORS.green} delay={16} mood="happy" scale={0.92} />
                <div style={{display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start"}}>
                  <Chip color={COLORS.green}>বেতন ৩০,০০০ টাকা</Chip>
                  <Body size={30}>টাকা জমানোর অভ্যাস আছে</Body>
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
                <Character
                  name="সুমন"
                  color={COLORS.coral}
                  delay={24}
                  mood="happy"
                  scale={0.92}
                />
                <div style={{display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start"}}>
                  <Chip color={COLORS.coral}>বেতন ৩০,০০০ টাকা</Chip>
                  <Body size={30}>আগে খরচ, পরে জমা</Body>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

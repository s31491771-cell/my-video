import React from "react";
import {AbsoluteFill} from "remotion";
import {GrowthChart} from "../components/GrowthChart";
import {Panel} from "../components/Backdrop";
import {Body, Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

export const Scene07Compounding: React.FC = () => {
  const header = useEnter(0);
  const chart = useEnter(16);

  return (
    <AbsoluteFill>
      <Stage padding="64px 108px">
        <div style={{...header, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40}}>
          <div style={{flex: 1, maxWidth: 1120}}>
            <Kicker color={COLORS.green}>কম্পাউন্ডিং</Kicker>
            <Title size={62} style={{marginTop: 12}}>
              এর মধ্যে <span style={{color: COLORS.green}}>৭ লাখ</span> শুধু কম্পাউন্ডিংয়ের জাদু
            </Title>
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end", flexShrink: 0}}>
            <Chip color={COLORS.blue} size={26}>
              মোট জমা ৭,২০,০০০
            </Chip>
            <Chip color={COLORS.green} size={26}>
              মুনাফা ৬,৬০,০০০
            </Chip>
          </div>
        </div>

        <div style={{...chart, display: "flex", justifyContent: "center"}}>
          <Panel accent={COLORS.green} style={{padding: "26px 32px"}}>
            <GrowthChart delay={20} width={1180} height={450} />
          </Panel>
        </div>

        <div style={{display: "flex", alignItems: "center", gap: 26}}>
          <Body size={28} color={COLORS.muted}>
            নীল রেখা = জমানো টাকা · সবুজ এলাকা = মোট মূল্য
          </Body>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

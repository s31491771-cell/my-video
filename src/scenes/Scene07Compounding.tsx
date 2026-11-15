import React from "react";
import {AbsoluteFill} from "remotion";
import {GrowthChart} from "../components/GrowthChart";
import {Panel} from "../components/Backdrop";
import {Body, Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

/**
 * Voiceover: "এর মধ্যে ৭ লাখ" 35.90 s, "শুধু কম্পাউন্ডিংয়ের জাদু" 37.62 s.
 * Scene starts at 35.667 s (frame 1070), ends 39.833 s.
 */
export const Scene07Compounding: React.FC = () => {
  const header = useEnter(6);
  const chips = useEnter(20);
  const chart = useEnter(56);
  const legend = useEnter(62);

  return (
    <AbsoluteFill>
      <Stage padding="64px 108px">
        <div
          style={{
            ...header,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 40,
          }}
        >
          <div style={{flex: 1, maxWidth: 1120}}>
            <Kicker color={COLORS.green}>কম্পাউন্ডিং</Kicker>
            <Title size={62} style={{marginTop: 12}}>
              এর মধ্যে <span style={{color: COLORS.green}}>৭ লাখ</span> শুধু কম্পাউন্ডিংয়ের জাদু
            </Title>
          </div>
          <div style={{...chips, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end"}}>
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
            <GrowthChart delay={4} width={1180} height={450} />
          </Panel>
        </div>

        <div style={{...legend, display: "flex", alignItems: "center", gap: 26}}>
          <Body size={28} color={COLORS.muted}>
            নীল রেখা = জমানো টাকা · সবুজ এলাকা = মোট মূল্য
          </Body>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

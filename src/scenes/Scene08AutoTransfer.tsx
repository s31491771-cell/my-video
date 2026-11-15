import React from "react";
import {AbsoluteFill} from "remotion";
import {PhoneCard} from "../components/PhoneCard";
import {Body, Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

export const Scene08AutoTransfer: React.FC = () => {
  const left = useEnter(0);
  const phone = useEnter(10, 70);

  return (
    <AbsoluteFill>
      <Stage padding="72px 120px">
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 70}}>
          <div style={{...left, display: "flex", flexDirection: "column", gap: 26, maxWidth: 900}}>
            <Kicker color={COLORS.blue}>আজকের কাজ</Kicker>
            <Title size={92}>
              আজ রাতেই <span style={{color: COLORS.blue}}>অটো ট্রান্সফার</span> সেট করুন
            </Title>
            <Body size={34} weight={600} color={COLORS.navy}>
              বেতন আসার দিনই ৬,০০০ টাকা আলাদা হয়ে যাবে
            </Body>
            <div style={{display: "flex", gap: 18, marginTop: 8}}>
              <Chip color={COLORS.green} size={30}>
                ১০ মিনিট লাগবে
              </Chip>
              <Chip color={COLORS.navy} size={30}>
                একবারই সেট করতে হবে
              </Chip>
            </div>
          </div>

          <div style={phone}>
            <PhoneCard delay={14} />
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

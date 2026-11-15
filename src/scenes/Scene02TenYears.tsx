import React from "react";
import {AbsoluteFill} from "remotion";
import {Panel} from "../components/Backdrop";
import {MoneyBar} from "../components/MoneyBar";
import {Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

/**
 * Voiceover: "১০ বছর পর" 6.00 s, "রাকিবের অ্যাকাউন্টে ১৪ লাখ টাকা" 8.32 s,
 * "সুমনের মাত্র ৮০ হাজার" 9.94 s.
 * Scene starts at 5.733 s (frame 172).
 */
export const Scene02TenYears: React.FC = () => {
  const header = useEnter(8);
  const panel = useEnter(4);
  const gapChip = useEnter(188);

  return (
    <AbsoluteFill>
      <Stage>
        <div style={header}>
          <Kicker color={COLORS.gold}>১০ বছর পর</Kicker>
          <Title size={84} style={{marginTop: 16}}>
            একই বেতন, <span style={{color: COLORS.coral}}>ভিন্ন ফল</span>
          </Title>
        </div>

        <div style={panel}>
          <Panel accent={COLORS.gold}>
            <div style={{display: "flex", flexDirection: "column", gap: 34}}>
              <MoneyBar
                label="রাকিবের অ্যাকাউন্ট"
                value="৳ ১৪,০০,০০০"
                ratio={1}
                color={COLORS.green}
                delay={74}
              />
              <MoneyBar
                label="সুমনের অ্যাকাউন্ট"
                value="৳ ৮০,০০০"
                ratio={0.06}
                color={COLORS.coral}
                delay={124}
              />
            </div>
          </Panel>
        </div>

        <div style={{display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
          <div style={gapChip}>
            <Chip color={COLORS.gold} fg={COLORS.navy}>
              পার্থক্য ১৩ লাখ ২০ হাজার
            </Chip>
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

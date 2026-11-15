import React from "react";
import {AbsoluteFill} from "remotion";
import {Panel} from "../components/Backdrop";
import {MoneyBar} from "../components/MoneyBar";
import {Body, Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

export const Scene02TenYears: React.FC = () => {
  const header = useEnter(0);
  const panel = useEnter(10);

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
                delay={18}
              />
              <MoneyBar
                label="সুমনের অ্যাকাউন্ট"
                value="৳ ৮০,০০০"
                ratio={0.06}
                color={COLORS.coral}
                delay={30}
              />
            </div>
          </Panel>
        </div>

        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <Body size={34} weight={600} color={COLORS.navy}>
            উভয়ের মাসিক বেতন ৩০,০০০ টাকা
          </Body>
          <Chip color={COLORS.gold} fg={COLORS.navy}>
            পার্থক্য ১৩ লাখ ২০ হাজার
          </Chip>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

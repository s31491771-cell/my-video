import React from "react";
import {AbsoluteFill} from "remotion";
import {PhoneCard} from "../components/PhoneCard";
import {Body, Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

/**
 * Voiceover: "আজ রাতেই ব্যাংক অ্যাপে অটো ট্রান্সফার সেট করুন" 40.12 s,
 * "১০ মিনিট লাগবে" 42.94 s.
 * Scene starts at 39.833 s (frame 1195), ends 44.033 s.
 */
export const Scene08AutoTransfer: React.FC = () => {
  const left = useEnter(6);
  const phone = useEnter(10, 70);
  const tenMinutes = useEnter(92);
  const once = useEnter(100);

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
              <div style={tenMinutes}>
                <Chip color={COLORS.green} size={30}>
                  ১০ মিনিট লাগবে
                </Chip>
              </div>
              <div style={once}>
                <Chip color={COLORS.navy} size={30}>
                  একবারই সেট করতে হবে
                </Chip>
              </div>
            </div>
          </div>

          <div style={phone}>
            <PhoneCard delay={10} toggleDelay={26} />
          </div>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

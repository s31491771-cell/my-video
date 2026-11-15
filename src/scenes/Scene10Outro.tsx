import React from "react";
import {AbsoluteFill} from "remotion";
import {Body, Chip, Kicker, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

/**
 * Voiceover: "ফলো করুন" 46.22 s, "পরের ভিডিওতে বলবো টাকা কোথায় বিনিয়োগ করবেন"
 * 46.94-49.24 s. Scene starts at 46.000 s (frame 1380).
 */
export const Scene10Outro: React.FC = () => {
  const top = useEnter(7);
  const cta = useEnter(24);
  const next = useEnter(30);

  return (
    <AbsoluteFill>
      <Stage justify="center" gap={34} padding="78px 130px">
        <div style={top}>
          <Kicker color={COLORS.green}>শেষ কথা</Kicker>
          <Title size={104} style={{marginTop: 12}}>
            ফলো করুন
          </Title>
        </div>

        <div style={{...cta, display: "flex", gap: 18, alignItems: "center"}}>
          <Chip color={COLORS.green} size={34}>
            পেই ইওরসেলফ ফার্স্ট
          </Chip>
          <Chip color={COLORS.gold} fg={COLORS.navy} size={34}>
            আজই শুরু করুন
          </Chip>
        </div>

        <div
          style={{
            ...next,
            display: "flex",
            alignItems: "center",
            gap: 26,
            background: COLORS.navy,
            borderRadius: 28,
            padding: "26px 34px",
            width: "fit-content",
            boxShadow: "0 26px 60px rgba(20,45,78,0.28)",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: COLORS.coral,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              color: COLORS.white,
            }}
          >
            ▶
          </div>
          <Body size={34} weight={600} color={COLORS.white}>
            পরের ভিডিও: টাকা কোথায় বিনিয়োগ করবেন?
          </Body>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

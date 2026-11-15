import React from "react";
import {AbsoluteFill} from "remotion";
import {Body, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

/**
 * Voiceover: "তারপর বাকি টাকা দিয়ে খরচ" 24.66 s,
 * "একে বলে পেই ইওরসেলফ ফার্স্ট" 26.84 s,
 * "নিজেকে আগে টাকা দিন" 29.28 s.
 * Scene starts at 24.433 s (frame 733), ends 30.933 s.
 */
export const Scene05SpendRest: React.FC = () => {
  const top = useEnter(6);
  const english = useEnter(70);
  const bangla = useEnter(145);

  return (
    <AbsoluteFill>
      <Stage justify="center" gap={52} padding="72px 120px">
        <div style={top}>
          <Body size={36} weight={600} color={COLORS.muted}>
            তারপর বাকি টাকা দিয়ে খরচ
          </Body>
        </div>

        <div style={english}>
          <Title size={104} color={COLORS.navy}>
            Pay Yourself <span style={{color: COLORS.gold}}>First</span>
          </Title>
        </div>

        <div
          style={{
            ...bangla,
            display: "flex",
            alignItems: "center",
            gap: 26,
            background: COLORS.paper,
            border: `1px solid ${COLORS.line}`,
            borderRadius: 26,
            padding: "24px 34px",
            boxShadow: "0 20px 50px rgba(20,45,78,0.12)",
            width: "fit-content",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: COLORS.gold,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.navy,
            }}
          >
            ১
          </div>
          <Body size={40} weight={700} color={COLORS.navy}>
            নিজেকে আগে টাকা দিন
          </Body>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

import React from "react";
import {AbsoluteFill} from "remotion";
import {Body, Chip, Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

export const Scene05SpendRest: React.FC = () => {
  const top = useEnter(0);
  const english = useEnter(14);
  const bottom = useEnter(26);

  return (
    <AbsoluteFill>
      <Stage justify="center" gap={44} padding="72px 120px">
        <div style={{...top, display: "flex", flexDirection: "column", gap: 18}}>
          <Body size={36} weight={600} color={COLORS.muted}>
            তারপর বাকি টাকা দিয়ে খরচ
          </Body>
          <Title size={112} color={COLORS.navy}>
            Pay Yourself <span style={{color: COLORS.gold}}>First</span>
          </Title>
        </div>

        <div
          style={{
            ...english,
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

        <div style={{...bottom}}>
          <Chip color={COLORS.navy} size={30}>
            আগে জমা — পরে খরচ
          </Chip>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

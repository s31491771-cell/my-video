import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {Stage, Title, useEnter} from "../components/Type";
import {COLORS} from "../theme";

/**
 * Voiceover: "১০ বছর বদলে যাবে" 44.26-45.50 s.
 * Scene starts at 44.033 s (frame 1321), ends 46.000 s.
 */
export const Scene09TenYears: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useEnter(2, 28);
  const b = useEnter(7, 36);
  const line = interpolate(frame, [7, 21], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Stage justify="center" padding="80px 140px" gap={18}>
        <div
          style={{
            ...a,
            display: "flex",
            alignItems: "baseline",
            gap: 38,
            justifyContent: "center",
          }}
        >
          <Title size={92} color={COLORS.muted}>
            ১০ মিনিট
          </Title>
          <div style={{fontSize: 64, fontWeight: 700, color: COLORS.blue, opacity: line}}>→</div>
          <Title size={110} color={COLORS.green}>
            ১০ বছর
          </Title>
        </div>
        <div
          style={{
            height: 10,
            width: `${line * 62}%`,
            background: COLORS.gold,
            borderRadius: 999,
            margin: "0 auto",
          }}
        />
        <div style={{...b, textAlign: "center", marginTop: 10}}>
          <Title size={78} align="center">
            ১০ বছর <span style={{color: COLORS.gold}}>বদলে যাবে</span>
          </Title>
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

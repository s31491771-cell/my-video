import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, FONT_FAMILY} from "../theme";

type Props = {delay?: number; toggleDelay?: number};

/** Bank-app mockup with an auto-transfer toggle switching itself on. */
export const PhoneCard: React.FC<Props> = ({delay = 0, toggleDelay = 22}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness: 90},
  });
  const toggle = spring({
    frame: frame - delay - toggleDelay,
    fps,
    config: {damping: 18, stiffness: 120},
  });
  const knob = interpolate(toggle, [0, 1], [0, 58]);

  return (
    <div
      style={{
        width: 400,
        height: 720,
        borderRadius: 54,
        background: COLORS.navy,
        padding: 16,
        boxShadow: "0 40px 90px rgba(20,45,78,0.32)",
        transform: `translateY(${interpolate(enter, [0, 1], [70, 0])}px) scale(${
          0.94 + enter * 0.06
        })`,
        opacity: enter,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 40,
          background: COLORS.paper,
          padding: "44px 30px 30px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div style={{fontSize: 26, color: COLORS.muted, fontWeight: 600}}>ব্যাংক অ্যাপ</div>
        <div style={{fontSize: 34, fontWeight: 800, color: COLORS.navy, lineHeight: 1.5}}>
          অটো ট্রান্সফার
        </div>
        <div
          style={{
            borderRadius: 24,
            background: "rgba(57,140,229,0.10)",
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{fontSize: 24, color: COLORS.muted}}>পরিমাণ</div>
          <div style={{fontSize: 46, fontWeight: 800, color: COLORS.navy}}>৳ ৬,০০০</div>
          <div style={{fontSize: 24, color: COLORS.muted}}>প্রতি মাসে</div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 24,
            border: `1px solid ${COLORS.line}`,
            padding: "20px 24px",
          }}
        >
          <div style={{fontSize: 28, fontWeight: 700, color: COLORS.navy}}>সক্রিয়</div>
          <div
            style={{
              width: 92,
              height: 50,
              borderRadius: 999,
              background: toggle > 0.4 ? COLORS.green : "rgba(20,45,78,0.18)",
              padding: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                background: COLORS.white,
                transform: `translateX(${knob}px)`,
                boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
              }}
            />
          </div>
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: COLORS.green,
            color: COLORS.white,
            borderRadius: 20,
            padding: "18px 0",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          সেটিংস সেভ হয়েছে
        </div>
      </div>
    </div>
  );
};

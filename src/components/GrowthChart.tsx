import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {COLORS, FONT_FAMILY} from "../theme";

type Props = {
  delay?: number;
  width?: number;
  height?: number;
};

const YEARS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// ৬,০০০/মাস at 12% annual (1% monthly), contributions vs total value.
const TOTAL = [
  0, 76095, 160838, 258462, 367337, 490019, 628261, 784032, 959563, 1157152,
  1380234,
];
const CONTRIB = [0, 72000, 144000, 216000, 288000, 360000, 432000, 504000, 576000, 648000, 720000];
const MAX = 1450000;

/**
 * Compounding chart: contributions (blue) vs total value (green area).
 * The reveal is driven by a clip rect so the curve draws left to right.
 */
export const GrowthChart: React.FC<Props> = ({delay = 0, width = 1080, height = 470}) => {
  const frame = useCurrentFrame();
  const padX = 34;
  const padTop = 26;
  const padBottom = 58;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;

  const progress = interpolate(frame - delay, [0, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x = (year: number) => padX + (year / 10) * innerW;
  const y = (value: number) => padTop + innerH - (value / MAX) * innerH;

  const totalPath = TOTAL.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const contribPath = CONTRIB.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const areaPath = `${totalPath} L ${x(10)} ${padTop + innerH} L ${x(0)} ${padTop + innerH} Z`;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        fontFamily: FONT_FAMILY,
      }}
    >
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.42} />
            <stop offset="100%" stopColor={COLORS.green} stopOpacity={0.04} />
          </linearGradient>
          <clipPath id="growthClip">
            <rect
              x={0}
              y={0}
              width={padX + progress * (innerW + 8)}
              height={height}
            />
          </clipPath>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={width - padX}
            y1={padTop + innerH * t}
            y2={padTop + innerH * t}
            stroke="rgba(20,45,78,0.12)"
            strokeWidth={2}
            strokeDasharray="6 10"
          />
        ))}

        <g clipPath="url(#growthClip)">
          <path d={areaPath} fill="url(#growthFill)" />
          <path
            d={contribPath}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray="1 0"
          />
          <path
            d={totalPath}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {YEARS.map((year) => (
          <text
            key={year}
            x={x(year)}
            y={height - 20}
            textAnchor="middle"
            fontSize={26}
            fill={COLORS.muted}
            fontFamily={FONT_FAMILY}
          >
            {year}
          </text>
        ))}
        <text x={padX} y={height - 20} textAnchor="start" fontSize={26} fill={COLORS.muted}>
          ০
        </text>
        <text x={padX + 10} y={22} fontSize={26} fill={COLORS.muted}>
          বছর
        </text>
      </svg>
    </div>
  );
};

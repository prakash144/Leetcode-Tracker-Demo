"use client";

import { memo, useEffect, useState } from "react";

interface DonutSegment {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSubLabel?: string;
  onSegmentClick?: (segment: DonutSegment) => void;
}

const DonutChart = memo(function DonutChart({
  segments,
  size = 160,
  strokeWidth = 28,
  centerLabel,
  centerSubLabel,
  onSegmentClick,
}: DonutChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  if (total === 0) {
    return (
      <svg width={size} height={size} className="shrink-0">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgb(39 39 42)"
          strokeWidth={strokeWidth}
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgb(161 161 170)"
          className="text-xs"
        >
          No data
        </text>
      </svg>
    );
  }

  let offset = 0;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgb(39 39 42)"
        strokeWidth={strokeWidth}
      />
      {segments.map((segment) => {
        const fraction = segment.value / total;
        const dashLength = fraction * circumference;
        const segOffset = offset;
        offset += fraction * circumference;

        return (
          <circle
            key={segment.name}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={animated ? -segOffset : circumference}
            strokeLinecap="butt"
            className={`transition-all duration-1000 ease-out hover:opacity-80 ${onSegmentClick ? "cursor-pointer" : ""}`}
            transform={`rotate(-90 ${center} ${center})`}
            onClick={() => onSegmentClick?.(segment)}
          />
        );
      })}
      {centerLabel && (
        <text
          x={center}
          y={center - (centerSubLabel ? 6 : 0)}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgb(228 228 231)"
          className="text-lg font-bold"
        >
          {centerLabel}
        </text>
      )}
      {centerSubLabel && (
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgb(161 161 170)"
          className="text-xs"
        >
          {centerSubLabel}
        </text>
      )}
    </svg>
  );
});

export default DonutChart;

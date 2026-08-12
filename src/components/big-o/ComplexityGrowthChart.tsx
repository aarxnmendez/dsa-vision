import type { ComplexityDimension } from "../../data/bigOReference";

const CHART_WIDTH = 640;
const CHART_HEIGHT = 320;
const PADDING = { top: 24, right: 24, bottom: 48, left: 56 };

const allCurves = [
  {
    id: "constant",
    label: "O(1)",
    color: "#006c49",
    fn: () => 1,
  },
  {
    id: "log",
    label: "O(log n)",
    color: "#0057bf",
    fn: (n: number) => Math.log2(Math.max(n, 1)),
  },
  {
    id: "linear",
    label: "O(n)",
    color: "#825100",
    fn: (n: number) => n,
  },
  {
    id: "nlogn",
    label: "O(n log n)",
    color: "#653e00",
    fn: (n: number) => n * Math.log2(Math.max(n, 1)),
  },
  {
    id: "quadratic",
    label: "O(n²)",
    color: "#ba1a1a",
    fn: (n: number) => n * n,
  },
] as const;

const spaceCurveIds = new Set(["constant", "log", "linear"]);

function buildPath(
  fn: (n: number) => number,
  maxInput: number,
  maxValue: number,
  plotWidth: number,
  plotHeight: number,
) {
  const points: string[] = [];

  for (let i = 0; i <= maxInput; i++) {
    const x = PADDING.left + (i / maxInput) * plotWidth;
    const value = fn(i + 1);
    const y =
      PADDING.top + plotHeight - (Math.min(value, maxValue) / maxValue) * plotHeight;
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return points.join(" ");
}

interface ComplexityGrowthChartProps {
  dimension: ComplexityDimension;
}

export function ComplexityGrowthChart({ dimension }: ComplexityGrowthChartProps) {
  const maxInput = 20;
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const maxValue = maxInput * maxInput;
  const curves =
    dimension === "space"
      ? allCurves.filter((curve) => spaceCurveIds.has(curve.id))
      : allCurves;

  const yAxisLabel = dimension === "time" ? "Operations" : "Extra memory";
  const chartLabel =
    dimension === "time"
      ? "Comparison of time complexity growth curves"
      : "Comparison of space complexity growth curves";

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full min-w-[320px] max-w-3xl mx-auto"
        role="img"
        aria-label={chartLabel}
      >
        <rect
          x={PADDING.left}
          y={PADDING.top}
          width={plotWidth}
          height={plotHeight}
          className="fill-surface-container-low"
          rx={12}
        />

        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const y = PADDING.top + plotHeight * (1 - fraction);
          return (
            <line
              key={fraction}
              x1={PADDING.left}
              y1={y}
              x2={PADDING.left + plotWidth}
              y2={y}
              stroke="#dfe3e7"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          );
        })}

        <line
          x1={PADDING.left}
          y1={PADDING.top + plotHeight}
          x2={PADDING.left + plotWidth}
          y2={PADDING.top + plotHeight}
          stroke="#727786"
          strokeWidth={2}
        />
        <line
          x1={PADDING.left}
          y1={PADDING.top}
          x2={PADDING.left}
          y2={PADDING.top + plotHeight}
          stroke="#727786"
          strokeWidth={2}
        />

        <text
          x={PADDING.left + plotWidth / 2}
          y={CHART_HEIGHT - 8}
          textAnchor="middle"
          className="fill-on-surface-variant text-xs font-semibold"
        >
          Input size (n)
        </text>
        <text
          x={16}
          y={PADDING.top + plotHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90 16 ${PADDING.top + plotHeight / 2})`}
          className="fill-on-surface-variant text-xs font-semibold"
        >
          {yAxisLabel}
        </text>

        {curves.map((curve) => (
          <path
            key={curve.id}
            d={buildPath(curve.fn, maxInput, maxValue, plotWidth, plotHeight)}
            fill="none"
            stroke={curve.color}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}

        {curves.map((curve, index) => (
          <g key={`${curve.id}-legend`}>
            <rect
              x={PADDING.left + 12}
              y={PADDING.top + 12 + index * 22}
              width={12}
              height={12}
              rx={3}
              fill={curve.color}
            />
            <text
              x={PADDING.left + 30}
              y={PADDING.top + 22 + index * 22}
              className="fill-on-surface text-xs font-bold"
            >
              {curve.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

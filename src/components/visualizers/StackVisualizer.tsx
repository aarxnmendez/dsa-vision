import { useTranslation } from "react-i18next";
import type { StackItemHighlight, StackItemState, StackPhase } from "../../types/stackStructure";
import {
  STACK_BLOCK_HIGHLIGHT_STYLE,
  STACK_BLOCK_IDLE_BODY,
  STACK_BLOCK_IDLE_TOP,
  STACK_BUCKET_CLASS,
  STACK_BUCKET_ERROR_CLASS,
  STACK_CAPACITY_LABEL_CLASS,
  STACK_CAPACITY_LABEL_NEUTRAL_CLASS,
  STACK_CAPACITY_LABEL_OVERFLOW_CLASS,
  STACK_LEGEND_ITEMS,
  STACK_LEGEND_SWATCH_CLASS,
  type StackBlockStyle,
} from "../../constants/visualizerTokens";

interface StackVisualizerProps {
  items: StackItemState[];
  maxCapacity: number;
  size: number;
  phase?: StackPhase;
  isError?: boolean;
  stepTransitionMs?: number;
}

const SVG_WIDTH = 320;
const SVG_HEIGHT = 420;
const RACK_LEFT = 44;
const RACK_RIGHT = 276;
const RACK_TOP = 56;
const RACK_FLOOR_Y = 356;
const BLOCK_LEFT = 64;
const BLOCK_WIDTH = 192;
const BLOCK_HEIGHT = 28;
const BLOCK_RADIUS = 8;
const BLOCK_RIGHT = BLOCK_LEFT + BLOCK_WIDTH;
const BLOCK_CENTER_X = BLOCK_LEFT + BLOCK_WIDTH / 2;
const BLOCK_STACK_STEP = 30;

function getBlockTopY(stackIndex: number): number {
  return RACK_FLOOR_Y - BLOCK_HEIGHT - stackIndex * BLOCK_STACK_STEP;
}

function resolveBlockStyle(
  item: StackItemState,
): StackBlockStyle {
  const highlightStyle = STACK_BLOCK_HIGHLIGHT_STYLE[item.highlightState];
  if (highlightStyle) {
    return highlightStyle;
  }

  return item.isTop ? STACK_BLOCK_IDLE_TOP : STACK_BLOCK_IDLE_BODY;
}

function blockMotionClass(highlight: StackItemHighlight): string {
  switch (highlight) {
    case "pushing":
      return "scale-[1.015]";
    case "popping":
      return "-translate-y-1 scale-[1.02] opacity-80";
    case "clearing":
      return "opacity-50";
    case "removed":
      return "-translate-y-3 opacity-0";
    default:
      return "translate-y-0 opacity-100";
  }
}

function StackBlock({
  item,
  topY,
  stepTransitionMs,
}: {
  item: StackItemState;
  topY: number;
  stepTransitionMs: number;
}) {
  const style = resolveBlockStyle(item);
  const motion = blockMotionClass(item.highlightState);
  const textY = topY + BLOCK_HEIGHT / 2 + 5;

  return (
    <g
      className={motion}
      style={{
        transformOrigin: `${BLOCK_CENTER_X}px ${topY + BLOCK_HEIGHT / 2}px`,
        transition: `transform ${stepTransitionMs}ms ease-out, opacity ${stepTransitionMs}ms ease-out`,
      }}
    >
      <rect
        x={BLOCK_LEFT + 3}
        y={topY + BLOCK_HEIGHT + 1}
        width={BLOCK_WIDTH - 6}
        height={3}
        rx={1.5}
        fill="rgba(15,23,42,0.08)"
      />

      <rect
        x={BLOCK_LEFT}
        y={topY}
        width={BLOCK_WIDTH}
        height={BLOCK_HEIGHT}
        rx={BLOCK_RADIUS}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
      />

      <text
        x={BLOCK_CENTER_X}
        y={textY}
        textAnchor="middle"
        fill={style.textFill}
        opacity={style.textOpacity}
        className="font-mono text-sm tabular-nums"
        style={{
          fontSize: "14px",
          fontWeight: style.fontWeight,
        }}
      >
        {item.value}
      </text>
    </g>
  );
}

function StackContainer({
  maxCapacity,
  occupiedCount,
}: {
  maxCapacity: number;
  occupiedCount: number;
}) {
  return (
    <g aria-hidden="true">
      <line
        x1={RACK_LEFT}
        y1={RACK_TOP}
        x2={RACK_LEFT}
        y2={RACK_FLOOR_Y}
        stroke="#e2e8f0"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={RACK_RIGHT}
        y1={RACK_TOP}
        x2={RACK_RIGHT}
        y2={RACK_FLOOR_Y}
        stroke="#e2e8f0"
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {Array.from({ length: maxCapacity }, (_, slotIndex) => {
        const slotCenterY = getBlockTopY(slotIndex) + BLOCK_HEIGHT / 2;
        const isOccupied = slotIndex < occupiedCount;

        return (
          <line
            key={`slot-${slotIndex}`}
            x1={RACK_LEFT + 8}
            y1={slotCenterY}
            x2={RACK_RIGHT - 8}
            y2={slotCenterY}
            stroke={isOccupied ? "#f1f5f9" : "#e2e8f0"}
            strokeWidth={1}
            strokeDasharray={isOccupied ? "0" : "4 4"}
          />
        );
      })}

      <rect
        x={RACK_LEFT - 4}
        y={RACK_FLOOR_Y}
        width={RACK_RIGHT - RACK_LEFT + 8}
        height={10}
        rx={4}
        fill="#f1f5f9"
        stroke="#e2e8f0"
        strokeWidth={1}
      />
    </g>
  );
}

function TopBadge({
  blockTopY,
  visible,
  stepTransitionMs,
  topLabel,
}: {
  blockTopY: number;
  visible: boolean;
  stepTransitionMs: number;
  topLabel: string;
}) {
  if (!visible) {
    return null;
  }

  const referenceCenterY = getBlockTopY(0) + BLOCK_HEIGHT / 2;
  const centerY = blockTopY + BLOCK_HEIGHT / 2;
  const badgeX = BLOCK_RIGHT + 10;
  const badgeWidth = 34;
  const badgeHeight = 20;

  return (
    <g
      aria-hidden="true"
      style={{
        transform: `translateY(${centerY - referenceCenterY}px)`,
        transition: `transform ${stepTransitionMs}ms ease-out`,
      }}
    >
      <rect
        x={badgeX}
        y={referenceCenterY - badgeHeight / 2}
        width={badgeWidth}
        height={badgeHeight}
        rx={6}
        fill="#eff6ff"
        stroke="#3b82f6"
        strokeWidth={1.5}
      />
      <text
        x={badgeX + badgeWidth / 2}
        y={referenceCenterY + 4}
        textAnchor="middle"
        className="fill-blue-700 text-[9px] font-bold uppercase tracking-wide"
      >
        {topLabel}
      </text>
    </g>
  );
}

export function StackStructureLegendBar() {
  const { t } = useTranslation("structures");

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest px-4 py-3"
      aria-label="Color legend"
    >
      {STACK_LEGEND_ITEMS.map(({ token }) => (
        <span
          key={token}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700"
        >
          <span
            className={[
              "h-4 w-4 shrink-0 rounded",
              STACK_LEGEND_SWATCH_CLASS[token],
            ].join(" ")}
            aria-hidden="true"
          />
          {t(`legends.stack.${token}`)}
        </span>
      ))}
    </div>
  );
}

export function StackVisualizer({
  items,
  maxCapacity,
  size,
  phase,
  isError = false,
  stepTransitionMs = 200,
}: StackVisualizerProps) {
  const { t } = useTranslation("structures");
  const showErrorGlow =
    isError || phase === "overflow" || phase === "underflow";
  const showCapacityOverflow =
    phase === "overflow" || (isError && size >= maxCapacity);
  const topItem = items.find((item) => item.isTop);
  const topBlockTopY = topItem
    ? getBlockTopY(items.indexOf(topItem))
    : getBlockTopY(0);

  return (
    <div
      className={[
        "mx-auto w-full max-w-md rounded-xl bg-surface-container-lowest/80 px-4 py-5",
        STACK_BUCKET_CLASS,
        showErrorGlow ? STACK_BUCKET_ERROR_CLASS : "",
      ].join(" ")}
    >
      <p
        className={[
          STACK_CAPACITY_LABEL_CLASS,
          showCapacityOverflow
            ? STACK_CAPACITY_LABEL_OVERFLOW_CLASS
            : STACK_CAPACITY_LABEL_NEUTRAL_CLASS,
        ].join(" ")}
      >
        {t("visualizer.stack.capacitySummary", { size, max: maxCapacity })}
      </p>

      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="mx-auto h-auto w-full max-w-[320px] overflow-visible"
        role="img"
        aria-label={t("visualizer.stack.ariaLabel", { size, max: maxCapacity })}
      >
        <StackContainer maxCapacity={maxCapacity} occupiedCount={size} />

        {items.map((item, index) => (
          <StackBlock
            key={item.id}
            item={item}
            topY={getBlockTopY(index)}
            stepTransitionMs={stepTransitionMs}
          />
        ))}

        <TopBadge
          blockTopY={topBlockTopY}
          visible={size > 0}
          stepTransitionMs={stepTransitionMs}
          topLabel={t("visualizer.stack.topBadge")}
        />
      </svg>
    </div>
  );
}

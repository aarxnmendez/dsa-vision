import { useTranslation } from "react-i18next";
import { ChevronIcon } from "../ui/ChevronIcon";
import type {
  QueueItemHighlight,
  QueueItemState,
  QueueOperationId,
  QueuePhase,
} from "../../types/queueStructure";
import { FIRST_ROW_CAPACITY } from "../visualizers/ArrayVisualizer";
import {
  QUEUE_BUCKET_CLASS,
  QUEUE_BUCKET_ERROR_CLASS,
  QUEUE_CAPACITY_LABEL_CLASS,
  QUEUE_CAPACITY_LABEL_NEUTRAL_CLASS,
  QUEUE_CAPACITY_LABEL_OVERFLOW_CLASS,
  QUEUE_LEGEND_ITEMS,
  QUEUE_LEGEND_SWATCH_CLASS,
  BINARY_SEARCH_CELL_STYLES,
} from "../../constants/visualizerTokens";

interface QueueVisualizerProps {
  items: Array<QueueItemState | undefined>;
  maxCapacity: number;
  size: number;
  operation?: QueueOperationId;
  phase?: QueuePhase;
  isError?: boolean;
  stepTransitionMs?: number;
}

const neutralCellClass =
  "bg-white border-2 border-slate-200 border-b-4 shadow-sm";

const QUEUE_CELL_LAYOUT_CLASS =
  "w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl flex items-center justify-center relative transition-all";

const QUEUE_SLOTS_GRID_OUTER_CLASS =
  "flex w-full max-w-full min-w-0 flex-col items-center overflow-visible";

const QUEUE_SLOTS_GRID_ROW_CLASS =
  "flex w-full flex-nowrap items-center justify-center gap-2 pt-12 md:gap-3";

function splitSlotRows(count: number): number[][] {
  if (count <= FIRST_ROW_CAPACITY) {
    return [Array.from({ length: count }, (_, index) => index)];
  }

  const firstRow = Array.from(
    { length: FIRST_ROW_CAPACITY },
    (_, index) => index,
  );
  const secondRow = Array.from(
    { length: count - FIRST_ROW_CAPACITY },
    (_, index) => index + FIRST_ROW_CAPACITY,
  );

  return [firstRow, secondRow];
}

const QUEUE_POINTER_COLORS = {
  front: {
    label: "text-blue-600 bg-blue-50 border border-blue-200",
    arrow: "text-blue-500",
  },
  rear: {
    label: "bg-emerald-50 border border-emerald-400 text-emerald-700",
    arrow: "text-emerald-600",
  },
} as const;

const badgeTextClass = "text-xs font-semibold px-2 py-0.5 whitespace-nowrap";

const QUEUE_FRONT_ROLE_CLASS =
  "border-2 border-blue-500 bg-blue-50/50 ring-4 ring-blue-400/30 shadow-[0_0_12px_rgba(59,130,246,0.35)]";

const QUEUE_REAR_ROLE_CLASS = [
  "border-2 border-emerald-500 bg-emerald-50/50",
  "ring-4 ring-emerald-400/25",
  "shadow-[0_0_12px_rgba(16,185,129,0.3)]",
  BINARY_SEARCH_CELL_STYLES.found,
].join(" ");

const QUEUE_HIGHLIGHT_CELL_CLASS: Record<QueueItemHighlight, string> = {
  default: "",
  enqueueing:
    "border-2 border-cyan-500 bg-cyan-50/60 ring-4 ring-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.3)]",
  dequeuing:
    "border-2 border-orange-500 bg-orange-50/60 ring-4 ring-orange-400/30 shadow-[0_0_12px_rgba(249,115,22,0.3)]",
  outgoing:
    "border-2 border-orange-500 bg-orange-50/60 ring-4 ring-orange-400/30 shadow-[0_0_12px_rgba(249,115,22,0.3)]",
  peeking: ["border-2 border-blue-500 bg-blue-50/60", BINARY_SEARCH_CELL_STYLES.comparing].join(
    " ",
  ),
  found: QUEUE_REAR_ROLE_CLASS,
  clearing:
    "border-2 border-orange-500 bg-orange-50/40 ring-4 ring-orange-400/20 opacity-80",
  removed: "opacity-0 scale-95",
};

function blockMotionClass(
  highlight: QueueItemHighlight,
  item: QueueItemState,
): string {
  if (item.isRear && !item.isFront) {
    return "";
  }

  switch (highlight) {
    case "enqueueing":
      return "scale-[1.03]";
    case "outgoing":
      return "";
    case "dequeuing":
      return "-translate-x-[calc(100%+2.5rem)] opacity-0 scale-90";
    default:
      return "";
  }
}

function pointerRoleClass(item: QueueItemState): string {
  if (item.isFront && item.isRear) {
    return QUEUE_FRONT_ROLE_CLASS;
  }
  if (item.isFront) {
    return QUEUE_FRONT_ROLE_CLASS;
  }
  if (item.isRear) {
    return QUEUE_REAR_ROLE_CLASS;
  }
  return "";
}

function resolveCellSurfaceClass(item: QueueItemState): string {
  const { highlightState } = item;
  const roleClass = pointerRoleClass(item);

  if (
    highlightState === "enqueueing" ||
    highlightState === "dequeuing" ||
    highlightState === "outgoing" ||
    highlightState === "peeking" ||
    highlightState === "clearing" ||
    highlightState === "removed"
  ) {
    return QUEUE_HIGHLIGHT_CELL_CLASS[highlightState];
  }

  if (item.isRear && !item.isFront) {
    return QUEUE_REAR_ROLE_CLASS;
  }

  if (highlightState === "found") {
    if (roleClass) {
      return roleClass;
    }
    return QUEUE_REAR_ROLE_CLASS;
  }

  return roleClass || neutralCellClass;
}

function QueuePointerBadge({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof QUEUE_POINTER_COLORS;
}) {
  const colors = QUEUE_POINTER_COLORS[tone];

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 flex flex-col items-center whitespace-nowrap z-10 pointer-events-none"
    >
      <span
        className={[badgeTextClass, "rounded-lg border", colors.label].join(" ")}
      >
        {label}
      </span>
      <ChevronIcon
        direction="left"
        className={["h-4 w-4 rotate-[-90deg]", colors.arrow].join(" ")}
      />
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="flex shrink-0 flex-col items-center">
      <div
        className={[
          QUEUE_CELL_LAYOUT_CLASS,
          "border-2 border-dashed border-slate-300/60 bg-transparent shadow-none border-b-2",
        ].join(" ")}
        aria-hidden="true"
      />
    </div>
  );
}

function QueueCellSlot({
  item,
  stepTransitionMs,
  frontPointerLabel,
  rearPointerLabel,
  hidePointerBadges,
}: {
  item?: QueueItemState;
  stepTransitionMs: number;
  frontPointerLabel: string;
  rearPointerLabel: string;
  hidePointerBadges?: boolean;
}) {
  if (!item) {
    return <EmptySlot />;
  }

  const motion = blockMotionClass(item.highlightState, item);
  const isOutgoingMarked = item.highlightState === "outgoing";
  const isExiting = item.highlightState === "dequeuing";
  const showFrontBadge = !hidePointerBadges && item.isFront;
  const showRearBadge = !hidePointerBadges && item.isRear && !item.isFront;
  const surfaceClass = resolveCellSurfaceClass(item);

  return (
    <div className="flex shrink-0 flex-col items-center">
      <div
        className={[
          "relative overflow-visible transition-all",
          isExiting || isOutgoingMarked ? "z-20" : "",
          motion,
        ].join(" ")}
        style={{ transitionDuration: `${stepTransitionMs}ms` }}
      >
        {showFrontBadge && (
          <QueuePointerBadge label={frontPointerLabel} tone="front" />
        )}
        {showRearBadge && (
          <QueuePointerBadge label={rearPointerLabel} tone="rear" />
        )}

        <div className={[QUEUE_CELL_LAYOUT_CLASS, surfaceClass].join(" ")}>
          <span className="font-bold text-base tabular-nums text-slate-900">
            {item.value}
          </span>
        </div>
      </div>
    </div>
  );
}

export function QueueStructureLegendBar() {
  const { t } = useTranslation("structures");
  const { t: tCommon } = useTranslation("common");

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest px-4 py-3"
      aria-label={tCommon("aria.colorLegend")}
    >
      {QUEUE_LEGEND_ITEMS.map(({ token }) => (
        <span
          key={token}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700"
        >
          <span
            className={[
              "h-4 w-4 shrink-0 rounded",
              QUEUE_LEGEND_SWATCH_CLASS[token],
            ].join(" ")}
            aria-hidden="true"
          />
          {t(`legends.queue.${token}`)}
        </span>
      ))}
    </div>
  );
}

export function QueueVisualizer({
  items,
  maxCapacity,
  size,
  operation,
  phase,
  isError = false,
  stepTransitionMs = 200,
}: QueueVisualizerProps) {
  const { t } = useTranslation("structures");
  const showErrorGlow =
    isError || phase === "overflow" || phase === "underflow";
  const showCapacityOverflow =
    phase === "overflow" || (isError && size >= maxCapacity);

  const slots = Array.from({ length: maxCapacity }, (_, slotIndex) =>
    items[slotIndex],
  );
  const hidePointerBadges = operation === "clear" && phase === "clear";
  const slotRows = splitSlotRows(maxCapacity);
  const isMultiRow = slotRows.length > 1;

  const renderSlot = (slotIndex: number) => (
    <QueueCellSlot
      key={slots[slotIndex]?.id ?? `empty-${slotIndex}`}
      item={slots[slotIndex]}
      stepTransitionMs={stepTransitionMs}
      frontPointerLabel={t("visualizer.queue.frontPointer")}
      rearPointerLabel={t("visualizer.queue.rearPointer")}
      hidePointerBadges={hidePointerBadges}
    />
  );

  return (
    <div
      className={[
        "mx-auto w-full max-w-full overflow-hidden rounded-xl bg-surface-container-lowest/80",
        QUEUE_BUCKET_CLASS,
        showErrorGlow ? QUEUE_BUCKET_ERROR_CLASS : "",
      ].join(" ")}
    >
      <p
        className={[
          QUEUE_CAPACITY_LABEL_CLASS,
          showCapacityOverflow
            ? QUEUE_CAPACITY_LABEL_OVERFLOW_CLASS
            : QUEUE_CAPACITY_LABEL_NEUTRAL_CLASS,
        ].join(" ")}
      >
        {t("visualizer.queue.capacitySummary", { size, max: maxCapacity })}
      </p>

      <div
        className="flex w-full flex-col items-center justify-center overflow-visible pt-6 pb-8"
        role="img"
        aria-label={t("visualizer.queue.ariaLabel", { size, max: maxCapacity })}
      >
        <div
          className={[
            QUEUE_SLOTS_GRID_OUTER_CLASS,
            isMultiRow ? "gap-y-8" : "",
          ].join(" ")}
        >
          {slotRows.map((rowIndices, rowIndex) => (
            <div key={rowIndex} className={QUEUE_SLOTS_GRID_ROW_CLASS}>
              {rowIndices.map((slotIndex) => renderSlot(slotIndex))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

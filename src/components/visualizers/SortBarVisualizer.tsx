import { useTranslation } from "react-i18next";
import type { SortBarHighlight } from "../../types/visualizer";
import { VISUALIZER_BAR_STYLES } from "../../constants/visualizerTokens";
import { ArrayIndexLabels } from "./ArrayIndexLabels";

interface SortBarVisualizerProps {
  /** Numeric values for bar height scale (may omit holes). */
  currentArray: number[];
  /** Per-index cell values; null renders an empty slot (never filled with held key). */
  cellValues?: (number | null)[];
  /** Key held outside the array during extract / shift phases. */
  reservedKeyValue?: number | null;
  /** Stable bar identities (unique values) used to animate horizontal swaps. */
  trackedValues?: number[];
  /** Render each bar at its array index (required when values can repeat). */
  positionByIndex?: boolean;
  highlights: SortBarHighlight[];
  stepTransitionMs?: number;
  showLegend?: boolean;
}

type LegendLabelKey =
  | "legend.unsorted"
  | "legend.outerIndex"
  | "legend.comparingMin"
  | "legend.sorted";

const LEGEND_ITEMS: { highlight: SortBarHighlight; labelKey: LegendLabelKey }[] = [
  { highlight: "default", labelKey: "legend.unsorted" },
  { highlight: "active", labelKey: "legend.outerIndex" },
  { highlight: "comparing", labelKey: "legend.comparingMin" },
  { highlight: "sorted", labelKey: "legend.sorted" },
];

function buildStableBarKeys(cells: (number | null)[]): (string | null)[] {
  const valueCounts = new Map<number, number>();
  for (const cell of cells) {
    if (cell === null) {
      continue;
    }
    valueCounts.set(cell, (valueCounts.get(cell) ?? 0) + 1);
  }

  const assigned = new Map<number, number>();

  return cells.map((cell) => {
    if (cell === null) {
      return null;
    }

    const total = valueCounts.get(cell) ?? 1;
    if (total === 1) {
      return `value-${cell}`;
    }

    const occurrence = assigned.get(cell) ?? 0;
    assigned.set(cell, occurrence + 1);
    return `value-${cell}-inst-${occurrence}`;
  });
}

export function SortLegendBar() {
  const { t } = useTranslation("common");

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest px-4 py-3"
      aria-label={t("aria.colorLegend")}
    >
      {LEGEND_ITEMS.map(({ highlight, labelKey }) => (
        <span
          key={highlight}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700"
        >
          <span
            className={[
              "h-4 w-4 shrink-0 rounded border border-solid",
              VISUALIZER_BAR_STYLES[highlight].fill,
            ].join(" ")}
            aria-hidden="true"
          />
          {t(labelKey)}
        </span>
      ))}
    </div>
  );
}

export function SortBarVisualizer({
  currentArray,
  cellValues,
  reservedKeyValue = null,
  trackedValues,
  positionByIndex = false,
  highlights,
  stepTransitionMs = 300,
  showLegend = false,
}: SortBarVisualizerProps) {
  const { t } = useTranslation("common");
  const displayCells = cellValues ?? currentArray;
  const count = displayCells.length;
  const maxValue = Math.max(...currentArray, 1);
  const slotWidth = count > 0 ? 100 / count : 0;
  const positionTransition = `left ${stepTransitionMs}ms ease-in-out, transform ${stepTransitionMs}ms ease-in-out`;
  const sizeTransition = `height ${stepTransitionMs}ms ease-in-out, transform ${stepTransitionMs}ms ease-in-out, background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease`;
  const useIndexLayout = positionByIndex || cellValues !== undefined;
  const animateBarMotion = cellValues !== undefined;
  const stableBarKeys = animateBarMotion ? buildStableBarKeys(displayCells) : null;

  if (count === 0) {
    return null;
  }

  const renderBarAtIndex = (
    reactKey: string,
    index: number,
    value: number,
    highlight: SortBarHighlight,
  ) => {
    const styles = VISUALIZER_BAR_STYLES[highlight];
    const heightPercent = Math.max((value / maxValue) * 100, 15);

    return (
      <div
        key={reactKey}
        className="absolute top-0 bottom-0 flex flex-col items-center justify-end will-change-[left,transform]"
        style={{
          left: `${index * slotWidth}%`,
          width: `${slotWidth}%`,
          transition: positionTransition,
        }}
      >
        {styles.badge && (
          <span
            className={[
              "mb-1 shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              styles.badgeClass,
            ].join(" ")}
          >
            {highlight === "minimum" ? t("legend.min") : styles.badge}
          </span>
        )}

        <span
          className={[
            "mb-1 shrink-0 text-sm font-bold tabular-nums",
            styles.label,
          ].join(" ")}
        >
          {value}
        </span>

        <div
          className={[
            "w-[60%] max-w-11 min-w-6 rounded-t-lg border border-b-0 border-solid",
            styles.fill,
            highlight === "swapping" ? "z-10 scale-105" : "z-0",
          ].join(" ")}
          style={{
            height: `${heightPercent}%`,
            minHeight: "1.5rem",
            transition: sizeTransition,
          }}
        />
      </div>
    );
  };

  const renderEmptySlot = (index: number) => {
    const highlight = highlights[index] ?? "default";

    return (
      <div
        key={`empty-${index}`}
        className="absolute top-0 bottom-0 flex flex-col items-center justify-end will-change-[left,transform]"
        style={{
          left: `${index * slotWidth}%`,
          width: `${slotWidth}%`,
          transition: positionTransition,
        }}
      >
        <span className="mb-1 shrink-0 text-sm font-bold tabular-nums text-slate-300">
          —
        </span>
        <div
          className={[
            "w-[60%] max-w-11 min-w-6 rounded-t-lg border-2 border-dashed border-slate-300 bg-slate-50/80",
            highlight === "minimum" ? "border-violet-400 bg-violet-50/50" : "",
          ].join(" ")}
          style={{ height: "12%", minHeight: "1rem" }}
        />
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {reservedKeyValue !== null && (
        <div
          className="flex justify-center px-2 sm:px-4"
          aria-live="polite"
        >
          <div className="inline-flex min-w-[7rem] flex-col items-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/90 px-4 py-2 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wide text-blue-800/80">
              {t("legend.heldKey")}
            </span>
            <span className="text-lg font-bold tabular-nums text-blue-900">
              {reservedKeyValue}
            </span>
          </div>
        </div>
      )}

      <div className="relative h-72 min-h-[280px] w-full px-2 pt-4 pb-3 sm:px-4">
        <div className="relative h-full w-full">
          {useIndexLayout
            ? displayCells.map((cellValue, index) => {
                const highlight = highlights[index] ?? "default";

                if (cellValue === null) {
                  return renderEmptySlot(index);
                }

                const barKey = animateBarMotion
                  ? (stableBarKeys?.[index] ?? `bar-${index}`)
                  : `bar-${index}`;

                return renderBarAtIndex(barKey, index, cellValue, highlight);
              })
            : (trackedValues ?? currentArray).map((value) => {
                const index = currentArray.indexOf(value);
                if (index === -1) return null;

                const highlight = highlights[index] ?? "default";
                return renderBarAtIndex(
                  `track-${value}`,
                  index,
                  value,
                  highlight,
                );
              })}
        </div>
      </div>

      <ArrayIndexLabels count={count} className="px-2 sm:px-4" />

      {showLegend && <SortLegendBar />}
    </div>
  );
}

import type { SortBarHighlight } from "../../types/visualizer";
import {
  VISUALIZER_BAR_STYLES,
  VISUALIZER_LEGEND_ITEMS,
} from "../../constants/visualizerTokens";
import { ArrayIndexLabels } from "./ArrayIndexLabels";

interface SortBarVisualizerProps {
  currentArray: number[];
  /** Stable bar identities (unique values) used to animate horizontal swaps. */
  trackedValues: number[];
  highlights: SortBarHighlight[];
  stepTransitionMs?: number;
  showLegend?: boolean;
}

export function SortLegendBar() {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest px-4 py-3"
      aria-label="Color legend"
    >
      {VISUALIZER_LEGEND_ITEMS.map(({ highlight, label }) => (
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
          {label}
        </span>
      ))}
    </div>
  );
}

export function SortBarVisualizer({
  currentArray,
  trackedValues,
  highlights,
  stepTransitionMs = 300,
  showLegend = false,
}: SortBarVisualizerProps) {
  const count = currentArray.length;
  const maxValue = Math.max(...currentArray, 1);
  const slotWidth = count > 0 ? 100 / count : 0;
  const positionTransition = `left ${stepTransitionMs}ms ease-in-out`;
  const sizeTransition = `height ${stepTransitionMs}ms ease-in-out, transform ${stepTransitionMs}ms ease-in-out, background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease`;

  if (count === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative h-72 min-h-[280px] w-full px-2 pt-4 pb-3 sm:px-4">
        <div className="relative h-full w-full">
          {trackedValues.map((value) => {
            const index = currentArray.indexOf(value);
            if (index === -1) return null;

            const highlight = highlights[index] ?? "default";
            const styles = VISUALIZER_BAR_STYLES[highlight];
            const heightPercent = Math.max((value / maxValue) * 100, 15);

            return (
              <div
                key={value}
                className="absolute top-0 bottom-0 flex flex-col items-center justify-end"
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
                    {styles.badge}
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
          })}
        </div>
      </div>

      <ArrayIndexLabels count={count} className="px-2 sm:px-4" />

      {showLegend && <SortLegendBar />}
    </div>
  );
}

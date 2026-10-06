import { useTranslation } from "react-i18next";
import type { SortBarHighlight } from "../../types/visualizer";
import { VISUALIZER_BAR_STYLES } from "../../constants/visualizerTokens";

const LEGEND_ITEMS: {
  highlight: SortBarHighlight;
  labelKey:
    | "legend.unsorted"
    | "legend.quickSortPivot"
    | "legend.quickSortPartitioning"
    | "legend.quickSortPivotSorted";
}[] = [
  { highlight: "default", labelKey: "legend.unsorted" },
  { highlight: "pivot", labelKey: "legend.quickSortPivot" },
  { highlight: "comparing", labelKey: "legend.quickSortPartitioning" },
  { highlight: "sorted", labelKey: "legend.quickSortPivotSorted" },
];

export function QuickSortLegendBar() {
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

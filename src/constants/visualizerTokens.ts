import type { SortBarHighlight } from "../types/visualizer";
import type { CellHighlight } from "../types/visualizer";

export const CODE_ACTIVE_LINE_CLASS =
  "border-blue-500 bg-blue-500/15 font-semibold text-slate-100";

export const ARRAY_INDEX_LABEL_CLASS =
  "mt-2 text-xs font-mono tabular-nums text-slate-400";

export const VISUALIZER_IDLE_STATUS_CLASS =
  "w-full min-h-28 max-w-lg mx-auto rounded-xl border border-success/30 bg-surface-container-lowest px-5 py-3 shadow-md flex flex-col items-center justify-center text-center";

export const VISUALIZER_IDLE_STATUS_TEXT_CLASS =
  "font-body-md text-body-md leading-snug text-on-surface-variant";

export const CODE_PANEL_TOOLBAR_CONTROL_CLASS =
  "bg-surface-container-lowest border-2 border-surface-variant rounded-xl px-4 py-2.5 font-body-md transition-colors cursor-pointer hover:border-primary hover:bg-surface-bright";

export const EMBEDDED_PANEL_HEADER_CLASS =
  "flex min-h-[3.75rem] min-w-0 items-end justify-between gap-3 border-b-2 border-surface-variant bg-surface-container px-4 pt-4";

export const EMBEDDED_PANEL_TAB_CLASS =
  "inline-flex shrink-0 cursor-default items-center gap-2 rounded-t-xl border-2 border-b-0 border-surface-variant bg-surface-container-lowest px-6 py-3 font-bold text-primary select-none";

export const VISUALIZER_BAR_STYLES: Record<
  SortBarHighlight,
  { fill: string; label: string; badge?: string; badgeClass?: string }
> = {
  default: {
    fill: "sort-bar-default",
    label: "text-slate-700",
  },
  active: {
    fill: "sort-bar-active",
    label: "text-blue-600",
  },
  sorted: {
    fill: "sort-bar-sorted",
    label: "text-[var(--color-success)]",
  },
  minimum: {
    fill: "sort-bar-comparing",
    label: "text-amber-600",
    badge: "Min",
    badgeClass:
      "border border-solid border-amber-500 bg-amber-500/15 text-amber-600",
  },
  comparing: {
    fill: "sort-bar-comparing",
    label: "text-amber-600",
  },
  swapping: {
    fill: "sort-bar-comparing",
    label: "text-amber-600",
  },
};

export const VISUALIZER_LEGEND_ITEMS: {
  highlight: SortBarHighlight;
  label: string;
}[] = [
  { highlight: "default", label: "Unsorted" },
  { highlight: "active", label: "Outer index (i)" },
  { highlight: "comparing", label: "Comparing / Min" },
  { highlight: "sorted", label: "Sorted" },
];

export const BINARY_SEARCH_CELL_STYLES: Record<CellHighlight, string> = {
  default: "",
  eliminated: "opacity-40",
  comparing:
    "scale-105 shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-4 ring-blue-400/40",
  found:
    "scale-105 shadow-[0_0_24px_rgba(88,204,2,0.25)] ring-2 ring-success/30",
  sorted: "",
  minimum: "",
  swapping: "",
};

/** @deprecated Use BINARY_SEARCH_CELL_STYLES or sort-bar tokens per visualizer. */
export const VISUALIZER_CELL_STYLES = BINARY_SEARCH_CELL_STYLES;

export const SELECTION_SORT_TIME_INFO = {
  title: "Quadratic Time",
  text: "Selection Sort compares elements across nested loops, resulting in O(n²) time in typical cases.",
};

export const SELECTION_SORT_SPACE_INFO = {
  title: "Constant Space",
  text: "The algorithm sorts in place using only a constant amount of extra memory for indices and swaps.",
};

export const BINARY_SEARCH_TIME_INFO = {
  title: "Logarithmic Time",
  text: "Execution time grows logarithmically relative to the input size. By halving the search space at each step, it remains exceptionally fast even for massive datasets.",
};

export const BINARY_SEARCH_SPACE_INFO = {
  title: "Constant Space",
  text: "The algorithm uses a fixed amount of additional memory (pointers only), regardless of the array size.",
};

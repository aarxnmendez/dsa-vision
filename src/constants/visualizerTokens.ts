import type { SortBarHighlight } from "../types/visualizer";
import type { CellHighlight } from "../types/visualizer";

export const CODE_ACTIVE_LINE_CLASS =
  "border-blue-500 bg-blue-500/15 font-semibold text-slate-100";

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

export const VISUALIZER_CELL_STYLES: Record<CellHighlight, string> = {
  default: "",
  eliminated: "opacity-40",
  comparing:
    "bg-blue-500 text-white border-blue-600 border-b-blue-700 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  found:
    "bg-emerald-500 text-white border-emerald-600 border-b-emerald-700 scale-105 shadow-[0_0_24px_rgba(16,185,129,0.25)] ring-2 ring-emerald-400/30",
  sorted:
    "bg-emerald-500 text-white border-emerald-600 border-b-emerald-700",
  minimum:
    "bg-amber-500 text-white border-amber-600 border-b-amber-700 scale-105 shadow-[0_0_12px_rgba(245,158,11,0.45)]",
  swapping:
    "bg-rose-500 text-white border-rose-600 border-b-rose-700 scale-110 shadow-[0_0_16px_rgba(244,63,94,0.5)]",
};

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

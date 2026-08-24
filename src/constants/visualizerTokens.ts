import type { SortBarHighlight } from "../types/visualizer";
import type { CellHighlight } from "../types/visualizer";

export const VISUALIZER_CELL_BASE_CLASS =
  "bg-surface-container border-2 border-surface-variant border-b-4 text-on-surface shadow-sm";

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

/** Amber glow mirroring BINARY_SEARCH_CELL_STYLES.comparing intensity. */
export const ARRAY_STRUCTURE_SHIFT_GLOW =
  "scale-105 shadow-[0_0_15px_rgba(245,158,11,0.5)] ring-4 ring-amber-400/40";

export const ARRAY_STRUCTURE_SHIFT_SOURCE_GLOW =
  "shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-4 ring-amber-400/30";

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

export const ARRAY_STRUCTURE_TIME_INFO = {
  title: "Mixed Complexity",
  text: "Index access is O(1), but insertions and deletions away from the end may shift up to n elements, costing O(n) time.",
};

export const ARRAY_STRUCTURE_SPACE_INFO = {
  title: "Contiguous Storage",
  text: "Elements are stored in adjacent memory slots. The structure uses O(n) space for n values plus any reserved capacity.",
};

export type ArrayStructureLegendToken =
  | "active"
  | "shift"
  | "success"
  | "vacant";

export const ARRAY_STRUCTURE_LEGEND_ITEMS: {
  token: ArrayStructureLegendToken;
  label: string;
}[] = [
  { token: "active", label: "Active / Accessed" },
  { token: "shift", label: "Shift / Reorder" },
  { token: "success", label: "Inserted / Success" },
  { token: "vacant", label: "Vacant / Memory" },
];

export const ARRAY_STRUCTURE_LEGEND_SWATCH_CLASS: Record<
  ArrayStructureLegendToken,
  string
> = {
  active: "border border-solid border-blue-500 bg-blue-50",
  shift: "border border-solid border-amber-500 bg-amber-50",
  success: "border border-solid border-emerald-500 bg-emerald-50",
  vacant: "border border-dashed border-surface-variant bg-slate-50",
};

const ARRAY_STRUCTURE_HIGHLIGHT_TOKEN: Record<
  import("../types/arrayStructure").ArrayStructureHighlight,
  ArrayStructureLegendToken | null
> = {
  default: null,
  accessed: "active",
  comparing: "active",
  shifting: "shift",
  "shift-source": "shift",
  "shift-target": "shift",
  deleted: "shift",
  inserted: "success",
  found: "success",
  vacant: "vacant",
};

export function getArrayStructureLegendToken(
  highlight: import("../types/arrayStructure").ArrayStructureHighlight,
): ArrayStructureLegendToken | null {
  return ARRAY_STRUCTURE_HIGHLIGHT_TOKEN[highlight];
}

const ARRAY_STRUCTURE_CELL_LAYOUT =
  "relative flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all";

export const ARRAY_STRUCTURE_CELL_APPEARANCE: Record<
  import("../types/arrayStructure").ArrayStructureHighlight,
  string
> = {
  default: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-slate-200 bg-white shadow-sm shadow-slate-200/50",
  ].join(" "),
  accessed: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-blue-500 bg-blue-50/60",
    BINARY_SEARCH_CELL_STYLES.comparing,
  ].join(" "),
  comparing: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-blue-500 bg-blue-50/60",
    BINARY_SEARCH_CELL_STYLES.comparing,
  ].join(" "),
  shifting: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-solid border-amber-500 bg-amber-50/60",
    ARRAY_STRUCTURE_SHIFT_GLOW,
  ].join(" "),
  "shift-source": [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-dashed border-amber-500 bg-amber-50/30 opacity-80",
    ARRAY_STRUCTURE_SHIFT_SOURCE_GLOW,
  ].join(" "),
  "shift-target": [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-solid border-amber-500 bg-amber-50/60",
    ARRAY_STRUCTURE_SHIFT_GLOW,
  ].join(" "),
  deleted: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-dashed border-amber-500 bg-amber-50/30 opacity-80",
    ARRAY_STRUCTURE_SHIFT_SOURCE_GLOW,
  ].join(" "),
  inserted: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-emerald-500 bg-emerald-50/60",
    BINARY_SEARCH_CELL_STYLES.found,
  ].join(" "),
  found: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-emerald-500 bg-emerald-50/60",
    BINARY_SEARCH_CELL_STYLES.found,
  ].join(" "),
  vacant: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-dashed border-slate-200 bg-slate-50 shadow-sm shadow-slate-200/50",
  ].join(" "),
};

/** @deprecated Use ARRAY_STRUCTURE_CELL_APPEARANCE */
export const ARRAY_STRUCTURE_CELL_STYLES = ARRAY_STRUCTURE_CELL_APPEARANCE;

export const ARRAY_STRUCTURE_POINTER_CELL_APPEARANCE: Record<
  "active" | "shift" | "success",
  string
> = {
  active: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-blue-500 bg-blue-50/60",
    BINARY_SEARCH_CELL_STYLES.comparing,
  ].join(" "),
  shift: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-solid border-amber-500 bg-amber-50/60",
    ARRAY_STRUCTURE_SHIFT_GLOW,
  ].join(" "),
  success: [
    ARRAY_STRUCTURE_CELL_LAYOUT,
    "border-emerald-500 bg-emerald-50/60",
    BINARY_SEARCH_CELL_STYLES.found,
  ].join(" "),
};

export const LEFT_PANEL_SCROLL_CLASS =
  "flex-1 min-h-0 overflow-y-auto overscroll-contain pb-28 pr-1";

export const LINKED_LIST_TIME_INFO = {
  title: "Pointer-Based Complexity",
  text: "With head and tail pointers, insert at head and insert at tail are O(1). Delete at head is also O(1). Delete at tail stays O(n) in singly linked lists because you must walk to the penultimate node; doubly linked lists achieve O(1) tail deletion. Search, access by index, and reverse remain O(n).",
};

export const LINKED_LIST_SPACE_INFO = {
  title: "Node Overhead",
  text: "Each node stores a value plus pointer(s). Doubly linked lists use extra space for prev links but enable O(1) backward traversal.",
};

export const LINKED_LIST_CONNECTION_STYLES: Record<
  import("../types/linkedListStructure").LinkedListConnectionState,
  { stroke: string; strokeWidth: number; strokeDasharray?: string; className: string }
> = {
  idle: {
    stroke: "#94a3b8",
    strokeWidth: 2,
    className: "opacity-80",
  },
  traversing: {
    stroke: "#06b6d4",
    strokeWidth: 3,
    className: "drop-shadow-[0_0_8px_rgba(6,182,212,0.65)]",
  },
  relinking: {
    stroke: "#10b981",
    strokeWidth: 3,
    className: "drop-shadow-[0_0_10px_rgba(16,185,129,0.55)]",
  },
  breaking: {
    stroke: "#f97316",
    strokeWidth: 3,
    strokeDasharray: "6 4",
    className: "drop-shadow-[0_0_8px_rgba(249,115,22,0.45)]",
  },
  active: {
    stroke: "#3b82f6",
    strokeWidth: 3,
    className: "drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]",
  },
};

const LINKED_LIST_NODE_LAYOUT =
  "relative flex items-stretch rounded-xl border-2 transition-all shadow-sm";

export const LINKED_LIST_PORT_NULL_LABEL_CLASS =
  "font-mono text-[10px] tracking-tight text-slate-400 dark:text-slate-500 opacity-80 select-none";

export const LINKED_LIST_NODE_APPEARANCE: Record<
  import("../types/linkedListStructure").LinkedListNodeHighlight,
  string
> = {
  default: [LINKED_LIST_NODE_LAYOUT, "border-slate-200 bg-white"].join(" "),
  active: [
    LINKED_LIST_NODE_LAYOUT,
    "border-blue-500 bg-blue-50/60 scale-105",
    BINARY_SEARCH_CELL_STYLES.comparing,
  ].join(" "),
  accessed: [
    LINKED_LIST_NODE_LAYOUT,
    "border-blue-400 bg-blue-50/50",
  ].join(" "),
  comparing: [
    LINKED_LIST_NODE_LAYOUT,
    "border-blue-500 bg-blue-50/60",
    BINARY_SEARCH_CELL_STYLES.comparing,
  ].join(" "),
  creating: [
    LINKED_LIST_NODE_LAYOUT,
    "border-amber-500 bg-white dark:bg-surface-container-lowest",
    "text-amber-600 ring-2 ring-amber-400/30",
  ].join(" "),
  inserted: [
    LINKED_LIST_NODE_LAYOUT,
    "border-emerald-500 bg-white dark:bg-surface-container-lowest",
    "text-emerald-600 ring-2 ring-emerald-400/20",
    BINARY_SEARCH_CELL_STYLES.found,
  ].join(" "),
  deleted: [
    LINKED_LIST_NODE_LAYOUT,
    "border-dashed border-amber-500 bg-white dark:bg-surface-container-lowest opacity-80",
    "text-amber-600 ring-2 ring-amber-400/20",
  ].join(" "),
  found: [
    LINKED_LIST_NODE_LAYOUT,
    "border-emerald-500 bg-white dark:bg-surface-container-lowest",
    "text-emerald-600 ring-2 ring-emerald-400/30",
    BINARY_SEARCH_CELL_STYLES.found,
  ].join(" "),
};

export const LINKED_LIST_LEGEND_ITEMS = [
  { label: "Active / Traversing", swatch: "border border-blue-500 bg-blue-50" },
  { label: "New node (pending)", swatch: "border border-amber-500 bg-white ring-2 ring-amber-400/30" },
  { label: "Relinking", swatch: "border border-emerald-500 bg-emerald-50" },
  { label: "Breaking", swatch: "border border-dashed border-amber-500 bg-amber-50" },
  { label: "Idle link", swatch: "border border-slate-300 bg-slate-50" },
] as const;

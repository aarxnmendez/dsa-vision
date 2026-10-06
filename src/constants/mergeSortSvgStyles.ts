import type { SortBarHighlight } from "../types/visualizer";
import type { MergeSortTreeNode } from "../algorithms/mergeSort";

export interface MergeSortSvgCellStyle {
  fill: string;
  stroke: string;
  text: string;
}

export const MERGE_SORT_SVG_CELL_STYLES: Record<
  SortBarHighlight,
  MergeSortSvgCellStyle
> = {
  default: {
    fill: "var(--color-surface-container)",
    stroke: "#cbd5e1",
    text: "var(--color-on-surface)",
  },
  active: {
    fill: "rgba(59, 130, 246, 0.12)",
    stroke: "#3b82f6",
    text: "#1d4ed8",
  },
  comparing: {
    fill: "rgba(245, 158, 11, 0.14)",
    stroke: "#f59e0b",
    text: "#b45309",
  },
  swapping: {
    fill: "rgba(245, 158, 11, 0.14)",
    stroke: "#f59e0b",
    text: "#b45309",
  },
  sorted: {
    fill: "color-mix(in oklab, var(--color-success) 14%, var(--color-surface-container-lowest))",
    stroke: "var(--color-success)",
    text: "var(--color-success)",
  },
  minimum: {
    fill: "rgba(245, 158, 11, 0.14)",
    stroke: "#f59e0b",
    text: "#b45309",
  },
  pivot: {
    fill: "rgba(249, 115, 22, 0.18)",
    stroke: "#f97316",
    text: "#c2410c",
  },
};

export function mergeSortNodeFrameStyle(
  nodeHighlight: MergeSortTreeNode["nodeHighlight"],
): { stroke: string; strokeWidth: number } {
  if (nodeHighlight === "active") {
    return { stroke: "var(--color-primary)", strokeWidth: 2.5 };
  }

  if (nodeHighlight === "merged") {
    return { stroke: "#10b981", strokeWidth: 2 };
  }

  return { stroke: "var(--color-surface-variant)", strokeWidth: 2 };
}

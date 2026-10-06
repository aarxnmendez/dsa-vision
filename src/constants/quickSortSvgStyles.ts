import type { SortBarHighlight } from "../types/visualizer";
import type { QuickSortTreeNode } from "../algorithms/quickSort";
import type { MergeSortSvgCellStyle } from "./mergeSortSvgStyles";
import { MERGE_SORT_SVG_CELL_STYLES } from "./mergeSortSvgStyles";

export const QUICK_SORT_SVG_CELL_STYLES: Record<
  SortBarHighlight,
  MergeSortSvgCellStyle
> = MERGE_SORT_SVG_CELL_STYLES;

export function quickSortNodeFrameStyle(
  nodeHighlight: QuickSortTreeNode["nodeHighlight"],
): { stroke: string; strokeWidth: number } {
  if (nodeHighlight === "active") {
    return { stroke: "var(--color-primary)", strokeWidth: 2.5 };
  }

  if (nodeHighlight === "done") {
    return { stroke: "#10b981", strokeWidth: 2 };
  }

  return { stroke: "var(--color-surface-variant)", strokeWidth: 2 };
}

import type { MergeSortLayoutNode } from "./mergeSortTreeLayout";

const ARROW_INSET = 7;

export function shortenSegment(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  trimStart = 0,
  trimEnd = ARROW_INSET,
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return { x1, y1, x2, y2 };
  }

  const unitX = dx / length;
  const unitY = dy / length;

  return {
    x1: x1 + unitX * trimStart,
    y1: y1 + unitY * trimStart,
    x2: x2 - unitX * trimEnd,
    y2: y2 - unitY * trimEnd,
  };
}

export function parentToChildEdgePoints(
  from: MergeSortLayoutNode,
  to: MergeSortLayoutNode,
  fromBoxHeight: number,
): { x1: number; y1: number; x2: number; y2: number } {
  const startX = from.centerX;
  const startY = from.y + fromBoxHeight;
  const endX = to.centerX;
  const endY = to.y;

  return shortenSegment(startX, startY, endX, endY, 2, ARROW_INSET);
}

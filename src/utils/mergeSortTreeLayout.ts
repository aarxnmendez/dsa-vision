import type {
  MergeSortTreeLink,
  MergeSortTreeNode,
} from "../algorithms/mergeSort";

export interface MergeSortLayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface MergeSortTreeLayout {
  nodes: Map<string, MergeSortLayoutNode>;
  width: number;
  height: number;
}

const CELL_WIDTH = 40;
const CELL_GAP = 6;
const ROW_HEIGHT = 112;
const LEVEL_GAP = 32;
export const MERGE_NODE_LABEL_HEIGHT = 20;
export const MERGE_NODE_CELL_HEIGHT = 36;
export const MERGE_NODE_VERTICAL_PADDING = 16;
export const MERGE_NODE_BOX_HEIGHT =
  MERGE_NODE_LABEL_HEIGHT + MERGE_NODE_CELL_HEIGHT + MERGE_NODE_VERTICAL_PADDING;
const SIBLING_GAP = 28;

function nodeBoxWidth(valuesLength: number): number {
  if (valuesLength === 0) {
    return CELL_WIDTH;
  }

  return valuesLength * CELL_WIDTH + (valuesLength - 1) * CELL_GAP + 16;
}

export function layoutMergeSortTree(
  nodes: MergeSortTreeNode[],
  links: MergeSortTreeLink[],
): MergeSortTreeLayout {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const childrenByParent = new Map<string, string[]>();

  for (const link of links) {
    const siblings = childrenByParent.get(link.fromId) ?? [];
    siblings.push(link.toId);
    childrenByParent.set(link.fromId, siblings);
  }

  for (const siblings of childrenByParent.values()) {
    siblings.sort((left, right) => {
      const leftNode = nodeById.get(left);
      const rightNode = nodeById.get(right);
      return (leftNode?.low ?? 0) - (rightNode?.low ?? 0);
    });
  }

  const positions = new Map<string, MergeSortLayoutNode>();

  const measureWidth = (id: string): number => {
    const node = nodeById.get(id);
    if (!node) {
      return 0;
    }

    const children = childrenByParent.get(id) ?? [];
    if (children.length === 0) {
      return nodeBoxWidth(node.values.length);
    }

    const childWidths = children.map((childId) => measureWidth(childId));
    return (
      childWidths.reduce((sum, width) => sum + width, 0) +
      SIBLING_GAP * (children.length - 1)
    );
  };

  const placeNode = (id: string, depth: number, leftX: number): number => {
    const node = nodeById.get(id);
    if (!node) {
      return leftX;
    }

    const subtreeWidth = measureWidth(id);
    const boxWidth = nodeBoxWidth(node.values.length);
    const x = leftX + subtreeWidth / 2 - boxWidth / 2;
    const y = depth * (ROW_HEIGHT + LEVEL_GAP);
    const centerX = x + boxWidth / 2;
    const centerY = y + MERGE_NODE_BOX_HEIGHT / 2;

    positions.set(id, {
      id,
      x,
      y,
      width: boxWidth,
      height: MERGE_NODE_BOX_HEIGHT,
      centerX,
      centerY,
    });

    const children = childrenByParent.get(id) ?? [];
    let cursor = leftX;

    for (const childId of children) {
      const childWidth = measureWidth(childId);
      placeNode(childId, depth + 1, cursor);
      cursor += childWidth + SIBLING_GAP;
    }

    return leftX + subtreeWidth;
  };

  const roots = nodes
    .filter((node) => !links.some((link) => link.toId === node.id))
    .sort((a, b) => a.low - b.low);

  if (roots.length === 0 && nodes.length > 0) {
    placeNode(nodes[0]!.id, 0, 0);
  } else {
    let cursor = 0;
    for (const root of roots) {
      const width = measureWidth(root.id);
      placeNode(root.id, 0, cursor);
      cursor += width + SIBLING_GAP;
    }
  }

  let maxX = 0;
  let maxY = 0;

  for (const layoutNode of positions.values()) {
    maxX = Math.max(maxX, layoutNode.x + layoutNode.width);
    maxY = Math.max(maxY, layoutNode.y + layoutNode.height);
  }

  return {
    nodes: positions,
    width: Math.max(maxX + 48, 320),
    height: Math.max(maxY + 48, 280),
  };
}

export { CELL_GAP, CELL_WIDTH };

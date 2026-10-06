import { useId, useMemo, type ReactNode } from "react";
import type {
  QuickSortTreeLink,
  QuickSortTreeNode,
} from "../../algorithms/quickSort";
import {
  QUICK_SORT_SVG_CELL_STYLES,
  quickSortNodeFrameStyle,
} from "../../constants/quickSortSvgStyles";
import type { SortBarHighlight } from "../../types/visualizer";
import { parentToChildEdgePoints } from "../../utils/mergeSortTreeEdges";
import {
  CELL_GAP,
  CELL_WIDTH,
  MERGE_NODE_BOX_HEIGHT,
  MERGE_NODE_CELL_HEIGHT,
  MERGE_NODE_LABEL_HEIGHT,
  MERGE_NODE_VERTICAL_PADDING,
  layoutMergeSortTree,
} from "../../utils/mergeSortTreeLayout";

interface QuickSortTreeVisualizerProps {
  nodes: QuickSortTreeNode[];
  links: QuickSortTreeLink[];
}

const ARROW_MARKER_PREFIX = "quick-sort-tree-arrow";
const NODE_PADDING_X = 8;
const CELL_RADIUS = 6;
const NODE_RADIUS = 12;

function renderNodeCells(
  node: QuickSortTreeNode,
  originX: number,
  cellsTop: number,
) {
  const cells: ReactNode[] = [];
  let cellX = originX + NODE_PADDING_X;

  node.values.forEach((value, index) => {
    const highlight: SortBarHighlight = node.cellHighlights[index] ?? "default";
    const style = QUICK_SORT_SVG_CELL_STYLES[highlight];

    cells.push(
      <g key={`${node.id}-cell-${index}`}>
        <rect
          x={cellX}
          y={cellsTop}
          width={CELL_WIDTH}
          height={MERGE_NODE_CELL_HEIGHT}
          rx={CELL_RADIUS}
          fill={style.fill}
          stroke={style.stroke}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        <text
          x={cellX + CELL_WIDTH / 2}
          y={cellsTop + MERGE_NODE_CELL_HEIGHT / 2 + 5}
          textAnchor="middle"
          fill={style.text}
          fontSize={14}
          fontWeight={700}
          fontFamily="var(--font-body-md, 'Nunito Sans', sans-serif)"
        >
          {value}
        </text>
      </g>,
    );

    cellX += CELL_WIDTH + CELL_GAP;
  });

  return cells;
}

export function QuickSortTreeVisualizer({
  nodes,
  links,
}: QuickSortTreeVisualizerProps) {
  const markerId = `${ARROW_MARKER_PREFIX}-${useId().replace(/:/g, "")}`;
  const layout = useMemo(
    () => layoutMergeSortTree(nodes, links),
    [links, nodes],
  );

  const labelBaseline = MERGE_NODE_VERTICAL_PADDING / 2 + 11;
  const cellsTop = MERGE_NODE_VERTICAL_PADDING / 2 + MERGE_NODE_LABEL_HEIGHT + 4;

  return (
    <svg
      className="infinite-canvas-vector-content block"
      width={layout.width}
      height={layout.height}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      aria-hidden="true"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>

      <g className="text-outline-variant">
        {links.map((link) => {
          const from = layout.nodes.get(link.fromId);
          const to = layout.nodes.get(link.toId);
          if (!from || !to) {
            return null;
          }

          const { x1, y1, x2, y2 } = parentToChildEdgePoints(
            from,
            to,
            MERGE_NODE_BOX_HEIGHT,
          );

          return (
            <line
              key={`${link.fromId}-${link.toId}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              markerEnd={`url(#${markerId})`}
            />
          );
        })}
      </g>

      {nodes.map((node) => {
        const position = layout.nodes.get(node.id);
        if (!position) {
          return null;
        }

        const frame = quickSortNodeFrameStyle(node.nodeHighlight);

        return (
          <g key={node.id}>
            <rect
              x={position.x}
              y={position.y}
              width={position.width}
              height={MERGE_NODE_BOX_HEIGHT}
              rx={NODE_RADIUS}
              fill="var(--color-surface-container-lowest)"
              stroke={frame.stroke}
              strokeWidth={frame.strokeWidth}
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={position.x + NODE_PADDING_X}
              y={position.y + labelBaseline}
              fill="var(--color-on-surface-variant)"
              fontSize={10}
              fontWeight={600}
              letterSpacing="0.06em"
              fontFamily="var(--font-body-md, 'Nunito Sans', sans-serif)"
            >
              [{node.low}..{node.high}]
            </text>
            {renderNodeCells(node, position.x, position.y + cellsTop)}
          </g>
        );
      })}
    </svg>
  );
}

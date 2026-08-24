import { useEffect, useMemo, useRef, useState } from "react";
import type {
  LinkedListConnection,
  LinkedListNodeState,
  LinkedListType,
} from "../../types/linkedListStructure";
import {
  LINKED_LIST_CONNECTION_STYLES,
  LINKED_LIST_LEGEND_ITEMS,
  LINKED_LIST_NODE_APPEARANCE,
  LINKED_LIST_PORT_NULL_LABEL_CLASS,
} from "../../constants/visualizerTokens";

interface LinkedListStructureVisualizerProps {
  listType: LinkedListType;
  nodes: LinkedListNodeState[];
  connections: LinkedListConnection[];
  stepTransitionMs?: number;
}

const NODE_WIDTH = 112;
const NODE_HEIGHT = 52;
const NODE_GAP = 72;
const ROW_GAP = 56;
const ROW_TOP = 44;
const CHANNEL_MARGIN = 28;
const CIRCULAR_LEFT_CHANNEL_OFFSET = 48;
const CORNER_RADIUS = 10;
const CIRCULAR_BOTTOM_MARGIN = 56;

const ARROW_MARKER_SIZE = 5;
const ARROW_REF_X = 4;
const ARROW_PATH = "M0,0 L5,2.5 L0,5 Z";

interface Point {
  x: number;
  y: number;
}

interface NodeLayoutEntry {
  x: number;
  y: number;
  index: number;
  row: number;
  col: number;
}

interface LayoutBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface LayoutResult {
  positions: Map<string, NodeLayoutEntry>;
  nodesPerRow: number;
  rowCount: number;
  canvasWidth: number;
  canvasHeight: number;
  bounds: LayoutBounds;
  nodeById: Map<string, LinkedListNodeState>;
}

function getNodesPerRow(availableWidth: number): number {
  if (availableWidth <= NODE_WIDTH) {
    return 1;
  }
  return Math.max(1, Math.floor((availableWidth + NODE_GAP) / (NODE_WIDTH + NODE_GAP)));
}

function getRowWidth(nodeCount: number): number {
  if (nodeCount <= 0) {
    return NODE_WIDTH;
  }
  return nodeCount * NODE_WIDTH + Math.max(nodeCount - 1, 0) * NODE_GAP;
}

function getRowWrapLeftChannelX(minX: number): number {
  return minX - CHANNEL_MARGIN;
}

function getCircularLeftChannelX(minX: number): number {
  return minX - CIRCULAR_LEFT_CHANNEL_OFFSET;
}

function buildLayout(
  nodes: LinkedListNodeState[],
  containerWidth: number,
): LayoutResult {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const nodesPerRow = getNodesPerRow(containerWidth);
  const rowCount = Math.max(1, Math.ceil(nodes.length / nodesPerRow));
  const positions = new Map<string, NodeLayoutEntry>();

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = ROW_TOP;
  let maxY = ROW_TOP;

  nodes.forEach((node, flowIndex) => {
    const row = Math.floor(flowIndex / nodesPerRow);
    const col = flowIndex % nodesPerRow;
    const rowStartIndex = row * nodesPerRow;
    const nodesInRow = Math.min(nodesPerRow, nodes.length - rowStartIndex);
    const rowWidth = getRowWidth(nodesInRow);
    const offsetX = Math.max(0, (containerWidth - rowWidth) / 2);
    const x = offsetX + col * (NODE_WIDTH + NODE_GAP);
    const y = ROW_TOP + row * (NODE_HEIGHT + ROW_GAP);

    positions.set(node.id, { x, y, index: flowIndex, row, col });

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x + NODE_WIDTH);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y + NODE_HEIGHT);
  });

  if (nodes.length === 0) {
    minX = Math.max(0, (containerWidth - NODE_WIDTH) / 2);
    maxX = minX + NODE_WIDTH;
    maxY = ROW_TOP + NODE_HEIGHT;
  }

  const canvasHeight =
    ROW_TOP +
    rowCount * NODE_HEIGHT +
    Math.max(rowCount - 1, 0) * ROW_GAP +
    CIRCULAR_BOTTOM_MARGIN;

  return {
    positions,
    nodesPerRow,
    rowCount,
    canvasWidth: containerWidth,
    canvasHeight,
    bounds: { minX, maxX, minY, maxY },
    nodeById,
  };
}

function nextOutPort(node: NodeLayoutEntry): Point {
  return { x: node.x + NODE_WIDTH, y: node.y + NODE_HEIGHT / 2 };
}

function nextInPort(node: NodeLayoutEntry): Point {
  return { x: node.x, y: node.y + NODE_HEIGHT / 2 };
}

function prevOutPort(node: NodeLayoutEntry): Point {
  return { x: node.x, y: node.y + NODE_HEIGHT / 2 + 14 };
}

function prevInPort(node: NodeLayoutEntry): Point {
  return { x: node.x + NODE_WIDTH, y: node.y + NODE_HEIGHT / 2 + 14 };
}

function isRowWrapNext(from: NodeLayoutEntry, to: NodeLayoutEntry): boolean {
  return to.index === from.index + 1 && to.row !== from.row;
}

function isRowWrapPrev(from: NodeLayoutEntry, to: NodeLayoutEntry): boolean {
  return from.index === to.index + 1 && to.row !== from.row;
}

function buildRoundedOrthogonalPath(points: Point[], radius = CORNER_RADIUS): string {
  if (points.length === 0) {
    return "";
  }
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const next = points[index + 1];

    if (!next) {
      path += ` L ${current.x} ${current.y}`;
      break;
    }

    const dx1 = current.x - previous.x;
    const dy1 = current.y - previous.y;
    const dx2 = next.x - current.x;
    const dy2 = next.y - current.y;
    const length1 = Math.hypot(dx1, dy1);
    const length2 = Math.hypot(dx2, dy2);
    const cornerRadius = Math.min(radius, length1 / 2, length2 / 2);

    if (cornerRadius <= 0 || length1 === 0 || length2 === 0) {
      path += ` L ${current.x} ${current.y}`;
      continue;
    }

    const beforeCornerX = current.x - (dx1 / length1) * cornerRadius;
    const beforeCornerY = current.y - (dy1 / length1) * cornerRadius;
    const afterCornerX = current.x + (dx2 / length2) * cornerRadius;
    const afterCornerY = current.y + (dy2 / length2) * cornerRadius;

    path += ` L ${beforeCornerX} ${beforeCornerY}`;
    path += ` Q ${current.x} ${current.y} ${afterCornerX} ${afterCornerY}`;
  }

  return path;
}

function sameRowNextPath(from: NodeLayoutEntry, to: NodeLayoutEntry): string {
  const start = nextOutPort(from);
  const end = nextInPort(to);
  return buildRoundedOrthogonalPath([start, end]);
}

function sameRowPrevPath(from: NodeLayoutEntry, to: NodeLayoutEntry): string {
  const start = prevOutPort(from);
  const end = prevInPort(to);
  return buildRoundedOrthogonalPath([start, end]);
}

function rowWrapNextPath(
  from: NodeLayoutEntry,
  to: NodeLayoutEntry,
  bounds: LayoutBounds,
): string {
  const start = nextOutPort(from);
  const end = nextInPort(to);
  const rightChannelX = bounds.maxX + CHANNEL_MARGIN;
  const leftChannelX = getRowWrapLeftChannelX(bounds.minX);
  const channelY = from.y + NODE_HEIGHT + ROW_GAP / 2;

  return buildRoundedOrthogonalPath([
    start,
    { x: rightChannelX, y: start.y },
    { x: rightChannelX, y: channelY },
    { x: leftChannelX, y: channelY },
    { x: leftChannelX, y: end.y },
    end,
  ]);
}

function rowWrapPrevPath(
  from: NodeLayoutEntry,
  to: NodeLayoutEntry,
  bounds: LayoutBounds,
): string {
  const start = prevOutPort(from);
  const end = prevInPort(to);
  const leftChannelX = getRowWrapLeftChannelX(bounds.minX);
  const rightChannelX = bounds.maxX + CHANNEL_MARGIN;
  const channelY = to.y + NODE_HEIGHT + ROW_GAP / 2;

  return buildRoundedOrthogonalPath([
    start,
    { x: leftChannelX, y: start.y },
    { x: leftChannelX, y: channelY },
    { x: rightChannelX, y: channelY },
    { x: rightChannelX, y: end.y },
    end,
  ]);
}

function circularBackEdgePath(
  from: NodeLayoutEntry,
  to: NodeLayoutEntry,
  bounds: LayoutBounds,
): string {
  const start = nextOutPort(from);
  const end = nextInPort(to);
  const rightChannelX = bounds.maxX + CHANNEL_MARGIN;
  const circularLeftChannelX = getCircularLeftChannelX(bounds.minX);
  const bottomChannelY = bounds.maxY + CIRCULAR_BOTTOM_MARGIN;

  return buildRoundedOrthogonalPath([
    start,
    { x: rightChannelX, y: start.y },
    { x: rightChannelX, y: bottomChannelY },
    { x: circularLeftChannelX, y: bottomChannelY },
    { x: circularLeftChannelX, y: end.y },
    end,
  ]);
}

function isBackwardNextLink(from: NodeLayoutEntry, to: NodeLayoutEntry): boolean {
  return to.index < from.index;
}

function reverseRowWrapPath(
  from: NodeLayoutEntry,
  to: NodeLayoutEntry,
  bounds: LayoutBounds,
): string {
  const start = nextOutPort(from);
  const end = nextInPort(to);
  const rightChannelX = bounds.maxX + CHANNEL_MARGIN;
  const channelY = from.y - ROW_GAP / 2;

  return buildRoundedOrthogonalPath([
    start,
    { x: rightChannelX, y: start.y },
    { x: rightChannelX, y: channelY },
    { x: end.x, y: channelY },
    end,
  ]);
}

function connectionPath(
  from: NodeLayoutEntry,
  to: NodeLayoutEntry,
  label: LinkedListConnection["label"],
  options: { isBackEdge: boolean; bounds: LayoutBounds },
): string {
  if (options.isBackEdge) {
    return circularBackEdgePath(from, to, options.bounds);
  }

  if (label === "next") {
    if (isBackwardNextLink(from, to)) {
      if (from.row !== to.row) {
        return reverseRowWrapPath(from, to, options.bounds);
      }
      return sameRowNextPath(from, to);
    }
    if (isRowWrapNext(from, to)) {
      return rowWrapNextPath(from, to, options.bounds);
    }
    return sameRowNextPath(from, to);
  }

  if (isRowWrapPrev(from, to)) {
    return rowWrapPrevPath(from, to, options.bounds);
  }

  return sameRowPrevPath(from, to);
}

function PointerPort({
  label,
  isNull,
  borderSide,
}: {
  label: "next" | "prev";
  isNull: boolean;
  borderSide: "left" | "right";
}) {
  return (
    <div
      className={[
        "flex w-8 shrink-0 items-center justify-center bg-slate-50 dark:bg-surface-container-lowest",
        borderSide === "left" ? "border-r border-slate-200" : "border-l border-slate-200",
        isNull ? "px-1" : "",
      ].join(" ")}
    >
      {isNull ? (
        <span className={LINKED_LIST_PORT_NULL_LABEL_CLASS}>null</span>
      ) : (
        <span className="text-[10px] font-bold leading-none text-slate-500">{label}</span>
      )}
    </div>
  );
}

function LinkedListNode({
  node,
  listType,
  position,
  stepTransitionMs,
}: {
  node: LinkedListNodeState;
  listType: LinkedListType;
  position: NodeLayoutEntry;
  stepTransitionMs: number;
}) {
  const showPrev = listType === "doubly";

  return (
    <div
      className={[
        LINKED_LIST_NODE_APPEARANCE[node.highlightState],
        "relative z-[1] flex overflow-hidden",
      ].join(" ")}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        transitionDuration: `${stepTransitionMs}ms`,
      }}
    >
      {showPrev && (
        <PointerPort
          label="prev"
          isNull={node.prevIsNull ?? true}
          borderSide="left"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-2">
        {node.showNewLabel && (
          <span className="text-[9px] font-bold uppercase tracking-wide text-amber-600">NEW</span>
        )}
        {!node.showNewLabel && node.isHead && (
          <span className="text-[9px] font-bold uppercase tracking-wide text-blue-600">head</span>
        )}
        {!node.showNewLabel && node.isTail && !node.isHead && (
          <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">tail</span>
        )}
        <span className="text-base font-bold tabular-nums text-slate-900">{node.value}</span>
      </div>
      <PointerPort
        label="next"
        isNull={node.nextIsNull ?? true}
        borderSide="right"
      />
    </div>
  );
}

export function LinkedListStructureVisualizer({
  listType,
  nodes,
  connections,
  stepTransitionMs = 200,
}: LinkedListStructureVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(640);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return undefined;
    }

    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(
    () => buildLayout(nodes, containerWidth),
    [nodes, containerWidth],
  );

  const nodeIds = useMemo(() => new Set(nodes.map((node) => node.id)), [nodes]);

  const headId = nodes.find((node) => node.isHead)?.id;
  const tailId = nodes.find((node) => node.isTail)?.id;

  const canvasHeight =
    layout.canvasHeight + (listType === "circular" ? CIRCULAR_BOTTOM_MARGIN / 2 : 0);

  const visibleConnections = useMemo(
    () =>
      connections.filter(
        (connection) =>
          nodeIds.has(connection.sourceId) && nodeIds.has(connection.targetId),
      ),
    [connections, nodeIds],
  );

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-4">
      <div className="w-full max-w-5xl rounded-2xl border-2 border-dashed border-primary/20 bg-surface-container-low/60 px-4 py-6">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {listType === "singly" && "Singly linked nodes (value + next)"}
          {listType === "doubly" && "Doubly linked nodes (prev + value + next)"}
          {listType === "circular" && "Circular linked list (tail → head)"}
        </p>

        <div
          ref={containerRef}
          className="relative mx-auto flex w-full justify-center"
          style={{ height: canvasHeight }}
        >
          <div
            className="relative"
            style={{ width: layout.canvasWidth, height: canvasHeight }}
          >
            <svg
              className="pointer-events-none absolute inset-0 z-0 overflow-visible"
              width={layout.canvasWidth}
              height={canvasHeight}
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="linked-list-arrow"
                  markerWidth={ARROW_MARKER_SIZE}
                  markerHeight={ARROW_MARKER_SIZE}
                  refX={ARROW_REF_X}
                  refY={2.5}
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path d={ARROW_PATH} fill="#64748b" />
                </marker>
              </defs>

              {visibleConnections.map((connection) => {
                const from = layout.positions.get(connection.sourceId);
                const to = layout.positions.get(connection.targetId);
                if (!from || !to) return null;

                const style = LINKED_LIST_CONNECTION_STYLES[connection.state];
                const isBackEdge =
                  listType === "circular" &&
                  connection.label === "next" &&
                  headId != null &&
                  connection.targetId === headId &&
                  connection.sourceId !== headId &&
                  (connection.sourceId === tailId || connection.state === "active");

                return (
                  <path
                    key={connection.id}
                    d={connectionPath(from, to, connection.label, {
                      isBackEdge,
                      bounds: layout.bounds,
                    })}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    strokeDasharray={style.strokeDasharray}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={style.className}
                    markerEnd="url(#linked-list-arrow)"
                  />
                );
              })}
            </svg>

            {nodes.map((node) => {
              const position = layout.positions.get(node.id);
              if (!position) return null;
              return (
                <LinkedListNode
                  key={node.id}
                  node={node}
                  listType={listType}
                  position={position}
                  stepTransitionMs={stepTransitionMs}
                />
              );
            })}
          </div>
        </div>
      </div>

      {listType === "circular" && (
        <p className="mt-1 text-center text-xs text-on-surface-variant">
          The orthogonal back-edge routes tail.next around the list exterior back to head
        </p>
      )}
    </div>
  );
}

export function LinkedListStructureLegendBar() {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest px-4 py-3"
      aria-label="Color legend"
    >
      {LINKED_LIST_LEGEND_ITEMS.map(({ label, swatch }) => (
        <span
          key={label}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700"
        >
          <span className={["h-4 w-4 shrink-0 rounded", swatch].join(" ")} aria-hidden="true" />
          {label}
        </span>
      ))}
    </div>
  );
}

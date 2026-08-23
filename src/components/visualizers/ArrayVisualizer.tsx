import type {
  ArrayCellState,
  ArrayPointer,
  PointerId,
} from "../../types/visualizer";
import {
  ARRAY_INDEX_LABEL_CLASS,
  BINARY_SEARCH_CELL_STYLES,
  VISUALIZER_CELL_BASE_CLASS,
} from "../../constants/visualizerTokens";
import { ChevronIcon } from "../ui/ChevronIcon";

interface ArrayVisualizerProps {
  cells: ArrayCellState[];
  pointers: ArrayPointer[];
  stepTransitionMs?: number;
}

export const FIRST_ROW_CAPACITY = 10;
const POINTER_ORDER: PointerId[] = ["low", "mid", "high", "i", "j", "min"];

const pointerColors: Record<
  PointerId,
  { label: string; arrow: string; border: string }
> = {
  low: {
    label: "text-amber-600 bg-orange-50 border border-orange-200",
    arrow: "text-orange-500",
    border: "border-orange-500 border-[3px]",
  },
  mid: {
    label: "text-blue-600 bg-blue-50 border border-blue-200",
    arrow: "text-blue-500",
    border: "border-blue-500 border-[3px]",
  },
  high: {
    label: "text-success bg-success/10 border-success/30",
    arrow: "text-success",
    border: "border-success border-[3px]",
  },
  i: {
    label: "text-violet-700 bg-violet-50 border border-violet-200",
    arrow: "text-violet-500",
    border: "border-violet-500 border-[3px]",
  },
  j: {
    label: "text-blue-700 bg-blue-50 border border-blue-200",
    arrow: "text-blue-500",
    border: "border-blue-500 border-[3px]",
  },
  min: {
    label: "text-amber-700 bg-amber-50 border border-amber-200",
    arrow: "text-amber-500",
    border: "border-amber-500 border-[3px]",
  },
};

const cellBase = VISUALIZER_CELL_BASE_CLASS;

const cellHighlightStyles = BINARY_SEARCH_CELL_STYLES;

function getPointerBorder(pointerIds: PointerId[]): string {
  if (pointerIds.includes("min")) return pointerColors.min.border;
  if (pointerIds.includes("j")) return pointerColors.j.border;
  if (pointerIds.includes("i")) return pointerColors.i.border;
  if (pointerIds.includes("mid")) return pointerColors.mid.border;
  if (pointerIds.includes("low")) return pointerColors.low.border;
  if (pointerIds.includes("high")) return pointerColors.high.border;
  return "border-surface-variant border-2 border-b-4";
}

function getPrimaryPointerId(pointerIds: PointerId[]): PointerId {
  if (pointerIds.includes("min")) return "min";
  if (pointerIds.includes("j")) return "j";
  if (pointerIds.includes("i")) return "i";
  if (pointerIds.includes("mid")) return "mid";
  if (pointerIds.includes("low")) return "low";
  return "high";
}

function splitRowIndices(count: number): number[][] {
  if (count <= FIRST_ROW_CAPACITY) {
    return [Array.from({ length: count }, (_, index) => index)];
  }

  const firstRow = Array.from(
    { length: FIRST_ROW_CAPACITY },
    (_, index) => index,
  );
  const secondRow = Array.from(
    { length: count - FIRST_ROW_CAPACITY },
    (_, index) => index + FIRST_ROW_CAPACITY,
  );

  return [firstRow, secondRow];
}

function PointerLabels({ pointers }: { pointers: ArrayPointer[] }) {
  const sortedIds = POINTER_ORDER.filter((id) =>
    pointers.some((pointer) => pointer.id === id),
  );

  if (sortedIds.length === 0) {
    return null;
  }

  const primaryId = getPrimaryPointerId(sortedIds);
  const badgeTextClass = "text-xs font-semibold px-2 py-0.5 whitespace-nowrap";

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 flex flex-col items-center whitespace-nowrap z-10 pointer-events-none">
      {sortedIds.length === 1 ? (
        <span
          className={[
            badgeTextClass,
            "rounded-lg border",
            pointerColors[sortedIds[0]].label,
          ].join(" ")}
        >
          {sortedIds[0]}
        </span>
      ) : (
        <div className="inline-flex items-center rounded-lg border border-surface-variant bg-surface-container-lowest overflow-hidden shadow-sm">
          {sortedIds.map((id, index) => (
            <span key={id} className="inline-flex items-center">
              {index > 0 && (
                <span className="text-xs font-semibold whitespace-nowrap text-outline opacity-50 px-0 select-none">
                  |
                </span>
              )}
              <span className={[badgeTextClass, pointerColors[id].label].join(" ")}>
                {id}
              </span>
            </span>
          ))}
        </div>
      )}
      <ChevronIcon
        direction="left"
        className={[
          "w-4 h-4 rotate-[-90deg]",
          pointerColors[primaryId].arrow,
        ].join(" ")}
      />
    </div>
  );
}

export function ArrayVisualizer({
  cells,
  pointers,
  stepTransitionMs = 200,
}: ArrayVisualizerProps) {
  const pointersByIndex = pointers.reduce<Record<number, ArrayPointer[]>>(
    (acc, pointer) => {
      acc[pointer.index] = [...(acc[pointer.index] ?? []), pointer];
      return acc;
    },
    {},
  );

  const rows = splitRowIndices(cells.length);
  const isMultiRow = rows.length > 1;

  return (
    <div
      className={[
        "w-full max-w-full min-w-0 flex flex-col items-center overflow-x-hidden overflow-y-visible",
        isMultiRow ? "gap-y-8" : "",
      ].join(" ")}
    >
      {rows.map((rowIndices, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-nowrap justify-center gap-3 md:gap-4 w-full min-w-0 overflow-x-hidden overflow-y-visible pt-12"
        >
          {rowIndices.map((index) => {
            const cell = cells[index];
            const columnPointers = pointersByIndex[index] ?? [];
            const pointerIds = columnPointers.map((pointer) => pointer.id);
            const hasPointers = columnPointers.length > 0;

            const isComparing = cell.highlight === "comparing";

            return (
              <div key={index} className="flex flex-col items-center shrink-0">
                <div className="relative">
                  <PointerLabels pointers={columnPointers} />

                  <div
                    className={[
                      "w-14 h-14 rounded-xl flex items-center justify-center relative transition-all",
                      cellBase,
                      hasPointers && !isComparing
                        ? getPointerBorder(pointerIds)
                        : "",
                      cellHighlightStyles[cell.highlight],
                    ].join(" ")}
                    style={{ transitionDuration: `${stepTransitionMs}ms` }}
                  >
                    <span className="font-bold text-base tabular-nums text-slate-900">
                      {cell.value}
                    </span>
                  </div>
                </div>

                <span className={ARRAY_INDEX_LABEL_CLASS}>[{index}]</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

import { useTranslation } from "react-i18next";
import type {
  ArrayStructureCellState,
  ArrayStructureHighlight,
} from "../../types/arrayStructure";
import type { ArrayPointer } from "../../types/visualizer";
import {
  ARRAY_INDEX_LABEL_CLASS,
  ARRAY_STRUCTURE_CELL_APPEARANCE,
  ARRAY_STRUCTURE_LEGEND_ITEMS,
  ARRAY_STRUCTURE_LEGEND_SWATCH_CLASS,
  ARRAY_STRUCTURE_POINTER_CELL_APPEARANCE,
} from "../../constants/visualizerTokens";
import { ChevronIcon } from "../ui/ChevronIcon";

interface ArrayStructureVisualizerProps {
  cells: ArrayStructureCellState[];
  capacity: number;
  pointers: ArrayPointer[];
  stepTransitionMs?: number;
}

const POINTER_ORDER = ["i", "j", "low", "mid", "high", "min"] as const;

const pointerToneById: Record<
  (typeof POINTER_ORDER)[number],
  keyof typeof ARRAY_STRUCTURE_POINTER_CELL_APPEARANCE
> = {
  i: "active",
  mid: "active",
  j: "shift",
  low: "shift",
  min: "shift",
  high: "success",
};

const pointerColors: Record<
  (typeof POINTER_ORDER)[number],
  { label: string; arrow: string }
> = {
  i: {
    label: "text-blue-700 bg-blue-50 border border-blue-200",
    arrow: "text-blue-500",
  },
  j: {
    label: "text-amber-700 bg-amber-50 border border-amber-200",
    arrow: "text-amber-500",
  },
  low: {
    label: "text-amber-600 bg-orange-50 border border-orange-200",
    arrow: "text-orange-500",
  },
  mid: {
    label: "text-blue-600 bg-blue-50 border border-blue-200",
    arrow: "text-blue-500",
  },
  high: {
    label: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    arrow: "text-emerald-500",
  },
  min: {
    label: "text-amber-700 bg-amber-50 border border-amber-200",
    arrow: "text-amber-500",
  },
};

function getPrimaryPointerId(pointerIds: string[]): (typeof POINTER_ORDER)[number] {
  for (const id of POINTER_ORDER) {
    if (pointerIds.includes(id)) {
      return id;
    }
  }
  return "i";
}

function getArrayStructureCellClass(
  highlight: ArrayStructureHighlight,
  pointerIds: string[],
): string {
  if (highlight !== "default" && highlight !== "vacant") {
    return ARRAY_STRUCTURE_CELL_APPEARANCE[highlight];
  }

  if (pointerIds.length > 0) {
    const pointerId = getPrimaryPointerId(pointerIds);
    return ARRAY_STRUCTURE_POINTER_CELL_APPEARANCE[pointerToneById[pointerId]];
  }

  return ARRAY_STRUCTURE_CELL_APPEARANCE[highlight];
}

function PointerLabels({ pointers }: { pointers: ArrayPointer[] }) {
  if (pointers.length === 0) {
    return null;
  }

  const primary = pointers[0];

  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 flex flex-col items-center whitespace-nowrap z-10 pointer-events-none">
      <span
        className={[
          "text-xs font-semibold px-2 py-0.5 whitespace-nowrap rounded-lg border",
          pointerColors[primary.id as (typeof POINTER_ORDER)[number]]?.label ??
            pointerColors.i.label,
        ].join(" ")}
      >
        {primary.id}
      </span>
      <ChevronIcon
        direction="left"
        className={[
          "w-4 h-4 rotate-[-90deg]",
          pointerColors[primary.id as (typeof POINTER_ORDER)[number]]?.arrow ??
            pointerColors.i.arrow,
        ].join(" ")}
      />
    </div>
  );
}

export function ArrayStructureVisualizer({
  cells,
  capacity,
  pointers,
  stepTransitionMs = 200,
}: ArrayStructureVisualizerProps) {
  const { t } = useTranslation("structures");
  const pointersByIndex = pointers.reduce<Record<number, ArrayPointer[]>>(
    (acc, pointer) => {
      acc[pointer.index] = [...(acc[pointer.index] ?? []), pointer];
      return acc;
    },
    {},
  );

  const displayCells =
    capacity > cells.length
      ? [
          ...cells,
          ...Array.from({ length: capacity - cells.length }, () => ({
            value: null,
            highlight: "vacant" as const,
          })),
        ]
      : cells;

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-4">
      <div className="w-full max-w-4xl rounded-2xl border-2 border-dashed border-primary/25 bg-surface-container-low/60 px-4 py-5 sm:px-6">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          {t("visualizer.array.memoryBlockTitle")}
        </p>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 overflow-x-auto pt-12 pb-2">
          {displayCells.map((cell, index) => {
            const columnPointers = pointersByIndex[index] ?? [];
            const pointerIds = columnPointers.map((pointer) => pointer.id);
            const cellClass = getArrayStructureCellClass(
              cell.highlight,
              pointerIds,
            );

            return (
              <div key={index} className="flex flex-col items-center shrink-0">
                <div className="relative">
                  <PointerLabels pointers={columnPointers} />

                  <div
                    className={cellClass}
                    style={{ transitionDuration: `${stepTransitionMs}ms` }}
                  >
                    <span className="text-base font-bold tabular-nums text-slate-900">
                      {cell.value ?? "·"}
                    </span>
                  </div>
                </div>

                <span className={ARRAY_INDEX_LABEL_CLASS}>[{index}]</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-on-surface-variant">
        {t("visualizer.array.capacityHint", { count: capacity })}
      </p>
    </div>
  );
}

export function ArrayStructureLegendBar() {
  const { t } = useTranslation("structures");

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest px-4 py-3"
      aria-label="Color legend"
    >
      {ARRAY_STRUCTURE_LEGEND_ITEMS.map(({ token }) => (
        <span
          key={token}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700"
        >
          <span
            className={[
              "h-4 w-4 shrink-0 rounded",
              ARRAY_STRUCTURE_LEGEND_SWATCH_CLASS[token],
            ].join(" ")}
            aria-hidden="true"
          />
          {t(`legends.array.${token}`)}
        </span>
      ))}
    </div>
  );
}

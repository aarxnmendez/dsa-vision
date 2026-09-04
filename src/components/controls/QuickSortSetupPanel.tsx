import type { PivotStrategy } from "../../algorithms/quickSort";
import { DatasetSetupPanel } from "./DatasetSetupPanel";
import { sectionLabelClass } from "../ui/sectionLabel";

interface QuickSortSetupPanelProps {
  arraySize: number;
  pivotStrategy: PivotStrategy;
  onArraySizeChange: (size: number) => void;
  onRandomize: () => void;
  onApplyCustomDataset: (array: number[]) => void;
  onPivotStrategyChange: (strategy: PivotStrategy) => void;
}

const QUICKSORT_CUSTOM_INPUT_DESCRIPTION =
  "Enter values in any order. Try a sorted sequence with First vs Random pivots.";

const PIVOT_STRATEGY_OPTIONS: {
  id: PivotStrategy;
  label: string;
  description: string;
}[] = [
  {
    id: "first",
    label: "First",
    description: "Skews to O(n²) on pre-sorted data",
  },
  {
    id: "middle",
    label: "Middle",
    description: "Balanced splits on sorted input",
  },
  {
    id: "last",
    label: "Last",
    description: "Skews on reverse-sorted data",
  },
  {
    id: "random",
    label: "Random",
    description: "Avoids O(n²) on pre-sorted data",
  },
];

function strategyButtonClass(isActive: boolean): string {
  return [
    "flex min-h-[4.25rem] flex-col justify-center rounded-xl border-2 px-3.5 py-3 text-left transition-colors cursor-pointer",
    isActive
      ? "border-primary bg-primary-fixed text-primary"
      : "border-surface-variant bg-surface text-on-surface-variant hover:border-primary/40",
  ].join(" ");
}

export function QuickSortSetupPanel({
  arraySize,
  pivotStrategy,
  onArraySizeChange,
  onRandomize,
  onApplyCustomDataset,
  onPivotStrategyChange,
}: QuickSortSetupPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <DatasetSetupPanel
        embedded
        arraySize={arraySize}
        onArraySizeChange={onArraySizeChange}
        onRandomize={onRandomize}
        preserveArrayOrder
        customInputDescription={QUICKSORT_CUSTOM_INPUT_DESCRIPTION}
        arrayPlaceholder="1, 2, 3, 4, 5"
        onApplyCustomDataset={({ array }) => onApplyCustomDataset(array)}
      />

      <div className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className={sectionLabelClass}>Pivot Strategy</span>
          <div className="grid grid-cols-2 gap-2.5">
            {PIVOT_STRATEGY_OPTIONS.map((option) => {
              const isActive = pivotStrategy === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onPivotStrategyChange(option.id)}
                  aria-pressed={isActive}
                  className={strategyButtonClass(isActive)}
                >
                  <span className="block text-sm font-bold leading-snug">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed opacity-80">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

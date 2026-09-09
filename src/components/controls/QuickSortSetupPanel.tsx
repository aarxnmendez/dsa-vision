import { useTranslation } from "react-i18next";
import type { PivotStrategy } from "../../algorithms/quickSort";
import { DatasetSetupPanel } from "./DatasetSetupPanel";
import { sectionLabelClass } from "../ui/sectionLabel";

interface QuickSortSetupPanelProps {
  arraySize: number;
  pivotStrategy: PivotStrategy;
  customInputDescription?: string;
  onArraySizeChange: (size: number) => void;
  onRandomize: () => void;
  onApplyCustomDataset: (array: number[]) => void;
  onPivotStrategyChange: (strategy: PivotStrategy) => void;
}

const PIVOT_STRATEGY_IDS: PivotStrategy[] = [
  "first",
  "middle",
  "last",
  "random",
];

const PIVOT_LABEL_KEYS = {
  first: "quickSort.pivot.first",
  middle: "quickSort.pivot.middle",
  last: "quickSort.pivot.last",
  random: "quickSort.pivot.random",
} as const satisfies Record<PivotStrategy, string>;

const PIVOT_DESCRIPTION_KEYS = {
  first: "quickSort.pivot.firstDescription",
  middle: "quickSort.pivot.middleDescription",
  last: "quickSort.pivot.lastDescription",
  random: "quickSort.pivot.randomDescription",
} as const satisfies Record<PivotStrategy, string>;

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
  customInputDescription,
  onArraySizeChange,
  onRandomize,
  onApplyCustomDataset,
  onPivotStrategyChange,
}: QuickSortSetupPanelProps) {
  const { t } = useTranslation("structures");

  return (
    <div className="flex flex-col gap-3">
      <DatasetSetupPanel
        embedded
        arraySize={arraySize}
        onArraySizeChange={onArraySizeChange}
        onRandomize={onRandomize}
        preserveArrayOrder
        customInputDescription={customInputDescription}
        arrayPlaceholder="1, 2, 3, 4, 5"
        onApplyCustomDataset={({ array }) => onApplyCustomDataset(array)}
      />

      <div className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className={sectionLabelClass}>{t("quickSort.pivotStrategy")}</span>
          <div className="grid grid-cols-2 gap-2.5">
            {PIVOT_STRATEGY_IDS.map((id) => {
              const isActive = pivotStrategy === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onPivotStrategyChange(id)}
                  aria-pressed={isActive}
                  className={strategyButtonClass(isActive)}
                >
                  <span className="block text-sm font-bold leading-snug">
                    {t(PIVOT_LABEL_KEYS[id])}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed opacity-80">
                    {t(PIVOT_DESCRIPTION_KEYS[id])}
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

import { useTranslation } from "react-i18next";
import type { StackOperationId } from "../../types/stackStructure";
import { STACK_MAX_CAPACITY } from "../../types/stackStructure";
import { DatasetSetupPanel } from "./DatasetSetupPanel";
import { sectionLabelClass } from "../ui/sectionLabel";

interface StackSetupPanelProps {
  values: number[];
  stackSize: number;
  operation: StackOperationId;
  pushValue: number;
  onStackSizeChange: (size: number) => void;
  onRandomize: () => void;
  onApplyCustomDataset: (values: number[]) => void;
  onOperationChange: (operation: StackOperationId) => void;
  onPushValueChange: (value: number) => void;
}

const OPERATION_IDS: StackOperationId[] = ["push", "pop", "peek", "clear"];

const OPERATION_LABEL_KEYS = {
  push: "stack.operations.push",
  pop: "stack.operations.pop",
  peek: "stack.operations.peek",
  clear: "stack.operations.clear",
} as const satisfies Record<StackOperationId, string>;

const OPERATION_DESCRIPTION_KEYS = {
  push: "stack.operations.pushDescription",
  pop: "stack.operations.popDescription",
  peek: "stack.operations.peekDescription",
  clear: "stack.operations.clearDescription",
} as const satisfies Record<StackOperationId, string>;

const compactFieldClass =
  "w-full rounded-xl border-2 border-surface-variant bg-surface px-3 py-2 font-body-md text-sm focus:border-primary focus:outline-none";

function operationButtonClass(isActive: boolean): string {
  return [
    "flex min-h-[4.25rem] flex-col justify-center rounded-xl border-2 px-3.5 py-3 text-left transition-colors cursor-pointer",
    isActive
      ? "border-primary bg-primary-fixed text-primary"
      : "border-surface-variant bg-surface text-on-surface-variant hover:border-primary/40",
  ].join(" ");
}

export function StackSetupPanel({
  values,
  stackSize,
  operation,
  pushValue,
  onStackSizeChange,
  onRandomize,
  onApplyCustomDataset,
  onOperationChange,
  onPushValueChange,
}: StackSetupPanelProps) {
  const { t } = useTranslation("structures");

  return (
    <div className="flex flex-col gap-3">
      <DatasetSetupPanel
        embedded
        arraySize={stackSize}
        onArraySizeChange={onStackSizeChange}
        onRandomize={onRandomize}
        preserveArrayOrder
        array={values}
        customInputDescription={t("stack.customInputDescription", {
          max: STACK_MAX_CAPACITY,
        })}
        arrayPlaceholder="12, 45, 89"
        sizeMin={0}
        sizeMax={STACK_MAX_CAPACITY}
        sizeLabel={t("stack.initialSize")}
        onApplyCustomDataset={({ array }) => onApplyCustomDataset(array)}
      />

      <div className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className={sectionLabelClass}>{t("stack.stackOperation")}</span>
          <div className="grid grid-cols-2 gap-2.5">
            {OPERATION_IDS.map((id) => {
              const isActive = operation === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onOperationChange(id)}
                  aria-pressed={isActive}
                  className={operationButtonClass(isActive)}
                >
                  <span className="block text-sm font-bold leading-snug">
                    {t(OPERATION_LABEL_KEYS[id])}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed opacity-80">
                    {t(OPERATION_DESCRIPTION_KEYS[id])}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {operation === "push" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="stack-push-value" className={sectionLabelClass}>
              {t("stack.valueToPush")}
            </label>
            <input
              id="stack-push-value"
              type="number"
              value={pushValue}
              onChange={(event) => onPushValueChange(Number(event.target.value))}
              className={[compactFieldClass, "no-spinner"].join(" ")}
            />
          </div>
        )}

        <p className="text-xs text-on-surface-variant">
          {t("stack.capacityLoaded", {
            loaded: values.length,
            max: STACK_MAX_CAPACITY,
          })}
        </p>
      </div>
    </div>
  );
}

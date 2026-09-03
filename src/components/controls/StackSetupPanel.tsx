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

const OPERATION_OPTIONS: {
  id: StackOperationId;
  label: string;
  description: string;
}[] = [
  { id: "push", label: "Push", description: "O(1) — add to TOP" },
  { id: "pop", label: "Pop", description: "O(1) — remove TOP" },
  { id: "peek", label: "Peek", description: "O(1) — read TOP" },
  { id: "clear", label: "Clear", description: "O(n) — empty stack" },
];

const STACK_CUSTOM_INPUT_DESCRIPTION = `Enter bottom-to-top values (max ${STACK_MAX_CAPACITY} elements).`;

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
  return (
    <div className="flex flex-col gap-3">
      <DatasetSetupPanel
        embedded
        arraySize={stackSize}
        onArraySizeChange={onStackSizeChange}
        onRandomize={onRandomize}
        preserveArrayOrder
        array={values}
        customInputDescription={STACK_CUSTOM_INPUT_DESCRIPTION}
        arrayPlaceholder="12, 45, 89"
        sizeMin={0}
        sizeMax={STACK_MAX_CAPACITY}
        sizeLabel="Initial Stack Size"
        onApplyCustomDataset={({ array }) => onApplyCustomDataset(array)}
      />

      <div className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className={sectionLabelClass}>Stack Operation</span>
          <div className="grid grid-cols-2 gap-2.5">
            {OPERATION_OPTIONS.map((option) => {
              const isActive = operation === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onOperationChange(option.id)}
                  aria-pressed={isActive}
                  className={operationButtonClass(isActive)}
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

        {operation === "push" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="stack-push-value" className={sectionLabelClass}>
              Value to Push
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
          Capacity: {values.length} / {STACK_MAX_CAPACITY} elements loaded.
        </p>
      </div>
    </div>
  );
}

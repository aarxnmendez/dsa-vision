import type { ArrayOperationId } from "../../types/arrayStructure";
import { DatasetSetupPanel } from "./DatasetSetupPanel";
import { Select } from "../ui/Select";
import { sectionLabelClass } from "../ui/sectionLabel";

interface ArraySetupPanelProps {
  array: number[];
  arraySize: number;
  operation: ArrayOperationId;
  operationIndex: number;
  operationValue: number;
  searchTarget: number;
  needsIndexInput: boolean;
  needsValueInput: boolean;
  needsSearchTarget: boolean;
  onArraySizeChange: (size: number) => void;
  onRandomize: () => void;
  onApplyCustomDataset: (array: number[]) => void;
  onOperationChange: (operation: ArrayOperationId) => void;
  onOperationIndexChange: (index: number) => void;
  onOperationValueChange: (value: number) => void;
  onSearchTargetChange: (target: number) => void;
}

const OPERATION_OPTIONS: { id: ArrayOperationId; label: string }[] = [
  { id: "access", label: "Access by Index — O(1)" },
  { id: "linear-search", label: "Linear Search — O(n)" },
  { id: "insert-start", label: "Insert at Start — O(n)" },
  { id: "insert-middle", label: "Insert at Middle — O(n)" },
  { id: "insert-end", label: "Insert at End — O(1) amortized" },
  { id: "delete-start", label: "Delete at Start — O(n)" },
  { id: "delete-middle", label: "Delete at Middle — O(n)" },
  { id: "delete-end", label: "Delete at End — O(1)" },
];

const ARRAY_CUSTOM_INPUT_DESCRIPTION =
  "Values are stored left-to-right in contiguous memory.";

const compactFieldClass =
  "w-full rounded-xl border-2 border-surface-variant bg-surface px-3 py-2 font-body-md text-sm focus:border-primary focus:outline-none";

export function ArraySetupPanel({
  array,
  arraySize,
  operation,
  operationIndex,
  operationValue,
  searchTarget,
  needsIndexInput,
  needsValueInput,
  needsSearchTarget,
  onArraySizeChange,
  onRandomize,
  onApplyCustomDataset,
  onOperationChange,
  onOperationIndexChange,
  onOperationValueChange,
  onSearchTargetChange,
}: ArraySetupPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <DatasetSetupPanel
        embedded
        arraySize={arraySize}
        onArraySizeChange={onArraySizeChange}
        onRandomize={onRandomize}
        preserveArrayOrder
        array={array}
        customInputDescription={ARRAY_CUSTOM_INPUT_DESCRIPTION}
        arrayPlaceholder="42, 17, 83, 5, 61"
        onApplyCustomDataset={({ array: nextArray }) =>
          onApplyCustomDataset(nextArray)
        }
      />

      <div className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="array-operation-select" className={sectionLabelClass}>
            Operation
          </label>
          <Select
            id="array-operation-select"
            value={operation}
            options={OPERATION_OPTIONS.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            onChange={onOperationChange}
            ariaLabel="Array operation"
          />
        </div>

        {needsIndexInput && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="array-operation-index" className={sectionLabelClass}>
              Index
            </label>
            <input
              id="array-operation-index"
              type="number"
              min={0}
              max={Math.max(array.length - 1, 0)}
              value={operationIndex}
              onChange={(event) =>
                onOperationIndexChange(Number(event.target.value))
              }
              className={[compactFieldClass, "no-spinner"].join(" ")}
            />
          </div>
        )}

        {needsValueInput && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="array-operation-value" className={sectionLabelClass}>
              Value to Insert
            </label>
            <input
              id="array-operation-value"
              type="number"
              value={operationValue}
              onChange={(event) =>
                onOperationValueChange(Number(event.target.value))
              }
              className={[compactFieldClass, "no-spinner"].join(" ")}
            />
          </div>
        )}

        {needsSearchTarget && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="array-search-target" className={sectionLabelClass}>
              Search Target
            </label>
            <input
              id="array-search-target"
              type="number"
              value={searchTarget}
              onChange={(event) =>
                onSearchTargetChange(Number(event.target.value))
              }
              className={[compactFieldClass, "no-spinner"].join(" ")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

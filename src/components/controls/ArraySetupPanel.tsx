import { useMemo } from "react";
import { useTranslation } from "react-i18next";
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

const OPERATION_IDS: ArrayOperationId[] = [
  "access",
  "linear-search",
  "insert-start",
  "insert-middle",
  "insert-end",
  "delete-start",
  "delete-middle",
  "delete-end",
];

const OPERATION_LABEL_KEYS = {
  access: "array.operations.access",
  "linear-search": "array.operations.linearSearch",
  "insert-start": "array.operations.insertStart",
  "insert-middle": "array.operations.insertMiddle",
  "insert-end": "array.operations.insertEnd",
  "delete-start": "array.operations.deleteStart",
  "delete-middle": "array.operations.deleteMiddle",
  "delete-end": "array.operations.deleteEnd",
} as const satisfies Record<ArrayOperationId, string>;

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
  const { t } = useTranslation("structures");

  const operationOptions = useMemo(
    () =>
      OPERATION_IDS.map((id) => ({
        value: id,
        label: t(OPERATION_LABEL_KEYS[id]),
      })),
    [t],
  );

  return (
    <div className="flex flex-col gap-3">
      <DatasetSetupPanel
        embedded
        arraySize={arraySize}
        onArraySizeChange={onArraySizeChange}
        onRandomize={onRandomize}
        preserveArrayOrder
        array={array}
        customInputDescription={t("array.customInputDescription")}
        arrayPlaceholder="42, 17, 83, 5, 61"
        onApplyCustomDataset={({ array: nextArray }) =>
          onApplyCustomDataset(nextArray)
        }
      />

      <div className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="array-operation-select" className={sectionLabelClass}>
            {t("array.operation")}
          </label>
          <Select
            id="array-operation-select"
            value={operation}
            options={operationOptions}
            onChange={onOperationChange}
            ariaLabel={t("array.operationAria")}
          />
        </div>

        {needsIndexInput && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="array-operation-index" className={sectionLabelClass}>
              {t("array.index")}
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
              {t("array.valueToInsert")}
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
              {t("array.searchTarget")}
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

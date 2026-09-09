import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type {
  LinkedListOperationId,
  LinkedListType,
} from "../../types/linkedListStructure";
import { DatasetSetupPanel } from "./DatasetSetupPanel";
import { Select } from "../ui/Select";
import { sectionLabelClass } from "../ui/sectionLabel";

interface LinkedListSetupPanelProps {
  values: number[];
  listSize: number;
  listType: LinkedListType;
  operation: LinkedListOperationId;
  operationIndex: number;
  operationValue: number;
  searchTarget: number;
  needsIndexInput: boolean;
  needsValueInput: boolean;
  needsSearchTarget: boolean;
  onListSizeChange: (size: number) => void;
  onRandomize: () => void;
  onApplyCustomDataset: (values: number[]) => void;
  onListTypeChange: (type: LinkedListType) => void;
  onOperationChange: (operation: LinkedListOperationId) => void;
  onOperationIndexChange: (index: number) => void;
  onOperationValueChange: (value: number) => void;
  onSearchTargetChange: (target: number) => void;
}

const LIST_TYPE_IDS: LinkedListType[] = ["singly", "doubly", "circular"];

const LIST_TYPE_LABEL_KEYS = {
  singly: "linkedList.types.singly",
  doubly: "linkedList.types.doubly",
  circular: "linkedList.types.circular",
} as const satisfies Record<LinkedListType, string>;

const OPERATION_IDS: LinkedListOperationId[] = [
  "insert-at-head",
  "insert-at-tail",
  "insert-at-index",
  "delete-head",
  "delete-tail",
  "delete-value",
  "search",
  "reverse",
];

const OPERATION_LABEL_KEYS = {
  "insert-at-head": "linkedList.operations.insertAtHead",
  "insert-at-tail": "linkedList.operations.insertAtTail",
  "insert-at-index": "linkedList.operations.insertAtIndex",
  "delete-head": "linkedList.operations.deleteHead",
  "delete-tail": "linkedList.operations.deleteTail",
  "delete-value": "linkedList.operations.deleteValue",
  search: "linkedList.operations.search",
  reverse: "linkedList.operations.reverse",
} as const satisfies Record<LinkedListOperationId, string>;

const compactFieldClass =
  "w-full rounded-xl border-2 border-surface-variant bg-surface px-3 py-2 font-body-md text-sm focus:border-primary focus:outline-none";

export function LinkedListSetupPanel({
  values,
  listSize,
  listType,
  operation,
  operationIndex,
  operationValue,
  searchTarget,
  needsIndexInput,
  needsValueInput,
  needsSearchTarget,
  onListSizeChange,
  onRandomize,
  onApplyCustomDataset,
  onListTypeChange,
  onOperationChange,
  onOperationIndexChange,
  onOperationValueChange,
  onSearchTargetChange,
}: LinkedListSetupPanelProps) {
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
        arraySize={listSize}
        onArraySizeChange={onListSizeChange}
        onRandomize={onRandomize}
        preserveArrayOrder
        array={values}
        customInputDescription={t("linkedList.customInputDescription")}
        arrayPlaceholder="42, 17, 83, 5, 61"
        onApplyCustomDataset={({ array }) => onApplyCustomDataset(array)}
      />

      <div className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className={sectionLabelClass}>{t("linkedList.listType")}</span>
          <div className="grid grid-cols-1 gap-2">
            {LIST_TYPE_IDS.map((id) => {
              const isActive = listType === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onListTypeChange(id)}
                  className={[
                    "rounded-xl border-2 px-3 py-2 text-left text-sm font-semibold transition-colors cursor-pointer",
                    isActive
                      ? "border-primary bg-primary-fixed text-primary"
                      : "border-surface-variant bg-surface text-on-surface-variant hover:border-primary/40",
                  ].join(" ")}
                >
                  {t(LIST_TYPE_LABEL_KEYS[id])}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="linked-list-operation-select" className={sectionLabelClass}>
            {t("linkedList.operation")}
          </label>
          <Select
            id="linked-list-operation-select"
            value={operation}
            options={operationOptions}
            onChange={onOperationChange}
            ariaLabel={t("linkedList.operationAria")}
          />
        </div>

        {needsIndexInput && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="linked-list-operation-index" className={sectionLabelClass}>
              {t("linkedList.index")}
            </label>
            <input
              id="linked-list-operation-index"
              type="number"
              min={0}
              max={Math.max(values.length, 0)}
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
            <label htmlFor="linked-list-operation-value" className={sectionLabelClass}>
              {t("linkedList.valueToInsert")}
            </label>
            <input
              id="linked-list-operation-value"
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
            <label htmlFor="linked-list-search-target" className={sectionLabelClass}>
              {t("linkedList.searchTarget")}
            </label>
            <input
              id="linked-list-search-target"
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

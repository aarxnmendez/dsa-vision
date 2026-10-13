import { useTranslation } from "react-i18next";
import type { QueueOperationId } from "../../types/queueStructure";
import {
  QUEUE_MAX_CAPACITY,
  QUEUE_MIN_CAPACITY,
} from "../../types/queueStructure";
import { DatasetSetupPanel } from "./DatasetSetupPanel";
import { sectionLabelClass } from "../ui/sectionLabel";

interface QueueSetupPanelProps {
  values: number[];
  queueSize: number;
  operation: QueueOperationId;
  enqueueValue: number;
  onQueueSizeChange: (size: number) => void;
  onRandomize: () => void;
  onApplyCustomDataset: (values: number[]) => void;
  onOperationChange: (operation: QueueOperationId) => void;
  onEnqueueValueChange: (value: number) => void;
}

const OPERATION_IDS: QueueOperationId[] = [
  "enqueue",
  "dequeue",
  "peek",
  "clear",
];

const OPERATION_LABEL_KEYS = {
  enqueue: "queue.operations.enqueue",
  dequeue: "queue.operations.dequeue",
  peek: "queue.operations.peek",
  clear: "queue.operations.clear",
} as const satisfies Record<QueueOperationId, string>;

const OPERATION_DESCRIPTION_KEYS = {
  enqueue: "queue.operations.enqueueDescription",
  dequeue: "queue.operations.dequeueDescription",
  peek: "queue.operations.peekDescription",
  clear: "queue.operations.clearDescription",
} as const satisfies Record<QueueOperationId, string>;

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

export function QueueSetupPanel({
  values,
  queueSize,
  operation,
  enqueueValue,
  onQueueSizeChange,
  onRandomize,
  onApplyCustomDataset,
  onOperationChange,
  onEnqueueValueChange,
}: QueueSetupPanelProps) {
  const { t } = useTranslation("structures");

  return (
    <div className="flex flex-col gap-3">
      <DatasetSetupPanel
        embedded
        arraySize={queueSize}
        onArraySizeChange={onQueueSizeChange}
        onRandomize={onRandomize}
        preserveArrayOrder
        array={values}
        customInputDescription={t("queue.customInputDescription", {
          max: QUEUE_MAX_CAPACITY,
        })}
        arrayPlaceholder="12, 45, 89"
        sizeMin={QUEUE_MIN_CAPACITY}
        sizeMax={QUEUE_MAX_CAPACITY}
        sizeLabel={t("queue.initialSize")}
        onApplyCustomDataset={({ array }) => onApplyCustomDataset(array)}
      />

      <div className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className={sectionLabelClass}>{t("queue.queueOperation")}</span>
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

        {operation === "enqueue" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="queue-enqueue-value" className={sectionLabelClass}>
              {t("queue.valueToEnqueue")}
            </label>
            <input
              id="queue-enqueue-value"
              type="number"
              value={enqueueValue}
              onChange={(event) =>
                onEnqueueValueChange(Number(event.target.value))
              }
              className={[compactFieldClass, "no-spinner"].join(" ")}
            />
          </div>
        )}

        <p className="text-xs text-on-surface-variant">
          {t("queue.capacityLoaded", {
            loaded: values.length,
            max: QUEUE_MAX_CAPACITY,
          })}
        </p>
      </div>
    </div>
  );
}

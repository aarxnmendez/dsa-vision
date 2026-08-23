import { useId, useState } from "react";
import type { CustomDatasetPayload } from "../../utils/customInput";
import { sectionLabelClass } from "../ui/sectionLabel";
import { buttonLabelClass } from "../ui/buttonLabel";
import { Icon } from "../ui/Icon";
import { CustomInputModal } from "./CustomInputModal";

interface DatasetSetupPanelProps {
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  onRandomize: () => void;
  onApplyCustomDataset: (payload: CustomDatasetPayload) => void;
  showTargetInput?: boolean;
  array?: number[];
  target?: number;
  onTargetChange?: (target: number) => void;
  preserveArrayOrder?: boolean;
  customInputDescription?: string;
  arrayPlaceholder?: string;
  embedded?: boolean;
}

export function DatasetSetupPanel({
  arraySize,
  onArraySizeChange,
  onRandomize,
  onApplyCustomDataset,
  showTargetInput = false,
  array,
  target,
  onTargetChange,
  preserveArrayOrder = false,
  customInputDescription,
  arrayPlaceholder,
  embedded = false,
}: DatasetSetupPanelProps) {
  const idPrefix = useId().replace(/:/g, "");
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalKey, setCustomModalKey] = useState(0);

  const openCustomModal = () => {
    setCustomModalKey((key) => key + 1);
    setIsCustomModalOpen(true);
  };

  const customModalInitialValues =
    array !== undefined ? array.join(", ") : "";

  const customModalInitialTarget =
    showTargetInput && target !== undefined ? String(target) : "";

  return (
    <>
      <div
        className={[
          "flex flex-col gap-3",
          embedded ? "" : "overflow-y-auto pr-2",
        ].join(" ")}
      >
        <div className="bg-surface-container-lowest p-4 rounded-2xl border-2 border-surface-variant flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label
                htmlFor={`${idPrefix}-array-size-slider`}
                className={sectionLabelClass}
              >
                Array Size
              </label>
              <span className="bg-primary-container text-on-primary-container font-bold px-3 py-1 rounded-xl text-sm">
                {arraySize}
              </span>
            </div>
            <input
              id={`${idPrefix}-array-size-slider`}
              type="range"
              min={5}
              max={20}
              value={arraySize}
              onChange={(event) => onArraySizeChange(Number(event.target.value))}
              className="w-full h-3 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary border-2 border-surface-variant"
            />
          </div>

          {showTargetInput && onTargetChange !== undefined && target !== undefined && (
            <div className="flex flex-col gap-3">
              <label
                htmlFor={`${idPrefix}-target-value-input`}
                className={sectionLabelClass}
              >
                Target Value
              </label>
              <div className="relative">
                <input
                  id={`${idPrefix}-target-value-input`}
                  type="number"
                  value={target}
                  onChange={(event) => {
                    const raw = event.target.value;
                    if (raw.trim() === "") return;
                    const nextTarget = Number(raw);
                    if (!Number.isFinite(nextTarget)) return;
                    onTargetChange(nextTarget);
                  }}
                  className="w-full bg-surface text-on-surface border-2 border-surface-variant rounded-xl py-3 px-4 font-headline-md focus:outline-none focus:border-primary focus:ring-0 transition-colors no-spinner"
                />
                <Icon
                  name="my_location"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 pt-1 border-t-2 border-surface-container">
            <button
              type="button"
              onClick={onRandomize}
              className={[
                "bg-primary text-on-primary py-3 px-4 rounded-xl border-b-4 border-on-primary-fixed-variant hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center gap-2 btn-3d w-full cursor-pointer",
                buttonLabelClass,
              ].join(" ")}
            >
              <Icon name="shuffle" className="text-[20px]" />
              Randomize Data
            </button>

            <button
              type="button"
              onClick={openCustomModal}
              className={[
                "bg-surface-container-low text-on-surface-variant py-3 px-4 rounded-xl border-2 border-surface-variant hover:bg-surface-container flex items-center justify-center gap-2 btn-3d w-full cursor-pointer",
                buttonLabelClass,
              ].join(" ")}
            >
              <Icon name="edit_note" className="text-[20px]" />
              Custom Input
            </button>
          </div>
        </div>
      </div>

      {isCustomModalOpen && (
        <CustomInputModal
          key={customModalKey}
          initialValues={customModalInitialValues}
          initialTarget={customModalInitialTarget}
          showTargetInput={showTargetInput}
          preserveArrayOrder={preserveArrayOrder}
          description={customInputDescription}
          arrayPlaceholder={arrayPlaceholder}
          onClose={() => setIsCustomModalOpen(false)}
          onApply={onApplyCustomDataset}
        />
      )}
    </>
  );
}

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MAX_CUSTOM_ARRAY_ELEMENTS,
  MIN_CUSTOM_ARRAY_ELEMENTS,
  parseCustomArrayInput,
} from "../../utils/customInput";
import { buttonLabelClass } from "../ui/buttonLabel";
import {
  APPLY_DATA_LABEL,
  CUSTOM_DATA_INPUT_TITLE,
} from "../../constants/copy";
import { sectionLabelClass } from "../ui/sectionLabel";
import { Icon } from "../ui/Icon";

interface SortDatasetSetupPanelProps {
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  onRandomize: () => void;
  onApplyCustomDataset: (array: number[]) => void;
}

interface SortCustomInputModalProps {
  initialValues: string;
  onClose: () => void;
  onApply: (array: number[]) => void;
}

function SortCustomInputModal({
  initialValues,
  onClose,
  onApply,
}: SortCustomInputModalProps) {
  const titleId = useId();
  const valuesInputRef = useRef<HTMLInputElement>(null);
  const [valuesInput, setValuesInput] = useState(initialValues);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      valuesInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleApply = () => {
    const arrayResult = parseCustomArrayInput(valuesInput, {
      preserveOrder: true,
    });

    if ("error" in arrayResult) {
      setError(arrayResult.error);
      return;
    }

    onApply(arrayResult.array);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg bg-surface-container-lowest border-2 border-surface-variant border-b-4 rounded-2xl shadow-[0_12px_0_0_#dfe3e7] p-6 flex flex-col gap-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="font-headline-md text-headline-md text-primary"
            >
              {CUSTOM_DATA_INPUT_TITLE}
            </h2>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Enter values in any order. Selection Sort will sort them in place.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="sort-custom-array-values" className={sectionLabelClass}>
            Array Values
          </label>
          <input
            id="sort-custom-array-values"
            ref={valuesInputRef}
            type="text"
            value={valuesInput}
            onChange={(event) => {
              setValuesInput(event.target.value);
              setError(null);
            }}
            placeholder="64, 25, 12, 22, 11"
            className="w-full bg-surface text-on-surface border-2 border-surface-variant rounded-xl py-3 px-4 font-body-md focus:outline-none focus:border-primary focus:ring-0 transition-colors"
          />
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            Enter {MIN_CUSTOM_ARRAY_ELEMENTS} to {MAX_CUSTOM_ARRAY_ELEMENTS}{" "}
            numbers separated by commas.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="font-body-md text-body-md text-error bg-error-container/40 border border-error-container rounded-xl px-4 py-3"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className={[
              "flex-1 bg-surface text-on-surface py-3 px-4 rounded-xl border-b-4 border-surface-variant hover:bg-surface-bright btn-3d cursor-pointer",
              buttonLabelClass,
            ].join(" ")}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className={[
              "flex-1 bg-primary text-on-primary py-3 px-4 rounded-xl border-b-4 border-on-primary-fixed-variant hover:bg-primary-container hover:text-on-primary-container transition-colors btn-3d cursor-pointer",
              buttonLabelClass,
            ].join(" ")}
          >
            {APPLY_DATA_LABEL}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function SortDatasetSetupPanel({
  arraySize,
  onArraySizeChange,
  onRandomize,
  onApplyCustomDataset,
}: SortDatasetSetupPanelProps) {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customSeed, setCustomSeed] = useState("");

  return (
    <>
      <div className="flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="bg-surface-container-lowest p-4 rounded-2xl border-2 border-surface-variant flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label htmlFor="sort-array-size-slider" className={sectionLabelClass}>
                Array Size
              </label>
              <span className="bg-primary-container text-on-primary-container font-bold px-3 py-1 rounded-xl text-sm">
                {arraySize}
              </span>
            </div>
            <input
              id="sort-array-size-slider"
              type="range"
              min={5}
              max={20}
              value={arraySize}
              onChange={(event) => onArraySizeChange(Number(event.target.value))}
              className="w-full h-3 bg-surface-variant rounded-full appearance-none cursor-pointer accent-primary border-2 border-surface-variant"
            />
          </div>

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
              onClick={() => {
                setCustomSeed(String(Date.now()));
                setIsCustomModalOpen(true);
              }}
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
        <SortCustomInputModal
          key={customSeed}
          initialValues=""
          onClose={() => setIsCustomModalOpen(false)}
          onApply={onApplyCustomDataset}
        />
      )}
    </>
  );
}

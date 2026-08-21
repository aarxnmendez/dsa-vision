import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MAX_CUSTOM_ARRAY_ELEMENTS,
  MIN_CUSTOM_ARRAY_ELEMENTS,
  parseCustomArrayInput,
  parseOptionalTarget,
  type CustomDatasetPayload,
} from "../../utils/customInput";
import { sectionLabelClass } from "../ui/sectionLabel";
import { buttonLabelClass } from "../ui/buttonLabel";
import {
  APPLY_DATA_LABEL,
  CUSTOM_DATA_INPUT_TITLE,
} from "../../constants/copy";
import { Icon } from "../ui/Icon";

interface CustomInputModalProps {
  initialValues: string;
  initialTarget?: string;
  showTargetInput?: boolean;
  preserveArrayOrder?: boolean;
  description?: string;
  arrayPlaceholder?: string;
  onClose: () => void;
  onApply: (payload: CustomDatasetPayload) => void;
}

export function CustomInputModal({
  initialValues,
  initialTarget = "",
  showTargetInput = false,
  preserveArrayOrder = false,
  description,
  arrayPlaceholder = "4, 10, 18, 23, 42, 55",
  onClose,
  onApply,
}: CustomInputModalProps) {
  const titleId = useId();
  const valuesInputRef = useRef<HTMLInputElement>(null);
  const [valuesInput, setValuesInput] = useState(initialValues);
  const [targetInput, setTargetInput] = useState(initialTarget);
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
      preserveOrder: preserveArrayOrder,
    });

    if ("error" in arrayResult) {
      setError(arrayResult.error);
      return;
    }

    if (showTargetInput) {
      const targetResult = parseOptionalTarget(targetInput);
      if ("error" in targetResult) {
        setError(targetResult.error);
        return;
      }

      onApply({
        array: arrayResult.array,
        target: targetResult.target,
      });
    } else {
      onApply({ array: arrayResult.array });
    }

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
            {description && (
              <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                {description}
              </p>
            )}
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
          <label htmlFor="custom-array-values" className={sectionLabelClass}>
            Array Values
          </label>
          <input
            id="custom-array-values"
            ref={valuesInputRef}
            type="text"
            value={valuesInput}
            onChange={(event) => {
              setValuesInput(event.target.value);
              setError(null);
            }}
            placeholder={arrayPlaceholder}
            className="w-full bg-surface text-on-surface border-2 border-surface-variant rounded-xl py-3 px-4 font-body-md focus:outline-none focus:border-primary focus:ring-0 transition-colors"
          />
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            Enter {MIN_CUSTOM_ARRAY_ELEMENTS} to {MAX_CUSTOM_ARRAY_ELEMENTS}{" "}
            numbers separated by commas.
          </p>
        </div>

        {showTargetInput && (
          <div className="flex flex-col gap-2">
            <label htmlFor="custom-target-value" className={sectionLabelClass}>
              Target Value (optional)
            </label>
            <input
              id="custom-target-value"
              type="text"
              inputMode="numeric"
              value={targetInput}
              onChange={(event) => {
                setTargetInput(event.target.value);
                setError(null);
              }}
              placeholder="e.g. 23"
              className="w-full bg-surface text-on-surface border-2 border-surface-variant rounded-xl py-3 px-4 font-body-md focus:outline-none focus:border-primary focus:ring-0 transition-colors no-spinner"
            />
          </div>
        )}

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

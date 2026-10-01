import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  generateInsertionSortSteps,
  generateUnsortedArray,
  type InsertionSortStep,
} from "../algorithms/insertionSort";
import type { SortBarHighlight } from "../types/visualizer";
import { usePlayerControls } from "./usePlayerControls";

const DEFAULT_SIZE = 10;

function buildBarHighlights(step: InsertionSortStep | undefined): SortBarHighlight[] {
  if (!step) {
    return [];
  }

  if (step.sortedBoundary >= step.array.length) {
    return step.array.map(() => "sorted");
  }

  return step.array.map((_, index) => {
    if (step.shiftIndices) {
      const [fromIndex, toIndex] = step.shiftIndices;
      if (index === fromIndex || index === toIndex) {
        return "swapping";
      }
    }

    if (step.comparingIdx !== null && index === step.comparingIdx) {
      return "comparing";
    }

    if (
      step.keyIndex !== null &&
      index === step.keyIndex &&
      (step.phase === "select-key" || step.phase === "compare")
    ) {
      return "active";
    }

    if (
      step.insertIndex !== null &&
      index === step.insertIndex &&
      step.phase === "insert"
    ) {
      return "active";
    }

    if (
      step.insertIndex !== null &&
      index === step.insertIndex &&
      (step.phase === "extract-key" || step.phase === "shift")
    ) {
      return "minimum";
    }

    if (index < step.sortedBoundary && step.array[index] !== null) {
      return "sorted";
    }

    return "default";
  });
}

function numericValuesForScale(
  cells: (number | null)[],
  reservedKey: number | null,
): number[] {
  const values = cells.filter((value): value is number => value !== null);
  if (reservedKey !== null) {
    values.push(reservedKey);
  }

  return values;
}

export function useInsertionSortVisualizer() {
  const { i18n } = useTranslation();
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [array, setArray] = useState(() => generateUnsortedArray(DEFAULT_SIZE));

  const steps = useMemo(
    () => generateInsertionSortSteps(array),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- locale drives getAlgorithmT()
    [array, i18n.language],
  );
  const player = usePlayerControls({
    totalSteps: steps.length,
  });
  const { onReset } = player;

  const currentStep =
    player.currentIndex >= 0 ? steps[player.currentIndex] : undefined;

  const cellValues = currentStep?.array ?? array.map((value) => value);

  const reservedKey = useMemo(() => {
    if (!currentStep) {
      return null;
    }

    if (
      currentStep.phase === "extract-key" ||
      currentStep.phase === "shift" ||
      (currentStep.phase === "compare" &&
        currentStep.keyIndex === null &&
        currentStep.holeIndex !== null)
    ) {
      return currentStep.keyValue;
    }

    return null;
  }, [currentStep]);

  const currentArray = useMemo(
    () => numericValuesForScale(cellValues, reservedKey),
    [cellValues, reservedKey],
  );

  const barHighlights = useMemo(
    () => buildBarHighlights(currentStep),
    [currentStep],
  );

  const randomizeData = useCallback(() => {
    setArray(generateUnsortedArray(arraySize));
    onReset();
  }, [arraySize, onReset]);

  const handleArraySizeChange = useCallback(
    (size: number) => {
      setArraySize(size);
      setArray(generateUnsortedArray(size));
      onReset();
    },
    [onReset],
  );

  const applyCustomDataset = useCallback(
    (nextArray: number[]) => {
      setArraySize(nextArray.length);
      setArray(nextArray);
      onReset();
    },
    [onReset],
  );

  return {
    array,
    arraySize,
    steps,
    currentStep,
    cellValues,
    currentArray,
    reservedKey,
    barHighlights,
    randomizeData,
    applyCustomDataset,
    setArraySize: handleArraySizeChange,
    ...player,
  };
}

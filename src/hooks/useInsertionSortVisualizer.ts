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
    if (
      step.shiftIndices &&
      (index === step.shiftIndices[0] || index === step.shiftIndices[1])
    ) {
      return "swapping";
    }

    if (step.comparingIdx !== null && index === step.comparingIdx) {
      return "comparing";
    }

    if (index === step.keyIdx) {
      return "active";
    }

    if (step.insertIndex !== null && index === step.insertIndex) {
      return "minimum";
    }

    if (index < step.sortedBoundary) {
      return "sorted";
    }

    return "default";
  });
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

  const currentArray = currentStep?.array ?? array;
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
    currentArray,
    barHighlights,
    randomizeData,
    applyCustomDataset,
    setArraySize: handleArraySizeChange,
    ...player,
  };
}

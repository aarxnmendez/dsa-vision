import { useCallback, useMemo, useState } from "react";
import {
  generateSelectionSortSteps,
  generateUnsortedArray,
  type SelectionSortStep,
} from "../algorithms/selectionSort";
import type { SortBarHighlight } from "../types/visualizer";
import { FAST_SPEED_MIN_MS } from "../constants/player";
import { usePlayerControls } from "./usePlayerControls";

const DEFAULT_SIZE = 10;

function buildBarHighlights(step: SelectionSortStep | undefined): SortBarHighlight[] {
  if (!step) {
    return [];
  }

  if (step.sortedBoundary >= step.array.length) {
    return step.array.map(() => "sorted");
  }

  return step.array.map((_, index) => {
    if (
      step.swapIndices &&
      (index === step.swapIndices[0] || index === step.swapIndices[1])
    ) {
      return "swapping";
    }

    if (step.comparingIdx !== null && index === step.comparingIdx) {
      return "comparing";
    }

    if (
      index === step.sortedBoundary &&
      step.sortedBoundary < step.array.length
    ) {
      return "active";
    }

    if (index === step.minIdx) {
      return "minimum";
    }

    if (index < step.sortedBoundary) {
      return "sorted";
    }

    return "default";
  });
}

export function useSelectionSortVisualizer() {
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [array, setArray] = useState(() => generateUnsortedArray(DEFAULT_SIZE));

  const steps = useMemo(() => generateSelectionSortSteps(array), [array]);
  const player = usePlayerControls({
    totalSteps: steps.length,
    minSpeedMs: FAST_SPEED_MIN_MS,
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

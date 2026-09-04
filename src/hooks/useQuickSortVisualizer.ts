import { useCallback, useMemo, useState } from "react";
import {
  generateQuickSortSteps,
  generateUnsortedArray,
  type PivotStrategy,
  type QuickSortStep,
} from "../algorithms/quickSort";
import type { SortBarHighlight } from "../types/visualizer";
import { usePlayerControls } from "./usePlayerControls";

const DEFAULT_SIZE = 10;

function buildBarHighlights(step: QuickSortStep | undefined): SortBarHighlight[] {
  if (!step) {
    return [];
  }

  if (step.isComplete) {
    return step.array.map(() => "sorted");
  }

  const sortedSet = new Set(step.sortedIndices);

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

    if (step.pivotIndex !== null && index === step.pivotIndex) {
      return "active";
    }

    if (step.leftIndex !== null && index === step.leftIndex) {
      return "minimum";
    }

    if (sortedSet.has(index)) {
      return "sorted";
    }

    return "default";
  });
}

export function useQuickSortVisualizer() {
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [array, setArray] = useState(() => generateUnsortedArray(DEFAULT_SIZE));
  const [pivotStrategy, setPivotStrategy] = useState<PivotStrategy>("random");

  const steps = useMemo(
    () => generateQuickSortSteps(array, pivotStrategy),
    [array, pivotStrategy],
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

  const handlePivotStrategyChange = useCallback(
    (strategy: PivotStrategy) => {
      setPivotStrategy(strategy);
      onReset();
    },
    [onReset],
  );

  return {
    array,
    arraySize,
    pivotStrategy,
    steps,
    currentStep,
    currentArray,
    barHighlights,
    randomizeData,
    applyCustomDataset,
    setArraySize: handleArraySizeChange,
    setPivotStrategy: handlePivotStrategyChange,
    ...player,
  };
}

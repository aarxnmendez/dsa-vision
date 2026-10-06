import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  generateQuickSortSteps,
  generateUnsortedArray,
  type PivotStrategy,
  type QuickSortStep,
} from "../algorithms/quickSort";
import { IDLE_STEP_INDEX, usePlayerControls } from "./usePlayerControls";

const DEFAULT_SIZE = 10;

export function useQuickSortVisualizer() {
  const { i18n } = useTranslation();
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [array, setArray] = useState(() => generateUnsortedArray(DEFAULT_SIZE));
  const [pivotStrategy, setPivotStrategy] = useState<PivotStrategy>("random");

  const steps = useMemo(
    () => generateQuickSortSteps(array, pivotStrategy),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- locale drives getAlgorithmT()
    [array, pivotStrategy, i18n.language],
  );

  const player = usePlayerControls({
    totalSteps: steps.length,
  });
  const { onReset: playerReset, setCurrentIndex, onPause } = player;

  useEffect(() => {
    if (steps.length === 0) {
      setCurrentIndex(IDLE_STEP_INDEX);
      return;
    }

    setCurrentIndex(0);
  }, [array, i18n.language, pivotStrategy, setCurrentIndex, steps]);

  const currentStep: QuickSortStep | undefined =
    player.currentIndex >= 0 ? steps[player.currentIndex] : steps[0];

  const randomizeData = useCallback(() => {
    setArray(generateUnsortedArray(arraySize));
  }, [arraySize]);

  const handleArraySizeChange = useCallback((size: number) => {
    setArraySize(size);
    setArray(generateUnsortedArray(size));
  }, []);

  const applyCustomDataset = useCallback((nextArray: number[]) => {
    setArraySize(nextArray.length);
    setArray(nextArray);
  }, []);

  const handlePivotStrategyChange = useCallback((strategy: PivotStrategy) => {
    setPivotStrategy(strategy);
  }, []);

  const onReset = useCallback(() => {
    onPause();
    playerReset();
    if (steps.length > 0) {
      setCurrentIndex(0);
    }
  }, [onPause, playerReset, setCurrentIndex, steps.length]);

  return {
    array,
    arraySize,
    pivotStrategy,
    steps,
    currentStep,
    randomizeData,
    applyCustomDataset,
    setArraySize: handleArraySizeChange,
    setPivotStrategy: handlePivotStrategyChange,
    ...player,
    onReset,
  };
}

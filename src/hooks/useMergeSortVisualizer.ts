import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  generateMergeSortSteps,
  generateUnsortedArray,
  MERGE_SORT_DEFAULT_SIZE,
  MERGE_SORT_MAX_SIZE,
  MERGE_SORT_MIN_SIZE,
  type MergeSortStep,
} from "../algorithms/mergeSort";
import { IDLE_STEP_INDEX, usePlayerControls } from "./usePlayerControls";

export function useMergeSortVisualizer() {
  const { i18n } = useTranslation();
  const [arraySize, setArraySize] = useState(MERGE_SORT_DEFAULT_SIZE);
  const [array, setArray] = useState(() =>
    generateUnsortedArray(MERGE_SORT_DEFAULT_SIZE),
  );

  const steps = useMemo(
    () => generateMergeSortSteps(array),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- locale drives getAlgorithmT()
    [array, i18n.language],
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
  }, [array, i18n.language, setCurrentIndex, steps]);

  const currentStep: MergeSortStep | undefined =
    player.currentIndex >= 0
      ? steps[player.currentIndex]
      : steps[0];

  const randomizeData = useCallback(() => {
    setArray(generateUnsortedArray(arraySize));
  }, [arraySize]);

  const handleArraySizeChange = useCallback(
    (size: number) => {
      const clamped = Math.min(
        MERGE_SORT_MAX_SIZE,
        Math.max(MERGE_SORT_MIN_SIZE, size),
      );
      setArraySize(clamped);
      setArray(generateUnsortedArray(clamped));
    },
    [],
  );

  const applyCustomDataset = useCallback(
    (nextArray: number[]) => {
      const clampedSize = Math.min(
        MERGE_SORT_MAX_SIZE,
        Math.max(MERGE_SORT_MIN_SIZE, nextArray.length),
      );
      setArraySize(clampedSize);
      setArray(nextArray.slice(0, clampedSize));
    },
    [],
  );

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
    minArraySize: MERGE_SORT_MIN_SIZE,
    maxArraySize: MERGE_SORT_MAX_SIZE,
    steps,
    currentStep,
    randomizeData,
    applyCustomDataset,
    setArraySize: handleArraySizeChange,
    ...player,
    onReset,
  };
}

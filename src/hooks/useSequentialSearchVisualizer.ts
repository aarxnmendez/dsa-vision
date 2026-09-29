import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  sequentialSearch,
  type SequentialSearchStep,
} from "../algorithms/sequentialSearch";
import type {
  ArrayCellState,
  ArrayPointer,
  CellHighlight,
} from "../types/visualizer";
import { generateRandomArray } from "../utils/randomArray";
import { usePlayerControls } from "./usePlayerControls";

const DEFAULT_SIZE = 8;
const MIN_SIZE = 5;
const MAX_SIZE = 20;

function createDataset(size: number) {
  const array = generateRandomArray(size);
  return {
    array,
    target: array[Math.floor(Math.random() * array.length)] ?? array[0] ?? 1,
  };
}

function buildCellStates(
  array: number[],
  step: SequentialSearchStep | undefined,
): ArrayCellState[] {
  if (!step) {
    return array.map((value) => ({
      value,
      highlight: "default" as CellHighlight,
    }));
  }

  if (step.phase === "intro") {
    return array.map((value) => ({
      value,
      highlight: "default" as CellHighlight,
    }));
  }

  if (step.phase === "not-found") {
    return array.map((value) => ({
      value,
      highlight: "default" as CellHighlight,
    }));
  }

  return array.map((value, index) => {
    let highlight: CellHighlight = "default";

    if (
      (step.phase === "found" || step.phase === "complete") &&
      step.index !== null &&
      index === step.index
    ) {
      highlight = "found";
    } else if (
      step.phase === "compare" &&
      step.index !== null &&
      index === step.index
    ) {
      highlight = "comparing";
    }

    return { value, highlight };
  });
}

function buildPointers(step: SequentialSearchStep | undefined): ArrayPointer[] {
  if (!step || step.index === null) {
    return [];
  }

  if (
    step.phase === "compare" ||
    step.phase === "found" ||
    step.phase === "complete"
  ) {
    return [{ id: "i", index: step.index }];
  }

  return [];
}

export function useSequentialSearchVisualizer() {
  const { i18n } = useTranslation();
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [dataset, setDataset] = useState(() => createDataset(DEFAULT_SIZE));
  const { array, target } = dataset;

  const steps = useMemo(
    () => sequentialSearch(array, target),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- locale drives getAlgorithmT()
    [array, target, i18n.language],
  );

  const player = usePlayerControls({ totalSteps: steps.length });
  const { onReset } = player;
  const currentStep =
    player.currentIndex >= 0 ? steps[player.currentIndex] : undefined;

  const cells = useMemo(
    () => buildCellStates(array, currentStep),
    [array, currentStep],
  );

  const pointers = useMemo(
    () => buildPointers(currentStep),
    [currentStep],
  );

  const randomizeData = useCallback(() => {
    setDataset(createDataset(arraySize));
    onReset();
  }, [arraySize, onReset]);

  const handleArraySizeChange = useCallback(
    (size: number) => {
      const clamped = Math.min(Math.max(size, MIN_SIZE), MAX_SIZE);
      setArraySize(clamped);
      setDataset(createDataset(clamped));
      onReset();
    },
    [onReset],
  );

  const handleTargetChange = useCallback(
    (value: number) => {
      setDataset((current) => ({ ...current, target: value }));
      onReset();
    },
    [onReset],
  );

  const applyCustomDataset = useCallback(
    (array: number[], customTarget?: number) => {
      const clampedLength = Math.min(
        Math.max(array.length, MIN_SIZE),
        MAX_SIZE,
      );
      const nextArray = array.slice(0, clampedLength);
      setArraySize(nextArray.length);
      setDataset({
        array: nextArray,
        target:
          customTarget ??
          nextArray[Math.floor(nextArray.length / 2)] ??
          nextArray[0] ??
          1,
      });
      onReset();
    },
    [onReset],
  );

  return {
    array,
    arraySize,
    target,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
    steps,
    currentStep,
    cells,
    pointers,
    randomizeData,
    applyCustomDataset,
    setArraySize: handleArraySizeChange,
    setTarget: handleTargetChange,
    ...player,
  };
}

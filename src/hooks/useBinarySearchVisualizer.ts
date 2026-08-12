import { useCallback, useMemo, useState } from "react";
import {
  binarySearch,
  generateSortedArray,
  type BinarySearchStep,
} from "../algorithms/binarySearch";
import type {
  ArrayCellState,
  ArrayPointer,
  CellHighlight,
} from "../types/visualizer";
import { usePlayerControls } from "./usePlayerControls";

const DEFAULT_SIZE = 10;

function createDataset(size: number) {
  const array = generateSortedArray(size);
  return {
    array,
    target: array[Math.floor(array.length / 2)] ?? 1,
  };
}

function buildCellStates(
  array: number[],
  step: BinarySearchStep | undefined,
): ArrayCellState[] {
  if (!step || step.phase === "not-found") {
    return array.map((value) => ({
      value,
      highlight: "default" as CellHighlight,
    }));
  }

  return array.map((value, index) => {
    let highlight: CellHighlight = "default";

    if (step.phase === "found" && step.mid !== null && index === step.mid) {
      highlight = "found";
    } else if (step.compareMid && step.mid !== null && index === step.mid) {
      highlight = "comparing";
    } else if (index < step.low || index > step.high) {
      highlight = "eliminated";
    }

    return { value, highlight };
  });
}

function buildPointers(step: BinarySearchStep | undefined): ArrayPointer[] {
  if (!step || step.phase === "not-found") return [];

  const pointers: ArrayPointer[] = [
    { id: "low", index: step.low },
    { id: "high", index: step.high },
  ];

  if (step.showMid && step.mid !== null) {
    pointers.push({ id: "mid", index: step.mid });
  }

  return pointers;
}

export function useBinarySearchVisualizer() {
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [dataset, setDataset] = useState(() => createDataset(DEFAULT_SIZE));
  const { array, target } = dataset;

  const steps = useMemo(
    () => binarySearch(array, target),
    [array, target],
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
      setArraySize(size);
      setDataset(createDataset(size));
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
      setArraySize(array.length);
      setDataset({
        array,
        target:
          customTarget ?? array[Math.floor(array.length / 2)] ?? array[0] ?? 1,
      });
      onReset();
    },
    [onReset],
  );

  return {
    array,
    arraySize,
    target,
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

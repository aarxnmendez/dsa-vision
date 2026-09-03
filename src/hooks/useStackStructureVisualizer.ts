import { useCallback, useEffect, useMemo, useState } from "react";
import {
  generateStackOperationSteps,
  operationNeedsValueInput,
} from "../algorithms/stackOperations";
import type { StackOperationId } from "../types/stackStructure";
import { STACK_MAX_CAPACITY } from "../types/stackStructure";
import {
  createDefaultStackDataset,
  createRandomStackDataset,
} from "../utils/randomStack";
import { usePlayerControls } from "./usePlayerControls";

const DEFAULT_SIZE = 3;

export function useStackStructureVisualizer() {
  const [stackSize, setStackSize] = useState(DEFAULT_SIZE);
  const [dataset, setDataset] = useState(createDefaultStackDataset);
  const { values, pushValue } = dataset;
  const [operation, setOperation] = useState<StackOperationId>("push");

  const steps = useMemo(
    () =>
      generateStackOperationSteps(operation, values, { value: pushValue }),
    [operation, values, pushValue],
  );

  const player = usePlayerControls({ totalSteps: steps.length });
  const { onReset } = player;

  useEffect(() => {
    onReset();
  }, [steps, onReset]);

  const currentStep =
    player.currentIndex >= 0 ? steps[player.currentIndex] : undefined;

  const randomizeData = useCallback(() => {
    setDataset(createRandomStackDataset(stackSize));
    onReset();
  }, [stackSize, onReset]);

  const handleStackSizeChange = useCallback(
    (size: number) => {
      const clampedSize = Math.min(Math.max(size, 0), STACK_MAX_CAPACITY);
      setStackSize(clampedSize);
      setDataset(createRandomStackDataset(clampedSize));
      onReset();
    },
    [onReset],
  );

  const applyCustomDataset = useCallback(
    (nextValues: number[]) => {
      const clampedValues = nextValues.slice(0, STACK_MAX_CAPACITY);
      setStackSize(clampedValues.length);
      setDataset((current) => ({
        values: clampedValues,
        pushValue: current.pushValue,
      }));
      onReset();
    },
    [onReset],
  );

  const handleOperationChange = useCallback(
    (nextOperation: StackOperationId) => {
      setOperation(nextOperation);
      onReset();
    },
    [onReset],
  );

  const setPushValue = useCallback((value: number) => {
    setDataset((current) => ({ ...current, pushValue: value }));
  }, []);

  return {
    values,
    stackSize,
    operation,
    pushValue,
    maxCapacity: STACK_MAX_CAPACITY,
    needsValueInput: operationNeedsValueInput(operation),
    steps,
    currentStep,
    setOperation: handleOperationChange,
    setPushValue,
    randomizeData,
    applyCustomDataset,
    setStackSize: handleStackSizeChange,
    ...player,
  };
};

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  generateArrayOperationSteps,
  getDefaultOperationIndex,
  operationNeedsIndexInput,
  operationNeedsSearchTarget,
  operationNeedsValueInput,
} from "../algorithms/arrayOperations";
import type { ArrayOperationId } from "../types/arrayStructure";
import {
  createRandomArrayDataset,
  type RandomArrayDataset,
} from "../utils/randomArray";
import { usePlayerControls } from "./usePlayerControls";

const DEFAULT_SIZE = 8;

export function useArrayStructureVisualizer() {
  const { i18n } = useTranslation();
  const [arraySize, setArraySize] = useState(DEFAULT_SIZE);
  const [dataset, setDataset] = useState<RandomArrayDataset>(() =>
    createRandomArrayDataset(DEFAULT_SIZE),
  );
  const { array, searchTarget, operationValue } = dataset;
  const [operation, setOperation] = useState<ArrayOperationId>("access");
  const [operationIndex, setOperationIndex] = useState(0);

  const resolvedIndex = useMemo(() => {
    if (operation === "insert-start" || operation === "delete-start") return 0;
    if (operation === "insert-end") return array.length;
    if (operation === "delete-end") return Math.max(array.length - 1, 0);
    return Math.min(Math.max(operationIndex, 0), Math.max(array.length - 1, 0));
  }, [array.length, operation, operationIndex]);

  const steps = useMemo(
    () =>
      generateArrayOperationSteps(operation, array, {
        index: resolvedIndex,
        value: operationValue,
        searchTarget,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- locale drives getAlgorithmT()
    [array, operation, operationValue, resolvedIndex, searchTarget, i18n.language],
  );

  const player = usePlayerControls({ totalSteps: steps.length });
  const { onReset } = player;

  useEffect(() => {
    onReset();
  }, [steps, onReset]);

  const currentStep =
    player.currentIndex >= 0 ? steps[player.currentIndex] : undefined;

  const randomizeData = useCallback(() => {
    setDataset(createRandomArrayDataset(arraySize));
    setOperationIndex(getDefaultOperationIndex(operation, arraySize));
    onReset();
  }, [arraySize, onReset, operation]);

  const handleArraySizeChange = useCallback(
    (size: number) => {
      setArraySize(size);
      setDataset(createRandomArrayDataset(size));
      setOperationIndex(getDefaultOperationIndex(operation, size));
      onReset();
    },
    [onReset, operation],
  );

  const applyCustomDataset = useCallback(
    (nextArray: number[]) => {
      setArraySize(nextArray.length);
      setDataset((current) => ({
        array: nextArray,
        searchTarget: nextArray.includes(current.searchTarget)
          ? current.searchTarget
          : (nextArray[Math.floor(nextArray.length / 2)] ?? nextArray[0] ?? 1),
        operationValue: current.operationValue,
      }));
      setOperationIndex(getDefaultOperationIndex(operation, nextArray.length));
      onReset();
    },
    [onReset, operation],
  );

  const handleOperationChange = useCallback(
    (nextOperation: ArrayOperationId) => {
      setOperation(nextOperation);
      setOperationIndex(getDefaultOperationIndex(nextOperation, array.length));
      onReset();
    },
    [array.length, onReset],
  );

  const setOperationValue = useCallback((value: number) => {
    setDataset((current) => ({ ...current, operationValue: value }));
  }, []);

  const setSearchTarget = useCallback((target: number) => {
    setDataset((current) => ({ ...current, searchTarget: target }));
  }, []);

  return {
    array,
    arraySize,
    operation,
    operationIndex,
    operationValue,
    searchTarget,
    resolvedIndex,
    needsIndexInput: operationNeedsIndexInput(operation),
    needsValueInput: operationNeedsValueInput(operation),
    needsSearchTarget: operationNeedsSearchTarget(operation),
    steps,
    currentStep,
    setOperation: handleOperationChange,
    setOperationIndex,
    setOperationValue,
    setSearchTarget,
    randomizeData,
    applyCustomDataset,
    setArraySize: handleArraySizeChange,
    ...player,
  };
}

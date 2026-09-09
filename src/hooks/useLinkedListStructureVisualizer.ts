import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  generateLinkedListOperationSteps,
  getDefaultOperationIndex,
  operationNeedsIndexInput,
  operationNeedsSearchTarget,
  operationNeedsValueInput,
} from "../algorithms/linkedListOperations";
import type {
  LinkedListOperationId,
  LinkedListType,
} from "../types/linkedListStructure";
import {
  createRandomLinkedListDataset,
  type RandomLinkedListDataset,
} from "../utils/randomLinkedList";
import { usePlayerControls } from "./usePlayerControls";

const DEFAULT_SIZE = 5;

export function useLinkedListStructureVisualizer() {
  const { i18n } = useTranslation();
  const [listSize, setListSize] = useState(DEFAULT_SIZE);
  const [listType, setListType] = useState<LinkedListType>("singly");
  const [dataset, setDataset] = useState<RandomLinkedListDataset>(() =>
    createRandomLinkedListDataset(DEFAULT_SIZE),
  );
  const { values, operationValue, searchTarget, operationIndex } = dataset;
  const [operation, setOperation] =
    useState<LinkedListOperationId>("insert-at-head");

  const steps = useMemo(
    () =>
      generateLinkedListOperationSteps(listType, operation, values, {
        index: operationIndex,
        value: operationValue,
        searchTarget,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- locale drives getAlgorithmT()
    [
      listType,
      operation,
      values,
      operationIndex,
      operationValue,
      searchTarget,
      i18n.language,
    ],
  );

  const player = usePlayerControls({ totalSteps: steps.length });
  const { onReset } = player;

  useEffect(() => {
    onReset();
  }, [steps, onReset]);

  const currentStep =
    player.currentIndex >= 0 ? steps[player.currentIndex] : undefined;

  const randomizeData = useCallback(() => {
    setDataset(createRandomLinkedListDataset(listSize));
    onReset();
  }, [listSize, onReset]);

  const handleListSizeChange = useCallback(
    (size: number) => {
      setListSize(size);
      setDataset(createRandomLinkedListDataset(size));
      onReset();
    },
    [onReset],
  );

  const applyCustomDataset = useCallback(
    (nextValues: number[]) => {
      setListSize(nextValues.length);
      setDataset((current) => ({
        values: nextValues,
        operationValue: current.operationValue,
        searchTarget: nextValues.includes(current.searchTarget)
          ? current.searchTarget
          : (nextValues[Math.floor(nextValues.length / 2)] ?? nextValues[0] ?? 1),
        operationIndex: getDefaultOperationIndex(nextValues.length),
      }));
      onReset();
    },
    [onReset],
  );

  const handleListTypeChange = useCallback(
    (nextType: LinkedListType) => {
      setListType(nextType);
      onReset();
    },
    [onReset],
  );

  const handleOperationChange = useCallback(
    (nextOperation: LinkedListOperationId) => {
      setOperation(nextOperation);
      setDataset((current) => ({
        ...current,
        operationIndex: getDefaultOperationIndex(current.values.length),
      }));
      onReset();
    },
    [onReset],
  );

  const setOperationValue = useCallback((value: number) => {
    setDataset((current) => ({ ...current, operationValue: value }));
  }, []);

  const setSearchTarget = useCallback((target: number) => {
    setDataset((current) => ({ ...current, searchTarget: target }));
  }, []);

  const setOperationIndex = useCallback((index: number) => {
    setDataset((current) => ({ ...current, operationIndex: index }));
  }, []);

  return {
    values,
    listSize,
    listType,
    operation,
    operationIndex,
    operationValue,
    searchTarget,
    needsIndexInput: operationNeedsIndexInput(operation),
    needsValueInput: operationNeedsValueInput(operation),
    needsSearchTarget: operationNeedsSearchTarget(operation),
    steps,
    currentStep,
    setListType: handleListTypeChange,
    setOperation: handleOperationChange,
    setOperationIndex,
    setOperationValue,
    setSearchTarget,
    randomizeData,
    applyCustomDataset,
    setListSize: handleListSizeChange,
    ...player,
  };
}

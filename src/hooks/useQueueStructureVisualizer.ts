import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  generateQueueOperationSteps,
  queueOperationNeedsValueInput,
} from "../algorithms/queueOperations";
import type { QueueOperationId } from "../types/queueStructure";
import {
  INITIAL_QUEUE_SIZE,
  QUEUE_MAX_CAPACITY,
} from "../types/queueStructure";
import { createRandomQueueDataset } from "../utils/randomQueue";
import { usePlayerControls } from "./usePlayerControls";

export function useQueueStructureVisualizer() {
  const { i18n } = useTranslation();
  const [queueSize, setQueueSize] = useState(INITIAL_QUEUE_SIZE);
  const [dataset, setDataset] = useState(() =>
    createRandomQueueDataset(INITIAL_QUEUE_SIZE),
  );
  const { values, enqueueValue } = dataset;
  const [operation, setOperation] = useState<QueueOperationId>("enqueue");
  const steps = useMemo(
    () =>
      generateQueueOperationSteps(operation, values, { value: enqueueValue }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- locale drives getAlgorithmT()
    [operation, values, enqueueValue, i18n.language],
  );

  const player = usePlayerControls({ totalSteps: steps.length });
  const { onReset } = player;

  useEffect(() => {
    onReset();
  }, [steps, onReset]);

  const currentStep =
    player.currentIndex >= 0 ? steps[player.currentIndex] : undefined;

  const randomizeData = useCallback(() => {
    setDataset(createRandomQueueDataset(queueSize));
    onReset();
  }, [queueSize, onReset]);

  const handleQueueSizeChange = useCallback(
    (size: number) => {
      const clampedSize = Math.min(Math.max(size, 0), QUEUE_MAX_CAPACITY);
      setQueueSize(clampedSize);
      setDataset(createRandomQueueDataset(clampedSize));
      onReset();
    },
    [onReset],
  );

  const applyCustomDataset = useCallback(
    (nextValues: number[]) => {
      const clampedValues = nextValues.slice(0, QUEUE_MAX_CAPACITY);
      setQueueSize(clampedValues.length);
      setDataset((current) => ({
        values: clampedValues,
        enqueueValue: current.enqueueValue,
      }));
      onReset();
    },
    [onReset],
  );

  const handleOperationChange = useCallback(
    (nextOperation: QueueOperationId) => {
      setOperation(nextOperation);
      onReset();
    },
    [onReset],
  );

  const setEnqueueValue = useCallback((value: number) => {
    setDataset((current) => ({ ...current, enqueueValue: value }));
  }, []);

  return {
    values,
    queueSize,
    operation,
    enqueueValue,
    maxCapacity: QUEUE_MAX_CAPACITY,
    needsValueInput: queueOperationNeedsValueInput(operation),
    steps,
    currentStep,
    setOperation: handleOperationChange,
    setEnqueueValue,
    randomizeData,
    applyCustomDataset,
    setQueueSize: handleQueueSizeChange,
    ...player,
  };
}

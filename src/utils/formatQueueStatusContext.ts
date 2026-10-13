import type { TFunction } from "i18next";
import type { QueueOperationStep } from "../types/queueStructure";

export function formatQueueStatusContext(
  step: QueueOperationStep,
  t: TFunction<"structures">,
): string[] | undefined {
  switch (step.operation) {
    case "enqueue": {
      if (step.rearIndex === null) {
        return undefined;
      }
      return [t("queue.statusRearIndex", { index: step.rearIndex })];
    }
    case "dequeue": {
      if (step.phase === "intro") {
        if (step.frontIndex === null) {
          return undefined;
        }
        return [t("queue.statusFrontIndex", { index: step.frontIndex })];
      }
      if (step.phase === "advance_front") {
        if (step.frontIndex === null) {
          return undefined;
        }
        return [t("queue.statusFrontIndex", { index: step.frontIndex })];
      }
      if (step.phase === "complete" && step.returnedValue !== null) {
        return [
          t("queue.statusReturnedValue", { value: step.returnedValue }),
        ];
      }
      return undefined;
    }
    case "peek": {
      const lines: string[] = [];
      if (step.statusFrontValue !== null && step.statusFrontValue !== undefined) {
        lines.push(
          t("queue.statusFrontValue", { value: step.statusFrontValue }),
        );
      }
      if (step.frontIndex !== null) {
        lines.push(t("queue.statusFrontIndex", { index: step.frontIndex }));
      }
      return lines.length > 0 ? lines : undefined;
    }
    case "clear": {
      if (step.phase === "complete") {
        return [
          t("queue.statusCapacitySummary", {
            size: step.size,
            max: step.maxCapacity,
          }),
        ];
      }
      return undefined;
    }
    default:
      return undefined;
  }
}

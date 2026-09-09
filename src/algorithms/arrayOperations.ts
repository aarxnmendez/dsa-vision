import { getAlgorithmT } from "../i18n/index";
import type { ArrayPointer } from "../types/visualizer";
import type {
  ArrayOperationId,
  ArrayOperationParams,
  ArrayOperationStep,
  ArrayStructureCellState,
  ArrayStructureHighlight,
} from "../types/arrayStructure";

function createCells(
  values: Array<number | null>,
  capacity: number,
  highlightAt: (index: number) => ArrayStructureHighlight = () => "default",
): ArrayStructureCellState[] {
  const cells: ArrayStructureCellState[] = [];

  for (let index = 0; index < capacity; index += 1) {
    const value = values[index] ?? null;
    cells.push({
      value,
      highlight: value === null ? "vacant" : highlightAt(index),
    });
  }

  return cells;
}

function createStep(
  partial: Omit<ArrayOperationStep, "found"> & { found?: boolean },
): ArrayOperationStep {
  return { found: false, ...partial };
}

function pointerAt(id: ArrayPointer["id"], index: number): ArrayPointer[] {
  return [{ id, index }];
}

function resolveInsertIndex(
  operation: ArrayOperationId,
  arrayLength: number,
  index: number,
): number {
  if (operation === "insert-start") return 0;
  if (operation === "insert-end") return arrayLength;
  return Math.min(Math.max(index, 0), arrayLength);
}

function resolveDeleteIndex(
  operation: ArrayOperationId,
  arrayLength: number,
  index: number,
): number {
  if (operation === "delete-start") return 0;
  if (operation === "delete-end") return Math.max(arrayLength - 1, 0);
  return Math.min(Math.max(index, 0), Math.max(arrayLength - 1, 0));
}

function operationLabel(operation: ArrayOperationId): string {
  const t = getAlgorithmT();
  return t(`arrayOperations.operations.${operation}`);
}

export function generateAccessSteps(
  array: number[],
  index: number,
): ArrayOperationStep[] {
  const t = getAlgorithmT();

  if (array.length === 0) {
    return [
      createStep({
        phase: "not-found",
        cells: [],
        capacity: 0,
        operation: "access",
        activeIndex: null,
        shiftFromIndex: null,
        shiftToIndex: null,
        insertedValue: null,
        deletedValue: null,
        statusTitle: t("arrayOperations.access.empty.statusTitle"),
        statusDetail: t("arrayOperations.access.empty.statusDetail"),
        stepExplanation: t("arrayOperations.access.empty.stepExplanation"),
        codeLine: 1,
        pointers: [],
      }),
    ];
  }

  const safeIndex = Math.min(Math.max(index, 0), array.length - 1);

  return [
    createStep({
      phase: "intro",
      cells: createCells(array, array.length),
      capacity: array.length,
      operation: "access",
      activeIndex: safeIndex,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: null,
      deletedValue: null,
      statusTitle: t("arrayOperations.access.intro.statusTitle"),
      statusDetail: t("arrayOperations.access.intro.statusDetail", {
        index: safeIndex,
      }),
      stepExplanation: t("arrayOperations.access.intro.stepExplanation"),
      codeLine: 1,
      pointers: pointerAt("i", safeIndex),
    }),
    createStep({
      phase: "access",
      cells: createCells(array, array.length, (cellIndex) =>
        cellIndex === safeIndex ? "accessed" : "default",
      ),
      capacity: array.length,
      operation: "access",
      activeIndex: safeIndex,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: null,
      deletedValue: null,
      found: true,
      statusTitle: t("arrayOperations.access.read.statusTitle", {
        index: safeIndex,
        value: array[safeIndex],
      }),
      statusDetail: t("arrayOperations.access.read.statusDetail"),
      pointerMovement: t("arrayOperations.access.read.pointerMovement", {
        index: safeIndex,
      }),
      stepExplanation: t("arrayOperations.access.read.stepExplanation", {
        index: safeIndex,
      }),
      codeLine: 2,
      pointers: pointerAt("i", safeIndex),
    }),
    createStep({
      phase: "complete",
      cells: createCells(array, array.length, (cellIndex) =>
        cellIndex === safeIndex ? "found" : "default",
      ),
      capacity: array.length,
      operation: "access",
      activeIndex: safeIndex,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: null,
      deletedValue: null,
      found: true,
      statusTitle: t("arrayOperations.access.complete.statusTitle"),
      statusDetail: t("arrayOperations.access.complete.statusDetail", {
        value: array[safeIndex],
        index: safeIndex,
      }),
      stepExplanation: t("arrayOperations.access.complete.stepExplanation"),
      codeLine: 3,
      pointers: pointerAt("i", safeIndex),
    }),
  ];
}

export function generateLinearSearchSteps(
  array: number[],
  target: number,
): ArrayOperationStep[] {
  const t = getAlgorithmT();

  if (array.length === 0) {
    return [
      createStep({
        phase: "not-found",
        cells: [],
        capacity: 0,
        operation: "linear-search",
        activeIndex: null,
        shiftFromIndex: null,
        shiftToIndex: null,
        insertedValue: null,
        deletedValue: null,
        statusTitle: t("arrayOperations.linearSearch.empty.statusTitle", {
          target,
        }),
        statusDetail: t("arrayOperations.linearSearch.empty.statusDetail"),
        stepExplanation: t("arrayOperations.linearSearch.empty.stepExplanation"),
        codeLine: 8,
        pointers: [],
      }),
    ];
  }

  const steps: ArrayOperationStep[] = [
    createStep({
      phase: "intro",
      cells: createCells(array, array.length),
      capacity: array.length,
      operation: "linear-search",
      activeIndex: 0,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: null,
      deletedValue: null,
      statusTitle: t("arrayOperations.linearSearch.intro.statusTitle"),
      statusDetail: t("arrayOperations.linearSearch.intro.statusDetail", {
        target,
      }),
      stepExplanation: t("arrayOperations.linearSearch.intro.stepExplanation"),
      codeLine: 1,
      pointers: pointerAt("i", 0),
    }),
  ];

  for (let index = 0; index < array.length; index += 1) {
    const isMatch = array[index] === target;

    steps.push(
      createStep({
        phase: "compare",
        cells: createCells(array, array.length, (cellIndex) =>
          cellIndex === index ? "comparing" : "default",
        ),
        capacity: array.length,
        operation: "linear-search",
        activeIndex: index,
        shiftFromIndex: null,
        shiftToIndex: null,
        insertedValue: null,
        deletedValue: null,
        statusTitle: t("arrayOperations.linearSearch.compare.statusTitle", {
          index,
        }),
        statusDetail: t("arrayOperations.linearSearch.compare.statusDetail", {
          index,
          value: array[index],
          matchSuffix: isMatch
            ? t("arrayOperations.linearSearch.compare.matchSuffix")
            : "",
        }),
        pointerMovement: t("arrayOperations.linearSearch.compare.pointerMovement", {
          index,
        }),
        stepExplanation: isMatch
          ? t("arrayOperations.linearSearch.compare.stepExplanation.match", {
              index,
            })
          : t("arrayOperations.linearSearch.compare.stepExplanation.noMatch"),
        codeLine: isMatch ? 4 : 3,
        pointers: pointerAt("i", index),
      }),
    );

    if (isMatch) {
      steps.push(
        createStep({
          phase: "complete",
          cells: createCells(array, array.length, (cellIndex) =>
            cellIndex === index ? "found" : "default",
          ),
          capacity: array.length,
          operation: "linear-search",
          activeIndex: index,
          shiftFromIndex: null,
          shiftToIndex: null,
          insertedValue: null,
          deletedValue: null,
          found: true,
          statusTitle: t("arrayOperations.linearSearch.found.statusTitle", {
            index,
          }),
          statusDetail: t("arrayOperations.linearSearch.found.statusDetail", {
            target,
            index,
            comparisons: index + 1,
            comparisonSuffix:
              index === 0
                ? ""
                : t("arrayOperations.linearSearch.found.comparisonSuffix"),
          }),
          stepExplanation: t("arrayOperations.linearSearch.found.stepExplanation"),
          codeLine: 5,
          pointers: pointerAt("i", index),
        }),
      );
      return steps;
    }
  }

  steps.push(
    createStep({
      phase: "not-found",
      cells: createCells(array, array.length),
      capacity: array.length,
      operation: "linear-search",
      activeIndex: null,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: null,
      deletedValue: null,
      statusTitle: t("arrayOperations.linearSearch.notFound.statusTitle", {
        target,
      }),
      statusDetail: t("arrayOperations.linearSearch.notFound.statusDetail"),
      stepExplanation: t("arrayOperations.linearSearch.notFound.stepExplanation"),
      codeLine: 8,
      pointers: [],
    }),
  );

  return steps;
}

export function generateInsertSteps(
  operation: Extract<
    ArrayOperationId,
    "insert-start" | "insert-middle" | "insert-end"
  >,
  array: number[],
  params: Pick<ArrayOperationParams, "index" | "value">,
): ArrayOperationStep[] {
  const t = getAlgorithmT();
  const insertIndex = resolveInsertIndex(operation, array.length, params.index);
  const value = params.value;
  const steps: ArrayOperationStep[] = [
    createStep({
      phase: "intro",
      cells: createCells(array, array.length + 1),
      capacity: array.length + 1,
      operation,
      activeIndex: insertIndex,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: value,
      deletedValue: null,
      statusTitle: operationLabel(operation),
      statusDetail: t("arrayOperations.insert.intro.statusDetail", {
        value,
        index: insertIndex,
      }),
      stepExplanation:
        insertIndex === array.length
          ? t("arrayOperations.insert.intro.stepExplanation.end")
          : t("arrayOperations.insert.intro.stepExplanation.middle", {
              index: insertIndex,
            }),
      codeLine: insertIndex === array.length ? 14 : 8,
      pointers: pointerAt("i", insertIndex),
    }),
  ];

  if (insertIndex === array.length) {
    const result = [...array, value];
    steps.push(
      createStep({
        phase: "write",
        cells: createCells(result, result.length, (cellIndex) =>
          cellIndex === insertIndex ? "inserted" : "default",
        ),
        capacity: result.length,
        operation,
        activeIndex: insertIndex,
        shiftFromIndex: null,
        shiftToIndex: null,
        insertedValue: value,
        deletedValue: null,
        found: true,
        statusTitle: t("arrayOperations.insert.writeEnd.statusTitle", {
          value,
          index: insertIndex,
        }),
        statusDetail: t("arrayOperations.insert.writeEnd.statusDetail"),
        stepExplanation: t("arrayOperations.insert.writeEnd.stepExplanation"),
        codeLine: 15,
        pointers: pointerAt("i", insertIndex),
      }),
      createStep({
        phase: "complete",
        cells: createCells(result, result.length, (cellIndex) =>
          cellIndex === insertIndex ? "found" : "default",
        ),
        capacity: result.length,
        operation,
        activeIndex: insertIndex,
        shiftFromIndex: null,
        shiftToIndex: null,
        insertedValue: value,
        deletedValue: null,
        found: true,
        statusTitle: t("arrayOperations.insert.completeEnd.statusTitle"),
        statusDetail: t("arrayOperations.insert.completeEnd.statusDetail", {
          length: result.length,
        }),
        stepExplanation: t("arrayOperations.insert.completeEnd.stepExplanation"),
        codeLine: 16,
        pointers: pointerAt("i", insertIndex),
      }),
    );
    return steps;
  }

  let working = [...array];

  for (let sourceIndex = array.length - 1; sourceIndex >= insertIndex; sourceIndex -= 1) {
    const targetIndex = sourceIndex + 1;
    const preview = [...working];
    preview[targetIndex] = preview[sourceIndex];

    steps.push(
      createStep({
        phase: "shift",
        cells: createCells(preview, array.length + 1, (cellIndex) => {
          if (cellIndex === sourceIndex) return "shift-source";
          if (cellIndex === targetIndex) return "shift-target";
          return "default";
        }),
        capacity: array.length + 1,
        operation,
        activeIndex: insertIndex,
        shiftFromIndex: sourceIndex,
        shiftToIndex: targetIndex,
        insertedValue: value,
        deletedValue: null,
        statusTitle: t("arrayOperations.insert.shift.statusTitle"),
        statusDetail: t("arrayOperations.insert.shift.statusDetail", {
          sourceIndex,
          value: working[sourceIndex],
          targetIndex,
        }),
        pointerMovement: t("arrayOperations.insert.shift.pointerMovement", {
          sourceIndex,
        }),
        stepExplanation: t("arrayOperations.insert.shift.stepExplanation"),
        codeLine: 10,
        pointers: pointerAt("j", sourceIndex),
      }),
    );

    working = preview;
  }

  working[insertIndex] = value;
  steps.push(
    createStep({
      phase: "write",
      cells: createCells(working, working.length, (cellIndex) =>
        cellIndex === insertIndex ? "inserted" : "default",
      ),
      capacity: working.length,
      operation,
      activeIndex: insertIndex,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: value,
      deletedValue: null,
      found: true,
      statusTitle: t("arrayOperations.insert.write.statusTitle", {
        value,
        index: insertIndex,
      }),
      statusDetail: t("arrayOperations.insert.write.statusDetail"),
      stepExplanation: t("arrayOperations.insert.write.stepExplanation"),
      codeLine: 12,
      pointers: pointerAt("i", insertIndex),
    }),
    createStep({
      phase: "complete",
      cells: createCells(working, working.length, (cellIndex) =>
        cellIndex === insertIndex ? "found" : "default",
      ),
      capacity: working.length,
      operation,
      activeIndex: insertIndex,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: value,
      deletedValue: null,
      found: true,
      statusTitle: t("arrayOperations.insert.complete.statusTitle"),
      statusDetail: t("arrayOperations.insert.complete.statusDetail", {
        length: working.length,
      }),
      stepExplanation: t("arrayOperations.insert.complete.stepExplanation"),
      codeLine: 13,
      pointers: pointerAt("i", insertIndex),
    }),
  );

  return steps;
}

export function generateDeleteSteps(
  operation: Extract<
    ArrayOperationId,
    "delete-start" | "delete-middle" | "delete-end"
  >,
  array: number[],
  params: Pick<ArrayOperationParams, "index">,
): ArrayOperationStep[] {
  const t = getAlgorithmT();

  if (array.length === 0) {
    return [
      createStep({
        phase: "not-found",
        cells: [],
        capacity: 0,
        operation,
        activeIndex: null,
        shiftFromIndex: null,
        shiftToIndex: null,
        insertedValue: null,
        deletedValue: null,
        statusTitle: t("arrayOperations.delete.empty.statusTitle"),
        statusDetail: t("arrayOperations.delete.empty.statusDetail"),
        stepExplanation: t("arrayOperations.delete.empty.stepExplanation"),
        codeLine: 1,
        pointers: [],
      }),
    ];
  }

  const deleteIndex = resolveDeleteIndex(operation, array.length, params.index);
  const deletedValue = array[deleteIndex];
  const steps: ArrayOperationStep[] = [
    createStep({
      phase: "intro",
      cells: createCells(array, array.length, (cellIndex) =>
        cellIndex === deleteIndex ? "deleted" : "default",
      ),
      capacity: array.length,
      operation,
      activeIndex: deleteIndex,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: null,
      deletedValue: deletedValue,
      statusTitle: operationLabel(operation),
      statusDetail: t("arrayOperations.delete.intro.statusDetail", {
        value: deletedValue,
        index: deleteIndex,
      }),
      stepExplanation:
        deleteIndex === array.length - 1
          ? t("arrayOperations.delete.intro.stepExplanation.end")
          : t("arrayOperations.delete.intro.stepExplanation.middle"),
      codeLine: deleteIndex === array.length - 1 ? 20 : 16,
      pointers: pointerAt("i", deleteIndex),
    }),
  ];

  if (deleteIndex === array.length - 1) {
    const result = array.slice(0, -1);
    steps.push(
      createStep({
        phase: "complete",
        cells: createCells(result, result.length),
        capacity: result.length,
        operation,
        activeIndex: null,
        shiftFromIndex: null,
        shiftToIndex: null,
        insertedValue: null,
        deletedValue: deletedValue,
        found: true,
        statusTitle: t("arrayOperations.delete.completeEnd.statusTitle"),
        statusDetail: t("arrayOperations.delete.completeEnd.statusDetail", {
          length: result.length,
        }),
        stepExplanation: t("arrayOperations.delete.completeEnd.stepExplanation"),
        codeLine: 21,
        pointers: [],
      }),
    );
    return steps;
  }

  const working = [...array];

  for (
    let sourceIndex = deleteIndex + 1;
    sourceIndex < array.length;
    sourceIndex += 1
  ) {
    const targetIndex = sourceIndex - 1;
    const preview = [...working];
    preview[targetIndex] = preview[sourceIndex];

    steps.push(
      createStep({
        phase: "shift",
        cells: createCells(preview, array.length, (cellIndex) => {
          if (cellIndex === sourceIndex) return "shift-source";
          if (cellIndex === targetIndex) return "shift-target";
          if (cellIndex === deleteIndex) return "vacant";
          return "default";
        }),
        capacity: array.length,
        operation,
        activeIndex: deleteIndex,
        shiftFromIndex: sourceIndex,
        shiftToIndex: targetIndex,
        insertedValue: null,
        deletedValue: deletedValue,
        statusTitle: t("arrayOperations.delete.shift.statusTitle"),
        statusDetail: t("arrayOperations.delete.shift.statusDetail", {
          sourceIndex,
          value: working[sourceIndex],
          targetIndex,
        }),
        pointerMovement: t("arrayOperations.delete.shift.pointerMovement", {
          sourceIndex,
        }),
        stepExplanation: t("arrayOperations.delete.shift.stepExplanation"),
        codeLine: 18,
        pointers: pointerAt("j", sourceIndex),
      }),
    );

    working[targetIndex] = working[sourceIndex];
  }

  const result = working.slice(0, -1);
  steps.push(
    createStep({
      phase: "complete",
      cells: createCells(result, result.length),
      capacity: result.length,
      operation,
      activeIndex: null,
      shiftFromIndex: null,
      shiftToIndex: null,
      insertedValue: null,
      deletedValue: deletedValue,
      found: true,
      statusTitle: t("arrayOperations.delete.complete.statusTitle"),
      statusDetail: t("arrayOperations.delete.complete.statusDetail", {
        value: deletedValue,
        length: result.length,
      }),
      stepExplanation: t("arrayOperations.delete.complete.stepExplanation"),
      codeLine: 19,
      pointers: [],
    }),
  );

  return steps;
}

export function generateArrayOperationSteps(
  operation: ArrayOperationId,
  array: number[],
  params: ArrayOperationParams,
): ArrayOperationStep[] {
  switch (operation) {
    case "access":
      return generateAccessSteps(array, params.index);
    case "linear-search":
      return generateLinearSearchSteps(array, params.searchTarget);
    case "insert-start":
    case "insert-middle":
    case "insert-end":
      return generateInsertSteps(operation, array, params);
    case "delete-start":
    case "delete-middle":
    case "delete-end":
      return generateDeleteSteps(operation, array, params);
    default:
      return [];
  }
}

export function getDefaultOperationIndex(
  operation: ArrayOperationId,
  arrayLength: number,
): number {
  if (operation === "insert-start" || operation === "delete-start") return 0;
  if (operation === "insert-end" || operation === "delete-end") {
    return Math.max(arrayLength - 1, 0);
  }
  return Math.floor(arrayLength / 2);
}

export function operationNeedsIndexInput(operation: ArrayOperationId): boolean {
  return operation === "access" || operation === "insert-middle" || operation === "delete-middle";
}

export function operationNeedsValueInput(operation: ArrayOperationId): boolean {
  return operation.startsWith("insert-");
}

export function operationNeedsSearchTarget(operation: ArrayOperationId): boolean {
  return operation === "linear-search";
}

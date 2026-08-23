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
  const labels: Record<ArrayOperationId, string> = {
    access: "Index Access",
    "linear-search": "Linear Search",
    "insert-start": "Insert at Start",
    "insert-middle": "Insert at Middle",
    "insert-end": "Insert at End",
    "delete-start": "Delete at Start",
    "delete-middle": "Delete at Middle",
    "delete-end": "Delete at End",
  };
  return labels[operation];
}

export function generateAccessSteps(
  array: number[],
  index: number,
): ArrayOperationStep[] {
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
        statusTitle: "Empty array",
        statusDetail: "There are no elements to access.",
        stepExplanation: "Index access requires at least one stored element.",
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
      statusTitle: "Direct index access",
      statusDetail: `Requesting element at index ${safeIndex}.`,
      stepExplanation:
        "Arrays store elements in contiguous memory. The CPU jumps directly to base + index.",
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
      statusTitle: `arr[${safeIndex}] = ${array[safeIndex]}`,
      statusDetail: "O(1) time — no scanning or shifting required.",
      pointerMovement: `Memory address = base + ${safeIndex}`,
      stepExplanation: `Reading arr[${safeIndex}] takes constant time because the offset is computed in one step.`,
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
      statusTitle: "Access complete",
      statusDetail: `Value ${array[safeIndex]} retrieved from index ${safeIndex}.`,
      stepExplanation: "Index access is the main reason arrays are fast for lookups by position.",
      codeLine: 3,
      pointers: pointerAt("i", safeIndex),
    }),
  ];
}

export function generateLinearSearchSteps(
  array: number[],
  target: number,
): ArrayOperationStep[] {
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
        statusTitle: `Target ${target} not found`,
        statusDetail: "The array is empty.",
        stepExplanation: "Linear search checks each index until a match appears or the array ends.",
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
      statusTitle: "Linear search begins",
      statusDetail: `Looking for target value ${target}.`,
      stepExplanation:
        "Unlike index access, search must inspect elements one by one from left to right.",
      codeLine: 1,
      pointers: pointerAt("i", 0),
    }),
  ];

  for (let index = 0; index < array.length; index += 1) {
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
        statusTitle: `Compare arr[${index}] with target`,
        statusDetail: `arr[${index}] = ${array[index]}${array[index] === target ? " — match!" : ""}`,
        pointerMovement: `i = ${index}`,
        stepExplanation:
          array[index] === target
            ? `Match found at index ${index}.`
            : `No match yet. Advance i to the next index.`,
        codeLine: array[index] === target ? 4 : 3,
        pointers: pointerAt("i", index),
      }),
    );

    if (array[index] === target) {
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
          statusTitle: `Target found at index ${index}`,
          statusDetail: "Worst case still scans the entire array: O(n).",
          stepExplanation:
            "Linear search is simple but scales linearly because every element may need to be checked.",
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
      statusTitle: `Target ${target} not found`,
      statusDetail: "Every index was inspected.",
      stepExplanation: "When the target is absent, linear search always visits all n elements.",
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
      statusDetail: `Insert ${value} at index ${insertIndex}.`,
      stepExplanation:
        insertIndex === array.length
          ? "Appending at the end avoids shifting existing elements."
          : `Elements from index ${insertIndex} onward must shift one slot to the right.`,
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
        statusTitle: `Inserted ${value} at index ${insertIndex}`,
        statusDetail: "O(1) when the array has spare capacity at the end.",
        stepExplanation: "The new value is written directly into the next contiguous slot.",
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
        statusTitle: "Insert complete",
        statusDetail: `Array length is now ${result.length}.`,
        stepExplanation: "End insertion is fast because no elements need to move.",
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
        statusTitle: "Shift element right",
        statusDetail: `Move arr[${sourceIndex}] (${working[sourceIndex]}) to index ${targetIndex}.`,
        pointerMovement: `j = ${sourceIndex}`,
        stepExplanation:
          "Each shift copies one value one slot to the right to free space at the insert position.",
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
      statusTitle: `Write ${value} at index ${insertIndex}`,
      statusDetail: "The vacant slot is now filled.",
      stepExplanation: "After shifting, the new value is placed at the target index.",
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
      statusTitle: "Insert complete",
      statusDetail: `Array length is now ${working.length}.`,
      stepExplanation:
        "Inserting away from the end costs O(n) because up to n elements must shift.",
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
        statusTitle: "Nothing to delete",
        statusDetail: "The array is already empty.",
        stepExplanation: "Deletion requires at least one element.",
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
      statusDetail: `Remove value ${deletedValue} at index ${deleteIndex}.`,
      stepExplanation:
        deleteIndex === array.length - 1
          ? "Deleting the last element avoids shifting."
          : "Elements to the right must shift one slot left to close the gap.",
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
        statusTitle: "Delete complete",
        statusDetail: `Array length is now ${result.length}.`,
        stepExplanation: "Removing the tail element is O(1) because no shifting is required.",
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
        statusTitle: "Shift element left",
        statusDetail: `Move arr[${sourceIndex}] (${working[sourceIndex]}) to index ${targetIndex}.`,
        pointerMovement: `j = ${sourceIndex}`,
        stepExplanation:
          "Each left shift closes the gap by copying the next element one slot to the left.",
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
      statusTitle: "Delete complete",
      statusDetail: `Removed ${deletedValue}. Length is now ${result.length}.`,
      stepExplanation:
        "Deleting away from the end costs O(n) because remaining elements must shift left.",
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

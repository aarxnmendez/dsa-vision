import type {
  StackItemHighlight,
  StackItemState,
  StackOperationId,
  StackOperationParams,
  StackOperationStep,
  StackPhase,
} from "../types/stackStructure";
import { STACK_MAX_CAPACITY } from "../types/stackStructure";

interface InternalItem {
  id: string;
  value: number;
}

interface InternalStack {
  items: InternalItem[];
  maxCapacity: number;
}

interface StepBuildOptions {
  phase: StackPhase;
  operation: StackOperationId;
  statusTitle: string;
  statusDetail: string;
  stepMessage: string;
  stepExplanation: string;
  codeLine: number;
  found?: boolean;
  isError?: boolean;
  returnedValue?: number | null;
  itemHighlights?: Record<string, StackItemHighlight>;
}

let itemCounter = 0;

function resetItemCounter(): void {
  itemCounter = 0;
}

function createItemId(): string {
  const id = `s${itemCounter}`;
  itemCounter += 1;
  return id;
}

function buildStackFromValues(
  values: number[],
  maxCapacity: number = STACK_MAX_CAPACITY,
): InternalStack {
  resetItemCounter();
  const items = values.slice(0, maxCapacity).map((value) => ({
    id: createItemId(),
    value,
  }));
  return { items, maxCapacity };
}

function cloneStack(stack: InternalStack): InternalStack {
  return {
    maxCapacity: stack.maxCapacity,
    items: stack.items.map((item) => ({ ...item })),
  };
}

function buildItems(
  stack: InternalStack,
  highlights: Record<string, StackItemHighlight> = {},
): StackItemState[] {
  const topIndex = stack.items.length > 0 ? stack.items.length - 1 : -1;

  return stack.items.map((item, index) => ({
    id: item.id,
    value: item.value,
    highlightState: highlights[item.id] ?? "default",
    isTop: index === topIndex,
  }));
}

function createStep(
  stack: InternalStack,
  options: StepBuildOptions,
): StackOperationStep {
  const topIndex = stack.items.length > 0 ? stack.items.length - 1 : null;

  return {
    phase: options.phase,
    operation: options.operation,
    items: buildItems(stack, options.itemHighlights),
    maxCapacity: stack.maxCapacity,
    size: stack.items.length,
    topIndex,
    returnedValue: options.returnedValue ?? null,
    statusTitle: options.statusTitle,
    statusDetail: options.statusDetail,
    stepMessage: options.stepMessage,
    stepExplanation: options.stepExplanation,
    codeLine: options.codeLine,
    found: options.found ?? false,
    isError: options.isError ?? false,
  };
}

function introStep(
  stack: InternalStack,
  operation: StackOperationId,
  title: string,
  detail: string,
  codeLine: number,
  stepExplanation: string,
): StackOperationStep {
  return createStep(stack, {
    phase: "intro",
    operation,
    statusTitle: title,
    statusDetail: detail,
    stepMessage: detail,
    stepExplanation,
    codeLine,
  });
}

function operationLabel(operation: StackOperationId): string {
  const labels: Record<StackOperationId, string> = {
    push: "Push",
    pop: "Pop",
    peek: "Peek",
    clear: "Clear",
  };
  return labels[operation];
}

export function generatePushSteps(
  values: number[],
  value: number,
  maxCapacity: number = STACK_MAX_CAPACITY,
): StackOperationStep[] {
  const stack = buildStackFromValues(values, maxCapacity);
  const steps: StackOperationStep[] = [
    introStep(
      stack,
      "push",
      `Push ${value} onto the stack`,
      "Place the new element on top of the current stack.",
      3,
      `Preparing to push value ${value}. Stacks always insert new elements at the top.`,
    ),
  ];

  if (stack.items.length >= stack.maxCapacity) {
    steps.push(
      createStep(stack, {
        phase: "overflow",
        operation: "push",
        statusTitle: "Stack overflow!",
        statusDetail: `Stack overflow! Maximum capacity of ${stack.maxCapacity} elements reached. Push operation rejected.`,
        stepMessage: `Stack overflow! Maximum capacity of ${stack.maxCapacity} elements reached. Push operation rejected.`,
        stepExplanation: `Push rejected in O(1): the bounded stack already holds ${stack.maxCapacity} elements at maximum capacity. No slot remains above TOP for a new write.`,
        codeLine: 4,
        isError: true,
        itemHighlights: Object.fromEntries(
          stack.items.map((item, index) => [
            item.id,
            index === stack.items.length - 1 ? "peeking" : "default",
          ]),
        ),
      }),
    );
    return steps;
  }

  const working = cloneStack(stack);
  const newId = createItemId();
  working.items.push({ id: newId, value });

  const topIndex = working.items.length - 1;

  steps.push(
    createStep(working, {
      phase: "push",
      operation: "push",
      statusTitle: "Incoming element",
      statusDetail: `Place ${value} on TOP.`,
      stepMessage: `Incoming value ${value} placed at TOP.`,
      stepExplanation: `Value ${value} pushed to index ${topIndex}. The top pointer advances to track the new uppermost element.`,
      codeLine: 4,
      itemHighlights: { [newId]: "pushing" },
    }),
  );

  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "push",
      statusTitle: "Push complete",
      statusDetail: `Push complete: Element '${value}' added to TOP. Stack updated in O(1) time (TOP index: ${topIndex}).`,
      stepMessage: `Push complete: Element '${value}' added to TOP. Stack updated in O(1) time (TOP index: ${topIndex}).`,
      stepExplanation:
        "Push complete. Accessing or removing this element next maintains the LIFO order.",
      codeLine: 4,
      itemHighlights: { [newId]: "found" },
      found: true,
    }),
  );

  return steps;
}

export function generatePopSteps(
  values: number[],
  maxCapacity: number = STACK_MAX_CAPACITY,
): StackOperationStep[] {
  const stack = buildStackFromValues(values, maxCapacity);
  const topIndexBefore = stack.items.length > 0 ? stack.items.length - 1 : null;
  const steps: StackOperationStep[] = [
    introStep(
      stack,
      "pop",
      "Pop the top element",
      "Remove and return the most recently pushed value.",
      6,
      topIndexBefore !== null
        ? `Preparing to pop from the stack. The operation targets index ${topIndexBefore} (the current top).`
        : "Preparing to pop from the stack. The operation targets the current top index.",
    ),
  ];

  if (stack.items.length === 0) {
    steps.push(
      createStep(stack, {
        phase: "underflow",
        operation: "pop",
        statusTitle: "Stack underflow!",
        statusDetail:
          "Stack underflow! Cannot execute pop or peek on an empty stack.",
        stepMessage:
          "Stack underflow! Cannot execute pop or peek on an empty stack.",
        stepExplanation:
          "Pop rejected in O(1): the stack is empty — there is no top index to remove.",
        codeLine: 7,
        isError: true,
      }),
    );
    return steps;
  }

  const working = cloneStack(stack);
  const topIndex = working.items.length - 1;
  const topItem = working.items[topIndex]!;
  const newTopIndex = topIndex > 0 ? topIndex - 1 : null;

  steps.push(
    createStep(working, {
      phase: "pop",
      operation: "pop",
      statusTitle: "Lift TOP element",
      statusDetail: `TOP = ${topItem.value}`,
      stepMessage: `Highlight ${topItem.value} before removal.`,
      stepExplanation:
        newTopIndex !== null
          ? `Targeting TOP element ${topItem.value} at index ${topIndex} before executing stack.pop(). After removal, the top pointer will move to index ${newTopIndex}.`
          : `Targeting TOP element ${topItem.value} at index ${topIndex} before executing stack.pop(). After removal, the stack becomes empty.`,
      codeLine: 7,
      itemHighlights: { [topItem.id]: "popping" },
    }),
  );

  working.items.pop();

  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "pop",
      statusTitle: "Pop complete",
      statusDetail: `Pop complete: Element '${topItem.value}' removed from TOP in O(1) time.`,
      stepMessage: `Pop complete: Element '${topItem.value}' removed from TOP in O(1) time.`,
      stepExplanation:
        newTopIndex !== null
          ? `Element ${topItem.value} removed from top. The top pointer moves down to index ${newTopIndex}. Pop completes in O(1) without shifting remaining elements.`
          : `Element ${topItem.value} removed from top. The stack is now empty. Pop completes in O(1) without shifting remaining elements.`,
      codeLine: 7,
      returnedValue: topItem.value,
      found: true,
    }),
  );

  return steps;
}

export function generatePeekSteps(
  values: number[],
  maxCapacity: number = STACK_MAX_CAPACITY,
): StackOperationStep[] {
  const stack = buildStackFromValues(values, maxCapacity);
  const steps: StackOperationStep[] = [
    introStep(
      stack,
      "peek",
      "Peek at TOP",
      "Inspect the top element without removing it.",
      9,
      stack.items.length > 0
        ? `Reading top element at index ${stack.items.length - 1} (value: ${stack.items[stack.items.length - 1]!.value}). Peek inspects top without mutating the stack.`
        : "Preparing to peek at the top element without mutating the stack.",
    ),
  ];

  if (stack.items.length === 0) {
    steps.push(
      createStep(stack, {
        phase: "underflow",
        operation: "peek",
        statusTitle: "Stack underflow!",
        statusDetail:
          "Stack underflow! Cannot execute pop or peek on an empty stack.",
        stepMessage:
          "Stack underflow! Cannot execute pop or peek on an empty stack.",
        stepExplanation:
          "Peek rejected in O(1): the stack is empty — there is no top index to read.",
        codeLine: 10,
        isError: true,
      }),
    );
    return steps;
  }

  const topItem = stack.items[stack.items.length - 1]!;
  const topIndex = stack.items.length - 1;

  steps.push(
    createStep(stack, {
      phase: "peek",
      operation: "peek",
      statusTitle: "Read TOP",
      statusDetail: `TOP = ${topItem.value}`,
      stepMessage: `Observe ${topItem.value} — stack size unchanged.`,
      stepExplanation: `Reading top element at index ${topIndex} (value: ${topItem.value}). Peek inspects top without mutating the stack.`,
      codeLine: 10,
      itemHighlights: { [topItem.id]: "peeking" },
    }),
  );

  steps.push(
    createStep(stack, {
      phase: "complete",
      operation: "peek",
      statusTitle: "Peek complete",
      statusDetail: `Value ${topItem.value} at TOP. Size still ${stack.items.length}.`,
      stepMessage: "No elements were removed.",
      stepExplanation:
        "Peek complete. Stack size and LIFO order are unchanged — only the top value was inspected.",
      codeLine: 10,
      returnedValue: topItem.value,
      itemHighlights: { [topItem.id]: "found" },
      found: true,
    }),
  );

  return steps;
}

export function generateClearSteps(
  values: number[],
  maxCapacity: number = STACK_MAX_CAPACITY,
): StackOperationStep[] {
  const stack = buildStackFromValues(values, maxCapacity);
  const elementCount = stack.items.length;
  const steps: StackOperationStep[] = [
    introStep(
      stack,
      "clear",
      "Clear the stack",
      "Remove every element until the structure is empty.",
      12,
      elementCount > 0
        ? `Preparing to clear the stack. ${elementCount} stored element(s) will be dropped from TOP down to the base.`
        : "Preparing to clear the stack. No elements are currently stored.",
    ),
  ];

  if (stack.items.length === 0) {
    steps.push(
      createStep(stack, {
        phase: "complete",
        operation: "clear",
        statusTitle: "Already empty",
        statusDetail: "Nothing to remove.",
        stepMessage: "Clear on an empty stack is a no-op.",
        stepExplanation:
          "Clear on an empty stack completes in O(1) — no elements require removal.",
        codeLine: 13,
        found: true,
      }),
    );
    return steps;
  }

  const working = cloneStack(stack);
  const clearingHighlights = Object.fromEntries(
    working.items.map((item) => [item.id, "clearing" as StackItemHighlight]),
  );

  steps.push(
    createStep(working, {
      phase: "clear",
      operation: "clear",
      statusTitle: "Discard all elements",
      statusDetail: `Removing ${working.items.length} element(s).`,
      stepMessage: "Every slot from TOP down to the base is cleared.",
      stepExplanation: `Clearing all ${working.items.length} elements from memory sequentially (O(n)).`,
      codeLine: 13,
      itemHighlights: clearingHighlights,
    }),
  );

  working.items = [];

  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "clear",
      statusTitle: "Stack cleared",
      statusDetail: "Stack cleared: All elements removed in O(n) time.",
      stepMessage: "Stack cleared: All elements removed in O(n) time.",
      stepExplanation:
        "Clear complete. Every slot was emptied in O(n) time — push can resume from an empty stack in O(1).",
      codeLine: 13,
      found: true,
    }),
  );

  return steps;
}

export function buildStackDisplayState(
  values: number[],
  maxCapacity: number = STACK_MAX_CAPACITY,
): Pick<
  StackOperationStep,
  "items" | "maxCapacity" | "size" | "topIndex" | "returnedValue"
> {
  const stack = buildStackFromValues(values, maxCapacity);
  const topIndex = stack.items.length > 0 ? stack.items.length - 1 : null;

  return {
    items: buildItems(stack),
    maxCapacity: stack.maxCapacity,
    size: stack.items.length,
    topIndex,
    returnedValue: null,
  };
}

export function generateStackOperationSteps(
  operation: StackOperationId,
  values: number[],
  params: StackOperationParams,
  maxCapacity: number = STACK_MAX_CAPACITY,
): StackOperationStep[] {
  switch (operation) {
    case "push":
      return generatePushSteps(values, params.value, maxCapacity);
    case "pop":
      return generatePopSteps(values, maxCapacity);
    case "peek":
      return generatePeekSteps(values, maxCapacity);
    case "clear":
      return generateClearSteps(values, maxCapacity);
    default: {
      const _exhaustive: never = operation;
      return _exhaustive;
    }
  }
}

export function operationNeedsValueInput(operation: StackOperationId): boolean {
  return operation === "push";
}

export function getOperationLabel(operation: StackOperationId): string {
  return operationLabel(operation);
}

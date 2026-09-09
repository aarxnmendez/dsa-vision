import { getAlgorithmT } from "../i18n/index";
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
  const t = getAlgorithmT();
  return t(`stackOperations.operations.${operation}`);
}

export function generatePushSteps(
  values: number[],
  value: number,
  maxCapacity: number = STACK_MAX_CAPACITY,
): StackOperationStep[] {
  const t = getAlgorithmT();
  const stack = buildStackFromValues(values, maxCapacity);
  const steps: StackOperationStep[] = [
    introStep(
      stack,
      "push",
      t("stackOperations.push.intro.statusTitle", { value }),
      t("stackOperations.push.intro.statusDetail"),
      3,
      t("stackOperations.push.intro.stepExplanation", { value }),
    ),
  ];

  if (stack.items.length >= stack.maxCapacity) {
    const overflowDetail = t("stackOperations.push.overflow.statusDetail", {
      maxCapacity: stack.maxCapacity,
    });
    steps.push(
      createStep(stack, {
        phase: "overflow",
        operation: "push",
        statusTitle: t("stackOperations.push.overflow.statusTitle"),
        statusDetail: overflowDetail,
        stepMessage: overflowDetail,
        stepExplanation: t("stackOperations.push.overflow.stepExplanation", {
          maxCapacity: stack.maxCapacity,
        }),
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
      statusTitle: t("stackOperations.push.incoming.statusTitle"),
      statusDetail: t("stackOperations.push.incoming.statusDetail", { value }),
      stepMessage: t("stackOperations.push.incoming.stepMessage", { value }),
      stepExplanation: t("stackOperations.push.incoming.stepExplanation", {
        value,
        topIndex,
      }),
      codeLine: 4,
      itemHighlights: { [newId]: "pushing" },
    }),
  );

  const completeDetail = t("stackOperations.push.complete.statusDetail", {
    value,
    topIndex,
  });
  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "push",
      statusTitle: t("stackOperations.push.complete.statusTitle"),
      statusDetail: completeDetail,
      stepMessage: completeDetail,
      stepExplanation: t("stackOperations.push.complete.stepExplanation"),
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
  const t = getAlgorithmT();
  const stack = buildStackFromValues(values, maxCapacity);
  const topIndexBefore = stack.items.length > 0 ? stack.items.length - 1 : null;
  const steps: StackOperationStep[] = [
    introStep(
      stack,
      "pop",
      t("stackOperations.pop.intro.statusTitle"),
      t("stackOperations.pop.intro.statusDetail"),
      6,
      topIndexBefore !== null
        ? t("stackOperations.pop.intro.stepExplanation.withTop", {
            topIndex: topIndexBefore,
          })
        : t("stackOperations.pop.intro.stepExplanation.empty"),
    ),
  ];

  if (stack.items.length === 0) {
    const underflowDetail = t("stackOperations.pop.underflow.statusDetail");
    steps.push(
      createStep(stack, {
        phase: "underflow",
        operation: "pop",
        statusTitle: t("stackOperations.pop.underflow.statusTitle"),
        statusDetail: underflowDetail,
        stepMessage: underflowDetail,
        stepExplanation: t("stackOperations.pop.underflow.stepExplanation"),
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
      statusTitle: t("stackOperations.pop.lift.statusTitle"),
      statusDetail: t("stackOperations.pop.lift.statusDetail", {
        value: topItem.value,
      }),
      stepMessage: t("stackOperations.pop.lift.stepMessage", {
        value: topItem.value,
      }),
      stepExplanation:
        newTopIndex !== null
          ? t("stackOperations.pop.lift.stepExplanation.withNewTop", {
              value: topItem.value,
              topIndex,
              newTopIndex,
            })
          : t("stackOperations.pop.lift.stepExplanation.emptyAfter", {
              value: topItem.value,
              topIndex,
            }),
      codeLine: 7,
      itemHighlights: { [topItem.id]: "popping" },
    }),
  );

  working.items.pop();

  const completeDetail = t("stackOperations.pop.complete.statusDetail", {
    value: topItem.value,
  });
  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "pop",
      statusTitle: t("stackOperations.pop.complete.statusTitle"),
      statusDetail: completeDetail,
      stepMessage: completeDetail,
      stepExplanation:
        newTopIndex !== null
          ? t("stackOperations.pop.complete.stepExplanation.withNewTop", {
              value: topItem.value,
              newTopIndex,
            })
          : t("stackOperations.pop.complete.stepExplanation.emptyAfter", {
              value: topItem.value,
            }),
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
  const t = getAlgorithmT();
  const stack = buildStackFromValues(values, maxCapacity);
  const topItem = stack.items.length > 0 ? stack.items[stack.items.length - 1]! : null;
  const steps: StackOperationStep[] = [
    introStep(
      stack,
      "peek",
      t("stackOperations.peek.intro.statusTitle"),
      t("stackOperations.peek.intro.statusDetail"),
      9,
      topItem
        ? t("stackOperations.peek.intro.stepExplanation.withTop", {
            topIndex: stack.items.length - 1,
            value: topItem.value,
          })
        : t("stackOperations.peek.intro.stepExplanation.empty"),
    ),
  ];

  if (stack.items.length === 0) {
    const underflowDetail = t("stackOperations.peek.underflow.statusDetail");
    steps.push(
      createStep(stack, {
        phase: "underflow",
        operation: "peek",
        statusTitle: t("stackOperations.peek.underflow.statusTitle"),
        statusDetail: underflowDetail,
        stepMessage: underflowDetail,
        stepExplanation: t("stackOperations.peek.underflow.stepExplanation"),
        codeLine: 10,
        isError: true,
      }),
    );
    return steps;
  }

  const topIndex = stack.items.length - 1;

  steps.push(
    createStep(stack, {
      phase: "peek",
      operation: "peek",
      statusTitle: t("stackOperations.peek.read.statusTitle"),
      statusDetail: t("stackOperations.peek.read.statusDetail", {
        value: topItem!.value,
      }),
      stepMessage: t("stackOperations.peek.read.stepMessage", {
        value: topItem!.value,
      }),
      stepExplanation: t("stackOperations.peek.read.stepExplanation", {
        topIndex,
        value: topItem!.value,
      }),
      codeLine: 10,
      itemHighlights: { [topItem!.id]: "peeking" },
    }),
  );

  steps.push(
    createStep(stack, {
      phase: "complete",
      operation: "peek",
      statusTitle: t("stackOperations.peek.complete.statusTitle"),
      statusDetail: t("stackOperations.peek.complete.statusDetail", {
        value: topItem!.value,
        size: stack.items.length,
      }),
      stepMessage: t("stackOperations.peek.complete.stepMessage"),
      stepExplanation: t("stackOperations.peek.complete.stepExplanation"),
      codeLine: 10,
      returnedValue: topItem!.value,
      itemHighlights: { [topItem!.id]: "found" },
      found: true,
    }),
  );

  return steps;
}

export function generateClearSteps(
  values: number[],
  maxCapacity: number = STACK_MAX_CAPACITY,
): StackOperationStep[] {
  const t = getAlgorithmT();
  const stack = buildStackFromValues(values, maxCapacity);
  const elementCount = stack.items.length;
  const steps: StackOperationStep[] = [
    introStep(
      stack,
      "clear",
      t("stackOperations.clear.intro.statusTitle"),
      t("stackOperations.clear.intro.statusDetail"),
      12,
      elementCount > 0
        ? t("stackOperations.clear.intro.stepExplanation.withElements", {
            count: elementCount,
          })
        : t("stackOperations.clear.intro.stepExplanation.empty"),
    ),
  ];

  if (stack.items.length === 0) {
    const alreadyEmptyDetail = t("stackOperations.clear.alreadyEmpty.statusDetail");
    steps.push(
      createStep(stack, {
        phase: "complete",
        operation: "clear",
        statusTitle: t("stackOperations.clear.alreadyEmpty.statusTitle"),
        statusDetail: alreadyEmptyDetail,
        stepMessage: t("stackOperations.clear.alreadyEmpty.stepMessage"),
        stepExplanation: t("stackOperations.clear.alreadyEmpty.stepExplanation"),
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
      statusTitle: t("stackOperations.clear.discard.statusTitle"),
      statusDetail: t("stackOperations.clear.discard.statusDetail", {
        count: working.items.length,
      }),
      stepMessage: t("stackOperations.clear.discard.stepMessage"),
      stepExplanation: t("stackOperations.clear.discard.stepExplanation", {
        count: working.items.length,
      }),
      codeLine: 13,
      itemHighlights: clearingHighlights,
    }),
  );

  working.items = [];

  const clearedDetail = t("stackOperations.clear.complete.statusDetail");
  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "clear",
      statusTitle: t("stackOperations.clear.complete.statusTitle"),
      statusDetail: clearedDetail,
      stepMessage: clearedDetail,
      stepExplanation: t("stackOperations.clear.complete.stepExplanation"),
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

import { getAlgorithmT } from "../i18n/index";
import type {
  QueueItemHighlight,
  QueueItemState,
  QueueOperationId,
  QueueOperationParams,
  QueueOperationStep,
  QueuePhase,
} from "../types/queueStructure";
import { QUEUE_MAX_CAPACITY } from "../types/queueStructure";

interface InternalItem {
  id: string;
  value: number;
}

interface InternalQueue {
  items: InternalItem[];
  maxCapacity: number;
}

interface StepBuildOptions {
  phase: QueuePhase;
  operation: QueueOperationId;
  statusTitle: string;
  statusDetail: string;
  stepMessage: string;
  stepExplanation: string;
  codeLine: number;
  found?: boolean;
  isError?: boolean;
  returnedValue?: number | null;
  itemHighlights?: Record<string, QueueItemHighlight>;
  pointerOverrides?: {
    frontIndex?: number | null;
    rearIndex?: number | null;
  };
  statusFrontValue?: number | null;
}

let itemCounter = 0;

function resetItemCounter(): void {
  itemCounter = 0;
}

function createItemId(): string {
  const id = `q${itemCounter}`;
  itemCounter += 1;
  return id;
}

function buildQueueFromValues(
  values: number[],
  maxCapacity: number = QUEUE_MAX_CAPACITY,
): InternalQueue {
  resetItemCounter();
  const items = values.slice(0, maxCapacity).map((value) => ({
    id: createItemId(),
    value,
  }));
  return { items, maxCapacity };
}

function cloneQueue(queue: InternalQueue): InternalQueue {
  return {
    maxCapacity: queue.maxCapacity,
    items: queue.items.map((item) => ({ ...item })),
  };
}

function resolvePointerIndices(
  queue: InternalQueue,
  overrides?: StepBuildOptions["pointerOverrides"],
): { frontIndex: number | null; rearIndex: number | null } {
  const defaults = frontRearIndices(queue);
  return {
    frontIndex:
      overrides?.frontIndex !== undefined
        ? overrides.frontIndex
        : defaults.frontIndex,
    rearIndex:
      overrides?.rearIndex !== undefined
        ? overrides.rearIndex
        : defaults.rearIndex,
  };
}

function buildItems(
  queue: InternalQueue,
  highlights: Record<string, QueueItemHighlight> = {},
  frontIndex: number | null,
  rearIndex: number | null,
): Array<QueueItemState | undefined> {
  return queue.items.map((item, index) => ({
    id: item.id,
    value: item.value,
    highlightState: highlights[item.id] ?? "default",
    isFront: frontIndex !== null && index === frontIndex,
    isRear: rearIndex !== null && index === rearIndex,
  }));
}

function frontRearIndices(queue: InternalQueue): {
  frontIndex: number | null;
  rearIndex: number | null;
} {
  if (queue.items.length === 0) {
    return { frontIndex: null, rearIndex: null };
  }
  const last = queue.items.length - 1;
  return { frontIndex: 0, rearIndex: last };
}

function createStep(
  queue: InternalQueue,
  options: StepBuildOptions,
): QueueOperationStep {
  const { frontIndex, rearIndex } = resolvePointerIndices(
    queue,
    options.pointerOverrides,
  );

  return {
    phase: options.phase,
    operation: options.operation,
    items: buildItems(
      queue,
      options.itemHighlights ?? {},
      frontIndex,
      rearIndex,
    ),
    maxCapacity: queue.maxCapacity,
    size: queue.items.length,
    frontIndex,
    rearIndex,
    returnedValue: options.returnedValue ?? null,
    statusTitle: options.statusTitle,
    statusDetail: options.statusDetail,
    stepMessage: options.stepMessage,
    stepExplanation: options.stepExplanation,
    codeLine: options.codeLine,
    found: options.found ?? false,
    isError: options.isError ?? false,
    statusFrontValue: options.statusFrontValue ?? null,
  };
}

function introStep(
  queue: InternalQueue,
  operation: QueueOperationId,
  title: string,
  detail: string,
  codeLine: number,
  stepExplanation: string,
): QueueOperationStep {
  return createStep(queue, {
    phase: "intro",
    operation,
    statusTitle: title,
    statusDetail: detail,
    stepMessage: detail,
    stepExplanation,
    codeLine,
  });
}

export function generateEnqueueSteps(
  values: number[],
  value: number,
  maxCapacity: number = QUEUE_MAX_CAPACITY,
): QueueOperationStep[] {
  const t = getAlgorithmT();
  const queue = buildQueueFromValues(values, maxCapacity);
  const steps: QueueOperationStep[] = [
    createStep(queue, {
      phase: "intro",
      operation: "enqueue",
      statusTitle: t("queueOperations.enqueue.intro.statusTitle", { value }),
      statusDetail: t("queueOperations.enqueue.intro.statusDetail"),
      stepMessage: t("queueOperations.enqueue.intro.statusDetail"),
      stepExplanation: t("queueOperations.enqueue.intro.stepExplanation", {
        value,
      }),
      codeLine: 3,
    }),
  ];

  if (queue.items.length >= queue.maxCapacity) {
    const overflowDetail = t("queueOperations.enqueue.overflow.statusDetail", {
      maxCapacity: queue.maxCapacity,
    });
    steps.push(
      createStep(queue, {
        phase: "overflow",
        operation: "enqueue",
        statusTitle: t("queueOperations.enqueue.overflow.statusTitle"),
        statusDetail: overflowDetail,
        stepMessage: overflowDetail,
        stepExplanation: t("queueOperations.enqueue.overflow.stepExplanation", {
          maxCapacity: queue.maxCapacity,
        }),
        codeLine: 4,
        isError: true,
        itemHighlights: Object.fromEntries(
          queue.items.map((item, index) => [
            item.id,
            index === queue.items.length - 1 ? "peeking" : "default",
          ]),
        ),
      }),
    );
    return steps;
  }

  const working = cloneQueue(queue);
  const newId = createItemId();
  const previousRearIndex =
    queue.items.length > 0 ? queue.items.length - 1 : null;
  working.items.push({ id: newId, value });

  steps.push(
    createStep(working, {
      phase: "enqueue",
      operation: "enqueue",
      statusTitle: t("queueOperations.enqueue.incoming.statusTitle"),
      statusDetail: t("queueOperations.enqueue.incoming.statusDetail", {
        value,
      }),
      stepMessage: t("queueOperations.enqueue.incoming.stepMessage", { value }),
      stepExplanation: t("queueOperations.enqueue.incoming.stepExplanation", {
        value,
      }),
      codeLine: 4,
      itemHighlights: { [newId]: "enqueueing" },
      pointerOverrides: { rearIndex: previousRearIndex },
    }),
  );

  const completeDetail = t("queueOperations.enqueue.complete.statusDetail", {
    value,
  });
  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "enqueue",
      statusTitle: t("queueOperations.enqueue.complete.statusTitle"),
      statusDetail: completeDetail,
      stepMessage: completeDetail,
      stepExplanation: t("queueOperations.enqueue.complete.stepExplanation", {
        value,
      }),
      codeLine: 4,
      itemHighlights: { [newId]: "found" },
      found: true,
    }),
  );

  return steps;
}

export function generateDequeueSteps(
  values: number[],
  maxCapacity: number = QUEUE_MAX_CAPACITY,
): QueueOperationStep[] {
  const t = getAlgorithmT();
  const queue = buildQueueFromValues(values, maxCapacity);
  const frontItem =
    queue.items.length > 0 ? queue.items[0]! : null;
  const steps: QueueOperationStep[] = [
    createStep(queue, {
      phase: "intro",
      operation: "dequeue",
      statusTitle: t("queueOperations.dequeue.intro.statusTitle"),
      statusDetail: t("queueOperations.dequeue.intro.statusDetail"),
      stepMessage: t("queueOperations.dequeue.intro.stepMessage"),
      stepExplanation: frontItem
        ? t("queueOperations.dequeue.intro.stepExplanation.withFront", {
            value: frontItem.value,
          })
        : t("queueOperations.dequeue.intro.stepExplanation.empty"),
      codeLine: 6,
      itemHighlights: frontItem
        ? { [frontItem.id]: "peeking" }
        : undefined,
    }),
  ];

  if (queue.items.length === 0) {
    const underflowDetail = t("queueOperations.dequeue.underflow.statusDetail");
    steps.push(
      createStep(queue, {
        phase: "underflow",
        operation: "dequeue",
        statusTitle: t("queueOperations.dequeue.underflow.statusTitle"),
        statusDetail: underflowDetail,
        stepMessage: underflowDetail,
        stepExplanation: t("queueOperations.dequeue.underflow.stepExplanation"),
        codeLine: 7,
        isError: true,
      }),
    );
    return steps;
  }

  const working = cloneQueue(queue);
  const front = working.items[0]!;
  const willHaveFront = working.items.length > 1;

  steps.push(
    createStep(working, {
      phase: "advance_front",
      operation: "dequeue",
      statusTitle: t("queueOperations.dequeue.advanceFront.statusTitle"),
      statusDetail: t("queueOperations.dequeue.advanceFront.statusDetail", {
        value: front.value,
      }),
      stepMessage: t("queueOperations.dequeue.advanceFront.stepMessage", {
        value: front.value,
      }),
      stepExplanation: willHaveFront
        ? t("queueOperations.dequeue.advanceFront.stepExplanation.withNext", {
            value: front.value,
            nextValue: working.items[1]!.value,
          })
        : t("queueOperations.dequeue.advanceFront.stepExplanation.emptyAfter", {
            value: front.value,
          }),
      codeLine: 7,
      itemHighlights: { [front.id]: "outgoing" },
      pointerOverrides: {
        frontIndex: willHaveFront ? 1 : null,
      },
    }),
  );

  working.items.shift();

  const completeDetail = t("queueOperations.dequeue.complete.statusDetail", {
    value: front.value,
  });
  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "dequeue",
      statusTitle: t("queueOperations.dequeue.complete.statusTitle"),
      statusDetail: completeDetail,
      stepMessage: completeDetail,
      stepExplanation: willHaveFront
        ? t("queueOperations.dequeue.complete.stepExplanation.withNext", {
            value: front.value,
          })
        : t("queueOperations.dequeue.complete.stepExplanation.emptyAfter", {
            value: front.value,
          }),
      codeLine: 7,
      returnedValue: front.value,
      found: true,
    }),
  );

  return steps;
}

export function generateQueuePeekSteps(
  values: number[],
  maxCapacity: number = QUEUE_MAX_CAPACITY,
): QueueOperationStep[] {
  const t = getAlgorithmT();
  const queue = buildQueueFromValues(values, maxCapacity);
  const frontItem = queue.items.length > 0 ? queue.items[0]! : null;

  if (queue.items.length === 0) {
    const underflowDetail = t("queueOperations.peek.underflow.statusDetail");
    return [
      introStep(
        queue,
        "peek",
        t("queueOperations.peek.intro.statusTitle"),
        t("queueOperations.peek.intro.statusDetail"),
        9,
        t("queueOperations.peek.intro.stepExplanation.empty"),
      ),
      createStep(queue, {
        phase: "underflow",
        operation: "peek",
        statusTitle: t("queueOperations.peek.underflow.statusTitle"),
        statusDetail: underflowDetail,
        stepMessage: underflowDetail,
        stepExplanation: t("queueOperations.peek.underflow.stepExplanation"),
        codeLine: 10,
        isError: true,
      }),
    ];
  }

  const peekDetail = t("queueOperations.peek.read.statusDetail", {
    value: frontItem!.value,
  });

  return [
    createStep(queue, {
      phase: "peek",
      operation: "peek",
      statusTitle: t("queueOperations.peek.read.statusTitle"),
      statusDetail: peekDetail,
      stepMessage: t("queueOperations.peek.read.stepMessage", {
        value: frontItem!.value,
      }),
      stepExplanation: t("queueOperations.peek.read.stepExplanation", {
        value: frontItem!.value,
      }),
      codeLine: 10,
      itemHighlights: { [frontItem!.id]: "peeking" },
      statusFrontValue: frontItem!.value,
      found: true,
    }),
  ];
}

export function generateQueueClearSteps(
  values: number[],
  maxCapacity: number = QUEUE_MAX_CAPACITY,
): QueueOperationStep[] {
  const t = getAlgorithmT();
  const queue = buildQueueFromValues(values, maxCapacity);
  const elementCount = queue.items.length;
  const steps: QueueOperationStep[] = [
    introStep(
      queue,
      "clear",
      t("queueOperations.clear.intro.statusTitle"),
      t("queueOperations.clear.intro.statusDetail"),
      12,
      elementCount > 0
        ? t("queueOperations.clear.intro.stepExplanation.withElements", {
            count: elementCount,
          })
        : t("queueOperations.clear.intro.stepExplanation.empty"),
    ),
  ];

  if (queue.items.length === 0) {
    const alreadyEmptyDetail = t(
      "queueOperations.clear.alreadyEmpty.statusDetail",
    );
    steps.push(
      createStep(queue, {
        phase: "complete",
        operation: "clear",
        statusTitle: t("queueOperations.clear.alreadyEmpty.statusTitle"),
        statusDetail: alreadyEmptyDetail,
        stepMessage: t("queueOperations.clear.alreadyEmpty.stepMessage"),
        stepExplanation: t(
          "queueOperations.clear.alreadyEmpty.stepExplanation",
        ),
        codeLine: 13,
        found: true,
      }),
    );
    return steps;
  }

  const working = cloneQueue(queue);
  const clearingHighlights = Object.fromEntries(
    working.items.map((item) => [item.id, "outgoing" as QueueItemHighlight]),
  );

  steps.push(
    createStep(working, {
      phase: "clear",
      operation: "clear",
      statusTitle: t("queueOperations.clear.discard.statusTitle"),
      statusDetail: t("queueOperations.clear.discard.statusDetail", {
        count: working.items.length,
      }),
      stepMessage: t("queueOperations.clear.discard.stepMessage"),
      stepExplanation: t("queueOperations.clear.discard.stepExplanation", {
        count: working.items.length,
      }),
      codeLine: 13,
      itemHighlights: clearingHighlights,
    }),
  );

  working.items = [];

  const clearedDetail = t("queueOperations.clear.complete.statusDetail");
  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "clear",
      statusTitle: t("queueOperations.clear.complete.statusTitle"),
      statusDetail: clearedDetail,
      stepMessage: clearedDetail,
      stepExplanation: t("queueOperations.clear.complete.stepExplanation"),
      codeLine: 13,
      found: true,
    }),
  );

  return steps;
}

export function buildQueueDisplayState(
  values: number[],
  maxCapacity: number = QUEUE_MAX_CAPACITY,
): Pick<
  QueueOperationStep,
  "items" | "maxCapacity" | "size" | "frontIndex" | "rearIndex" | "returnedValue"
> {
  const queue = buildQueueFromValues(values, maxCapacity);
  const { frontIndex, rearIndex } = frontRearIndices(queue);

  return {
    items: buildItems(queue, {}, frontIndex, rearIndex),
    maxCapacity: queue.maxCapacity,
    size: queue.items.length,
    frontIndex,
    rearIndex,
    returnedValue: null,
  };
}

export function generateQueueOperationSteps(
  operation: QueueOperationId,
  values: number[],
  params: QueueOperationParams,
  maxCapacity: number = QUEUE_MAX_CAPACITY,
): QueueOperationStep[] {
  switch (operation) {
    case "enqueue":
      return generateEnqueueSteps(values, params.value, maxCapacity);
    case "dequeue":
      return generateDequeueSteps(values, maxCapacity);
    case "peek":
      return generateQueuePeekSteps(values, maxCapacity);
    case "clear":
      return generateQueueClearSteps(values, maxCapacity);
    default: {
      const _exhaustive: never = operation;
      return _exhaustive;
    }
  }
}

export function queueOperationNeedsValueInput(
  operation: QueueOperationId,
): boolean {
  return operation === "enqueue";
}

import { getAlgorithmT } from "../i18n/index";
import type {
  LinkedListConnection,
  LinkedListConnectionLabel,
  LinkedListConnectionState,
  LinkedListNodeHighlight,
  LinkedListNodeState,
  LinkedListFloatingPlacement,
  LinkedListOperationId,
  LinkedListOperationParams,
  LinkedListOperationStep,
  LinkedListPhase,
  LinkedListPointer,
  LinkedListType,
} from "../types/linkedListStructure";

interface InternalNode {
  id: string;
  value: number;
  next: string | null;
  prev: string | null;
}

interface InternalList {
  type: LinkedListType;
  headId: string | null;
  nodes: Map<string, InternalNode>;
}

interface AdditionalConnection {
  sourceId: string;
  targetId: string;
  label: LinkedListConnectionLabel;
  state?: LinkedListConnectionState;
}

interface NodePortOverride {
  nextIsNull?: boolean;
  prevIsNull?: boolean;
}

interface BuildNodesOptions {
  inlinePending?: Array<{ id: string; placement: LinkedListFloatingPlacement }>;
  headLabelNodeId?: string | null;
  tailLabelNodeId?: string | null;
  displayOrder?: string[];
  nodePortOverrides?: Record<string, NodePortOverride>;
}

interface StepBuildOptions {
  phase: LinkedListPhase;
  operation: LinkedListOperationId;
  statusTitle: string;
  statusDetail: string;
  stepMessage: string;
  stepExplanation: string;
  codeLine: number;
  pointers?: LinkedListPointer[];
  found?: boolean;
  nodeHighlights?: Record<string, LinkedListNodeHighlight>;
  connectionStates?: Record<string, LinkedListConnectionState>;
  inlinePending?: Array<{ id: string; placement: LinkedListFloatingPlacement }>;
  headLabelNodeId?: string | null;
  tailLabelNodeId?: string | null;
  additionalConnections?: AdditionalConnection[];
  displayOrder?: string[];
  nodePortOverrides?: Record<string, NodePortOverride>;
}

let nodeCounter = 0;

function resetNodeCounter(): void {
  nodeCounter = 0;
}

function createNodeId(): string {
  const id = `n${nodeCounter}`;
  nodeCounter += 1;
  return id;
}

function cloneList(list: InternalList): InternalList {
  const nodes = new Map<string, InternalNode>();
  for (const [id, node] of list.nodes) {
    nodes.set(id, { ...node });
  }
  return { type: list.type, headId: list.headId, nodes };
}

function buildListFromValues(
  values: number[],
  type: LinkedListType,
): InternalList {
  resetNodeCounter();
  const nodes = new Map<string, InternalNode>();
  let headId: string | null = null;
  let previousId: string | null = null;

  for (const value of values) {
    const id = createNodeId();
    nodes.set(id, { id, value, next: null, prev: null });
    if (previousId) {
      const prevNode = nodes.get(previousId)!;
      prevNode.next = id;
      if (type !== "singly") {
        nodes.get(id)!.prev = previousId;
      }
    } else {
      headId = id;
    }
    previousId = id;
  }

  if (type === "circular" && headId && previousId) {
    nodes.get(previousId)!.next = headId;
  }

  return { type, headId, nodes };
}

function getOrderedNodeIds(list: InternalList): string[] {
  if (!list.headId || !list.nodes.has(list.headId)) {
    return [];
  }

  const ordered: string[] = [];
  const visited = new Set<string>();
  let currentId: string | null = list.headId;
  const maxSteps = list.nodes.size + 1;
  let step = 0;

  while (currentId && step < maxSteps) {
    step += 1;

    if (visited.has(currentId) || !list.nodes.has(currentId)) {
      break;
    }

    ordered.push(currentId);
    visited.add(currentId);
    const node: InternalNode = list.nodes.get(currentId)!;
    currentId = node.next;

    if (list.type === "circular" && currentId === list.headId && ordered.length > 0) {
      break;
    }
  }

  return ordered;
}

function getTailId(list: InternalList): string | null {
  const ordered = getOrderedNodeIds(list);
  return ordered.length > 0 ? ordered[ordered.length - 1]! : null;
}

function isCircularSingleNode(list: InternalList): boolean {
  if (list.type !== "circular" || !list.headId || !list.nodes.has(list.headId)) {
    return false;
  }

  return list.nodes.size === 1 && list.nodes.get(list.headId)!.next === list.headId;
}

function relinkCircularTailToHead(list: InternalList): void {
  if (list.type !== "circular" || !list.headId) {
    return;
  }

  const tailId = getTailId(list);
  if (!tailId || !list.nodes.has(tailId)) {
    return;
  }

  list.nodes.get(tailId)!.next = list.headId;
}

function getTraversalLimit(list: InternalList): number {
  return Math.max(list.nodes.size, 1) + 1;
}

function getNodeAtIndex(list: InternalList, index: number): string | null {
  const ordered = getOrderedNodeIds(list);
  return ordered[index] ?? null;
}

function connectionKey(
  sourceId: string,
  targetId: string,
  label: LinkedListConnectionLabel,
): string {
  return `${sourceId}:${label}:${targetId}`;
}

function pushNextConnection(
  list: InternalList,
  connections: LinkedListConnection[],
  connectionIds: Set<string>,
  connectionStates: Record<string, LinkedListConnectionState>,
  sourceId: string,
  targetId: string,
  defaultState: LinkedListConnectionState,
): void {
  if (!list.nodes.has(sourceId) || !list.nodes.has(targetId)) {
    return;
  }

  const key = connectionKey(sourceId, targetId, "next");
  if (connectionIds.has(key)) {
    return;
  }

  connectionIds.add(key);
  connections.push({
    id: key,
    sourceId,
    targetId,
    label: "next",
    state: connectionStates[key] ?? defaultState,
  });
}

function buildConnections(
  list: InternalList,
  connectionStates: Record<string, LinkedListConnectionState> = {},
  additionalConnections: AdditionalConnection[] = [],
  displayOrder?: string[],
): LinkedListConnection[] {
  const connections: LinkedListConnection[] = [];
  const order = displayOrder ?? getOrderedNodeIds(list);
  const tailId = order.length > 0 ? order[order.length - 1]! : null;
  const connectionIds = new Set<string>();

  for (const node of list.nodes.values()) {
    if (node.next && list.nodes.has(node.next)) {
      const isBackEdge =
        list.type === "circular" &&
        node.id === tailId &&
        node.next === list.headId;

      const label: LinkedListConnectionLabel = "next";
      const key = connectionKey(node.id, node.next, label);
      connectionIds.add(key);
      connections.push({
        id: key,
        sourceId: node.id,
        targetId: node.next,
        label,
        state: connectionStates[key] ?? (isBackEdge ? "active" : "idle"),
      });
    }
  }

  if (list.type === "doubly") {
    for (const node of list.nodes.values()) {
      if (!node.prev || !list.nodes.has(node.prev)) continue;
      const key = connectionKey(node.id, node.prev, "prev");
      connectionIds.add(key);
      connections.push({
        id: key,
        sourceId: node.id,
        targetId: node.prev,
        label: "prev",
        state: connectionStates[key] ?? "idle",
      });
    }
  }

  for (const link of additionalConnections) {
    if (!list.nodes.has(link.sourceId) || !list.nodes.has(link.targetId)) {
      continue;
    }

    const key = connectionKey(link.sourceId, link.targetId, link.label);
    if (connectionIds.has(key)) {
      continue;
    }
    connectionIds.add(key);
    connections.push({
      id: key,
      sourceId: link.sourceId,
      targetId: link.targetId,
      label: link.label,
      state: connectionStates[key] ?? link.state ?? "idle",
    });
  }

  if (list.type === "circular" && list.headId && order.length > 1) {
    const ordered = order.filter((id) => list.nodes.has(id));

    for (let index = 0; index < ordered.length - 1; index += 1) {
      pushNextConnection(
        list,
        connections,
        connectionIds,
        connectionStates,
        ordered[index]!,
        ordered[index + 1]!,
        "idle",
      );
    }

    const tailFromOrder = ordered[ordered.length - 1]!;
    pushNextConnection(
      list,
      connections,
      connectionIds,
      connectionStates,
      tailFromOrder,
      list.headId,
      "active",
    );
  }

  return connections;
}

function resolvePortNullState(
  list: InternalList,
  nodeId: string,
  override?: NodePortOverride,
): Pick<LinkedListNodeState, "nextIsNull" | "prevIsNull"> {
  const node = list.nodes.get(nodeId);
  if (!node) {
    return { nextIsNull: true, prevIsNull: list.type === "doubly" ? true : undefined };
  }

  return {
    nextIsNull:
      override?.nextIsNull ??
      (list.type === "circular"
        ? node.next === null || !list.nodes.has(node.next)
        : node.next === null),
    prevIsNull:
      list.type === "doubly"
        ? (override?.prevIsNull ?? node.prev === null)
        : undefined,
  };
}

function buildNodes(
  list: InternalList,
  nodeHighlights: Record<string, LinkedListNodeHighlight> = {},
  options: BuildNodesOptions = {},
): LinkedListNodeState[] {
  const ordered = (options.displayOrder ?? getOrderedNodeIds(list)).filter((id) =>
    list.nodes.has(id),
  );
  const orderedSet = new Set(ordered);
  const defaultTailId = ordered.length > 0 ? ordered[ordered.length - 1]! : null;
  const headLabelId =
    options.headLabelNodeId === undefined ? list.headId : options.headLabelNodeId;
  const tailLabelId =
    options.tailLabelNodeId === undefined ? defaultTailId : options.tailLabelNodeId;

  const toNodeState = (
    id: string,
    extras: Partial<LinkedListNodeState> = {},
  ): LinkedListNodeState => ({
    id,
    value: list.nodes.get(id)!.value,
    highlightState: nodeHighlights[id] ?? "default",
    isHead: headLabelId !== null && id === headLabelId,
    isTail: tailLabelId !== null && id === tailLabelId && id !== headLabelId,
    ...extras,
  });

  const flowNodes = ordered.map((id) =>
    toNodeState(id, resolvePortNullState(list, id, options.nodePortOverrides?.[id])),
  );

  const beforeHead: LinkedListNodeState[] = [];
  const afterTail: LinkedListNodeState[] = [];

  for (const pending of options.inlinePending ?? []) {
    if (orderedSet.has(pending.id) || !list.nodes.has(pending.id)) {
      continue;
    }

    const highlight = nodeHighlights[pending.id] ?? "creating";
    const isCreating = highlight === "creating";
    const pendingNode = toNodeState(pending.id, {
      highlightState: highlight,
      isHead: false,
      isTail: false,
      showNewLabel: isCreating,
      inlinePlacement: pending.placement,
      ...resolvePortNullState(list, pending.id, options.nodePortOverrides?.[pending.id]),
    });

    if (pending.placement === "before-head") {
      beforeHead.push(pendingNode);
    } else {
      afterTail.push(pendingNode);
    }
  }

  return [...beforeHead, ...flowNodes, ...afterTail];
}

function createStep(
  list: InternalList,
  options: StepBuildOptions,
): LinkedListOperationStep {
  return {
    phase: options.phase,
    listType: list.type,
    nodes: buildNodes(list, options.nodeHighlights, {
      inlinePending: options.inlinePending,
      headLabelNodeId: options.headLabelNodeId,
      tailLabelNodeId: options.tailLabelNodeId,
      displayOrder: options.displayOrder,
      nodePortOverrides: options.nodePortOverrides,
    }),
    connections: buildConnections(
      list,
      options.connectionStates,
      options.additionalConnections,
      options.displayOrder,
    ),
    operation: options.operation,
    statusTitle: options.statusTitle,
    statusDetail: options.statusDetail,
    stepMessage: options.stepMessage,
    stepExplanation: options.stepExplanation,
    codeLine: options.codeLine,
    pointers: options.pointers ?? [],
    found: options.found ?? false,
  };
}

function pointerAt(
  id: LinkedListPointer["id"],
  nodeId: string,
): LinkedListPointer {
  return { id, nodeId };
}

function operationLabel(operation: LinkedListOperationId): string {
  const t = getAlgorithmT();
  return t(`linkedListOperations.operations.${operation}`);
}

function introStep(
  list: InternalList,
  operation: LinkedListOperationId,
  detail: string,
  message: string,
  codeLine: number,
): LinkedListOperationStep {
  return createStep(list, {
    phase: "intro",
    operation,
    statusTitle: operationLabel(operation),
    statusDetail: detail,
    stepMessage: message,
    stepExplanation: message,
    codeLine,
    pointers: list.headId ? [pointerAt("head", list.headId)] : [],
  });
}

export function generateInsertAtHeadSteps(
  listType: LinkedListType,
  values: number[],
  value: number,
): LinkedListOperationStep[] {
  const t = getAlgorithmT();
  const list = buildListFromValues(values, listType);
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "insert-at-head",
      t("linkedListOperations.insertAtHead.intro.statusDetail", { value }),
      t("linkedListOperations.insertAtHead.intro.stepExplanation"),
      2,
    ),
  ];

  const working = cloneList(list);
  const newId = createNodeId();
  const formerHeadId = working.headId;
  working.nodes.set(newId, {
    id: newId,
    value,
    next: null,
    prev: null,
  });

  steps.push(
    createStep(working, {
      phase: "insert",
      operation: "insert-at-head",
      statusTitle: t("linkedListOperations.insertAtHead.allocate.statusTitle"),
      statusDetail: t("linkedListOperations.insertAtHead.allocate.statusDetail", {
        value,
      }),
      stepMessage: t("linkedListOperations.insertAtHead.allocate.stepMessage", {
        value,
      }),
      stepExplanation: t(
        "linkedListOperations.insertAtHead.allocate.stepExplanation",
      ),
      codeLine: 2,
      pointers: formerHeadId ? [pointerAt("head", formerHeadId)] : [],
      nodeHighlights: { [newId]: "creating" },
      inlinePending: [{ id: newId, placement: "before-head" }],
      headLabelNodeId: formerHeadId,
    }),
  );

  if (formerHeadId) {
    working.nodes.get(newId)!.next = formerHeadId;

    if (working.type === "doubly") {
      working.nodes.get(formerHeadId)!.prev = newId;
    }

    steps.push(
      createStep(working, {
        phase: "relink",
        operation: "insert-at-head",
        statusTitle: t("linkedListOperations.insertAtHead.link.statusTitle"),
        statusDetail: t("linkedListOperations.insertAtHead.link.statusDetail"),
        stepMessage: t("linkedListOperations.insertAtHead.link.stepMessage", {
          value,
          formerHeadValue: working.nodes.get(formerHeadId)!.value,
        }),
        stepExplanation: t(
          "linkedListOperations.insertAtHead.link.stepExplanation",
        ),
        codeLine: 3,
        pointers: formerHeadId ? [pointerAt("head", formerHeadId)] : [],
        nodeHighlights: { [newId]: "inserted" },
        inlinePending: [{ id: newId, placement: "before-head" }],
        headLabelNodeId: formerHeadId,
        additionalConnections: [
          {
            sourceId: newId,
            targetId: formerHeadId,
            label: "next",
            state: "relinking",
          },
        ],
      }),
    );
  }

  working.headId = newId;

  if (working.type === "circular" && working.headId) {
    const tailId = getTailId(working);
    if (tailId && tailId !== newId) {
      working.nodes.get(tailId)!.next = working.headId;
    }
  }

  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "insert-at-head",
      statusTitle: t("linkedListOperations.insertAtHead.complete.statusTitle"),
      statusDetail: t("linkedListOperations.insertAtHead.complete.statusDetail"),
      stepMessage: t("linkedListOperations.insertAtHead.complete.stepMessage", {
        value,
      }),
      stepExplanation: t(
        "linkedListOperations.insertAtHead.complete.stepExplanation",
      ),
      codeLine: 4,
      pointers: [pointerAt("head", newId)],
      nodeHighlights: { [newId]: "found" },
      found: true,
    }),
  );

  return steps;
}

export function generateInsertAtTailSteps(
  listType: LinkedListType,
  values: number[],
  value: number,
): LinkedListOperationStep[] {
  const t = getAlgorithmT();
  const list = buildListFromValues(values, listType);
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "insert-at-tail",
      t("linkedListOperations.insertAtTail.intro.statusDetail", { value }),
      listType === "circular"
        ? t("linkedListOperations.insertAtTail.intro.stepExplanation.circular")
        : t("linkedListOperations.insertAtTail.intro.stepExplanation.default"),
      14,
    ),
  ];

  if (!list.headId) {
    return generateInsertAtHeadSteps(listType, [], value);
  }

  const working = cloneList(list);
  const tailId = getTailId(working)!;
  const newId = createNodeId();
  working.nodes.set(newId, { id: newId, value, next: null, prev: null });

  steps.push(
    createStep(working, {
      phase: "insert",
      operation: "insert-at-tail",
      statusTitle: t("linkedListOperations.insertAtTail.allocate.statusTitle"),
      statusDetail: t("linkedListOperations.insertAtTail.allocate.statusDetail", {
        value,
      }),
      stepMessage: t("linkedListOperations.insertAtTail.allocate.stepMessage", {
        value,
      }),
      stepExplanation: t(
        "linkedListOperations.insertAtTail.allocate.stepExplanation",
      ),
      codeLine: 14,
      pointers: [pointerAt("tail", tailId)],
      nodeHighlights: { [newId]: "creating", [tailId]: "accessed" },
      inlinePending: [{ id: newId, placement: "after-tail" }],
      tailLabelNodeId: tailId,
    }),
  );

  working.nodes.get(tailId)!.next = newId;

  if (working.type === "doubly") {
    working.nodes.get(newId)!.prev = tailId;
  }

  const tailNextKey = connectionKey(tailId, newId, "next");
  steps.push(
    createStep(working, {
      phase: "relink",
      operation: "insert-at-tail",
      statusTitle: t("linkedListOperations.insertAtTail.link.statusTitle"),
      statusDetail: t("linkedListOperations.insertAtTail.link.statusDetail"),
      stepMessage: t("linkedListOperations.insertAtTail.link.stepMessage", {
        tailValue: working.nodes.get(tailId)!.value,
        value,
      }),
      stepExplanation: t("linkedListOperations.insertAtTail.link.stepExplanation"),
      codeLine: 15,
      pointers: [pointerAt("tail", tailId)],
      nodeHighlights: { [newId]: "inserted", [tailId]: "accessed" },
      tailLabelNodeId: tailId,
      connectionStates: { [tailNextKey]: "relinking" },
    }),
  );

  if (working.type === "circular") {
    working.nodes.get(newId)!.next = working.headId;
  }

  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "insert-at-tail",
      statusTitle: t("linkedListOperations.insertAtTail.complete.statusTitle"),
      statusDetail: t("linkedListOperations.insertAtTail.complete.statusDetail"),
      stepMessage:
        listType === "circular"
          ? t("linkedListOperations.insertAtTail.complete.stepMessage.circular", {
              value,
            })
          : t("linkedListOperations.insertAtTail.complete.stepMessage.default", {
              value,
            }),
      stepExplanation:
        listType === "circular"
          ? t("linkedListOperations.insertAtTail.complete.stepExplanation.circular")
          : t("linkedListOperations.insertAtTail.complete.stepExplanation.default"),
      codeLine: 16,
      pointers: [pointerAt("tail", newId)],
      nodeHighlights: { [newId]: "found" },
      found: true,
    }),
  );

  return steps;
}

export function generateInsertAtIndexSteps(
  listType: LinkedListType,
  values: number[],
  index: number,
  value: number,
): LinkedListOperationStep[] {
  if (index <= 0) {
    return generateInsertAtHeadSteps(listType, values, value);
  }

  const list = buildListFromValues(values, listType);
  const ordered = getOrderedNodeIds(list);
  if (index >= ordered.length) {
    return generateInsertAtTailSteps(listType, values, value);
  }

  const t = getAlgorithmT();
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "insert-at-index",
      t("linkedListOperations.insertAtIndex.intro.statusDetail", {
        value,
        index,
      }),
      t("linkedListOperations.insertAtIndex.intro.stepExplanation"),
      8,
    ),
  ];

  const working = cloneList(list);
  let prevId = working.headId!;
  let trackedPrevId: string | null = null;

  for (let i = 0; i < index; i += 1) {
    const nodeId = getNodeAtIndex(working, i)!;
    prevId = nodeId;
    const nextId = working.nodes.get(nodeId)!.next;
    const isPredecessor = i === index - 1;
    const nodeValue = working.nodes.get(nodeId)!.value;
    steps.push(
      createStep(working, {
        phase: "traverse",
        operation: "insert-at-index",
        statusTitle: isPredecessor
          ? t("linkedListOperations.insertAtIndex.reachPredecessor.statusTitle", {
              index: i,
            })
          : t("linkedListOperations.insertAtIndex.traverse.statusTitle", {
              index: i,
            }),
        statusDetail: t("linkedListOperations.insertAtIndex.traverse.statusDetail", {
          value: nodeValue,
        }),
        stepMessage: t("linkedListOperations.insertAtIndex.traverseMessage"),
        stepExplanation: t("linkedListOperations.insertAtIndex.traverseExplanation"),
        codeLine: 9,
        pointers: [
          pointerAt("curr", nodeId),
          ...(trackedPrevId ? [pointerAt("prev", trackedPrevId)] : []),
        ],
        nodeHighlights: { [nodeId]: isPredecessor ? "active" : "accessed" },
        connectionStates:
          nextId && i < index - 1
            ? { [connectionKey(nodeId, nextId, "next")]: "traversing" }
            : {},
      }),
    );
    trackedPrevId = nodeId;
  }

  const newId = createNodeId();
  const afterId = working.nodes.get(prevId)!.next;
  working.nodes.set(newId, {
    id: newId,
    value,
    next: afterId,
    prev: prevId,
  });
  working.nodes.get(prevId)!.next = newId;
  if (afterId && working.type === "doubly") {
    working.nodes.get(afterId)!.prev = newId;
    working.nodes.get(newId)!.prev = prevId;
  }

  steps.push(
    createStep(working, {
      phase: "relink",
      operation: "insert-at-index",
      statusTitle: t("linkedListOperations.insertAtIndex.splice.statusTitle"),
      statusDetail: t("linkedListOperations.insertAtIndex.splice.statusDetail"),
      stepMessage: t("linkedListOperations.insertAtIndex.splice.stepMessage", {
        value,
        prevValue: working.nodes.get(prevId)!.value,
      }),
      stepExplanation: t("linkedListOperations.insertAtIndex.splice.stepExplanation"),
      codeLine: 10,
      pointers: [pointerAt("prev", prevId), pointerAt("temp", newId)],
      nodeHighlights: { [newId]: "inserted", [prevId]: "active" },
      connectionStates: {
        [connectionKey(prevId, newId, "next")]: "relinking",
        ...(afterId
          ? { [connectionKey(newId, afterId, "next")]: "relinking" }
          : {}),
      },
    }),
    createStep(working, {
      phase: "complete",
      operation: "insert-at-index",
      statusTitle: t("linkedListOperations.insertAtIndex.complete.statusTitle"),
      statusDetail: t("linkedListOperations.insertAtIndex.complete.statusDetail", {
        value,
        index,
      }),
      stepMessage: t("linkedListOperations.insertAtIndex.complete.stepMessage"),
      stepExplanation: t("linkedListOperations.insertAtIndex.complete.stepExplanation"),
      codeLine: 11,
      pointers: [pointerAt("temp", newId)],
      nodeHighlights: { [newId]: "found" },
      found: true,
    }),
  );

  return steps;
}

export function generateDeleteHeadSteps(
  listType: LinkedListType,
  values: number[],
): LinkedListOperationStep[] {
  const t = getAlgorithmT();
  const list = buildListFromValues(values, listType);
  if (!list.headId) {
    return [
      createStep(list, {
        phase: "not-found",
        operation: "delete-head",
        statusTitle: t("linkedListOperations.deleteHead.empty.statusTitle"),
        statusDetail: t("linkedListOperations.deleteHead.empty.statusDetail"),
        stepMessage: t("linkedListOperations.deleteHead.empty.stepMessage"),
        stepExplanation: t("linkedListOperations.deleteHead.empty.stepExplanation"),
        codeLine: 18,
      }),
    ];
  }

  const headId = list.headId;
  const headValue = list.nodes.get(headId)!.value;
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "delete-head",
      t("linkedListOperations.deleteHead.intro.statusDetail", { value: headValue }),
      t("linkedListOperations.deleteHead.intro.stepExplanation"),
      18,
    ),
  ];

  const working = cloneList(list);
  const nextId = working.nodes.get(headId)!.next;
  const isCircularSingle = isCircularSingleNode(working);
  const tailId =
    working.type === "circular" && !isCircularSingle ? getTailId(working) : null;
  const breakTargetId = isCircularSingle ? headId : nextId;
  const breakKey = breakTargetId
    ? connectionKey(headId, breakTargetId, "next")
    : "";

  steps.push(
    createStep(working, {
      phase: "delete",
      operation: "delete-head",
      statusTitle: t("linkedListOperations.deleteHead.unlink.statusTitle"),
      statusDetail: isCircularSingle
        ? t("linkedListOperations.deleteHead.unlink.statusDetail.circularSingle")
        : t("linkedListOperations.deleteHead.unlink.statusDetail.default"),
      stepMessage: isCircularSingle
        ? t("linkedListOperations.deleteHead.unlink.stepMessage.circularSingle", {
            value: headValue,
          })
        : t("linkedListOperations.deleteHead.unlink.stepMessage.default", {
            value: headValue,
          }),
      stepExplanation:
        working.type === "circular"
          ? isCircularSingle
            ? t(
                "linkedListOperations.deleteHead.unlink.stepExplanation.circularSingle",
              )
            : t("linkedListOperations.deleteHead.unlink.stepExplanation.circular")
          : t("linkedListOperations.deleteHead.unlink.stepExplanation.default"),
      codeLine: 19,
      pointers:
        isCircularSingle || !nextId
          ? [pointerAt("head", headId)]
          : [pointerAt("head", nextId!)],
      nodeHighlights: { [headId]: "deleted" },
      connectionStates: breakKey ? { [breakKey]: "breaking" } : {},
    }),
  );

  if (working.type === "circular") {
    if (isCircularSingle) {
      working.headId = null;
      working.nodes.delete(headId);
    } else {
      working.headId = nextId;
      working.nodes.delete(headId);

      if (tailId && working.headId) {
        const staleTailNextKey = connectionKey(tailId, headId, "next");
        const newTailNextKey = connectionKey(tailId, working.headId, "next");

        steps.push(
          createStep(working, {
            phase: "relink",
            operation: "delete-head",
            statusTitle: t("linkedListOperations.deleteHead.relinkTail.statusTitle"),
            statusDetail: t("linkedListOperations.deleteHead.relinkTail.statusDetail"),
            stepMessage: t("linkedListOperations.deleteHead.relinkTail.stepMessage", {
              tailValue: working.nodes.get(tailId)!.value,
              headValue: working.nodes.get(working.headId)!.value,
            }),
            stepExplanation: t(
              "linkedListOperations.deleteHead.relinkTail.stepExplanation",
            ),
            codeLine: 20,
            pointers: [
              pointerAt("tail", tailId),
              pointerAt("head", working.headId),
            ],
            nodeHighlights: {
              [tailId]: "active",
              [working.headId]: "accessed",
            },
            connectionStates: {
              [staleTailNextKey]: "breaking",
              [newTailNextKey]: "relinking",
            },
            additionalConnections: [
              {
                sourceId: tailId,
                targetId: working.headId,
                label: "next",
                state: "relinking",
              },
            ],
          }),
        );

        working.nodes.get(tailId)!.next = working.headId;
      }
    }
  } else {
    working.headId = nextId;
    working.nodes.delete(headId);
    if (working.type === "doubly" && nextId) {
      working.nodes.get(nextId)!.prev = null;
    }
  }

  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "delete-head",
      statusTitle: t("linkedListOperations.deleteHead.complete.statusTitle"),
      statusDetail: isCircularSingle
        ? t("linkedListOperations.deleteHead.complete.statusDetail.circularSingle", {
            value: headValue,
          })
        : t("linkedListOperations.deleteHead.complete.statusDetail.default", {
            value: headValue,
          }),
      stepMessage: isCircularSingle
        ? t("linkedListOperations.deleteHead.complete.stepMessage.circularSingle")
        : working.type === "circular"
          ? t("linkedListOperations.deleteHead.complete.stepMessage.circular")
          : working.type === "doubly" && working.headId
            ? t("linkedListOperations.deleteHead.complete.stepMessage.doubly")
            : t("linkedListOperations.deleteHead.complete.stepMessage.default"),
      stepExplanation: isCircularSingle
        ? t("linkedListOperations.deleteHead.complete.stepExplanation.circularSingle")
        : working.type === "circular"
          ? t("linkedListOperations.deleteHead.complete.stepExplanation.circular")
          : working.type === "doubly"
            ? t("linkedListOperations.deleteHead.complete.stepExplanation.doubly")
            : t("linkedListOperations.deleteHead.complete.stepExplanation.default"),
      codeLine: working.type === "circular" && !isCircularSingle ? 21 : 20,
      pointers: working.headId ? [pointerAt("head", working.headId)] : [],
      nodeHighlights: working.headId ? { [working.headId]: "found" } : {},
      nodePortOverrides:
        working.type === "doubly" && working.headId
          ? { [working.headId]: { prevIsNull: true } }
          : undefined,
      found: true,
    }),
  );

  return steps;
}

export function generateDeleteTailSteps(
  listType: LinkedListType,
  values: number[],
): LinkedListOperationStep[] {
  const list = buildListFromValues(values, listType);
  if (!list.headId) {
    return generateDeleteHeadSteps(listType, values);
  }

  const ordered = getOrderedNodeIds(list);
  if (ordered.length === 1) {
    return generateDeleteHeadSteps(listType, values);
  }

  if (list.type === "doubly") {
    return generateDeleteTailDoublySteps(list);
  }

  return generateDeleteTailSinglySteps(list);
}

function generateDeleteTailDoublySteps(list: InternalList): LinkedListOperationStep[] {
  const t = getAlgorithmT();
  const ordered = getOrderedNodeIds(list);
  const tailId = ordered[ordered.length - 1]!;
  const prevId = list.nodes.get(tailId)!.prev;

  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "delete-tail",
      t("linkedListOperations.deleteTail.doublyIntro.statusDetail"),
      t("linkedListOperations.deleteTail.doublyIntro.stepExplanation"),
      22,
    ),
  ];

  if (!prevId) {
    return generateDeleteHeadSteps(list.type, ordered.map((id) => list.nodes.get(id)!.value));
  }

  const working = cloneList(list);

  steps.push(
    createStep(working, {
      phase: "delete",
      operation: "delete-tail",
      statusTitle: t("linkedListOperations.deleteTail.accessTail.statusTitle"),
      statusDetail: t("linkedListOperations.deleteTail.accessTail.statusDetail", {
        value: working.nodes.get(prevId)!.value,
      }),
      stepMessage: t("linkedListOperations.deleteTail.accessTail.stepMessage"),
      stepExplanation: t("linkedListOperations.deleteTail.accessTail.stepExplanation"),
      codeLine: 23,
      pointers: [pointerAt("tail", tailId), pointerAt("prev", prevId)],
      nodeHighlights: { [tailId]: "active", [prevId]: "accessed" },
    }),
  );

  const penultimateNextKey = connectionKey(prevId, tailId, "next");
  const tailPrevKey = connectionKey(tailId, prevId, "prev");

  steps.push(
    createStep(working, {
      phase: "delete",
      operation: "delete-tail",
      statusTitle: t("linkedListOperations.deleteTail.breakLink.statusTitle"),
      statusDetail: t("linkedListOperations.deleteTail.breakLink.statusDetail.doubly"),
      stepMessage: t("linkedListOperations.deleteTail.breakLink.stepMessage.doubly", {
        tailValue: working.nodes.get(tailId)!.value,
      }),
      stepExplanation: t("linkedListOperations.deleteTail.breakLink.stepExplanation.default"),
      codeLine: 24,
      pointers: [pointerAt("tail", tailId), pointerAt("prev", prevId)],
      nodeHighlights: { [tailId]: "deleted", [prevId]: "active" },
      connectionStates: {
        [penultimateNextKey]: "breaking",
        [tailPrevKey]: "breaking",
      },
      nodePortOverrides: {
        [prevId]: { nextIsNull: true },
      },
    }),
  );

  working.nodes.get(prevId)!.next = null;
  working.nodes.delete(tailId);

  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "delete-tail",
      statusTitle: t("linkedListOperations.deleteTail.complete.statusTitle"),
      statusDetail: t("linkedListOperations.deleteTail.complete.statusDetail.doubly"),
      stepMessage: t("linkedListOperations.deleteTail.complete.stepMessage.doubly"),
      stepExplanation: t("linkedListOperations.deleteTail.complete.stepExplanation.doubly"),
      codeLine: 25,
      pointers: [pointerAt("tail", prevId)],
      nodeHighlights: { [prevId]: "found" },
      found: true,
    }),
  );

  return steps;
}

function generateDeleteTailSinglySteps(list: InternalList): LinkedListOperationStep[] {
  const t = getAlgorithmT();
  const ordered = getOrderedNodeIds(list);
  const tailId = ordered[ordered.length - 1]!;
  const prevId = ordered[ordered.length - 2]!;

  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "delete-tail",
      list.type === "circular"
        ? t("linkedListOperations.deleteTail.singlyIntro.statusDetail.circular")
        : t("linkedListOperations.deleteTail.singlyIntro.statusDetail.default"),
      t("linkedListOperations.deleteTail.singlyIntro.stepExplanation"),
      22,
    ),
  ];

  const working = cloneList(list);

  for (let index = 0; index < ordered.length - 1; index += 1) {
    const nodeId = ordered[index]!;
    const nextId = working.nodes.get(nodeId)!.next!;
    const isPenultimate = index === ordered.length - 2;

    const nodeValue = working.nodes.get(nodeId)!.value;
    steps.push(
      createStep(working, {
        phase: isPenultimate ? "compare" : "traverse",
        operation: "delete-tail",
        statusTitle: isPenultimate
          ? t("linkedListOperations.deleteTail.penultimate.statusTitle")
          : t("linkedListOperations.deleteTail.walk.statusTitle"),
        statusDetail: isPenultimate
          ? t("linkedListOperations.deleteTail.penultimate.statusDetail", {
              value: nodeValue,
            })
          : t("linkedListOperations.deleteTail.walk.statusDetail", {
              value: nodeValue,
            }),
        stepMessage: isPenultimate
          ? t("linkedListOperations.deleteTail.penultimate.stepMessage")
          : t("linkedListOperations.deleteTail.walkMessage"),
        stepExplanation: isPenultimate
          ? t("linkedListOperations.deleteTail.penultimate.stepExplanation")
          : t("linkedListOperations.deleteTail.walk.stepExplanation"),
        codeLine: 23,
        pointers: [pointerAt("curr", nodeId)],
        nodeHighlights: {
          [nodeId]: isPenultimate ? "active" : "accessed",
          ...(isPenultimate ? { [tailId]: "comparing" } : {}),
        },
        connectionStates: isPenultimate
          ? { [connectionKey(nodeId, tailId, "next")]: "traversing" }
          : { [connectionKey(nodeId, nextId, "next")]: "traversing" },
      }),
    );
  }

  const penultimateNextKey = connectionKey(prevId, tailId, "next");

  const tailValue = working.nodes.get(tailId)!.value;
  steps.push(
    createStep(working, {
      phase: "delete",
      operation: "delete-tail",
      statusTitle: t("linkedListOperations.deleteTail.breakLink.statusTitle"),
      statusDetail:
        working.type === "circular"
          ? t("linkedListOperations.deleteTail.breakLink.statusDetail.circular")
          : t("linkedListOperations.deleteTail.breakLink.statusDetail.default"),
      stepMessage:
        working.type === "circular"
          ? t("linkedListOperations.deleteTail.breakLink.stepMessage.circular", {
              tailValue,
            })
          : t("linkedListOperations.deleteTail.breakLink.stepMessage.default", {
              tailValue,
            }),
      stepExplanation:
        working.type === "circular"
          ? t("linkedListOperations.deleteTail.breakLink.stepExplanation.circular")
          : t("linkedListOperations.deleteTail.breakLink.stepExplanation.default"),
      codeLine: 24,
      pointers: [pointerAt("prev", prevId), pointerAt("tail", tailId)],
      nodeHighlights: { [prevId]: "active", [tailId]: "deleted" },
      connectionStates: { [penultimateNextKey]: "breaking" },
      nodePortOverrides: {
        [prevId]: { nextIsNull: working.type !== "circular" },
      },
    }),
  );

  if (working.type === "circular") {
    working.nodes.get(prevId)!.next = working.headId;
  } else {
    working.nodes.get(prevId)!.next = null;
  }
  working.nodes.delete(tailId);

  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "delete-tail",
      statusTitle: t("linkedListOperations.deleteTail.complete.statusTitle"),
      statusDetail: t("linkedListOperations.deleteTail.complete.statusDetail.default"),
      stepMessage:
        working.type === "circular"
          ? t("linkedListOperations.deleteTail.complete.stepMessage.circular")
          : t("linkedListOperations.deleteTail.complete.stepMessage.default"),
      stepExplanation:
        working.type === "circular"
          ? t("linkedListOperations.deleteTail.complete.stepExplanation.circular")
          : t("linkedListOperations.deleteTail.complete.stepExplanation.default"),
      codeLine: 25,
      pointers: [pointerAt("tail", prevId)],
      nodeHighlights: { [prevId]: "found" },
      found: true,
    }),
  );

  return steps;
}

export function generateDeleteValueSteps(
  listType: LinkedListType,
  values: number[],
  target: number,
): LinkedListOperationStep[] {
  const t = getAlgorithmT();
  const list = buildListFromValues(values, listType);
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "delete-value",
      t("linkedListOperations.deleteValue.intro.statusDetail", { target }),
      t("linkedListOperations.deleteValue.intro.stepExplanation"),
      26,
    ),
  ];

  if (!list.headId) {
    steps.push(
      createStep(list, {
        phase: "not-found",
        operation: "delete-value",
        statusTitle: t("linkedListOperations.deleteValue.empty.statusTitle"),
        statusDetail: t("linkedListOperations.deleteValue.empty.statusDetail"),
        stepMessage: t("linkedListOperations.deleteValue.empty.stepMessage", {
          target,
        }),
        stepExplanation: t("linkedListOperations.deleteValue.empty.stepExplanation"),
        codeLine: 26,
      }),
    );
    return steps;
  }

  const working = cloneList(list);
  let prevId: string | null = null;
  let currId: string | null = working.headId;
  const traversalLimit = getTraversalLimit(working);

  for (let hop = 0; hop < traversalLimit && currId; hop += 1) {
    if (!working.nodes.has(currId)) {
      break;
    }

    const node = working.nodes.get(currId)!;
    const isMatch = node.value === target;

    steps.push(
      createStep(working, {
        phase: isMatch ? "delete" : "traverse",
        operation: "delete-value",
        statusTitle: isMatch
          ? t("linkedListOperations.deleteValue.match.statusTitle")
          : t("linkedListOperations.deleteValue.scanning.statusTitle"),
        statusDetail: t("linkedListOperations.deleteValue.scanning.statusDetail", {
          value: node.value,
        }),
        stepMessage: isMatch
          ? t("linkedListOperations.deleteValue.match.stepMessage", { target })
          : t("linkedListOperations.deleteValue.scanning.stepMessage"),
        stepExplanation: isMatch
          ? t("linkedListOperations.deleteValue.match.stepExplanation")
          : t("linkedListOperations.deleteValue.scanning.stepExplanation"),
        codeLine: isMatch ? 28 : 27,
        pointers: [
          ...(prevId ? [pointerAt("prev", prevId)] : []),
          pointerAt("curr", currId),
        ],
        nodeHighlights: { [currId]: isMatch ? "deleted" : "comparing" },
        connectionStates:
          prevId && isMatch
            ? {
                [connectionKey(prevId, currId, "next")]: "breaking",
              }
            : node.next
              ? { [connectionKey(currId, node.next, "next")]: "traversing" }
              : {},
      }),
    );

    if (isMatch) {
      const nextId = node.next;
      const deletingCircularSingle =
        working.type === "circular" && isCircularSingleNode(working);

      if (prevId) {
        working.nodes.get(prevId)!.next = nextId;
        if (nextId && working.type === "doubly") {
          working.nodes.get(nextId)!.prev = prevId;
        }
      } else if (deletingCircularSingle) {
        working.headId = null;
      } else {
        working.headId = nextId;
        if (nextId && working.type === "doubly") {
          working.nodes.get(nextId)!.prev = null;
        }
      }

      working.nodes.delete(currId);

      if (working.type === "circular" && working.headId) {
        relinkCircularTailToHead(working);
      }

      steps.push(
        createStep(working, {
          phase: "complete",
          operation: "delete-value",
          statusTitle: t("linkedListOperations.deleteValue.complete.statusTitle"),
          statusDetail: t("linkedListOperations.deleteValue.complete.statusDetail", {
            target,
          }),
          stepMessage: t("linkedListOperations.deleteValue.complete.stepMessage"),
          stepExplanation: t("linkedListOperations.deleteValue.complete.stepExplanation"),
          codeLine: 29,
          pointers: working.headId ? [pointerAt("head", working.headId)] : [],
          found: true,
        }),
      );
      return steps;
    }

    prevId = currId;
    currId = node.next;
    if (list.type === "circular" && currId === working.headId) {
      break;
    }
  }

  steps.push(
    createStep(working, {
      phase: "not-found",
      operation: "delete-value",
      statusTitle: t("linkedListOperations.deleteValue.notFound.statusTitle"),
      statusDetail: t("linkedListOperations.deleteValue.notFound.statusDetail", {
        target,
      }),
      stepMessage: t("linkedListOperations.deleteValue.notFound.stepMessage"),
      stepExplanation: t("linkedListOperations.deleteValue.notFound.stepExplanation"),
      codeLine: 29,
    }),
  );
  return steps;
}

export function generateSearchSteps(
  listType: LinkedListType,
  values: number[],
  target: number,
): LinkedListOperationStep[] {
  const t = getAlgorithmT();
  const list = buildListFromValues(values, listType);
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "search",
      t("linkedListOperations.search.intro.statusDetail", { target }),
      t("linkedListOperations.search.intro.stepExplanation"),
      5,
    ),
  ];

  let currId = list.headId;
  let index = 0;
  const traversalLimit = getTraversalLimit(list);

  for (let hop = 0; hop < traversalLimit && currId; hop += 1) {
    if (!list.nodes.has(currId)) {
      break;
    }

    const node = list.nodes.get(currId)!;
    const isMatch = node.value === target;

    steps.push(
      createStep(list, {
        phase: isMatch ? "complete" : "compare",
        operation: "search",
        statusTitle: isMatch
          ? t("linkedListOperations.search.found.statusTitle")
          : t("linkedListOperations.search.compare.statusTitle", { index }),
        statusDetail: t("linkedListOperations.search.compare.statusDetail", {
          value: node.value,
        }),
        stepMessage: isMatch
          ? t("linkedListOperations.search.found.stepMessage", { index })
          : t("linkedListOperations.search.compare.stepMessage"),
        stepExplanation: isMatch
          ? t("linkedListOperations.search.found.stepExplanation")
          : t("linkedListOperations.search.compare.stepExplanation"),
        codeLine: isMatch ? 7 : 6,
        pointers: [pointerAt("curr", currId)],
        nodeHighlights: { [currId]: isMatch ? "found" : "comparing" },
        connectionStates:
          node.next && !isMatch
            ? { [connectionKey(currId, node.next, "next")]: "traversing" }
            : {},
        found: isMatch,
      }),
    );

    if (isMatch) return steps;

    currId = node.next;
    index += 1;
    if (list.type === "circular" && currId === list.headId) break;
  }

  steps.push(
    createStep(list, {
      phase: "not-found",
      operation: "search",
      statusTitle: t("linkedListOperations.search.notFound.statusTitle"),
      statusDetail: t("linkedListOperations.search.notFound.statusDetail", {
        target,
      }),
      stepMessage: t("linkedListOperations.search.notFound.stepMessage"),
      stepExplanation: t("linkedListOperations.search.notFound.stepExplanation"),
      codeLine: 7,
    }),
  );
  return steps;
}

export function generateReverseSteps(
  listType: LinkedListType,
  values: number[],
): LinkedListOperationStep[] {
  const list = buildListFromValues(values, listType);
  const displayOrder = getOrderedNodeIds(list);

  const t = getAlgorithmT();

  if (!list.headId || displayOrder.length <= 1) {
    return [
      introStep(
        list,
        "reverse",
        t("linkedListOperations.reverse.intro.statusDetail.trivial"),
        t("linkedListOperations.reverse.intro.stepExplanation.trivial"),
        30,
      ),
      createStep(list, {
        phase: "complete",
        operation: "reverse",
        statusTitle: t("linkedListOperations.reverse.trivialComplete.statusTitle"),
        statusDetail: t("linkedListOperations.reverse.trivialComplete.statusDetail"),
        stepMessage: t("linkedListOperations.reverse.trivialComplete.stepMessage"),
        stepExplanation: t("linkedListOperations.reverse.trivialComplete.stepExplanation"),
        codeLine: 30,
        found: true,
      }),
    ];
  }

  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "reverse",
      t("linkedListOperations.reverse.intro.statusDetail.default"),
      t("linkedListOperations.reverse.intro.stepExplanation.default"),
      30,
    ),
  ];

  const working = cloneList(list);
  let prevId: string | null = null;
  let currId = working.headId;
  let stepIndex = 0;
  const traversalLimit = getTraversalLimit(working);

  for (let hop = 0; hop < traversalLimit && currId; hop += 1) {
    if (!working.nodes.has(currId)) {
      break;
    }

    const node = working.nodes.get(currId)!;
    const nextId = node.next;
    const forwardKey = nextId ? connectionKey(currId, nextId, "next") : "";
    const reversedKey = prevId ? connectionKey(currId, prevId, "next") : "";

    steps.push(
      createStep(working, {
        phase: "relink",
        operation: "reverse",
        displayOrder,
        statusTitle: t("linkedListOperations.reverse.breakLink.statusTitle", {
          step: stepIndex + 1,
        }),
        statusDetail: prevId
          ? t("linkedListOperations.reverse.breakLink.statusDetail.withPrev", {
              value: node.value,
            })
          : t("linkedListOperations.reverse.breakLink.statusDetail.head"),
        stepMessage: t("linkedListOperations.reverse.breakLink.stepMessage", {
          value: node.value,
        }),
        stepExplanation: t("linkedListOperations.reverse.breakLink.stepExplanation"),
        codeLine: 31,
        pointers: [
          ...(prevId ? [pointerAt("prev", prevId)] : []),
          pointerAt("curr", currId),
          ...(nextId ? [pointerAt("temp", nextId)] : []),
        ],
        nodeHighlights: {
          [currId]: "active",
          ...(prevId ? { [prevId]: "accessed" } : {}),
        },
        connectionStates: {
          ...(forwardKey ? { [forwardKey]: "breaking" } : {}),
        },
        nodePortOverrides: {
          [currId]: { nextIsNull: true },
        },
      }),
    );

    node.next = prevId;
    if (working.type === "doubly") {
      node.prev = nextId;
      if (nextId) {
        working.nodes.get(nextId)!.prev = currId;
      }
    }

    steps.push(
      createStep(working, {
        phase: "relink",
        operation: "reverse",
        displayOrder,
        statusTitle: t("linkedListOperations.reverse.relink.statusTitle", {
          step: stepIndex + 1,
          value: node.value,
        }),
        statusDetail: prevId
          ? t("linkedListOperations.reverse.relink.statusDetail.withPrev", {
              prevValue: working.nodes.get(prevId)!.value,
            })
          : t("linkedListOperations.reverse.relink.statusDetail.head"),
        stepMessage: t("linkedListOperations.reverse.relink.stepMessage"),
        stepExplanation: t("linkedListOperations.reverse.relink.stepExplanation"),
        codeLine: 32,
        pointers: [
          ...(prevId ? [pointerAt("prev", prevId)] : []),
          pointerAt("curr", currId),
          ...(nextId ? [pointerAt("temp", nextId)] : []),
        ],
        nodeHighlights: {
          [currId]: "inserted",
          ...(prevId ? { [prevId]: "accessed" } : {}),
        },
        connectionStates: {
          ...(reversedKey ? { [reversedKey]: "relinking" } : {}),
        },
      }),
    );

    prevId = currId;
    currId = nextId;
    stepIndex += 1;

    if (list.type === "circular" && currId === list.headId) {
      break;
    }
  }

  working.headId = prevId;

  if (working.type === "circular" && working.headId) {
    relinkCircularTailToHead(working);
  }

  const reversedDisplayOrder = [...displayOrder].reverse();
  const circularCompletePortOverrides =
    working.type === "circular"
      ? Object.fromEntries(
          reversedDisplayOrder.map((id) => [id, { nextIsNull: false }]),
        )
      : undefined;

  steps.push(
    createStep(working, {
      phase: "complete",
      operation: "reverse",
      displayOrder: reversedDisplayOrder,
      statusTitle: t("linkedListOperations.reverse.complete.statusTitle"),
      statusDetail:
        working.type === "circular"
          ? t("linkedListOperations.reverse.complete.statusDetail.circular")
          : t("linkedListOperations.reverse.complete.statusDetail.default"),
      stepMessage:
        working.type === "circular"
          ? t("linkedListOperations.reverse.complete.stepMessage.circular")
          : t("linkedListOperations.reverse.complete.stepMessage.default"),
      stepExplanation:
        working.type === "circular"
          ? t("linkedListOperations.reverse.complete.stepExplanation.circular")
          : t("linkedListOperations.reverse.complete.stepExplanation.default"),
      codeLine: 33,
      pointers: working.headId ? [pointerAt("head", working.headId)] : [],
      nodeHighlights: working.headId ? { [working.headId]: "found" } : {},
      nodePortOverrides: circularCompletePortOverrides,
      found: true,
    }),
  );

  return steps;
}

export function buildLinkedListDisplayState(
  listType: LinkedListType,
  values: number[],
): Pick<
  LinkedListOperationStep,
  "listType" | "nodes" | "connections" | "pointers"
> {
  const list = buildListFromValues(values, listType);
  return {
    listType,
    nodes: buildNodes(list),
    connections: buildConnections(list),
    pointers: list.headId ? [{ id: "head", nodeId: list.headId }] : [],
  };
}

export function generateLinkedListOperationSteps(
  listType: LinkedListType,
  operation: LinkedListOperationId,
  values: number[],
  params: LinkedListOperationParams,
): LinkedListOperationStep[] {
  switch (operation) {
    case "insert-at-head":
      return generateInsertAtHeadSteps(listType, values, params.value);
    case "insert-at-tail":
      return generateInsertAtTailSteps(listType, values, params.value);
    case "insert-at-index":
      return generateInsertAtIndexSteps(
        listType,
        values,
        params.index,
        params.value,
      );
    case "delete-head":
      return generateDeleteHeadSteps(listType, values);
    case "delete-tail":
      return generateDeleteTailSteps(listType, values);
    case "delete-value":
      return generateDeleteValueSteps(listType, values, params.searchTarget);
    case "search":
      return generateSearchSteps(listType, values, params.searchTarget);
    case "reverse":
      return generateReverseSteps(listType, values);
    default:
      return [];
  }
}

export function operationNeedsIndexInput(operation: LinkedListOperationId): boolean {
  return operation === "insert-at-index";
}

export function operationNeedsValueInput(operation: LinkedListOperationId): boolean {
  return (
    operation === "insert-at-head" ||
    operation === "insert-at-tail" ||
    operation === "insert-at-index"
  );
}

export function operationNeedsSearchTarget(operation: LinkedListOperationId): boolean {
  return operation === "search" || operation === "delete-value";
}

export function getDefaultOperationIndex(valuesLength: number): number {
  return Math.floor(valuesLength / 2);
}

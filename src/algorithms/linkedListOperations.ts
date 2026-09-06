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
  const labels: Record<LinkedListOperationId, string> = {
    "insert-at-head": "Insert at Head",
    "insert-at-tail": "Insert at Tail",
    "insert-at-index": "Insert at Index",
    "delete-head": "Delete Head",
    "delete-tail": "Delete Tail",
    "delete-value": "Delete by Value",
    search: "Search",
    reverse: "Reverse",
  };
  return labels[operation];
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
  const list = buildListFromValues(values, listType);
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "insert-at-head",
      `Insert ${value} before the current head.`,
      "Creating a new node and pointing it to the former head takes O(1) time.",
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
      statusTitle: "Allocate new node",
      statusDetail: `Created node(${value}) in memory.`,
      stepMessage: `New node (${value}) sits inline before the current head — not linked yet.`,
      stepExplanation: "Node allocation is O(1). Pointers are assigned in the next step.",
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
        statusTitle: "Link new node",
        statusDetail: `node.next = formerHead`,
        stepMessage: `Connect ${value} → ${working.nodes.get(formerHeadId)!.value}.`,
        stepExplanation: "The new node points to the previous head. Head pointer updates next.",
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
      statusTitle: "Update head pointer",
      statusDetail: "Head pointer updated. Operation finished in O(1).",
      stepMessage: `${value} is now the head of the list.`,
      stepExplanation: "Head insertion is constant time for all three list variants.",
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
  const list = buildListFromValues(values, listType);
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "insert-at-tail",
      `Append ${value} after the current tail.`,
      listType === "circular"
        ? "Tail pointer gives O(1) access — append, then reconnect tail.next to head."
        : "An explicit tail pointer makes append O(1) without walking from head.",
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
      statusTitle: "Allocate new node",
      statusDetail: `Created node(${value}) in memory.`,
      stepMessage: `New node (${value}) sits inline to the right of the tail — not linked yet.`,
      stepExplanation: "Node allocation is O(1). The tail pointer targets the current last node directly.",
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
      statusTitle: "Link new node",
      statusDetail: `tail.next = newNode`,
      stepMessage: `Connect ${working.nodes.get(tailId)!.value} → ${value}.`,
      stepExplanation: "Only the tail's next pointer changes — still O(1), no traversal.",
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
      statusTitle: "Update tail pointer",
      statusDetail: "Tail pointer now references the new last node.",
      stepMessage:
        listType === "circular"
          ? `${value} is the new tail — next reconnects to head.`
          : `${value} is the new tail — next is null.`,
      stepExplanation:
        listType === "circular"
          ? "Circular lists set newTail.next = head after advancing the tail pointer."
          : "null on the new tail's next port marks the end of the list.",
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

  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "insert-at-index",
      `Insert ${value} at index ${index}.`,
      "Walk to the node before the insertion point, then relink pointers.",
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
    steps.push(
      createStep(working, {
        phase: "traverse",
        operation: "insert-at-index",
        statusTitle: isPredecessor
          ? `Reach predecessor at index ${i}`
          : `Traverse to index ${i}`,
        statusDetail: `curr at node with value ${working.nodes.get(nodeId)!.value}.`,
        stepMessage: "Advance until the insertion gap is found.",
        stepExplanation: "Insertion at index i requires i pointer hops from the head.",
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
      statusTitle: "Splice new node",
      statusDetail: "prev.next = newNode; newNode.next = next",
      stepMessage: `Inserted ${value} between ${working.nodes.get(prevId)!.value} and the successor.`,
      stepExplanation: "Two or three pointer updates splice the node in O(1) after traversal.",
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
      statusTitle: "Insert complete",
      statusDetail: `Value ${value} now sits at index ${index}.`,
      stepMessage: "Middle insertion finished.",
      stepExplanation: "Overall time is O(n) due to traversal to the index.",
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
  const list = buildListFromValues(values, listType);
  if (!list.headId) {
    return [
      createStep(list, {
        phase: "not-found",
        operation: "delete-head",
        statusTitle: "List is empty",
        statusDetail: "Nothing to delete.",
        stepMessage: "Head deletion requires at least one node.",
        stepExplanation: "Guard against empty lists before deleting the head.",
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
      `Remove head node (${headValue}).`,
      "Advance head to head.next and discard the old node.",
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
      statusTitle: "Unlink head",
      statusDetail:
        isCircularSingle
          ? "Break the self-loop — head and tail become null."
          : "head = head.next",
      stepMessage: isCircularSingle
        ? `Breaking the circular self-link on ${headValue}.`
        : `Breaking link from ${headValue} to the successor.`,
      stepExplanation:
        working.type === "circular"
          ? isCircularSingle
            ? "A one-node circular list clears both head and tail when the loop breaks."
            : "Advance head first, then reconnect tail.next to the new head."
          : "Head deletion is O(1) once the next pointer is read.",
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
            statusTitle: "Relink tail → head",
            statusDetail: "tail.next must target the new head in a circular list.",
            stepMessage: `Point tail (${working.nodes.get(tailId)!.value}) to new head (${working.nodes.get(working.headId)!.value}).`,
            stepExplanation:
              "Without this update, tail.next would still reference the removed head node.",
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
      statusTitle: "Delete complete",
      statusDetail: isCircularSingle
        ? `Removed ${headValue}. List is now empty.`
        : `Removed ${headValue}. Head advanced in O(1).`,
      stepMessage:
        isCircularSingle
          ? "Head and tail are null — circular list cleared."
          : working.type === "circular"
            ? "Head advanced and tail.next points to the new head."
            : working.type === "doubly" && working.headId
              ? "New head prev is null — forward link intact."
              : "Head advanced to the next node.",
      stepExplanation:
        isCircularSingle
          ? "Single-node circular lists require clearing both entry points."
          : working.type === "circular"
            ? "Tail.next must follow the head pointer after every head removal."
            : working.type === "doubly"
              ? "Doubly lists also clear the new head's prev pointer to null."
              : "Only pointer updates — no traversal required.",
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
  const ordered = getOrderedNodeIds(list);
  const tailId = ordered[ordered.length - 1]!;
  const prevId = list.nodes.get(tailId)!.prev;

  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "delete-tail",
      "Remove the last node using tail.prev — O(1).",
      "Doubly linked lists expose the predecessor directly from the tail node.",
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
      statusTitle: "Access tail and predecessor",
      statusDetail: `tail.prev points to ${working.nodes.get(prevId)!.value}.`,
      stepMessage: "No traversal needed — jump to tail and follow prev in O(1).",
      stepExplanation:
        "Doubly linked lists store a prev pointer on each node, enabling O(1) tail deletion.",
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
      statusTitle: "Break tail link",
      statusDetail: "Set penultimate.next = null.",
      stepMessage: `Unlink ${working.nodes.get(tailId)!.value} — penultimate.next becomes null.`,
      stepExplanation: "The predecessor's next port shows null as the tail node is detached.",
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
      statusTitle: "Delete complete",
      statusDetail: "Tail removed in O(1) time.",
      stepMessage: "Penultimate.next is null — tail node freed.",
      stepExplanation: "Doubly linked tail deletion avoids the O(n) walk required in singly lists.",
      codeLine: 25,
      pointers: [pointerAt("tail", prevId)],
      nodeHighlights: { [prevId]: "found" },
      found: true,
    }),
  );

  return steps;
}

function generateDeleteTailSinglySteps(list: InternalList): LinkedListOperationStep[] {
  const ordered = getOrderedNodeIds(list);
  const tailId = ordered[ordered.length - 1]!;
  const prevId = ordered[ordered.length - 2]!;

  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "delete-tail",
      list.type === "circular"
        ? "Remove the last node in the circular chain."
        : "Remove the last node in the chain.",
      "Singly linked lists must walk from head to the penultimate node — O(n) time.",
      22,
    ),
  ];

  const working = cloneList(list);

  for (let index = 0; index < ordered.length - 1; index += 1) {
    const nodeId = ordered[index]!;
    const nextId = working.nodes.get(nodeId)!.next!;
    const isPenultimate = index === ordered.length - 2;

    steps.push(
      createStep(working, {
        phase: isPenultimate ? "compare" : "traverse",
        operation: "delete-tail",
        statusTitle: isPenultimate ? "Penultimate node reached" : "Walk from head",
        statusDetail: isPenultimate
          ? `Node ${working.nodes.get(nodeId)!.value} is before the tail.`
          : `curr at node ${working.nodes.get(nodeId)!.value}.`,
        stepMessage: isPenultimate
          ? "Stop here — this is the node whose next pointer must be updated."
          : "Advance curr toward the tail one node at a time.",
        stepExplanation: isPenultimate
          ? "Singly lists cannot delete the tail in O(1) without a tail pointer and backward links."
          : "Each hop costs O(1), but finding the penultimate node requires O(n) hops.",
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

  steps.push(
    createStep(working, {
      phase: "delete",
      operation: "delete-tail",
      statusTitle: "Break tail link",
      statusDetail: `Set penultimate.next = ${working.type === "circular" ? "head" : "null"}.`,
      stepMessage:
        working.type === "circular"
          ? `Unlink ${working.nodes.get(tailId)!.value} — penultimate.next points to head.`
          : `Unlink ${working.nodes.get(tailId)!.value} — penultimate.next becomes null.`,
      stepExplanation:
        working.type === "circular"
          ? "Circular singly lists reconnect the penultimate node to head instead of null."
          : "The last node is removed when its predecessor's next pointer becomes null.",
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
      statusTitle: "Delete complete",
      statusDetail: "Tail removed and predecessor relinked.",
      stepMessage:
        working.type === "circular"
          ? "Penultimate now points to head — tail node freed."
          : "Penultimate.next is null — tail node freed.",
      stepExplanation:
        working.type === "circular"
          ? "Circular lists reconnect the penultimate node to head."
          : "null on the penultimate next port marks the new list termination.",
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
  const list = buildListFromValues(values, listType);
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "delete-value",
      `Delete the first node with value ${target}.`,
      "Traverse while tracking prev to splice out the matching node.",
      26,
    ),
  ];

  if (!list.headId) {
    steps.push(
      createStep(list, {
        phase: "not-found",
        operation: "delete-value",
        statusTitle: "Value not found",
        statusDetail: "Empty list.",
        stepMessage: `Cannot delete ${target} from an empty list.`,
        stepExplanation: "Search and delete require at least one node.",
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
        statusTitle: isMatch ? "Match found" : "Scanning nodes",
        statusDetail: `curr.value = ${node.value}`,
        stepMessage: isMatch
          ? `Splice out node with value ${target}.`
          : "Advance curr (and prev) until the target appears.",
        stepExplanation: isMatch
          ? "Rewire prev.next to skip the deleted node."
          : "Deletion by value requires O(n) search in the worst case.",
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
          statusTitle: "Delete complete",
          statusDetail: `Removed first occurrence of ${target}.`,
          stepMessage: "Pointers rewired around the deleted node.",
          stepExplanation: "Time is O(n) for search plus O(1) splice.",
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
      statusTitle: "Value not found",
      statusDetail: `No node stores ${target}.`,
      stepMessage: "Traversal finished without a match.",
      stepExplanation: "Every node was inspected — target absent.",
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
  const list = buildListFromValues(values, listType);
  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "search",
      `Search for value ${target}.`,
      "Walk node by node — there is no random access by index.",
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
        statusTitle: isMatch ? "Target found" : `Compare at node ${index}`,
        statusDetail: `curr.value = ${node.value}`,
        stepMessage: isMatch
          ? `Match at node index ${index}.`
          : "Advance curr along next pointers.",
        stepExplanation: isMatch
          ? "Search stops at the first matching node."
          : "Linear scan — O(n) worst case.",
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
      statusTitle: "Target not found",
      statusDetail: `${target} is not in the list.`,
      stepMessage: "Every node was visited.",
      stepExplanation: "Search cost is O(n) when the value is absent.",
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

  if (!list.headId || displayOrder.length <= 1) {
    return [
      introStep(
        list,
        "reverse",
        "Reverse pointer direction for every node.",
        "Lists with zero or one node are already reversed.",
        30,
      ),
      createStep(list, {
        phase: "complete",
        operation: "reverse",
        statusTitle: "Nothing to reverse",
        statusDetail: "List unchanged.",
        stepMessage: "Reversal complete trivially.",
        stepExplanation: "Iterate only when at least two nodes exist.",
        codeLine: 30,
        found: true,
      }),
    ];
  }

  const steps: LinkedListOperationStep[] = [
    introStep(
      list,
      "reverse",
      "Reverse the linked list in place.",
      "Track prev, curr, and temp while flipping each next pointer one node at a time.",
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
        statusTitle: `Step ${stepIndex + 1}: break curr → next`,
        statusDetail: prevId
          ? `Disconnect ${node.value} from its successor — next becomes null.`
          : "Disconnect head from its successor — next becomes null.",
        stepMessage: `curr at ${node.value}. The forward link is severed before relinking to prev.`,
        stepExplanation:
          "Explicit null marks termination while the old forward edge breaks.",
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
        statusTitle: `Step ${stepIndex + 1}: relink ${node.value} backward`,
        statusDetail: prevId
          ? `curr.next now targets ${working.nodes.get(prevId)!.value}.`
          : "Head now points to null — former first link reversed.",
        stepMessage: "Forward edge removed; backward edge established.",
        stepExplanation: "Advance prev ← curr and curr ← temp after each flip.",
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
      statusTitle: "Reverse complete",
      statusDetail:
        working.type === "circular"
          ? "Visual order flipped — head → successor and tail → head restored."
          : "Visual order flipped — new head at the start.",
      stepMessage:
        working.type === "circular"
          ? "Every node links forward; the tail closes the loop back to head."
          : "Nodes reorder left-to-right to match the reversed pointer chain.",
      stepExplanation:
        working.type === "circular"
          ? "Circular lists never terminate in null — tail.next must target the new head."
          : "The old tail becomes head; the grid now reflects natural traversal order.",
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

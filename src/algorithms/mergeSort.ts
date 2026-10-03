import { getAlgorithmT } from "../i18n/index";
import type { SortBarHighlight } from "../types/visualizer";
import { generateRandomArray } from "../utils/randomArray";

export const MERGE_SORT_MIN_SIZE = 4;
export const MERGE_SORT_MAX_SIZE = 20;
export const MERGE_SORT_DEFAULT_SIZE = 8;

export type MergeSortPhase =
  | "ready"
  | "divide"
  | "base-case"
  | "merge-start"
  | "merge-compare"
  | "merge-copy"
  | "merge-complete"
  | "complete";

export interface MergeSortTreeNode {
  id: string;
  low: number;
  high: number;
  values: number[];
  cellHighlights: SortBarHighlight[];
  nodeHighlight: "default" | "active" | "merged";
}

export interface MergeSortTreeLink {
  fromId: string;
  toId: string;
}

export interface MergeSortStep {
  phase: MergeSortPhase;
  nodes: MergeSortTreeNode[];
  links: MergeSortTreeLink[];
  activeNodeId: string | null;
  compareLeftNodeId: string | null;
  compareLeftIndex: number | null;
  compareRightNodeId: string | null;
  compareRightIndex: number | null;
  comparisons: number;
  merges: number;
  activeLine: number;
  statusTitle: string;
  statusDetail: string;
  stepExplanation: string;
  isComplete?: boolean;
}

function rangeId(low: number, high: number): string {
  return `${low}-${high}`;
}

function defaultHighlights(length: number): SortBarHighlight[] {
  return Array.from({ length }, () => "default");
}

function cloneNodes(nodes: Map<string, MergeSortTreeNode>): MergeSortTreeNode[] {
  return [...nodes.values()].map((node) => ({
    ...node,
    values: [...node.values],
    cellHighlights: [...node.cellHighlights],
  }));
}

function cloneLinks(links: MergeSortTreeLink[]): MergeSortTreeLink[] {
  return links.map((link) => ({ ...link }));
}

function buildLinks(nodes: Map<string, MergeSortTreeNode>): MergeSortTreeLink[] {
  const links: MergeSortTreeLink[] = [];

  for (const node of nodes.values()) {
    if (node.low === node.high) {
      continue;
    }

    const mid = Math.floor((node.low + node.high) / 2);
    const leftId = rangeId(node.low, mid);
    const rightId = rangeId(mid + 1, node.high);

    if (!nodes.has(leftId) || !nodes.has(rightId)) {
      continue;
    }

    links.push(
      { fromId: node.id, toId: leftId },
      { fromId: node.id, toId: rightId },
    );
  }

  return links;
}

export function generateUnsortedArray(size: number): number[] {
  return generateRandomArray(size);
}

function applyAllNodesSorted(nodes: Map<string, MergeSortTreeNode>): void {
  for (const node of nodes.values()) {
    node.nodeHighlight = "merged";
    node.cellHighlights = node.values.map(() => "sorted");
  }
}

export function generateMergeSortSteps(input: number[]): MergeSortStep[] {
  const t = getAlgorithmT();
  const n = input.length;
  const steps: MergeSortStep[] = [];
  const work = [...input];
  const nodes = new Map<string, MergeSortTreeNode>();
  let comparisons = 0;
  let merges = 0;

  const pushStep = (
    partial: Omit<
      MergeSortStep,
      | "nodes"
      | "links"
      | "comparisons"
      | "merges"
      | "statusTitle"
      | "statusDetail"
      | "stepExplanation"
    > & {
      statusTitle: string;
      statusDetail: string;
      stepExplanation: string;
    },
  ) => {
    steps.push({
      ...partial,
      nodes: cloneNodes(nodes),
      links: cloneLinks(buildLinks(nodes)),
      comparisons,
      merges,
    });
  };

  nodes.set(rangeId(0, n - 1), {
    id: rangeId(0, n - 1),
    low: 0,
    high: n - 1,
    values: [...input],
    cellHighlights: defaultHighlights(n),
    nodeHighlight: "default",
  });

  pushStep({
    phase: "ready",
    activeNodeId: rangeId(0, n - 1),
    compareLeftNodeId: null,
    compareLeftIndex: null,
    compareRightNodeId: null,
    compareRightIndex: null,
    activeLine: 1,
    statusTitle: t("mergeSort.ready.statusTitle"),
    statusDetail: t("mergeSort.ready.statusDetail", { n }),
    stepExplanation: t("mergeSort.ready.stepExplanation", { n }),
  });

  if (n <= 1) {
    applyAllNodesSorted(nodes);
    pushStep({
      phase: "complete",
      activeNodeId: null,
      compareLeftNodeId: null,
      compareLeftIndex: null,
      compareRightNodeId: null,
      compareRightIndex: null,
      activeLine: 3,
      isComplete: true,
      statusTitle: t("mergeSort.complete.statusTitle"),
      statusDetail: t("mergeSort.complete.statusDetail"),
      stepExplanation: t("mergeSort.complete.stepExplanation"),
    });
    return steps;
  }

  const divide = (low: number, high: number) => {
    if (low >= high) {
      const id = rangeId(low, high);
      const leaf = nodes.get(id);
      if (leaf) {
        leaf.nodeHighlight = "merged";
        leaf.cellHighlights = leaf.values.map(() => "sorted");
      }

      pushStep({
        phase: "base-case",
        activeNodeId: id,
        compareLeftNodeId: null,
        compareLeftIndex: null,
        compareRightNodeId: null,
        compareRightIndex: null,
        activeLine: 3,
        statusTitle: t("mergeSort.baseCase.statusTitle"),
        statusDetail: t("mergeSort.baseCase.statusDetail", { low, high }),
        stepExplanation: t("mergeSort.baseCase.stepExplanation", { index: low }),
      });
      return;
    }

    const mid = Math.floor((low + high) / 2);
    const parentId = rangeId(low, high);
    const leftId = rangeId(low, mid);
    const rightId = rangeId(mid + 1, high);
    const parent = nodes.get(parentId);

    if (parent) {
      parent.nodeHighlight = "active";
      parent.cellHighlights = defaultHighlights(parent.values.length);
    }

    nodes.set(leftId, {
      id: leftId,
      low,
      high: mid,
      values: work.slice(low, mid + 1),
      cellHighlights: defaultHighlights(mid - low + 1),
      nodeHighlight: "default",
    });

    nodes.set(rightId, {
      id: rightId,
      low: mid + 1,
      high,
      values: work.slice(mid + 1, high + 1),
      cellHighlights: defaultHighlights(high - mid),
      nodeHighlight: "default",
    });

    pushStep({
      phase: "divide",
      activeNodeId: parentId,
      compareLeftNodeId: null,
      compareLeftIndex: null,
      compareRightNodeId: null,
      compareRightIndex: null,
      activeLine: 5,
      statusTitle: t("mergeSort.divide.statusTitle"),
      statusDetail: t("mergeSort.divide.statusDetail", {
        low,
        high,
        mid,
        leftRange: `[${low}..${mid}]`,
        rightRange: `[${mid + 1}..${high}]`,
      }),
      stepExplanation: t("mergeSort.divide.stepExplanation", {
        low,
        high,
        mid,
      }),
    });

    divide(low, mid);
    divide(mid + 1, high);
    merge(low, high, mid);
  };

  const merge = (low: number, high: number, mid: number) => {
    merges += 1;
    const parentId = rangeId(low, high);
    const leftId = rangeId(low, mid);
    const rightId = rangeId(mid + 1, high);
    const parent = nodes.get(parentId);
    const leftNode = nodes.get(leftId);
    const rightNode = nodes.get(rightId);

    if (!parent || !leftNode || !rightNode) {
      return;
    }

    parent.nodeHighlight = "active";
    parent.cellHighlights = defaultHighlights(parent.values.length);

    let leftIndex = 0;
    let rightIndex = 0;
    let writeIndex = low;

    pushStep({
      phase: "merge-start",
      activeNodeId: parentId,
      compareLeftNodeId: leftId,
      compareLeftIndex: 0,
      compareRightNodeId: rightId,
      compareRightIndex: 0,
      activeLine: 9,
      statusTitle: t("mergeSort.mergeStart.statusTitle"),
      statusDetail: t("mergeSort.mergeStart.statusDetail", {
        low,
        high,
      }),
      stepExplanation: t("mergeSort.mergeStart.stepExplanation", {
        low,
        high,
      }),
    });

    while (leftIndex < leftNode.values.length && rightIndex < rightNode.values.length) {
      comparisons += 1;
      const leftValue = leftNode.values[leftIndex]!;
      const rightValue = rightNode.values[rightIndex]!;

      leftNode.cellHighlights = leftNode.values.map((_, index) =>
        index === leftIndex ? "comparing" : index < leftIndex ? "sorted" : "default",
      );
      rightNode.cellHighlights = rightNode.values.map((_, index) =>
        index === rightIndex ? "comparing" : index < rightIndex ? "sorted" : "default",
      );
      parent.values = work.slice(low, high + 1);
      parent.cellHighlights = parent.values.map((_, index) => {
        const globalIndex = low + index;
        return globalIndex < writeIndex ? "sorted" : "default";
      });

      pushStep({
        phase: "merge-compare",
        activeNodeId: parentId,
        compareLeftNodeId: leftId,
        compareLeftIndex: leftIndex,
        compareRightNodeId: rightId,
        compareRightIndex: rightIndex,
        activeLine: 13,
        statusTitle: t("mergeSort.mergeCompare.statusTitle"),
        statusDetail: t("mergeSort.mergeCompare.statusDetail", {
          leftValue,
          rightValue,
        }),
        stepExplanation: t("mergeSort.mergeCompare.stepExplanation", {
          leftValue,
          rightValue,
        }),
      });

      const takeLeft = leftValue <= rightValue;
      const chosen = takeLeft ? leftValue : rightValue;

      if (takeLeft) {
        leftIndex += 1;
      } else {
        rightIndex += 1;
      }

      work[writeIndex] = chosen;
      writeIndex += 1;
      parent.values = work.slice(low, high + 1);
      parent.cellHighlights = parent.values.map((_, index) => {
        const globalIndex = low + index;
        return globalIndex < writeIndex ? "sorted" : "default";
      });

      pushStep({
        phase: "merge-copy",
        activeNodeId: parentId,
        compareLeftNodeId: takeLeft ? leftId : rightId,
        compareLeftIndex: takeLeft ? leftIndex - 1 : rightIndex - 1,
        compareRightNodeId: null,
        compareRightIndex: null,
        activeLine: takeLeft ? 14 : 16,
        statusTitle: t("mergeSort.mergeCopy.statusTitle", { value: chosen }),
        statusDetail: t("mergeSort.mergeCopy.statusDetail", {
          value: chosen,
          position: writeIndex - 1,
        }),
        stepExplanation: t("mergeSort.mergeCopy.stepExplanation", {
          value: chosen,
          position: writeIndex - 1,
        }),
      });

      leftNode.cellHighlights = leftNode.values.map((_, index) =>
        index < leftIndex ? "sorted" : "default",
      );
      rightNode.cellHighlights = rightNode.values.map((_, index) =>
        index < rightIndex ? "sorted" : "default",
      );
    }

    while (leftIndex < leftNode.values.length) {
      const value = leftNode.values[leftIndex]!;
      work[writeIndex] = value;
      writeIndex += 1;
      leftIndex += 1;
      parent.values = work.slice(low, high + 1);
      parent.cellHighlights = parent.values.map((_, index) => {
        const globalIndex = low + index;
        return globalIndex < writeIndex ? "sorted" : "default";
      });

      pushStep({
        phase: "merge-copy",
        activeNodeId: parentId,
        compareLeftNodeId: leftId,
        compareLeftIndex: leftIndex - 1,
        compareRightNodeId: null,
        compareRightIndex: null,
        activeLine: 14,
        statusTitle: t("mergeSort.mergeCopy.statusTitle", { value }),
        statusDetail: t("mergeSort.mergeCopy.statusDetail", {
          value,
          position: writeIndex - 1,
        }),
        stepExplanation: t("mergeSort.mergeCopy.stepExplanation", {
          value,
          position: writeIndex - 1,
        }),
      });

      leftNode.cellHighlights = leftNode.values.map((_, index) =>
        index < leftIndex ? "sorted" : "default",
      );
    }

    while (rightIndex < rightNode.values.length) {
      const value = rightNode.values[rightIndex]!;
      work[writeIndex] = value;
      writeIndex += 1;
      rightIndex += 1;
      parent.values = work.slice(low, high + 1);
      parent.cellHighlights = parent.values.map((_, index) => {
        const globalIndex = low + index;
        return globalIndex < writeIndex ? "sorted" : "default";
      });

      pushStep({
        phase: "merge-copy",
        activeNodeId: parentId,
        compareLeftNodeId: rightId,
        compareLeftIndex: rightIndex - 1,
        compareRightNodeId: null,
        compareRightIndex: null,
        activeLine: 16,
        statusTitle: t("mergeSort.mergeCopy.statusTitle", { value }),
        statusDetail: t("mergeSort.mergeCopy.statusDetail", {
          value,
          position: writeIndex - 1,
        }),
        stepExplanation: t("mergeSort.mergeCopy.stepExplanation", {
          value,
          position: writeIndex - 1,
        }),
      });

      rightNode.cellHighlights = rightNode.values.map((_, index) =>
        index < rightIndex ? "sorted" : "default",
      );
    }

    parent.values = work.slice(low, high + 1);
    parent.nodeHighlight = "merged";
    parent.cellHighlights = parent.values.map(() => "sorted");
    leftNode.nodeHighlight = "merged";
    leftNode.cellHighlights = leftNode.values.map(() => "sorted");
    rightNode.nodeHighlight = "merged";
    rightNode.cellHighlights = rightNode.values.map(() => "sorted");

    pushStep({
      phase: "merge-complete",
      activeNodeId: parentId,
      compareLeftNodeId: null,
      compareLeftIndex: null,
      compareRightNodeId: null,
      compareRightIndex: null,
      activeLine: 17,
      statusTitle: t("mergeSort.mergeComplete.statusTitle"),
      statusDetail: t("mergeSort.mergeComplete.statusDetail", { low, high }),
      stepExplanation: t("mergeSort.mergeComplete.stepExplanation", {
        low,
        high,
      }),
    });
  };

  divide(0, n - 1);

  applyAllNodesSorted(nodes);

  pushStep({
    phase: "complete",
    activeNodeId: null,
    compareLeftNodeId: null,
    compareLeftIndex: null,
    compareRightNodeId: null,
    compareRightIndex: null,
    activeLine: 17,
    isComplete: true,
    statusTitle: t("mergeSort.complete.statusTitle"),
    statusDetail: t("mergeSort.complete.statusDetail"),
    stepExplanation: t("mergeSort.complete.stepExplanation"),
  });

  return steps;
}

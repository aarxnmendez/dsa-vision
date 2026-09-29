import { getAlgorithmT } from "../i18n/index";

export type SequentialSearchPhase =
  | "intro"
  | "compare"
  | "found"
  | "not-found"
  | "complete";

export interface SequentialSearchStep {
  phase: SequentialSearchPhase;
  index: number | null;
  target: number;
  arrayValue: number | null;
  found: boolean;
  statusTitle: string;
  statusDetail: string;
  pointerMovement?: string;
  stepExplanation: string;
  codeLine: number;
}

function createStep(
  partial: Omit<SequentialSearchStep, "found"> & { found?: boolean },
): SequentialSearchStep {
  return { found: false, ...partial };
}

export function sequentialSearch(
  array: number[],
  target: number,
): SequentialSearchStep[] {
  const t = getAlgorithmT();
  const steps: SequentialSearchStep[] = [];

  steps.push(
    createStep({
      phase: "intro",
      index: null,
      target,
      arrayValue: null,
      statusTitle: t("sequentialSearch.intro.statusTitle", { target }),
      statusDetail: t("sequentialSearch.intro.statusDetail", {
        target,
        length: array.length,
      }),
      stepExplanation: t("sequentialSearch.intro.stepExplanation", { target }),
      codeLine: 2,
    }),
  );

  if (array.length === 0) {
    steps.push(
      createStep({
        phase: "not-found",
        index: null,
        target,
        arrayValue: null,
        statusTitle: t("sequentialSearch.notFound.statusTitle", { target }),
        statusDetail: t("sequentialSearch.notFound.statusDetail", { target }),
        stepExplanation: t("sequentialSearch.notFound.stepExplanation", {
          target,
        }),
        codeLine: 5,
      }),
    );
    return steps;
  }

  for (let index = 0; index < array.length; index += 1) {
    const arrayValue = array[index];
    const isMatch = arrayValue === target;

    steps.push(
      createStep({
        phase: "compare",
        index,
        target,
        arrayValue,
        statusTitle: t("sequentialSearch.compare.statusTitle", {
          index,
          arrayValue,
          target,
        }),
        statusDetail: isMatch
          ? t("sequentialSearch.compare.statusDetail.match", {
              arrayValue,
              target,
            })
          : t("sequentialSearch.compare.statusDetail.noMatch", {
              arrayValue,
              target,
            }),
        stepExplanation: t("sequentialSearch.compare.stepExplanation", {
          index,
          arrayValue,
          target,
        }),
        codeLine: 3,
      }),
    );

    if (isMatch) {
      steps.push(
        createStep({
          phase: "found",
          index,
          target,
          arrayValue,
          found: true,
          statusTitle: t("sequentialSearch.found.statusTitle", {
            target,
            index,
          }),
          statusDetail: t("sequentialSearch.found.statusDetail", {
            target,
            index,
            arrayValue,
          }),
          pointerMovement: t("sequentialSearch.found.pointerMovement", {
            index,
          }),
          stepExplanation: t("sequentialSearch.found.stepExplanation", {
            target,
            index,
          }),
          codeLine: 4,
        }),
      );

      steps.push(
        createStep({
          phase: "complete",
          index,
          target,
          arrayValue,
          found: true,
          statusTitle: t("sequentialSearch.complete.statusTitle", { target }),
          statusDetail: t("sequentialSearch.complete.statusDetail", {
            target,
            index,
          }),
          stepExplanation: t("sequentialSearch.complete.stepExplanation", {
            target,
            index,
          }),
          codeLine: 4,
        }),
      );

      return steps;
    }
  }

  steps.push(
    createStep({
      phase: "not-found",
      index: null,
      target,
      arrayValue: null,
      statusTitle: t("sequentialSearch.notFound.statusTitle", { target }),
      statusDetail: t("sequentialSearch.notFound.statusDetail", { target }),
      stepExplanation: t("sequentialSearch.notFound.stepExplanation", {
        target,
      }),
      codeLine: 5,
    }),
  );

  return steps;
}

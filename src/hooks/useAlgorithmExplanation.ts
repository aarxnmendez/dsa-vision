import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { AlgorithmExplanationData } from "../components/panels/AlgorithmExplanationContent";

export type ExplanationKey =
  | "binarySearch"
  | "selectionSort"
  | "insertionSort"
  | "quickSort"
  | "array"
  | "linkedList"
  | "stack";

export function useAlgorithmExplanation(
  key: ExplanationKey,
): AlgorithmExplanationData {
  const { t, i18n } = useTranslation("explanations");

  return useMemo(
    () => ({
      howItWorks: t(`${key}.howItWorks`),
      keyConcepts: [
        ...(t(`${key}.keyConcepts`, { returnObjects: true }) as readonly string[]),
      ],
      complexityRows: [
        ...(t(`${key}.complexityRows`, {
          returnObjects: true,
        }) as unknown as AlgorithmExplanationData["complexityRows"]),
      ],
      whenToUse: [
        ...(t(`${key}.whenToUse`, { returnObjects: true }) as readonly string[]),
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh when locale changes
    [key, i18n.language, t],
  );
}

export type PageMetaKey = ExplanationKey | "quickSort";

export function usePageMeta(pageKey: ExplanationKey) {
  const { t, i18n } = useTranslation("pages");

  return useMemo(
    () => ({
      title: t(`${pageKey}.title`),
      description: t(`${pageKey}.description`),
      customInputHint: t(`${pageKey}.customInputHint`, { defaultValue: "" }),
      timeComplexityInfo: {
        title: t(`${pageKey}.complexity.time.title`),
        text: t(`${pageKey}.complexity.time.text`),
      },
      spaceComplexityInfo: {
        title: t(`${pageKey}.complexity.space.title`),
        text: t(`${pageKey}.complexity.space.text`),
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh when locale changes
    [pageKey, i18n.language, t],
  );
}

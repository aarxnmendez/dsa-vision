import type { VisualizerRoute } from "../constants/routes";

export type AlgorithmCategory =
  | "all"
  | "arrays"
  | "sorting"
  | "trees"
  | "graphs";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type AlgorithmAvailability = "available" | "coming-soon";

interface AlgorithmMetaBase {
  id: string;
  title: string;
  description: string;
  complexity: string;
  complexityVariant: "success" | "warning" | "error" | "tertiary";
  difficulty: Difficulty;
  category: Exclude<AlgorithmCategory, "all">;
  imageUrl: string;
  imageBg: string;
}

export type AvailableAlgorithmMeta = AlgorithmMetaBase & {
  availability: "available";
  route: VisualizerRoute;
};

export type ComingSoonAlgorithmMeta = AlgorithmMetaBase & {
  availability: "coming-soon";
};

export type AlgorithmMeta = AvailableAlgorithmMeta | ComingSoonAlgorithmMeta;

export function isAlgorithmAvailable(
  algorithm: AlgorithmMeta,
): algorithm is AvailableAlgorithmMeta {
  return algorithm.availability === "available";
}

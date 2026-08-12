export type AlgorithmCategory =
  | "all"
  | "arrays"
  | "sorting"
  | "trees"
  | "graphs";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface AlgorithmMeta {
  id: string;
  title: string;
  description: string;
  complexity: string;
  complexityVariant: "success" | "warning" | "error" | "tertiary";
  difficulty: Difficulty;
  category: Exclude<AlgorithmCategory, "all">;
  imageUrl: string;
  imageBg: string;
  route: string;
}

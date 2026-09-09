export type ComplexityDimension = "time" | "space";

export interface ComplexityReferenceRow {
  notation: string;
  name: string;
  description: string;
  examples: string;
  color: string;
}

export const COMPLEXITY_ROW_COLORS: Record<string, string> = {
  "O(1)": "text-secondary",
  "O(log n)": "text-primary",
  "O(n)": "text-tertiary",
  "O(n log n)": "text-on-tertiary-fixed-variant",
  "O(n²)": "text-error",
};

export function withComplexityRowColors(
  rows: readonly Omit<ComplexityReferenceRow, "color">[],
): ComplexityReferenceRow[] {
  return rows.map((row) => ({
    ...row,
    color: COMPLEXITY_ROW_COLORS[row.notation] ?? "text-on-surface",
  }));
}

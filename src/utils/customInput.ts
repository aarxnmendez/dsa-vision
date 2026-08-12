export const MIN_CUSTOM_ARRAY_ELEMENTS = 5;
export const MAX_CUSTOM_ARRAY_ELEMENTS = 20;

export const CUSTOM_ARRAY_COUNT_ERROR =
  "Please enter between 5 and 20 numbers.";

export interface CustomDatasetPayload {
  array: number[];
  target?: number;
}

export function parseCustomArrayInput(
  input: string,
): { array: number[] } | { error: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return { error: CUSTOM_ARRAY_COUNT_ERROR };
  }

  const parts = trimmed.split(/[,;\s]+/).filter(Boolean);

  if (
    parts.length < MIN_CUSTOM_ARRAY_ELEMENTS ||
    parts.length > MAX_CUSTOM_ARRAY_ELEMENTS
  ) {
    return { error: CUSTOM_ARRAY_COUNT_ERROR };
  }

  const values: number[] = [];

  for (const part of parts) {
    const token = part.trim();
    if (!/^-?\d+$/.test(token)) {
      return {
        error: "Only numeric values separated by commas are allowed.",
      };
    }
    values.push(Number(token));
  }

  const array = [...values].sort((a, b) => a - b);

  return { array };
}

export function parseOptionalTarget(
  input: string,
): { target: number } | { target?: undefined } | { error: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return { target: undefined };
  }

  if (!/^-?\d+$/.test(trimmed)) {
    return { error: "Target must be a valid number." };
  }

  return { target: Number(trimmed) };
}

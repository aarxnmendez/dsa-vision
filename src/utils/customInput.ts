import i18n from "../i18n";

export const MIN_CUSTOM_ARRAY_ELEMENTS = 5;
export const MAX_CUSTOM_ARRAY_ELEMENTS = 20;

export interface CustomDatasetPayload {
  array: number[];
  target?: number;
}

function arrayCountError(): string {
  return i18n.t("validation.arrayCountRange", {
    ns: "common",
    min: MIN_CUSTOM_ARRAY_ELEMENTS,
    max: MAX_CUSTOM_ARRAY_ELEMENTS,
  });
}

export function parseCustomArrayInput(
  input: string,
  options?: { preserveOrder?: boolean },
): { array: number[] } | { error: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return { error: arrayCountError() };
  }

  const parts = trimmed.split(/[,;\s]+/).filter(Boolean);

  if (
    parts.length < MIN_CUSTOM_ARRAY_ELEMENTS ||
    parts.length > MAX_CUSTOM_ARRAY_ELEMENTS
  ) {
    return { error: arrayCountError() };
  }

  const values: number[] = [];

  for (const part of parts) {
    const token = part.trim();
    if (!/^-?\d+$/.test(token)) {
      return {
        error: i18n.t("validation.invalidNumeric", { ns: "common" }),
      };
    }
    values.push(Number(token));
  }

  const array = options?.preserveOrder
    ? values
    : [...values].sort((a, b) => a - b);

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
    return { error: i18n.t("validation.invalidTarget", { ns: "common" }) };
  }

  return { target: Number(trimmed) };
}

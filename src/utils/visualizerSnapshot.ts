export const SNAPSHOT_STORAGE_KEY = "dsavision-snapshots";

/** Router `state` carried by the "continue" link so the page restores its last data. */
export interface ResumeNavigationState {
  resume: true;
}

export const RESUME_NAVIGATION_STATE: ResumeNavigationState = { resume: true };

export function isResumeNavigationState(
  state: unknown,
): state is ResumeNavigationState {
  return (
    typeof state === "object" &&
    state !== null &&
    (state as { resume?: unknown }).resume === true
  );
}

function readAllSnapshots(): Record<string, unknown> {
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function readSnapshot(id: string): unknown {
  return readAllSnapshots()[id] ?? null;
}

export function hasSnapshot(id: string): boolean {
  return readAllSnapshots()[id] !== undefined;
}

export function writeSnapshot(id: string, snapshot: unknown): void {
  try {
    const all = readAllSnapshots();
    all[id] = snapshot;
    window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage can be unavailable (private mode, blocked site data); resuming is optional.
  }
}

const MAX_SNAPSHOT_ITEMS = 50;

export function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function asNumberArray(value: unknown): number[] | null {
  if (!Array.isArray(value) || value.length > MAX_SNAPSHOT_ITEMS) {
    return null;
  }
  return value.every((item) => asNumber(item) !== null)
    ? (value as number[])
    : null;
}

export function asOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | null {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

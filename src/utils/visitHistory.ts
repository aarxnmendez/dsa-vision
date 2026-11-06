export const VISIT_HISTORY_KEY = "dsavision-visits";

export type VisitHistory = Record<string, number>;

export function readVisitHistory(): VisitHistory {
  try {
    const raw = window.localStorage.getItem(VISIT_HISTORY_KEY);
    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }

    const history: VisitHistory = {};
    for (const [id, timestamp] of Object.entries(parsed)) {
      if (typeof timestamp === "number" && Number.isFinite(timestamp)) {
        history[id] = timestamp;
      }
    }
    return history;
  } catch {
    return {};
  }
}

export function recordVisit(algorithmId: string): void {
  try {
    const history = readVisitHistory();
    history[algorithmId] = Date.now();
    window.localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Storage can be unavailable (private mode, blocked site data); history is optional.
  }
}

export function findLastVisitedId(
  history: VisitHistory,
  knownIds: readonly string[],
): string | null {
  let lastId: string | null = null;
  let lastTimestamp = -Infinity;

  for (const id of knownIds) {
    const timestamp = history[id];
    if (timestamp !== undefined && timestamp > lastTimestamp) {
      lastId = id;
      lastTimestamp = timestamp;
    }
  }

  return lastId;
}

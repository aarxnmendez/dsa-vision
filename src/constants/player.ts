/** Shortest delay between steps (fastest playback). */
export const SPEED_MIN_MS = 500;

/** Longest delay between steps (slowest playback). */
export const SPEED_MAX_MS = 8000;

/** CSS transition length for array cells, scaled to step interval. */
export function getStepTransitionMs(stepIntervalMs: number): number {
  const clamped = Math.min(
    SPEED_MAX_MS,
    Math.max(SPEED_MIN_MS, stepIntervalMs),
  );

  return Math.min(250, Math.max(120, Math.round(clamped * 0.4)));
}

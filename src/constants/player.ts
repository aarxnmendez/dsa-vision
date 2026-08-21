/** Shortest delay between steps (fastest playback). */
export const SPEED_MIN_MS = 50;

/** Longest delay between steps (slowest playback). */
export const SPEED_MAX_MS = 2000;

/** Default delay between steps at normal playback speed. */
export const SPEED_DEFAULT_MS = 500;

/** CSS transition length for array cells, scaled to step interval. */
export function getStepTransitionMs(
  stepIntervalMs: number,
  minIntervalMs: number = SPEED_MIN_MS,
): number {
  const floor = minIntervalMs;
  const clamped = Math.min(
    SPEED_MAX_MS,
    Math.max(floor, stepIntervalMs),
  );

  return Math.min(250, Math.max(80, Math.round(clamped * 0.4)));
}

export function clampPlaybackSpeed(
  speed: number,
  minMs: number = SPEED_MIN_MS,
  maxMs: number = SPEED_MAX_MS,
): number {
  return Math.min(maxMs, Math.max(minMs, speed));
}

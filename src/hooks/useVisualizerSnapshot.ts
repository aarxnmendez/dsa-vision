import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  hasSnapshot,
  isResumeNavigationState,
  readSnapshot,
  writeSnapshot,
} from "../utils/visualizerSnapshot";

/**
 * Returns the saved snapshot for a visualizer, but only when the page was opened
 * through a "continue" link. Normal visits start with fresh data.
 */
export function useRestoredSnapshot<T>(
  id: string,
  parse: (raw: unknown) => T | null,
): T | null {
  const { state } = useLocation();
  const [restored] = useState<T | null>(() =>
    isResumeNavigationState(state) ? parse(readSnapshot(id)) : null,
  );

  return restored;
}

/**
 * Saves the visualizer's data so it can be resumed later. The fresh data of a
 * normal visit never replaces an existing snapshot; only a real change does.
 */
export function usePersistSnapshot(id: string, snapshot: unknown): void {
  const serialized = JSON.stringify(snapshot);
  const [initialSerialized] = useState(serialized);
  const hasChanged = useRef(false);

  useEffect(() => {
    if (serialized !== initialSerialized) {
      hasChanged.current = true;
    }
    if (!hasChanged.current && hasSnapshot(id)) {
      return;
    }
    writeSnapshot(id, JSON.parse(serialized) as unknown);
  }, [id, initialSerialized, serialized]);
}

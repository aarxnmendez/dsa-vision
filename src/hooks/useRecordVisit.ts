import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { algorithms } from "../data/algorithms";
import { isAlgorithmAvailable } from "../types/algorithm";
import { recordVisit } from "../utils/visitHistory";

/** Remembers which visualizer was opened, for the catalog's "continue" shortcut. */
export function useRecordVisit(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const visited = algorithms.find(
      (algorithm) => isAlgorithmAvailable(algorithm) && algorithm.route === pathname,
    );
    if (visited) {
      recordVisit(visited.id);
    }
  }, [pathname]);
}

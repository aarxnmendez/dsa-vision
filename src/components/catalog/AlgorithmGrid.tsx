import type { AlgorithmMeta } from "../../types/algorithm";
import { AlgorithmCard } from "./AlgorithmCard";

interface AlgorithmGridProps {
  algorithms: AlgorithmMeta[];
}

export function AlgorithmGrid({ algorithms }: AlgorithmGridProps) {
  if (algorithms.length === 0) {
    return (
      <div className="text-center py-stack-lg">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          No algorithms match your search.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
      {algorithms.map((algorithm) => (
        <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
      ))}
    </section>
  );
}

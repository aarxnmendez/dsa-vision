import type { AlgorithmCategory } from "../../types/algorithm";

const categories: { id: AlgorithmCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "data-structures", label: "Data Structures" },
  { id: "arrays", label: "Arrays" },
  { id: "searching", label: "Searching" },
  { id: "sorting", label: "Sorting" },
  { id: "trees", label: "Trees" },
  { id: "graphs", label: "Graphs" },
];

interface FilterBarProps {
  activeCategory: AlgorithmCategory;
  onCategoryChange: (category: AlgorithmCategory) => void;
}

export function FilterBar({
  activeCategory,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <section className="flex flex-wrap justify-center gap-stack-sm">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={[
              "btn-3d font-body-md text-body-md px-6 py-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer",
              isActive
                ? "bg-primary text-on-primary border-b-4 border-on-primary-fixed-variant"
                : "bg-surface-container-lowest text-on-surface-variant border-2 border-surface-variant border-b-4 hover:bg-surface-container-low hover:border-primary/30 hover:text-primary hover:shadow-[0_4px_12px_rgba(0,87,191,0.08)]",
            ].join(" ")}
          >
            {category.label}
          </button>
        );
      })}
    </section>
  );
}

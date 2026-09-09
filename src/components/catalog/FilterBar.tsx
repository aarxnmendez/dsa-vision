import { useTranslation } from "react-i18next";
import type { AlgorithmCategory } from "../../types/algorithm";

type FilterLabelKey =
  | "filters.all"
  | "filters.dataStructures"
  | "filters.arrays"
  | "filters.searching"
  | "filters.sorting"
  | "filters.trees"
  | "filters.graphs";

const categories: { id: AlgorithmCategory; labelKey: FilterLabelKey }[] = [
  { id: "all", labelKey: "filters.all" },
  { id: "data-structures", labelKey: "filters.dataStructures" },
  { id: "arrays", labelKey: "filters.arrays" },
  { id: "searching", labelKey: "filters.searching" },
  { id: "sorting", labelKey: "filters.sorting" },
  { id: "trees", labelKey: "filters.trees" },
  { id: "graphs", labelKey: "filters.graphs" },
];

interface FilterBarProps {
  activeCategory: AlgorithmCategory;
  onCategoryChange: (category: AlgorithmCategory) => void;
}

export function FilterBar({
  activeCategory,
  onCategoryChange,
}: FilterBarProps) {
  const { t } = useTranslation("catalog");

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
            {t(category.labelKey)}
          </button>
        );
      })}
    </section>
  );
}

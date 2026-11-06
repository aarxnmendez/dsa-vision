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
  /** Matches per category for the current search; categories absent from the catalog are hidden. */
  counts: Partial<Record<AlgorithmCategory, number>>;
  /** Categories that exist in the catalog at all, regardless of search. */
  availableCategories: ReadonlySet<AlgorithmCategory>;
}

export function FilterBar({
  activeCategory,
  onCategoryChange,
  counts,
  availableCategories,
}: FilterBarProps) {
  const { t } = useTranslation("catalog");

  return (
    <section
      className="flex flex-wrap justify-center gap-stack-sm lg:justify-start"
      aria-label={t("filters.ariaLabel")}
    >
      {categories
        .filter(
          (category) =>
            category.id === "all" || availableCategories.has(category.id),
        )
        .map((category) => {
          const isActive = activeCategory === category.id;
          const count = counts[category.id] ?? 0;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              aria-pressed={isActive}
              className={[
                "btn-3d inline-flex items-center gap-2 font-body-md text-body-md px-5 py-2 rounded-full transition-all duration-300 ease-in-out cursor-pointer",
                isActive
                  ? "bg-primary text-on-primary border-b-4 border-on-primary-fixed-variant"
                  : "bg-surface-container-lowest text-on-surface-variant border-2 border-surface-variant border-b-4 hover:bg-surface-container-low hover:border-primary/30 hover:text-primary hover:shadow-[0_4px_12px_rgba(0,87,191,0.08)]",
                !isActive && count === 0 ? "opacity-60" : "",
              ].join(" ")}
            >
              {t(category.labelKey)}
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                  isActive
                    ? "bg-on-primary/20 text-on-primary"
                    : "bg-surface-container text-on-surface-variant",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          );
        })}
    </section>
  );
}

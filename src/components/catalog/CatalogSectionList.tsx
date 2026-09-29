import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CATALOG_SECTIONS } from "../../constants/catalogSections";
import type { AlgorithmMeta } from "../../types/algorithm";
import { AlgorithmCard } from "./AlgorithmCard";

const CARD_GRID_CLASS =
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

interface CatalogSectionListProps {
  algorithms: AlgorithmMeta[];
}

export function CatalogSectionList({ algorithms }: CatalogSectionListProps) {
  const { t } = useTranslation("catalog");

  const sections = useMemo(() => {
    const byId = new Map(algorithms.map((algorithm) => [algorithm.id, algorithm]));

    return CATALOG_SECTIONS.map((section) => ({
      id: section.id,
      items: section.algorithmIds
        .map((id) => byId.get(id))
        .filter((algorithm): algorithm is AlgorithmMeta => algorithm !== undefined),
    })).filter((section) => section.items.length > 0);
  }, [algorithms]);

  if (sections.length === 0) {
    return (
      <div className="mb-12 py-stack-lg text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {t("emptyResults")}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12 flex flex-col gap-8 md:gap-10">
      {sections.map((section) => (
        <section
          key={section.id}
          className="mt-8 first:mt-0"
          aria-labelledby={`catalog-section-${section.id}`}
        >
          <h2
            id={`catalog-section-${section.id}`}
            className="mb-6 flex items-center border-l-4 border-primary pl-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            <span className="flex items-center gap-3">
              {t(`sections.${section.id}.title`)}
              <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-slate-600">
                {section.items.length}
              </span>
            </span>
          </h2>
          <div className={CARD_GRID_CLASS}>
            {section.items.map((algorithm) => (
              <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

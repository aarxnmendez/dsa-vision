import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CatalogSectionList } from "../components/catalog/CatalogSectionList";
import { CatalogTable } from "../components/catalog/CatalogTable";
import { FilterBar } from "../components/catalog/FilterBar";
import { Hero } from "../components/catalog/Hero";
import { UpcomingSection } from "../components/catalog/UpcomingSection";
import {
  ViewToggle,
  type CatalogView,
} from "../components/catalog/ViewToggle";
import { SearchBar } from "../components/catalog/SearchBar";
import { CatalogLayout } from "../components/layout/CatalogLayout";
import { Footer } from "../components/layout/Footer";
import { algorithms } from "../data/algorithms";
import type { AlgorithmCategory } from "../types/algorithm";
import {
  algorithmMatchesCategory,
  algorithmMatchesSearch,
  normalizeText,
} from "../utils/catalogFilter";

const CATALOG_VIEW_KEY = "dsavision-catalog-view";

function readStoredView(): CatalogView {
  try {
    return window.localStorage.getItem(CATALOG_VIEW_KEY) === "table"
      ? "table"
      : "cards";
  } catch {
    return "cards";
  }
}

const FILTER_CATEGORIES: AlgorithmCategory[] = [
  "all",
  "data-structures",
  "arrays",
  "searching",
  "sorting",
  "trees",
  "graphs",
];

export function CatalogPage() {
  const { t } = useTranslation("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory>("all");
  const [view, setView] = useState<CatalogView>(readStoredView);

  const handleViewChange = (nextView: CatalogView) => {
    setView(nextView);
    try {
      window.localStorage.setItem(CATALOG_VIEW_KEY, nextView);
    } catch {
      // The view preference is a convenience; ignore blocked storage.
    }
  };

  const searchMatches = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery.trim());

    return algorithms.filter((algorithm) =>
      algorithmMatchesSearch(algorithm, normalizedQuery, {
        title: t(`algorithms.${algorithm.id}.title`, {
          defaultValue: algorithm.title,
        }),
        description: t(`algorithms.${algorithm.id}.description`, {
          defaultValue: algorithm.description,
        }),
      }),
    );
  }, [searchQuery, t]);

  const filteredAlgorithms = useMemo(
    () =>
      searchMatches.filter((algorithm) =>
        algorithmMatchesCategory(algorithm, activeCategory),
      ),
    [activeCategory, searchMatches],
  );

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<AlgorithmCategory, number>> = {};
    for (const category of FILTER_CATEGORIES) {
      counts[category] = searchMatches.filter((algorithm) =>
        algorithmMatchesCategory(algorithm, category),
      ).length;
    }
    return counts;
  }, [searchMatches]);

  const availableCategories = useMemo(
    () =>
      new Set<AlgorithmCategory>(
        FILTER_CATEGORIES.filter((category) =>
          algorithms.some((algorithm) =>
            algorithmMatchesCategory(algorithm, category),
          ),
        ),
      ),
    [],
  );

  const isUnfiltered =
    activeCategory === "all" && searchQuery.trim().length === 0;

  return (
    <CatalogLayout footer={<Footer />}>
      <Hero>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </Hero>
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          counts={categoryCounts}
          availableCategories={availableCategories}
        />
        <ViewToggle value={view} onChange={handleViewChange} />
      </div>
      {view === "table" ? (
        <CatalogTable algorithms={filteredAlgorithms} />
      ) : (
        <>
          <CatalogSectionList
            algorithms={filteredAlgorithms}
          />
          {isUnfiltered && <UpcomingSection />}
        </>
      )}
    </CatalogLayout>
  );
}

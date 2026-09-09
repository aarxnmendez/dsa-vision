import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlgorithmGrid } from "../components/catalog/AlgorithmGrid";
import { FilterBar } from "../components/catalog/FilterBar";
import { Hero } from "../components/catalog/Hero";
import { SearchBar } from "../components/catalog/SearchBar";
import { CatalogLayout } from "../components/layout/CatalogLayout";
import { Footer } from "../components/layout/Footer";
import { algorithms } from "../data/algorithms";
import type { AlgorithmCategory } from "../types/algorithm";
import {
  algorithmMatchesCategory,
  algorithmMatchesSearch,
} from "../utils/catalogFilter";

export function CatalogPage() {
  const { t } = useTranslation("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory>("all");

  const filteredAlgorithms = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return algorithms.filter((algorithm) => {
      const matchesCategory = algorithmMatchesCategory(
        algorithm,
        activeCategory,
      );
      const matchesSearch = algorithmMatchesSearch(
        algorithm,
        normalizedQuery,
        {
          title: t(`algorithms.${algorithm.id}.title`, {
            defaultValue: algorithm.title,
          }),
          description: t(`algorithms.${algorithm.id}.description`, {
            defaultValue: algorithm.description,
          }),
        },
      );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, t]);

  return (
    <CatalogLayout footer={<Footer />}>
      <Hero />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <AlgorithmGrid algorithms={filteredAlgorithms} />
    </CatalogLayout>
  );
}

import { useMemo, useState } from "react";
import { AlgorithmGrid } from "../components/catalog/AlgorithmGrid";
import { FilterBar } from "../components/catalog/FilterBar";
import { Hero } from "../components/catalog/Hero";
import { SearchBar } from "../components/catalog/SearchBar";
import { CatalogLayout } from "../components/layout/CatalogLayout";
import { algorithms } from "../data/algorithms";
import type { AlgorithmCategory } from "../types/algorithm";

export function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory>("all");

  const filteredAlgorithms = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return algorithms.filter((algorithm) => {
      const matchesCategory =
        activeCategory === "all" || algorithm.category === activeCategory;

      const matchesSearch =
        normalizedQuery.length === 0 ||
        algorithm.title.toLowerCase().includes(normalizedQuery) ||
        algorithm.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <CatalogLayout>
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

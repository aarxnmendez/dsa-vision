import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Route, Routes } from "react-router-dom";
import { DocumentMeta } from "./components/i18n/DocumentMeta";
import { LegacyEsRouteRedirect } from "./components/i18n/LegacyEsRouteRedirect";
import { APP_ROUTES } from "./constants/routes";
import { MobileNoticeOverlay } from "./components/layout/MobileNoticeOverlay";
import { CatalogPage } from "./pages/CatalogPage";

const ArrayPage = lazy(() =>
  import("./pages/ArrayPage").then((module) => ({ default: module.ArrayPage })),
);
const BigONotationPage = lazy(() =>
  import("./pages/BigONotationPage").then((module) => ({
    default: module.BigONotationPage,
  })),
);
const BinarySearchPage = lazy(() =>
  import("./pages/BinarySearchPage").then((module) => ({
    default: module.BinarySearchPage,
  })),
);
const SequentialSearchPage = lazy(() =>
  import("./pages/SequentialSearchPage").then((module) => ({
    default: module.SequentialSearchPage,
  })),
);
const LinkedListPage = lazy(() =>
  import("./pages/LinkedListPage").then((module) => ({
    default: module.LinkedListPage,
  })),
);
const StackPage = lazy(() =>
  import("./pages/StackPage").then((module) => ({ default: module.StackPage })),
);
const InsertionSortPage = lazy(() =>
  import("./pages/InsertionSortPage").then((module) => ({
    default: module.InsertionSortPage,
  })),
);
const QuickSortPage = lazy(() =>
  import("./pages/QuickSortPage").then((module) => ({
    default: module.QuickSortPage,
  })),
);
const SelectionSortPage = lazy(() =>
  import("./pages/SelectionSortPage").then((module) => ({
    default: module.SelectionSortPage,
  })),
);

function RouteLoadingFallback() {
  const { t } = useTranslation("common");

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background text-on-surface-variant"
      role="status"
      aria-live="polite"
    >
      {t("loadingModule")}
    </div>
  );
}

function App() {
  return (
    <>
      <LegacyEsRouteRedirect />
      <DocumentMeta />
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path={APP_ROUTES.catalog} element={<CatalogPage />} />
          <Route path={APP_ROUTES.array} element={<ArrayPage />} />
          <Route path={APP_ROUTES.linkedList} element={<LinkedListPage />} />
          <Route path={APP_ROUTES.stack} element={<StackPage />} />
          <Route path={APP_ROUTES.binarySearch} element={<BinarySearchPage />} />
          <Route
            path={APP_ROUTES.sequentialSearch}
            element={<SequentialSearchPage />}
          />
          <Route path={APP_ROUTES.selectionSort} element={<SelectionSortPage />} />
          <Route path={APP_ROUTES.insertionSort} element={<InsertionSortPage />} />
          <Route path={APP_ROUTES.quickSort} element={<QuickSortPage />} />
          <Route path={APP_ROUTES.bigONotation} element={<BigONotationPage />} />
        </Routes>
      </Suspense>
      <MobileNoticeOverlay />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;

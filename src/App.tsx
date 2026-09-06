import { Analytics } from "@vercel/analytics/react";
import { Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./constants/routes";
import { MobileNoticeOverlay } from "./components/layout/MobileNoticeOverlay";
import { ArrayPage } from "./pages/ArrayPage";
import { BigONotationPage } from "./pages/BigONotationPage";
import { BinarySearchPage } from "./pages/BinarySearchPage";
import { LinkedListPage } from "./pages/LinkedListPage";
import { StackPage } from "./pages/StackPage";
import { CatalogPage } from "./pages/CatalogPage";
import { QuickSortPage } from "./pages/QuickSortPage";
import { SelectionSortPage } from "./pages/SelectionSortPage";

function App() {
  return (
    <>
      <Routes>
        <Route path={APP_ROUTES.catalog} element={<CatalogPage />} />
        <Route path={APP_ROUTES.array} element={<ArrayPage />} />
        <Route path={APP_ROUTES.linkedList} element={<LinkedListPage />} />
        <Route path={APP_ROUTES.stack} element={<StackPage />} />
        <Route path={APP_ROUTES.binarySearch} element={<BinarySearchPage />} />
        <Route path={APP_ROUTES.selectionSort} element={<SelectionSortPage />} />
        <Route path={APP_ROUTES.quickSort} element={<QuickSortPage />} />
        <Route path={APP_ROUTES.bigONotation} element={<BigONotationPage />} />
      </Routes>
      <MobileNoticeOverlay />
      <Analytics />
    </>
  );
}

export default App;

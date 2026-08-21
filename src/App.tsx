import { Route, Routes } from "react-router-dom";
import { MobileNoticeOverlay } from "./components/layout/MobileNoticeOverlay";
import { BigONotationPage } from "./pages/BigONotationPage";
import { BinarySearchPage } from "./pages/BinarySearchPage";
import { CatalogPage } from "./pages/CatalogPage";
import { SelectionSortPage } from "./pages/SelectionSortPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/binary-search" element={<BinarySearchPage />} />
        <Route path="/selection-sort" element={<SelectionSortPage />} />
        <Route path="/big-o-notation" element={<BigONotationPage />} />
      </Routes>
      <MobileNoticeOverlay />
    </>
  );
}

export default App;

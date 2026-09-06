import { BigOView } from "../components/big-o/BigOView";
import { CatalogLayout } from "../components/layout/CatalogLayout";

export function BigONotationPage() {
  return (
    <CatalogLayout>
      <div className="pb-stack-lg">
        <BigOView />
      </div>
    </CatalogLayout>
  );
}

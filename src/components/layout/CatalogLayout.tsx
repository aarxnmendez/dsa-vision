import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface CatalogLayoutProps {
  children: ReactNode;
}

export function CatalogLayout({ children }: CatalogLayoutProps) {
  return (
    <div className="bg-background text-on-background min-h-screen pb-stack-lg">
      <Navbar />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-stack-lg flex flex-col gap-stack-lg">
        {children}
      </main>
    </div>
  );
}

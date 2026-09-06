import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface CatalogLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
}

export function CatalogLayout({ children, footer }: CatalogLayoutProps) {
  return (
    <div className="bg-background text-on-background flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-container-max flex-1 flex-col gap-stack-lg px-margin-mobile pt-stack-lg md:px-gutter xl:px-8">
        {children}
      </main>
      {footer}
    </div>
  );
}

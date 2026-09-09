import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { EmbeddedPanelTabBar } from "./EmbeddedPanelTabBar";

interface ExplanationPanelShellProps {
  children: ReactNode;
}

export function ExplanationPanelShell({ children }: ExplanationPanelShellProps) {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-[22rem] min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-surface-variant bg-surface-container-lowest shadow-sm">
      <EmbeddedPanelTabBar icon="menu_book" label={t("codePanel.explanation")} />
      <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">{children}</div>
    </div>
  );
}

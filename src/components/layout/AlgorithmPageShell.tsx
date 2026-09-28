import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface AlgorithmPageShellProps {
  heroLegend?: ReactNode;
  hero: ReactNode;
  statusSection: ReactNode;
  codeColumn: ReactNode;
  explanationColumn: ReactNode;
  playerControls: ReactNode;
  bottomColumnsOrder?: "code-first" | "explanation-first";
}

export function AlgorithmPageShell({
  heroLegend,
  hero,
  statusSection,
  codeColumn,
  explanationColumn,
  playerControls,
  bottomColumnsOrder = "code-first",
}: AlgorithmPageShellProps) {
  const { t } = useTranslation("common");
  const [leftBottomColumn, rightBottomColumn] =
    bottomColumnsOrder === "explanation-first"
      ? [explanationColumn, codeColumn]
      : [codeColumn, explanationColumn];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 pb-32">
        <section
          aria-label={t("aria.algorithmVisualization")}
          className="w-full rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-4 shadow-sm sm:p-6"
        >
          {heroLegend && (
            <div className="mb-4 border-b border-surface-variant pb-4">
              {heroLegend}
            </div>
          )}
          {hero}
          <div
            aria-label={t("aria.stepStatus")}
            className="mt-5 border-t border-surface-variant pt-5"
          >
            {statusSection}
          </div>
        </section>

        <section
          aria-label={t("aria.codeAndReference")}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <div className="min-w-0">{leftBottomColumn}</div>
          <div className="min-w-0">{rightBottomColumn}</div>
        </section>
      </div>

      {playerControls}
    </div>
  );
}

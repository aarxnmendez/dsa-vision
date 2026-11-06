import { useTranslation } from "react-i18next";

export type CatalogView = "cards" | "table";

interface ViewToggleProps {
  value: CatalogView;
  onChange: (view: CatalogView) => void;
}

const VIEWS: CatalogView[] = ["cards", "table"];

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  const { t } = useTranslation("catalog");

  return (
    <div
      className="inline-flex shrink-0 gap-2"
      role="group"
      aria-label={t("view.ariaLabel")}
    >
      {VIEWS.map((view) => {
        const isActive = value === view;
        return (
          <button
            key={view}
            type="button"
            onClick={() => onChange(view)}
            aria-pressed={isActive}
            className={[
              "btn-3d cursor-pointer rounded-xl px-4 py-1.5 text-sm font-bold",
              isActive
                ? "bg-primary text-on-primary border-b-4 border-on-primary-fixed-variant"
                : "bg-surface-container-lowest text-on-surface-variant border-2 border-surface-variant border-b-4 hover:bg-surface-container-low hover:border-primary/30 hover:text-primary",
            ].join(" ")}
          >
            {t(`view.${view}`)}
          </button>
        );
      })}
    </div>
  );
}

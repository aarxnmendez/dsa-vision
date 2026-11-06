import { useTranslation } from "react-i18next";

const UPCOMING_KEYS = ["hashTables", "trees", "graphs"] as const;

export function UpcomingSection() {
  const { t } = useTranslation("catalog");

  return (
    <section className="mb-12" aria-labelledby="catalog-upcoming">
      <h2
        id="catalog-upcoming"
        className="mb-4 flex items-center border-l-4 border-surface-variant pl-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
      >
        {t("upcoming.title")}
      </h2>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {UPCOMING_KEYS.map((key) => (
          <li
            key={key}
            className="rounded-2xl border-2 border-dashed border-surface-variant bg-transparent p-4"
          >
            <p className="font-headline-md text-base font-bold text-on-surface-variant">
              {t(`upcoming.items.${key}.title`)}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant opacity-80">
              {t(`upcoming.items.${key}.description`)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

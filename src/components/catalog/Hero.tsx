import { useTranslation } from "react-i18next";

export function Hero() {
  const { t } = useTranslation("catalog");

  return (
    <section className="text-center flex flex-col gap-stack-md items-center">
      <h1 className="font-display text-display text-primary max-w-2xl">
        {t("hero.title")}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
        {t("hero.subtitle")}
      </p>
    </section>
  );
}

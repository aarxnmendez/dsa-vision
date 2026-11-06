import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "../../constants/routes";
import { Icon } from "../ui/Icon";

interface HeroProps {
  children?: ReactNode;
}

export function Hero({ children }: HeroProps) {
  const { t } = useTranslation("catalog");

  return (
    <section className="flex flex-col items-center gap-4 text-center">
      <h1 className="font-display text-display text-primary max-w-4xl">
        {t("hero.title")}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
        {t("hero.subtitle")}
      </p>

      {children}

      <Link
        to={APP_ROUTES.bigONotation}
        className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
      >
        {t("hero.bigOLink")}
        <Icon name="arrow_forward" filled={false} />
      </Link>
    </section>
  );
}

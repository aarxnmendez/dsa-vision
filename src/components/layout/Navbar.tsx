import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "../../constants/routes";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const { t } = useTranslation("common");

  return (
    <header className="bg-surface text-primary font-headline-md text-headline-md sticky top-0 border-b-4 border-surface-container-highest flex justify-between items-center w-full px-base py-unit z-50">
      <Link
        to={APP_ROUTES.catalog}
        className="font-display text-headline-md font-black text-primary flex items-center gap-2 cursor-pointer transition-colors duration-300 ease-in-out hover:text-primary-container"
      >
        {t("brand")}
      </Link>
      <LanguageSwitcher />
    </header>
  );
}

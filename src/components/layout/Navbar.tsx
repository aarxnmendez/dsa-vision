import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "../../constants/routes";
import { useCommandPalette } from "../../hooks/useCommandPalette";
import { getPaletteShortcutLabel } from "../../utils/platform";
import { Icon } from "../ui/Icon";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const { t } = useTranslation("common");
  const { open } = useCommandPalette();

  return (
    <header className="bg-surface text-primary font-headline-md text-headline-md sticky top-0 border-b-4 border-surface-container-highest flex justify-between items-center w-full px-base py-unit z-50">
      <Link
        to={APP_ROUTES.catalog}
        className="font-display text-headline-md font-black text-primary flex items-center gap-2 cursor-pointer transition-colors duration-300 ease-in-out hover:text-primary-container"
      >
        {t("brand")}
      </Link>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={open}
          aria-label={t("palette.open")}
          aria-keyshortcuts="Control+K Meta+K"
          className="btn-3d inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-surface-variant border-b-4 bg-surface-container-lowest px-3 py-1.5 text-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary"
        >
          <Icon name="search" filled={false} />
          <span className="hidden sm:inline">{t("palette.trigger")}</span>
          <kbd className="hidden rounded-md border border-surface-variant bg-surface-container px-1.5 py-0.5 text-xs font-semibold md:inline">
            {getPaletteShortcutLabel()}
          </kbd>
        </button>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

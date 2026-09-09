import { useTranslation } from "react-i18next";
import {
  resolveAppLocale,
  setStoredLocalePreference,
  type AppLocale,
} from "../../i18n/localePreference";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation("common");
  const currentLanguage = resolveAppLocale(i18n.language);

  const setLanguage = (language: AppLocale) => {
    if (language === currentLanguage) {
      return;
    }

    setStoredLocalePreference(language);
    void i18n.changeLanguage(language);
  };

  return (
    <div
      className="inline-flex items-center rounded-xl border-2 border-surface-variant bg-surface-container-lowest p-1"
      role="group"
      aria-label={t("language.switchAria")}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={currentLanguage === "en"}
        className={[
          "rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer",
          currentLanguage === "en"
            ? "bg-primary text-on-primary"
            : "text-on-surface-variant hover:text-primary",
        ].join(" ")}
      >
        {t("language.en")}
      </button>
      <button
        type="button"
        onClick={() => setLanguage("es")}
        aria-pressed={currentLanguage === "es"}
        className={[
          "rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer",
          currentLanguage === "es"
            ? "bg-primary text-on-primary"
            : "text-on-surface-variant hover:text-primary",
        ].join(" ")}
      >
        {t("language.es")}
      </button>
    </div>
  );
}

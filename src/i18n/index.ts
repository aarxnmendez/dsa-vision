import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { getPreferredLocale } from "./localePreference";

void i18n.use(initReactI18next).init({
  resources: {
    en,
    es,
  },
  lng: getPreferredLocale(),
  fallbackLng: "en",
  defaultNS: "common",
  ns: [
    "common",
    "catalog",
    "pages",
    "explanations",
    "algorithms",
    "structures",
    "bigO",
    "seo",
  ],
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
}

export default i18n;

export function getAlgorithmT() {
  return i18n.getFixedT(i18n.language, "algorithms");
}

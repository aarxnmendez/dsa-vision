export const SUPPORTED_LOCALES = ["en", "es"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_PREFERENCE_KEY = "dsavision-locale";

export function getBrowserLocale(): AppLocale {
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }

  const languages =
    navigator.languages.length > 0 ? navigator.languages : [navigator.language];

  for (const language of languages) {
    if (language.toLowerCase().startsWith("es")) {
      return "es";
    }
  }

  return DEFAULT_LOCALE;
}

export function getStoredLocalePreference(): AppLocale | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(LOCALE_PREFERENCE_KEY);
  return stored === "es" || stored === "en" ? stored : null;
}

export function setStoredLocalePreference(locale: AppLocale): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCALE_PREFERENCE_KEY, locale);
}

export function getPreferredLocale(): AppLocale {
  return getStoredLocalePreference() ?? getBrowserLocale();
}

export function resolveAppLocale(language: string): AppLocale {
  return language.startsWith("es") ? "es" : "en";
}

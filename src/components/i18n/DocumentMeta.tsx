import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { APP_ROUTES, type AppRoute } from "../../constants/routes";
import { resolveAppLocale } from "../../i18n/localePreference";
import type { ExplanationKey } from "../../hooks/useAlgorithmExplanation";

const PAGE_SEO_KEYS: Partial<Record<AppRoute, ExplanationKey | "bigO">> = {
  [APP_ROUTES.array]: "array",
  [APP_ROUTES.linkedList]: "linkedList",
  [APP_ROUTES.stack]: "stack",
  [APP_ROUTES.binarySearch]: "binarySearch",
  [APP_ROUTES.sequentialSearch]: "sequentialSearch",
  [APP_ROUTES.selectionSort]: "selectionSort",
  [APP_ROUTES.insertionSort]: "insertionSort",
  [APP_ROUTES.mergeSort]: "mergeSort",
  [APP_ROUTES.quickSort]: "quickSort",
  [APP_ROUTES.bigONotation]: "bigO",
};

function upsertMeta(
  selector: string,
  attributes: Record<string, string>,
  content: string,
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element!.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]:not([hreflang])`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export function DocumentMeta() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const { t: tSeo } = useTranslation("seo");
  const { t: tPages } = useTranslation("pages");
  const locale = resolveAppLocale(i18n.language);

  useLayoutEffect(() => {
    const siteUrl = tSeo("siteUrl");
    const ogImageUrl = `${siteUrl}/og-image.png`;
    const canonicalUrl =
      pathname === "/"
        ? `${siteUrl}/`
        : `${siteUrl}${pathname}`;

    let title: string = tSeo("catalog.title");
    let description: string = tSeo("catalog.description");
    let ogTitle: string = tSeo("catalog.ogTitle");
    let ogDescription: string = tSeo("catalog.ogDescription");

    const pageKey = PAGE_SEO_KEYS[pathname as AppRoute];

    if (pageKey === "bigO") {
      title = `${tSeo("bigO.title")}${tSeo("titleSuffix")}`;
      description = tSeo("bigO.description");
      ogTitle = title;
      ogDescription = description;
    } else if (pageKey) {
      const pageTitle = tPages(`${pageKey}.title`);
      title = `${pageTitle}${tSeo("titleSuffix")}`;
      description = tPages(`${pageKey}.description`);
      ogTitle = title;
      ogDescription = description;
    }

    document.title = title;
    document.documentElement.lang = locale;

    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, ogTitle);
    upsertMeta(
      'meta[property="og:description"]',
      { property: "og:description" },
      ogDescription,
    );
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta(
      'meta[property="og:image"]',
      { property: "og:image" },
      ogImageUrl,
    );
    upsertMeta(
      'meta[property="og:locale"]',
      { property: "og:locale" },
      locale === "es" ? "es_ES" : "en_US",
    );
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, ogTitle);
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      ogDescription,
    );
    upsertMeta('meta[name="twitter:url"]', { name: "twitter:url" }, canonicalUrl);
    upsertMeta(
      'meta[name="twitter:image"]',
      { name: "twitter:image" },
      ogImageUrl,
    );

    upsertLink("canonical", canonicalUrl);
  }, [i18n.language, locale, pathname, tPages, tSeo]);

  return null;
}

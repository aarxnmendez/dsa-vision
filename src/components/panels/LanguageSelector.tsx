import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CodeLanguage } from "../../data/binarySearchCode";
import { CODE_PANEL_TOOLBAR_CONTROL_CLASS } from "../../constants/visualizerTokens";
import { ChevronIcon } from "../ui/ChevronIcon";

const languages: CodeLanguage[] = [
  "python",
  "javascript",
  "java",
  "pseudocode",
];

interface LanguageSelectorProps {
  value: CodeLanguage;
  onChange: (language: CodeLanguage) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const { t } = useTranslation("pages");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-36 min-w-[140px] shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={[
          "w-full flex items-center justify-between gap-2",
          CODE_PANEL_TOOLBAR_CONTROL_CLASS,
        ].join(" ")}
      >
        <span className="font-semibold text-primary truncate">
          {t(`codeLanguages.${value}`)}
        </span>
        <ChevronIcon
          direction="right"
          className={[
            "w-4 h-4 text-on-surface-variant shrink-0 transition-transform",
            isOpen ? "-rotate-90" : "rotate-90",
          ].join(" ")}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t("codeLanguages.python")}
          className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-surface-container-lowest border-2 border-surface-variant rounded-xl shadow-[0_4px_0_0_#dfe3e7] overflow-hidden py-1"
        >
          {languages.map((lang) => {
            const isSelected = value === lang;

            return (
              <li key={lang}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(lang);
                    setIsOpen(false);
                  }}
                  className={[
                    "w-full text-left px-4 py-2.5 font-body-md transition-colors cursor-pointer",
                    isSelected
                      ? "bg-primary-fixed text-primary font-semibold"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary",
                  ].join(" ")}
                >
                  {t(`codeLanguages.${lang}`)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

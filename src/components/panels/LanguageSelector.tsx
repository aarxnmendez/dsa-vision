import { useEffect, useRef, useState } from "react";
import type { CodeLanguage } from "../../data/binarySearchCode";
import { codeLanguageLabels } from "../../data/binarySearchCode";
import { ChevronIcon } from "../ui/ChevronIcon";

const languages = Object.entries(codeLanguageLabels) as [CodeLanguage, string][];

interface LanguageSelectorProps {
  value: CodeLanguage;
  onChange: (language: CodeLanguage) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
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
    <div ref={containerRef} className="relative w-full max-w-[11rem] shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 bg-surface-container-lowest border-2 border-surface-variant rounded-xl px-4 py-2.5 font-body-md text-on-surface hover:border-primary hover:bg-surface-bright transition-colors cursor-pointer"
      >
        <span className="font-semibold text-primary truncate">
          {codeLanguageLabels[value]}
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
          aria-label="Programming language"
          className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-surface-container-lowest border-2 border-surface-variant rounded-xl shadow-[0_4px_0_0_#dfe3e7] overflow-hidden py-1"
        >
          {languages.map(([lang, label]) => {
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
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

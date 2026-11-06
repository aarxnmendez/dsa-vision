import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CATEGORY_ICON_NAMES } from "../../constants/categoryIcons";
import { algorithms } from "../../data/algorithms";
import {
  isAlgorithmAvailable,
  type AvailableAlgorithmMeta,
} from "../../types/algorithm";
import { normalizeText } from "../../utils/catalogFilter";
import { findLastVisitedId, readVisitHistory } from "../../utils/visitHistory";
import {
  RESUME_NAVIGATION_STATE,
  hasSnapshot,
} from "../../utils/visualizerSnapshot";
import { Icon } from "../ui/Icon";

interface PaletteEntry {
  algorithm: AvailableAlgorithmMeta;
  title: string;
  description: string;
  complexity: string;
  /** Opens the visualizer with its last saved data instead of fresh data. */
  resume: boolean;
}

interface CommandPaletteProps {
  onClose: () => void;
}

const LISTBOX_ID = "command-palette-listbox";

function entryKey(entry: PaletteEntry): string {
  return `${entry.algorithm.id}${entry.resume ? "-resume" : ""}`;
}

function matchRank(
  entry: PaletteEntry,
  query: string,
): number | null {
  const title = normalizeText(entry.title);
  if (title.startsWith(query)) {
    return 0;
  }
  if (title.includes(query)) {
    return 1;
  }
  if (normalizeText(entry.algorithm.tags.join(" ")).includes(query)) {
    return 2;
  }
  if (normalizeText(entry.description).includes(query)) {
    return 3;
  }
  return null;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const { t } = useTranslation("common");
  const { t: tCatalog } = useTranslation("catalog");
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [lastVisitedId] = useState(() => {
    const resumableIds = algorithms
      .filter(isAlgorithmAvailable)
      .map((algorithm) => algorithm.id)
      .filter((id) => hasSnapshot(id));
    return findLastVisitedId(readVisitHistory(), resumableIds);
  });

  const entries = useMemo<PaletteEntry[]>(() => {
    const base = algorithms.filter(isAlgorithmAvailable).map((algorithm) => ({
      algorithm,
      title: tCatalog(`algorithms.${algorithm.id}.title`, {
        defaultValue: algorithm.title,
      }),
      description: tCatalog(`algorithms.${algorithm.id}.description`, {
        defaultValue: algorithm.description,
      }),
      complexity: tCatalog(`algorithms.${algorithm.id}.complexity`, {
        defaultValue: algorithm.complexity,
      }),
      resume: false,
    }));

    const normalizedQuery = normalizeText(query.trim());
    if (normalizedQuery.length === 0) {
      const resumeEntry = base.find(
        (entry) => entry.algorithm.id === lastVisitedId,
      );
      return resumeEntry ? [{ ...resumeEntry, resume: true }, ...base] : base;
    }

    return base
      .map((entry) => ({ entry, rank: matchRank(entry, normalizedQuery) }))
      .filter(
        (item): item is { entry: PaletteEntry; rank: number } =>
          item.rank !== null,
      )
      .sort((left, right) => left.rank - right.rank)
      .map((item) => item.entry);
  }, [lastVisitedId, query, tCatalog]);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    listRef.current?.children[activeIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  const select = (entry: PaletteEntry) => {
    navigate(
      entry.algorithm.route,
      entry.resume ? { state: RESUME_NAVIGATION_STATE } : undefined,
    );
    onClose();
  };

  const moveActive = (delta: number) => {
    if (entries.length === 0) {
      return;
    }
    setActiveIndex((current) => (current + delta + entries.length) % entries.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Enter": {
        const entry = entries[activeIndex];
        if (entry) {
          event.preventDefault();
          select(entry);
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        onClose();
        break;
      case "Tab":
        // The input is the only focusable control; keep focus inside the dialog.
        event.preventDefault();
        break;
    }
  };

  const activeEntry = entries[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      onKeyDown={handleKeyDown}
    >
      <div
        className="palette-backdrop absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm"
        onMouseDown={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("palette.title")}
        className="palette-panel relative w-full max-w-xl overflow-hidden rounded-2xl border-2 border-surface-variant border-b-4 bg-surface-container-lowest shadow-[0_24px_64px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-center gap-3 border-b-2 border-surface-variant px-4">
          <Icon
            name="search"
            className="text-xl text-on-surface-variant"
            filled={false}
          />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={LISTBOX_ID}
            aria-autocomplete="list"
            aria-activedescendant={
              activeEntry ? `palette-option-${entryKey(activeEntry)}` : undefined
            }
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder={t("palette.placeholder")}
            aria-label={t("palette.title")}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent py-4 font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none"
          />
          <kbd className="shrink-0 rounded-md border border-surface-variant bg-surface-container px-2 py-0.5 font-body-md text-xs font-semibold text-on-surface-variant">
            esc
          </kbd>
        </div>

        {entries.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-on-surface-variant">
            {t("palette.empty", { query: query.trim() })}
          </p>
        ) : (
          <ul
            ref={listRef}
            id={LISTBOX_ID}
            role="listbox"
            aria-label={t("palette.listLabel")}
            className="max-h-[50vh] overflow-y-auto p-2"
          >
            {entries.map((entry, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={entryKey(entry)}
                  id={`palette-option-${entryKey(entry)}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => select(entry)}
                  className={[
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                    isActive ? "bg-primary-fixed" : "",
                  ].join(" ")}
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-lg text-primary"
                    aria-hidden="true"
                  >
                    <Icon
                      name={CATEGORY_ICON_NAMES[entry.algorithm.category]}
                      filled={false}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-on-surface">
                      {entry.title}
                    </span>
                    <span className="block truncate text-xs text-on-surface-variant">
                      {entry.resume
                        ? t("palette.resume")
                        : entry.description}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-surface-container px-2 py-0.5 text-xs font-bold text-on-surface-variant">
                    {entry.complexity}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center justify-end gap-4 border-t-2 border-surface-variant bg-surface-container-low px-4 py-2 text-xs text-on-surface-variant">
          <span>↑↓ {t("palette.hints.navigate")}</span>
          <span>↵ {t("palette.hints.open")}</span>
          <span>esc {t("palette.hints.close")}</span>
        </div>
      </div>
    </div>
  );
}

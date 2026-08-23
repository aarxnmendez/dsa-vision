import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronIcon } from "./ChevronIcon";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  id?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}

const triggerClass =
  "w-full flex items-center justify-between gap-2 rounded-xl border-2 border-surface-variant bg-surface px-3 py-2 font-body-md text-sm text-on-surface transition-colors hover:border-primary/40 focus:border-primary focus:outline-none";

const menuClass =
  "max-h-52 overflow-y-auto overscroll-contain bg-surface-container-lowest border-2 border-surface-variant rounded-xl shadow-[0_4px_0_0_#dfe3e7] py-1 z-50";

export function Select<T extends string>({
  id,
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackId = useId();
  const triggerId = id ?? fallbackId;
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 50,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest("[data-select-menu]")
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
    <div ref={containerRef} className={["relative w-full", className].join(" ")}>
      <button
        id={triggerId}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={triggerClass}
      >
        <span className="truncate text-left font-medium">{selectedLabel}</span>
        <ChevronIcon
          direction="right"
          className={[
            "h-4 w-4 shrink-0 text-on-surface-variant transition-transform",
            isOpen ? "-rotate-90" : "rotate-90",
          ].join(" ")}
        />
      </button>

      {isOpen &&
        createPortal(
          <ul
            role="listbox"
            aria-labelledby={triggerId}
            data-select-menu
            className={menuClass}
            style={menuStyle}
          >
            {options.map((option) => {
              const isSelected = value === option.value;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={[
                      "w-full cursor-pointer px-3 py-2.5 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-primary-fixed font-semibold text-primary"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </div>
  );
}

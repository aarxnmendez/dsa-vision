import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { Icon } from "../ui/Icon";

interface ComplexityInfoPopoverProps {
  label: string;
  variant: "time" | "space";
  popoverTitle: string;
  popoverText: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const variantClasses = {
  time: "bg-success text-white border-b-4 border-success-dark hover:brightness-110",
  space:
    "bg-tertiary-fixed text-on-tertiary-fixed border-b-4 border-tertiary-fixed-dim hover:brightness-105",
};

const iconNames = {
  time: "timer",
  space: "memory",
} as const;

export function ComplexityInfoPopover({
  label,
  variant,
  popoverTitle,
  popoverText,
  isOpen,
  onToggle,
  onClose,
}: ComplexityInfoPopoverProps) {
  const popoverId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        className={[
          "btn-3d inline-flex items-center gap-2 px-4 py-2 rounded-xl text-body-md font-bold transition-all cursor-pointer",
          variantClasses[variant],
          isOpen ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : "",
        ].join(" ")}
      >
        <Icon name={iconNames[variant]} className="text-[18px]" />
        {label}
        <span
          className={[
            "inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black border",
            variant === "time"
              ? "bg-white/20 border-white/40 text-white"
              : "bg-on-tertiary-fixed/10 border-on-tertiary-fixed/30 text-on-tertiary-fixed",
          ].join(" ")}
          aria-hidden="true"
        >
          ?
        </span>
      </button>

      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={popoverTitle}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 max-w-sm z-50 bg-surface-container-lowest border-2 border-surface-variant rounded-2xl shadow-[0_8px_0_0_#dfe3e7] p-5 text-left"
        >
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface-container-lowest border-l-2 border-t-2 border-surface-variant rotate-45"
            aria-hidden="true"
          />
          <h4 className="font-headline-md text-headline-md text-primary mb-2 relative">
            {popoverTitle}
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed relative">
            {popoverText}
          </p>
          <Link
            to={APP_ROUTES.bigONotation}
            onClick={onClose}
            className="mt-4 inline-flex items-center gap-1 font-body-md text-body-md text-primary hover:underline cursor-pointer transition-colors whitespace-nowrap relative"
          >
            Learn about Big-O Notation
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}

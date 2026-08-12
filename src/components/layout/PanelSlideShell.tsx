import type { CSSProperties, ReactNode } from "react";
import { ChevronIcon } from "../ui/ChevronIcon";
import {
  getPanelShellTransform,
  getToggleAnchorClasses,
  getToggleShapeClasses,
  type PanelSide,
} from "./panelToggle";

interface SidebarToggleButtonProps {
  side: PanelSide;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function SidebarToggleButton({
  side,
  isOpen,
  onToggle,
  className = "",
}: SidebarToggleButtonProps) {
  const chevronDirection = side === "left" ? "left" : "right";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "flex items-center justify-center w-11 h-11 text-primary shrink-0",
        getToggleShapeClasses(side, isOpen),
        "bg-surface border-2 border-surface-variant shadow-md",
        "hover:bg-primary-fixed/40 transition-colors duration-300 ease-in-out cursor-pointer",
        className,
      ].join(" ")}
      aria-label={isOpen ? `Collapse ${side} panel` : `Expand ${side} panel`}
    >
      <ChevronIcon
        direction={chevronDirection}
        className={[
          "w-6 h-6 transition-transform duration-300 ease-in-out",
          isOpen ? "" : "rotate-180",
        ].join(" ")}
      />
    </button>
  );
}

interface PanelSlideShellProps {
  side: PanelSide;
  isOpen: boolean;
  isResizing?: boolean;
  onToggle: () => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function PanelSlideShell({
  side,
  isOpen,
  isResizing = false,
  onToggle,
  className = "",
  style,
  children,
}: PanelSlideShellProps) {
  const anchorClass =
    side === "left"
      ? "fixed left-0 top-0 h-full z-30 overflow-visible pointer-events-none"
      : "fixed right-0 top-0 h-full z-30 overflow-visible pointer-events-none";

  return (
    <div
      className={[
        anchorClass,
        className,
        isResizing ? "transition-none" : "transition-transform duration-300 ease-in-out",
      ].join(" ")}
      style={{
        ...style,
        transform: getPanelShellTransform(side, isOpen),
      }}
    >
      {children}

      <SidebarToggleButton
        side={side}
        isOpen={isOpen}
        onToggle={onToggle}
        className={getToggleAnchorClasses(side, isOpen)}
      />
    </div>
  );
}

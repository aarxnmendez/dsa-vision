import { Link } from "react-router-dom";
import { PanelSlideShell } from "./PanelSlideShell";
import { Icon } from "../ui/Icon";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sectionLabel?: string;
  sectionIcon?: string;
  children: React.ReactNode;
}

const LEFT_PANEL_WIDTH_CLASS = "w-80";

export function LeftSidebar({
  isOpen,
  onToggle,
  sectionLabel,
  sectionIcon = "database",
  children,
}: LeftSidebarProps) {
  return (
    <PanelSlideShell
      side="left"
      isOpen={isOpen}
      onToggle={onToggle}
      className={LEFT_PANEL_WIDTH_CLASS}
    >
      <aside
        className={[
          "h-full flex flex-col p-margin-mobile gap-stack-md",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
          "bg-surface-container-low text-primary font-body-md text-body-md",
          "border-r-4 border-surface-container-highest overflow-y-auto",
        ].join(" ")}
      >
        <div className="flex flex-col gap-4 mb-2">
          <div className="font-display text-headline-md font-black text-primary tracking-tight">
            DSAVision
          </div>
          <Link
            to="/"
            className="self-start flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors bg-surface-container-lowest px-4 py-2 rounded-xl border-b-4 border-surface-variant btn-3d cursor-pointer"
          >
            <Icon name="arrow_back" className="text-[20px]" />
            Back to Catalog
          </Link>
        </div>

        {sectionLabel && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-2 bg-surface-container text-on-surface-variant font-label-caps text-label-caps px-3 py-2 rounded-xl border border-surface-variant">
              <Icon name={sectionIcon} className="text-[18px]" />
              {sectionLabel}
            </span>
          </div>
        )}

        {children}
      </aside>
    </PanelSlideShell>
  );
}

interface RightPanelProps {
  isOpen: boolean;
  width: number;
  isResizing: boolean;
  onToggle: () => void;
  onResizeStart: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}

export function RightPanel({
  isOpen,
  width,
  isResizing,
  onToggle,
  onResizeStart,
  children,
}: RightPanelProps) {
  return (
    <PanelSlideShell
      side="right"
      isOpen={isOpen}
      isResizing={isResizing}
      onToggle={onToggle}
      style={{ width }}
    >
      <aside
        className={[
          "relative h-full w-full flex overflow-hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
          "bg-surface-container-lowest border-l-4 border-surface-variant",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Resize code panel"
          onMouseDown={onResizeStart}
          className={[
            "absolute left-0 top-0 h-full w-2 -translate-x-1/2 cursor-col-resize z-10 group",
            "hover:bg-primary/20 active:bg-primary/30 transition-colors",
          ].join(" ")}
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-surface-variant group-hover:bg-primary group-active:bg-primary transition-colors" />
        </button>

        <div className="flex flex-col h-full w-full min-w-0 overflow-hidden">
          {children}
        </div>
      </aside>
    </PanelSlideShell>
  );
}

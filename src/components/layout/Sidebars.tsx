import { Link } from "react-router-dom";
import { LEFT_PANEL_SCROLL_CLASS } from "../../constants/visualizerTokens";
import { PanelSlideShell } from "./PanelSlideShell";
import { Icon, type IconName } from "../ui/Icon";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sectionLabel?: string;
  sectionIcon?: IconName;
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
          "h-full flex min-h-0 flex-col overflow-hidden p-margin-mobile",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
          "bg-surface-container-low text-primary font-body-md text-body-md",
          "border-r-4 border-surface-container-highest",
        ].join(" ")}
      >
        <div className="flex shrink-0 flex-col gap-3 pb-3">
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

          {sectionLabel && (
            <span className="inline-flex w-fit items-center gap-2 bg-surface-container text-on-surface-variant font-label-caps text-label-caps px-3 py-2 rounded-xl border border-surface-variant">
              <Icon name={sectionIcon} className="text-[18px]" />
              {sectionLabel}
            </span>
          )}
        </div>

        <div className={LEFT_PANEL_SCROLL_CLASS}>{children}</div>
      </aside>
    </PanelSlideShell>
  );
}

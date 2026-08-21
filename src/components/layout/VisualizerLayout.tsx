import { useState, type ReactNode } from "react";
import { COMPACT_LAYOUT_QUERY } from "../../constants/breakpoints";
import { ComplexityBadges } from "../panels/ComplexityBadges";
import type { ComponentProps } from "react";
import type { IconName } from "../ui/Icon";
import { LeftSidebar } from "./Sidebars";

type ComplexityBadgesProps = ComponentProps<typeof ComplexityBadges>;

const LEFT_PANEL_WIDTH_PX = 320;

function getInitialLeftSidebarOpenState() {
  if (typeof window === "undefined") {
    return true;
  }

  return !window.matchMedia(COMPACT_LAYOUT_QUERY).matches;
}

interface VisualizerLayoutProps {
  title: string;
  description?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  timeComplexityInfo?: ComplexityBadgesProps["timeInfo"];
  spaceComplexityInfo?: ComplexityBadgesProps["spaceInfo"];
  leftPanelSectionLabel?: string;
  leftPanelSectionIcon?: IconName;
  leftPanel: ReactNode;
  children: ReactNode;
}

export function VisualizerLayout({
  title,
  description,
  timeComplexity,
  spaceComplexity,
  timeComplexityInfo,
  spaceComplexityInfo,
  leftPanelSectionLabel,
  leftPanelSectionIcon,
  leftPanel,
  children,
}: VisualizerLayoutProps) {
  const [isLeftOpen, setIsLeftOpen] = useState(getInitialLeftSidebarOpenState);

  return (
    <div className="bg-background text-on-surface font-body-md h-screen overflow-hidden flex">
      <LeftSidebar
        isOpen={isLeftOpen}
        onToggle={() => setIsLeftOpen((open) => !open)}
        sectionLabel={leftPanelSectionLabel}
        sectionIcon={leftPanelSectionIcon}
      >
        {leftPanel}
      </LeftSidebar>

      <main
        className="flex-1 flex min-h-0 flex-col overflow-y-auto bg-surface transition-[margin] duration-300"
        style={{
          marginLeft: isLeftOpen ? LEFT_PANEL_WIDTH_PX : 0,
        }}
      >
        <header className="flex w-full shrink-0 items-center justify-center border-b-4 border-surface-container-highest bg-surface px-base py-4">
          <div className="flex min-w-0 max-w-3xl flex-col items-center gap-3 text-center">
            <h1 className="text-headline-lg font-black tracking-tight text-primary">
              {title}
            </h1>
            <ComplexityBadges
              timeComplexity={timeComplexity}
              spaceComplexity={spaceComplexity}
              timeInfo={timeComplexityInfo}
              spaceInfo={spaceComplexityInfo}
            />
            {description && (
              <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            )}
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

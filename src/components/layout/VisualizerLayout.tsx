import { useEffect, useRef, useState, type ReactNode } from "react";
import { COMPACT_LAYOUT_QUERY } from "../../constants/breakpoints";
import { ComplexityBadges } from "../panels/ComplexityBadges";
import { LeftSidebar, RightPanel } from "./Sidebars";

const DEFAULT_RIGHT_WIDTH = 448;
const MIN_RIGHT_WIDTH = 300;
const MAX_RIGHT_WIDTH = 600;
const LEFT_PANEL_WIDTH_PX = 320;

function getInitialSidebarOpenState() {
  if (typeof window === "undefined") {
    return { isLeftOpen: true, isRightOpen: true };
  }

  const isCompactLayout = window.matchMedia(COMPACT_LAYOUT_QUERY).matches;

  return {
    isLeftOpen: !isCompactLayout,
    isRightOpen: !isCompactLayout,
  };
}

interface VisualizerLayoutProps {
  title: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  leftPanelSectionLabel?: string;
  leftPanelSectionIcon?: string;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  children: ReactNode;
}

export function VisualizerLayout({
  title,
  timeComplexity,
  spaceComplexity,
  leftPanelSectionLabel,
  leftPanelSectionIcon,
  leftPanel,
  rightPanel,
  children,
}: VisualizerLayoutProps) {
  const initialSidebarState = getInitialSidebarOpenState();
  const [isLeftOpen, setIsLeftOpen] = useState(initialSidebarState.isLeftOpen);
  const [isRightOpen, setIsRightOpen] = useState(
    initialSidebarState.isRightOpen,
  );
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(DEFAULT_RIGHT_WIDTH);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      const delta = resizeStartX.current - event.clientX;
      const nextWidth = Math.min(
        MAX_RIGHT_WIDTH,
        Math.max(MIN_RIGHT_WIDTH, resizeStartWidth.current + delta),
      );
      setRightWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (event: React.MouseEvent) => {
    event.preventDefault();
    resizeStartX.current = event.clientX;
    resizeStartWidth.current = rightWidth;
    setIsResizing(true);
  };

  return (
    <div
      className={[
        "bg-background text-on-surface font-body-md h-screen overflow-hidden flex",
        isResizing ? "cursor-col-resize" : "",
      ].join(" ")}
    >
      <LeftSidebar
        isOpen={isLeftOpen}
        onToggle={() => setIsLeftOpen((open) => !open)}
        sectionLabel={leftPanelSectionLabel}
        sectionIcon={leftPanelSectionIcon}
      >
        {leftPanel}
      </LeftSidebar>

      <main
        className={[
          "flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-surface",
          isResizing ? "" : "transition-[margin] duration-300",
        ].join(" ")}
        style={{
          marginLeft: isLeftOpen ? LEFT_PANEL_WIDTH_PX : 0,
          marginRight: isRightOpen ? rightWidth : 0,
        }}
      >
        <header className="flex items-center justify-center w-full px-base py-3 bg-surface border-b-4 border-surface-container-highest shrink-0">
          <div className="flex flex-col items-center text-center min-w-0 gap-2">
            <h1 className="text-headline-lg font-black text-primary tracking-tight">
              {title}
            </h1>
            <ComplexityBadges
              timeComplexity={timeComplexity}
              spaceComplexity={spaceComplexity}
            />
          </div>
        </header>

        {children}
      </main>

      <RightPanel
        isOpen={isRightOpen}
        width={rightWidth}
        onToggle={() => setIsRightOpen((open) => !open)}
        onResizeStart={handleResizeStart}
        isResizing={isResizing}
      >
        {rightPanel}
      </RightPanel>
    </div>
  );
}

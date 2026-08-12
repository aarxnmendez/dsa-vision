import type { ReactNode } from "react";
import { FIRST_ROW_CAPACITY } from "../visualizers/ArrayVisualizer";

interface VisualizerCanvasProps {
  cellCount: number;
  visualizer: ReactNode;
  statusContent: ReactNode;
}

export function VisualizerCanvas({
  cellCount,
  visualizer,
  statusContent,
}: VisualizerCanvasProps) {
  const isMultiRow = cellCount > FIRST_ROW_CAPACITY;
  const messageTopClass = isMultiRow
    ? "top-[calc(50%+11rem)]"
    : "top-[calc(50%+3.5rem)]";

  return (
    <div className="flex-1 relative min-w-0 min-h-0 overflow-x-hidden overflow-y-visible pb-24 select-none">
      <div className="h-full min-h-0 grid grid-rows-[1fr]">
        <div className="flex items-center justify-center min-h-0 min-w-0 overflow-x-hidden overflow-y-visible -translate-y-16">
          {visualizer}
        </div>
      </div>

      <div
        className={[
          "absolute inset-x-0 flex justify-center px-4 -translate-y-16",
          messageTopClass,
        ].join(" ")}
      >
        <div className="w-full max-w-lg text-center">{statusContent}</div>
      </div>
    </div>
  );
}

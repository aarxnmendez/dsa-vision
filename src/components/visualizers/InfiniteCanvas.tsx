import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../ui/Icon";

interface InfiniteCanvasProps {
  children: ReactNode;
  worldWidth: number;
  worldHeight: number;
  isFocused: boolean;
  onFocusChange: (focused: boolean) => void;
  className?: string;
}

interface ViewTransform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.35;
const MAX_SCALE = 2.5;

const VIEWPORT_DOT_GRID_STYLE = {
  backgroundColor: "var(--color-surface-container-low)",
  backgroundImage:
    "radial-gradient(circle, rgba(150, 150, 150, 0.2) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
} as const;

function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export function InfiniteCanvas({
  children,
  worldWidth,
  worldHeight,
  isFocused,
  onFocusChange,
  className = "",
}: InfiniteCanvasProps) {
  const { t } = useTranslation("common");
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [transform, setTransform] = useState<ViewTransform>({ x: 24, y: 24, scale: 1 });

  const fitToView = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const padding = 32;
    const availableWidth = viewport.clientWidth - padding * 2;
    const availableHeight = viewport.clientHeight - padding * 2;
    const scale = clampScale(
      Math.min(availableWidth / worldWidth, availableHeight / worldHeight, 1),
    );
    const x = (viewport.clientWidth - worldWidth * scale) / 2;
    const y = (viewport.clientHeight - worldHeight * scale) / 2;

    setTransform({ x, y, scale });
  }, [worldHeight, worldWidth]);

  useEffect(() => {
    fitToView();
  }, [fitToView, worldHeight, worldWidth, isFocused]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const zoomFactor = event.deltaY > 0 ? 0.92 : 1.08;

    setTransform((current) => {
      const nextScale = clampScale(current.scale * zoomFactor);
      const worldX = (pointerX - current.x) / current.scale;
      const worldY = (pointerY - current.y) / current.scale;
      const x = pointerX - worldX * nextScale;
      const y = pointerY - worldY * nextScale;

      return { x, y, scale: nextScale };
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    setTransform((current) => ({
      ...current,
      x: dragState.originX + deltaX,
      y: dragState.originY + deltaY,
    }));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const zoomBy = (factor: number) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const centerX = viewport.clientWidth / 2;
    const centerY = viewport.clientHeight / 2;

    setTransform((current) => {
      const nextScale = clampScale(current.scale * factor);
      const worldX = (centerX - current.x) / current.scale;
      const worldY = (centerY - current.y) / current.scale;
      return {
        x: centerX - worldX * nextScale,
        y: centerY - worldY * nextScale,
        scale: nextScale,
      };
    });
  };

  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border border-surface-variant bg-surface-container-low",
        isFocused ? "h-full min-h-0 flex-1" : "h-[min(70vh,520px)]",
        className,
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onFocusChange(!isFocused)}
        aria-label={t("aria.algorithmVisualization")}
        className="absolute right-3 top-3 z-20 flex size-10 items-center justify-center rounded-xl border border-surface-variant bg-surface-container-lowest text-on-surface shadow-sm transition hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <Icon
          name={isFocused ? "fullscreen_exit" : "fullscreen"}
          className="text-xl"
        />
      </button>

      <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          aria-label={t("infiniteCanvas.zoomIn")}
          onClick={() => zoomBy(1.12)}
          className="flex size-9 items-center justify-center rounded-lg border border-surface-variant bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container"
        >
          <Icon name="add" className="text-lg" />
        </button>
        <button
          type="button"
          aria-label={t("infiniteCanvas.zoomOut")}
          onClick={() => zoomBy(0.88)}
          className="flex size-9 items-center justify-center rounded-lg border border-surface-variant bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container"
        >
          <Icon name="remove" className="text-lg" />
        </button>
        <button
          type="button"
          aria-label={t("infiniteCanvas.resetView")}
          onClick={fitToView}
          className="flex size-9 items-center justify-center rounded-lg border border-surface-variant bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container"
        >
          <Icon name="my_location" className="text-lg" />
        </button>
      </div>

      <div
        ref={viewportRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        style={VIEWPORT_DOT_GRID_STYLE}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="infinite-canvas-world relative"
          style={{
            width: worldWidth,
            height: worldHeight,
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

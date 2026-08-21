import { SPEED_MAX_MS, SPEED_MIN_MS } from "../../constants/player";
import { compactButtonLabelClass } from "../ui/buttonLabel";
import { Icon } from "../ui/Icon";

interface PlayerControlsProps {
  currentIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  minSpeedMs?: number;
  maxSpeedMs?: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onNext: () => void;
  onPrev: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const controlButtonBase = [
  "btn-3d flex flex-col items-center justify-center rounded-xl border-b-4 p-2 transition-all",
  compactButtonLabelClass,
  "hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-2 disabled:cursor-not-allowed cursor-pointer",
].join(" ");

const secondaryControlButtonClass = [
  controlButtonBase,
  "bg-surface-variant text-on-surface-variant border-surface-container-highest hover:bg-surface-container-highest disabled:opacity-40",
].join(" ");

const primaryControlButtonClass = [
  controlButtonBase,
  "bg-primary text-on-primary border-on-primary-fixed-variant hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50",
].join(" ");

export function PlayerControls({
  currentIndex,
  totalSteps,
  isPlaying,
  speed,
  canGoBack,
  canGoForward,
  onNext,
  onPrev,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  minSpeedMs = SPEED_MIN_MS,
  maxSpeedMs = SPEED_MAX_MS,
}: PlayerControlsProps) {
  const invertedSpeed = maxSpeedMs + minSpeedMs - speed;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-center gap-stack-md items-center px-gutter bg-surface-container text-primary font-label-caps text-label-caps rounded-t-2xl border-t-4 border-surface-container-highest shadow-[0_-8px_30px_rgba(0,0,0,0.1)] py-2">
      <div className="flex items-center gap-6 pr-8 border-r-2 border-surface-variant">
        <span className={`${compactButtonLabelClass} text-on-surface-variant`}>
          Speed
        </span>
        <input
          type="range"
          min={minSpeedMs}
          max={maxSpeedMs}
          step={25}
          value={invertedSpeed}
          onChange={(event) =>
            onSpeedChange(
              maxSpeedMs + minSpeedMs - Number(event.target.value),
            )
          }
          className="w-40 h-2 bg-surface-variant rounded-full appearance-none accent-primary cursor-pointer"
        />
      </div>

      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoBack}
        className={secondaryControlButtonClass}
      >
        <Icon name="skip_previous" className="text-[24px]" />
        <span className={`mt-1 text-[10px] ${compactButtonLabelClass}`}>Back</span>
      </button>

      <button
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        disabled={totalSteps === 0}
        className={primaryControlButtonClass}
      >
        <Icon
          name={isPlaying ? "pause" : "play_arrow"}
          className="text-[24px]"
        />
        <span className={`mt-1 text-[10px] ${compactButtonLabelClass}`}>
          {isPlaying ? "Pause" : "Play"}
        </span>
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoForward}
        className={secondaryControlButtonClass}
      >
        <Icon name="skip_next" className="text-[24px]" />
        <span className={`mt-1 text-[10px] ${compactButtonLabelClass}`}>
          Forward
        </span>
      </button>

      <button
        type="button"
        onClick={onReset}
        className={[secondaryControlButtonClass, "ml-4"].join(" ")}
      >
        <Icon name="refresh" className="text-[24px]" />
        <span className={`mt-1 text-[10px] ${compactButtonLabelClass}`}>Reset</span>
      </button>

      <span className="sr-only">
        Step {currentIndex + 1} of {totalSteps}
      </span>
    </nav>
  );
}

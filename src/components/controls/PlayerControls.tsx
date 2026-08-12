import { SPEED_MAX_MS, SPEED_MIN_MS } from "../../constants/player";
import { Icon } from "../ui/Icon";

interface PlayerControlsProps {
  currentIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onNext: () => void;
  onPrev: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

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
}: PlayerControlsProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-center gap-stack-md items-center px-gutter bg-surface-container text-primary font-label-caps text-label-caps rounded-t-2xl border-t-4 border-surface-container-highest shadow-[0_-8px_30px_rgba(0,0,0,0.1)] py-2">
      <div className="flex items-center gap-6 pr-8 border-r-2 border-surface-variant">
        <span className="font-bold text-on-surface-variant">Speed</span>
        <input
          type="range"
          min={SPEED_MIN_MS}
          max={SPEED_MAX_MS}
          step={25}
          value={SPEED_MAX_MS + SPEED_MIN_MS - speed}
          onChange={(event) =>
            onSpeedChange(
              SPEED_MAX_MS + SPEED_MIN_MS - Number(event.target.value),
            )
          }
          className="w-40 h-2 bg-surface-variant rounded-full appearance-none accent-primary cursor-pointer"
        />
      </div>

      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoBack}
        className="flex flex-col items-center justify-center bg-surface-variant text-on-surface-variant rounded-xl border-b-4 border-surface-container-highest p-2 hover:translate-y-[-2px] hover:bg-surface-container-highest transition-all active:translate-y-[2px] active:border-b-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <Icon name="skip_previous" className="text-[24px]" />
        <span className="mt-1 text-[10px]">Back</span>
      </button>

      <button
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        disabled={totalSteps === 0}
        className="flex flex-col items-center justify-center bg-success text-white rounded-2xl border-b-4 border-success-dark p-3 hover:translate-y-[-4px] transition-all hover:brightness-110 active:translate-y-[4px] active:border-b-2 shadow-xl mx-4 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Icon
          name={isPlaying ? "pause" : "play_arrow"}
          className="text-[32px] relative z-10"
        />
        <span className="mt-1 text-sm font-black tracking-widest relative z-10">
          {isPlaying ? "Pause" : "Play"}
        </span>
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoForward}
        className="flex flex-col items-center justify-center bg-surface-variant text-on-surface-variant rounded-xl border-b-4 border-surface-container-highest p-2 hover:translate-y-[-2px] hover:bg-surface-container-highest transition-all active:translate-y-[2px] active:border-b-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <Icon name="skip_next" className="text-[24px]" />
        <span className="mt-1 text-[10px]">Forward</span>
      </button>

      <button
        type="button"
        onClick={onReset}
        className="flex flex-col items-center justify-center text-error rounded-xl p-2 hover:bg-error/10 transition-colors ml-4 cursor-pointer"
      >
        <Icon name="refresh" className="text-[24px]" />
        <span className="mt-1 text-[10px]">Reset</span>
      </button>

      <span className="sr-only">
        Step {currentIndex + 1} of {totalSteps}
      </span>
    </nav>
  );
}

import { SPEED_MAX_MS, SPEED_MIN_MS } from "../constants/player";
import { useCallback, useEffect, useState } from "react";

export const IDLE_STEP_INDEX = -1;

interface UsePlayerControlsOptions {
  totalSteps: number;
  initialSpeed?: number;
}

function clampSpeed(speed: number) {
  return Math.min(SPEED_MAX_MS, Math.max(SPEED_MIN_MS, speed));
}

export function usePlayerControls({
  totalSteps,
  initialSpeed = SPEED_MIN_MS,
}: UsePlayerControlsOptions) {
  const [currentIndex, setCurrentIndex] = useState(IDLE_STEP_INDEX);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(() => clampSpeed(initialSpeed));

  const onNext = useCallback(() => {
    setCurrentIndex((index) => {
      const nextIndex = Math.min(index + 1, totalSteps - 1);
      if (nextIndex >= totalSteps - 1) {
        window.setTimeout(() => setIsPlaying(false), 0);
      }
      return nextIndex;
    });
  }, [totalSteps]);

  const onPrev = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, IDLE_STEP_INDEX));
  }, []);

  const onPlay = useCallback(() => {
    if (totalSteps === 0) return;
    setCurrentIndex((index) =>
      index >= totalSteps - 1 ? IDLE_STEP_INDEX : index,
    );
    setIsPlaying(true);
  }, [totalSteps]);

  const onPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(IDLE_STEP_INDEX);
  }, []);

  const handleSpeedChange = useCallback((value: number) => {
    setSpeed(clampSpeed(value));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentIndex < 0) {
      const timer = window.setTimeout(() => {
        setCurrentIndex(0);
      }, speed);
      return () => window.clearTimeout(timer);
    }

    if (currentIndex >= totalSteps - 1) return;

    const timer = window.setTimeout(() => {
      setCurrentIndex((index) => {
        const nextIndex = Math.min(index + 1, totalSteps - 1);
        if (nextIndex >= totalSteps - 1) {
          window.setTimeout(() => setIsPlaying(false), 0);
        }
        return nextIndex;
      });
    }, speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, currentIndex, speed, totalSteps]);

  return {
    currentIndex,
    isIdle: currentIndex < 0,
    setCurrentIndex,
    isPlaying,
    speed,
    setSpeed: handleSpeedChange,
    onNext,
    onPrev,
    onPlay,
    onPause,
    onReset,
    canGoBack: currentIndex > IDLE_STEP_INDEX,
    canGoForward: currentIndex < totalSteps - 1,
  };
}

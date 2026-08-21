import {
  VISUALIZER_IDLE_STATUS_CLASS,
  VISUALIZER_IDLE_STATUS_TEXT_CLASS,
} from "../../constants/visualizerTokens";

interface VisualizerIdleStatusProps {
  message: string;
}

export function VisualizerIdleStatus({ message }: VisualizerIdleStatusProps) {
  return (
    <div className={VISUALIZER_IDLE_STATUS_CLASS}>
      <p className={VISUALIZER_IDLE_STATUS_TEXT_CLASS}>{message}</p>
    </div>
  );
}

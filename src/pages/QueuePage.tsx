import { useTranslation } from "react-i18next";
import { getStepTransitionMs } from "../constants/player";
import { queueCode } from "../data/queueCode";
import { buildQueueDisplayState } from "../algorithms/queueOperations";
import { QueueSetupPanel } from "../components/controls/QueueSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { AlgorithmExplanationContent } from "../components/panels/AlgorithmExplanationContent";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { StatusCard } from "../components/panels/StatusCard";
import {
  QueueStructureLegendBar,
  QueueVisualizer,
} from "../components/structures/QueueVisualizer";
import { VisualizerIdleStatus } from "../components/visualizers/VisualizerIdleStatus";
import { useQueueStructureVisualizer } from "../hooks/useQueueStructureVisualizer";
import {
  useAlgorithmExplanation,
  usePageMeta,
} from "../hooks/useAlgorithmExplanation";
import { DATA_SETUP_ICON } from "../constants/copy";
import { formatQueueStatusContext } from "../utils/formatQueueStatusContext";

export function QueuePage() {
  const { t } = useTranslation("common");
  const { t: tStructures } = useTranslation("structures");
  const pageMeta = usePageMeta("queue");
  const explanation = useAlgorithmExplanation("queue");
  const visualizer = useQueueStructureVisualizer();
  const transitionMs = getStepTransitionMs(visualizer.speed);

  const idleDisplay = buildQueueDisplayState(
    visualizer.values,
    visualizer.maxCapacity,
  );

  const displayItems = visualizer.currentStep?.items ?? idleDisplay.items;
  const displaySize = visualizer.currentStep?.size ?? idleDisplay.size;
  const displayMaxCapacity =
    visualizer.currentStep?.maxCapacity ?? visualizer.maxCapacity;

  const statusContent = visualizer.currentStep ? (
    <StatusCard
      title={visualizer.currentStep.statusTitle}
      detail={visualizer.currentStep.stepMessage}
      pointerMovement={formatQueueStatusContext(
        visualizer.currentStep,
        tStructures,
      )}
      isSuccess={
        visualizer.currentStep.found ||
        visualizer.currentStep.phase === "complete"
      }
      isError={visualizer.currentStep.isError}
    />
  ) : (
    <VisualizerIdleStatus message={t("idle.queue")} />
  );

  return (
    <VisualizerLayout
      title={pageMeta.title}
      description={pageMeta.description}
      timeComplexity="O(1)"
      spaceComplexity="O(n)"
      timeComplexityInfo={pageMeta.timeComplexityInfo}
      spaceComplexityInfo={pageMeta.spaceComplexityInfo}
      leftPanelSectionLabel={t("dataSetup.label")}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <QueueSetupPanel
          values={visualizer.values}
          queueSize={visualizer.queueSize}
          operation={visualizer.operation}
          enqueueValue={visualizer.enqueueValue}
          onQueueSizeChange={visualizer.setQueueSize}
          onRandomize={visualizer.randomizeData}
          onApplyCustomDataset={visualizer.applyCustomDataset}
          onOperationChange={visualizer.setOperation}
          onEnqueueValueChange={visualizer.setEnqueueValue}
        />
      }
    >
      <AlgorithmPageShell
        bottomColumnsOrder="explanation-first"
        heroLegend={<QueueStructureLegendBar />}
        hero={
          <div className="flex w-full items-center justify-center py-2">
            <QueueVisualizer
              items={displayItems}
              maxCapacity={displayMaxCapacity}
              size={displaySize}
              operation={visualizer.currentStep?.operation ?? visualizer.operation}
              phase={visualizer.currentStep?.phase}
              isError={visualizer.currentStep?.isError}
              stepTransitionMs={transitionMs}
            />
          </div>
        }
        statusSection={statusContent}
        codeColumn={
          <CodePanel
            codeByLanguage={queueCode}
            activeLine={visualizer.currentStep?.codeLine ?? 1}
            stepExplanation={visualizer.currentStep?.stepExplanation}
            showStepFooter
          />
        }
        explanationColumn={
          <ExplanationPanelShell>
            <AlgorithmExplanationContent {...explanation} />
          </ExplanationPanelShell>
        }
        playerControls={
          <PlayerControls
            currentIndex={visualizer.currentIndex}
            totalSteps={visualizer.steps.length}
            isPlaying={visualizer.isPlaying}
            speed={visualizer.speed}
            canGoBack={visualizer.canGoBack}
            canGoForward={visualizer.canGoForward}
            onNext={visualizer.onNext}
            onPrev={visualizer.onPrev}
            onPlay={visualizer.onPlay}
            onPause={visualizer.onPause}
            onReset={visualizer.onReset}
            onSpeedChange={visualizer.setSpeed}
          />
        }
      />
    </VisualizerLayout>
  );
}

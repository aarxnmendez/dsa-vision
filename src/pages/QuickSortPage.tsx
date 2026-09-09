import { useTranslation } from "react-i18next";
import { getStepTransitionMs } from "../constants/player";
import { quickSortCode } from "../data/quickSortCode";
import { QuickSortSetupPanel } from "../components/controls/QuickSortSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { AlgorithmExplanationContent } from "../components/panels/AlgorithmExplanationContent";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { StatusCard } from "../components/panels/StatusCard";
import { SortBarVisualizer, SortLegendBar } from "../components/visualizers/SortBarVisualizer";
import { VisualizerIdleStatus } from "../components/visualizers/VisualizerIdleStatus";
import { useQuickSortVisualizer } from "../hooks/useQuickSortVisualizer";
import {
  useAlgorithmExplanation,
  usePageMeta,
} from "../hooks/useAlgorithmExplanation";
import { DATA_SETUP_ICON } from "../constants/copy";

export function QuickSortPage() {
  const { t } = useTranslation("common");
  const pageMeta = usePageMeta("quickSort");
  const explanation = useAlgorithmExplanation("quickSort");
  const visualizer = useQuickSortVisualizer();
  const transitionMs = getStepTransitionMs(visualizer.speed);
  const defaultHighlights = visualizer.array.map(() => "default" as const);

  const statusContent = visualizer.currentStep ? (
    <StatusCard
      title={visualizer.currentStep.statusTitle}
      detail={visualizer.currentStep.statusDetail}
      pointerMovement={
        visualizer.currentStep.subArrayRange
          ? `Active range: [${visualizer.currentStep.subArrayRange[0]}..${visualizer.currentStep.subArrayRange[1]}]`
          : undefined
      }
      isSuccess={visualizer.currentStep.isComplete}
    />
  ) : (
    <VisualizerIdleStatus message={t("idle.visualizer")} />
  );

  return (
    <VisualizerLayout
      title={pageMeta.title}
      description={pageMeta.description}
      timeComplexity="O(n log n) avg"
      spaceComplexity="O(log n)"
      timeComplexityInfo={pageMeta.timeComplexityInfo}
      spaceComplexityInfo={pageMeta.spaceComplexityInfo}
      leftPanelSectionLabel={t("dataSetup.label")}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <QuickSortSetupPanel
          arraySize={visualizer.arraySize}
          pivotStrategy={visualizer.pivotStrategy}
          customInputDescription={pageMeta.customInputHint}
          onArraySizeChange={visualizer.setArraySize}
          onRandomize={visualizer.randomizeData}
          onApplyCustomDataset={visualizer.applyCustomDataset}
          onPivotStrategyChange={visualizer.setPivotStrategy}
        />
      }
    >
      <AlgorithmPageShell
        bottomColumnsOrder="explanation-first"
        heroLegend={<SortLegendBar />}
        hero={
          <SortBarVisualizer
            currentArray={visualizer.currentArray}
            trackedValues={visualizer.array}
            highlights={
              visualizer.barHighlights.length > 0
                ? visualizer.barHighlights
                : defaultHighlights
            }
            stepTransitionMs={transitionMs}
          />
        }
        statusSection={statusContent}
        codeColumn={
          <CodePanel
            codeByLanguage={quickSortCode}
            activeLine={visualizer.currentStep?.activeLine ?? 1}
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

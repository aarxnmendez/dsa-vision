import { useTranslation } from "react-i18next";
import { getStepTransitionMs } from "../constants/player";
import { insertionSortCode } from "../data/insertionSortCode";
import { DatasetSetupPanel } from "../components/controls/DatasetSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { AlgorithmExplanationContent } from "../components/panels/AlgorithmExplanationContent";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { StatusCard } from "../components/panels/StatusCard";
import { SortBarVisualizer, SortLegendBar } from "../components/visualizers/SortBarVisualizer";
import { VisualizerIdleStatus } from "../components/visualizers/VisualizerIdleStatus";
import { useInsertionSortVisualizer } from "../hooks/useInsertionSortVisualizer";
import {
  useAlgorithmExplanation,
  usePageMeta,
} from "../hooks/useAlgorithmExplanation";
import { DATA_SETUP_ICON } from "../constants/copy";

export function InsertionSortPage() {
  const { t } = useTranslation("common");
  const pageMeta = usePageMeta("insertionSort");
  const explanation = useAlgorithmExplanation("insertionSort");
  const visualizer = useInsertionSortVisualizer();
  const transitionMs = getStepTransitionMs(visualizer.speed);
  const defaultHighlights = visualizer.array.map(() => "default" as const);

  const statusContent = visualizer.currentStep ? (
    <StatusCard
      title={visualizer.currentStep.statusTitle}
      detail={visualizer.currentStep.statusDetail}
      isSuccess={visualizer.currentStep.isComplete}
    />
  ) : (
    <VisualizerIdleStatus message={t("idle.visualizer")} />
  );

  return (
    <VisualizerLayout
      title={pageMeta.title}
      description={pageMeta.description}
      timeComplexity="O(n²)"
      spaceComplexity="O(1)"
      timeComplexityInfo={pageMeta.timeComplexityInfo}
      spaceComplexityInfo={pageMeta.spaceComplexityInfo}
      leftPanelSectionLabel={t("dataSetup.label")}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <DatasetSetupPanel
          arraySize={visualizer.arraySize}
          onArraySizeChange={visualizer.setArraySize}
          onRandomize={visualizer.randomizeData}
          preserveArrayOrder
          customInputDescription={pageMeta.customInputHint}
          arrayPlaceholder="64, 25, 12, 22, 11"
          onApplyCustomDataset={({ array }) =>
            visualizer.applyCustomDataset(array)
          }
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
            codeByLanguage={insertionSortCode}
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

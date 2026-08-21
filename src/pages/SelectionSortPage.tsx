import { getStepTransitionMs } from "../constants/player";
import { selectionSortCode } from "../data/selectionSortCode";
import { SortDatasetSetupPanel } from "../components/controls/SortDatasetSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { SelectionSortExplanationPanel } from "../components/panels/SelectionSortExplanationPanel";
import { StatusCard } from "../components/panels/StatusCard";
import { SortBarVisualizer, SortLegendBar } from "../components/visualizers/SortBarVisualizer";
import { useSelectionSortVisualizer } from "../hooks/useSelectionSortVisualizer";
import {
  SELECTION_SORT_SPACE_INFO,
  SELECTION_SORT_TIME_INFO,
} from "../constants/visualizerTokens";

const PAGE_DESCRIPTION =
  "In-place comparison sort that selects the minimum each pass and swaps it forward.";

export function SelectionSortPage() {
  const visualizer = useSelectionSortVisualizer();
  const transitionMs = getStepTransitionMs(
    visualizer.speed,
    visualizer.minSpeedMs,
  );
  const defaultHighlights = visualizer.array.map(() => "default" as const);

  const statusContent = visualizer.currentStep ? (
    <StatusCard
      title={visualizer.currentStep.statusTitle}
      detail={visualizer.currentStep.statusDetail}
      isSuccess={visualizer.currentStep.isComplete}
    />
  ) : (
    <p className="font-body-md text-body-md text-on-surface-variant text-center">
      Configure the array in the left panel, then press Play or Forward to begin
      the step-by-step visualization.
    </p>
  );

  return (
    <VisualizerLayout
      title="Selection Sort"
      description={PAGE_DESCRIPTION}
      timeComplexity="O(n²)"
      spaceComplexity="O(1)"
      timeComplexityInfo={SELECTION_SORT_TIME_INFO}
      spaceComplexityInfo={SELECTION_SORT_SPACE_INFO}
      showRightPanel={false}
      leftPanelSectionLabel="Array Setup"
      leftPanelSectionIcon="sort"
      leftPanel={
        <SortDatasetSetupPanel
          arraySize={visualizer.arraySize}
          onArraySizeChange={visualizer.setArraySize}
          onRandomize={visualizer.randomizeData}
          onApplyCustomDataset={visualizer.applyCustomDataset}
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
            variant="embedded"
            codeByLanguage={selectionSortCode}
            codeSectionLabel="Implementation"
            activeLine={visualizer.currentStep?.activeLine ?? 1}
            stepExplanation={
              visualizer.currentStep?.stepExplanation ??
              "Ready to start sorting."
            }
            showStepFooter
          />
        }
        explanationColumn={
          <ExplanationPanelShell>
            <SelectionSortExplanationPanel />
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
            minSpeedMs={visualizer.minSpeedMs}
            maxSpeedMs={visualizer.maxSpeedMs}
          />
        }
      />
    </VisualizerLayout>
  );
}

import { getStepTransitionMs } from "../constants/player";
import { insertionSortCode } from "../data/insertionSortCode";
import { insertionSortExplanation } from "../data/insertionSortExplanation";
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
  INSERTION_SORT_SPACE_INFO,
  INSERTION_SORT_TIME_INFO,
} from "../constants/visualizerTokens";
import {
  CODE_PANEL_IDLE_FALLBACK,
  DATA_SETUP_LABEL,
  DATA_SETUP_ICON,
  VISUALIZER_IDLE_MESSAGE,
} from "../constants/copy";

const PAGE_DESCRIPTION =
  "In-place comparison sort that inserts each element into the growing sorted prefix on the left.";

const INSERTION_SORT_CUSTOM_INPUT_DESCRIPTION =
  "Enter values in any order. Insertion Sort will sort them in place.";

export function InsertionSortPage() {
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
    <VisualizerIdleStatus message={VISUALIZER_IDLE_MESSAGE} />
  );

  return (
    <VisualizerLayout
      title="Insertion Sort"
      description={PAGE_DESCRIPTION}
      timeComplexity="O(n²)"
      spaceComplexity="O(1)"
      timeComplexityInfo={INSERTION_SORT_TIME_INFO}
      spaceComplexityInfo={INSERTION_SORT_SPACE_INFO}
      leftPanelSectionLabel={DATA_SETUP_LABEL}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <DatasetSetupPanel
          arraySize={visualizer.arraySize}
          onArraySizeChange={visualizer.setArraySize}
          onRandomize={visualizer.randomizeData}
          preserveArrayOrder
          customInputDescription={INSERTION_SORT_CUSTOM_INPUT_DESCRIPTION}
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
            stepExplanation={
              visualizer.currentStep?.stepExplanation ?? CODE_PANEL_IDLE_FALLBACK
            }
            showStepFooter
          />
        }
        explanationColumn={
          <ExplanationPanelShell>
            <AlgorithmExplanationContent {...insertionSortExplanation} />
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

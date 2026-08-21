import { getStepTransitionMs } from "../constants/player";
import { binarySearchCode } from "../data/binarySearchCode";
import { DatasetSetupPanel } from "../components/controls/DatasetSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanel } from "../components/panels/ExplanationPanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { StatusCard } from "../components/panels/StatusCard";
import { ArrayVisualizer } from "../components/visualizers/ArrayVisualizer";
import { VisualizerIdleStatus } from "../components/visualizers/VisualizerIdleStatus";
import { useBinarySearchVisualizer } from "../hooks/useBinarySearchVisualizer";
import {
  BINARY_SEARCH_SPACE_INFO,
  BINARY_SEARCH_TIME_INFO,
} from "../constants/visualizerTokens";
import {
  CODE_PANEL_IDLE_FALLBACK,
  DATA_SETUP_LABEL,
  DATA_SETUP_ICON,
  VISUALIZER_IDLE_MESSAGE,
} from "../constants/copy";

const PAGE_DESCRIPTION =
  "Divide-and-conquer search on a sorted array by halving the active interval each step.";

export function BinarySearchPage() {
  const visualizer = useBinarySearchVisualizer();
  const transitionMs = getStepTransitionMs(visualizer.speed);

  const statusContent = visualizer.currentStep ? (
    <StatusCard
      title={visualizer.currentStep.statusTitle}
      detail={visualizer.currentStep.statusDetail}
      pointerMovement={visualizer.currentStep.pointerMovement}
      isSuccess={visualizer.currentStep.found}
      isError={visualizer.currentStep.phase === "not-found"}
    />
  ) : (
    <VisualizerIdleStatus message={VISUALIZER_IDLE_MESSAGE} />
  );

  return (
    <VisualizerLayout
      title="Binary Search"
      description={PAGE_DESCRIPTION}
      timeComplexity="O(log n)"
      spaceComplexity="O(1)"
      timeComplexityInfo={BINARY_SEARCH_TIME_INFO}
      spaceComplexityInfo={BINARY_SEARCH_SPACE_INFO}
      showRightPanel={false}
      leftPanelSectionLabel={DATA_SETUP_LABEL}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <DatasetSetupPanel
          array={visualizer.array}
          arraySize={visualizer.arraySize}
          target={visualizer.target}
          onArraySizeChange={visualizer.setArraySize}
          onTargetChange={visualizer.setTarget}
          onRandomize={visualizer.randomizeData}
          onApplyCustomDataset={({ array, target }) =>
            visualizer.applyCustomDataset(array, target)
          }
        />
      }
    >
      <AlgorithmPageShell
        bottomColumnsOrder="explanation-first"
        hero={
          <div className="flex min-h-[12rem] w-full items-center justify-center py-2">
            <ArrayVisualizer
              cells={visualizer.cells}
              pointers={visualizer.pointers}
              stepTransitionMs={transitionMs}
            />
          </div>
        }
        statusSection={statusContent}
        codeColumn={
          <CodePanel
            variant="embedded"
            codeByLanguage={binarySearchCode}
            activeLine={visualizer.currentStep?.codeLine ?? 1}
            stepExplanation={
              visualizer.currentStep?.stepExplanation ?? CODE_PANEL_IDLE_FALLBACK
            }
            stepFormula={visualizer.currentStep?.stepFormula}
            showStepFooter
          />
        }
        explanationColumn={
          <ExplanationPanelShell>
            <ExplanationPanel />
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

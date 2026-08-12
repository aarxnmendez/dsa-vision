import { getStepTransitionMs } from "../constants/player";
import { binarySearchCode } from "../data/binarySearchCode";
import { DatasetSetupPanel } from "../components/controls/DatasetSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { VisualizerCanvas } from "../components/layout/VisualizerCanvas";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanel } from "../components/panels/ExplanationPanel";
import { StatusCard } from "../components/panels/StatusCard";
import { ArrayVisualizer } from "../components/visualizers/ArrayVisualizer";
import { useBinarySearchVisualizer } from "../hooks/useBinarySearchVisualizer";

export function BinarySearchPage() {
  const visualizer = useBinarySearchVisualizer();

  return (
    <VisualizerLayout
      title="Binary Search"
      timeComplexity="O(log n)"
      spaceComplexity="O(1)"
      leftPanelSectionLabel="Dataset Setup"
      leftPanelSectionIcon="database"
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
      rightPanel={
        <CodePanel
          codeByLanguage={binarySearchCode}
          explanation={<ExplanationPanel />}
          activeLine={visualizer.currentStep?.codeLine ?? 1}
          stepExplanation={
            visualizer.currentStep?.stepExplanation ??
            "Set up your array and target, then press Play to begin."
          }
          stepFormula={visualizer.currentStep?.stepFormula}
        />
      }
    >
      <VisualizerCanvas
        cellCount={visualizer.cells.length}
        visualizer={
          <ArrayVisualizer
            cells={visualizer.cells}
            pointers={visualizer.pointers}
            stepTransitionMs={getStepTransitionMs(visualizer.speed)}
          />
        }
        statusContent={
          visualizer.currentStep ? (
            <StatusCard
              title={visualizer.currentStep.statusTitle}
              detail={visualizer.currentStep.statusDetail}
              pointerMovement={visualizer.currentStep.pointerMovement}
              isSuccess={visualizer.currentStep.found}
              isError={visualizer.currentStep.phase === "not-found"}
            />
          ) : (
            <p className="font-body-md text-body-md text-on-surface-variant text-center">
              Configure the dataset and press Play or Forward to begin the
              search.
            </p>
          )
        }
      />

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
    </VisualizerLayout>
  );
}

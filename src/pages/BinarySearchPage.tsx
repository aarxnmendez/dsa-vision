import { useTranslation } from "react-i18next";
import { getStepTransitionMs } from "../constants/player";
import { binarySearchCode } from "../data/binarySearchCode";
import { DatasetSetupPanel } from "../components/controls/DatasetSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { AlgorithmExplanationContent } from "../components/panels/AlgorithmExplanationContent";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { StatusCard } from "../components/panels/StatusCard";
import { ArrayVisualizer } from "../components/visualizers/ArrayVisualizer";
import { VisualizerIdleStatus } from "../components/visualizers/VisualizerIdleStatus";
import { useBinarySearchVisualizer } from "../hooks/useBinarySearchVisualizer";
import {
  useAlgorithmExplanation,
  usePageMeta,
} from "../hooks/useAlgorithmExplanation";
import { DATA_SETUP_ICON } from "../constants/copy";

export function BinarySearchPage() {
  const { t } = useTranslation("common");
  const pageMeta = usePageMeta("binarySearch");
  const explanation = useAlgorithmExplanation("binarySearch");
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
    <VisualizerIdleStatus message={t("idle.visualizer")} />
  );

  return (
    <VisualizerLayout
      title={pageMeta.title}
      description={pageMeta.description}
      timeComplexity="O(log n)"
      spaceComplexity="O(1)"
      timeComplexityInfo={pageMeta.timeComplexityInfo}
      spaceComplexityInfo={pageMeta.spaceComplexityInfo}
      leftPanelSectionLabel={t("dataSetup.label")}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <DatasetSetupPanel
          showTargetInput
          array={visualizer.array}
          arraySize={visualizer.arraySize}
          target={visualizer.target}
          onArraySizeChange={visualizer.setArraySize}
          onTargetChange={visualizer.setTarget}
          onRandomize={visualizer.randomizeData}
          customInputDescription={pageMeta.customInputHint}
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
            codeByLanguage={binarySearchCode}
            activeLine={visualizer.currentStep?.codeLine ?? 1}
            stepExplanation={visualizer.currentStep?.stepExplanation}
            stepFormula={visualizer.currentStep?.stepFormula}
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

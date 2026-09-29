import { useTranslation } from "react-i18next";
import { getStepTransitionMs } from "../constants/player";
import { sequentialSearchCode } from "../data/sequentialSearchCode";
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
import { useSequentialSearchVisualizer } from "../hooks/useSequentialSearchVisualizer";
import {
  useAlgorithmExplanation,
  usePageMeta,
} from "../hooks/useAlgorithmExplanation";
import { DATA_SETUP_ICON } from "../constants/copy";

export function SequentialSearchPage() {
  const { t } = useTranslation("common");
  const pageMeta = usePageMeta("sequentialSearch");
  const explanation = useAlgorithmExplanation("sequentialSearch");
  const visualizer = useSequentialSearchVisualizer();
  const transitionMs = getStepTransitionMs(visualizer.speed);

  const statusContent = visualizer.currentStep ? (
    <StatusCard
      title={visualizer.currentStep.statusTitle}
      detail={visualizer.currentStep.statusDetail}
      pointerMovement={visualizer.currentStep.pointerMovement}
      isSuccess={
        visualizer.currentStep.found ||
        visualizer.currentStep.phase === "complete"
      }
      isError={visualizer.currentStep.phase === "not-found"}
    />
  ) : (
    <VisualizerIdleStatus message={t("idle.visualizer")} />
  );

  return (
    <VisualizerLayout
      title={pageMeta.title}
      description={pageMeta.description}
      timeComplexity="O(n)"
      spaceComplexity="O(1)"
      timeComplexityInfo={pageMeta.timeComplexityInfo}
      spaceComplexityInfo={pageMeta.spaceComplexityInfo}
      leftPanelSectionLabel={t("dataSetup.label")}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <DatasetSetupPanel
          showTargetInput
          sizeMin={visualizer.minSize}
          sizeMax={visualizer.maxSize}
          array={visualizer.array}
          arraySize={visualizer.arraySize}
          target={visualizer.target}
          onArraySizeChange={visualizer.setArraySize}
          onTargetChange={visualizer.setTarget}
          onRandomize={visualizer.randomizeData}
          customInputDescription={pageMeta.customInputHint}
          preserveArrayOrder
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
            codeByLanguage={sequentialSearchCode}
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

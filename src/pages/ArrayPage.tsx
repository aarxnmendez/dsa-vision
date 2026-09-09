import { useTranslation } from "react-i18next";
import { getStepTransitionMs } from "../constants/player";
import { arrayCode } from "../data/arrayCode";
import { ArraySetupPanel } from "../components/controls/ArraySetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { AlgorithmExplanationContent } from "../components/panels/AlgorithmExplanationContent";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { StatusCard } from "../components/panels/StatusCard";
import {
  ArrayStructureLegendBar,
  ArrayStructureVisualizer,
} from "../components/visualizers/ArrayStructureVisualizer";
import { VisualizerIdleStatus } from "../components/visualizers/VisualizerIdleStatus";
import { useArrayStructureVisualizer } from "../hooks/useArrayStructureVisualizer";
import {
  useAlgorithmExplanation,
  usePageMeta,
} from "../hooks/useAlgorithmExplanation";
import { DATA_SETUP_ICON } from "../constants/copy";

export function ArrayPage() {
  const { t } = useTranslation("common");
  const pageMeta = usePageMeta("array");
  const explanation = useAlgorithmExplanation("array");
  const visualizer = useArrayStructureVisualizer();
  const transitionMs = getStepTransitionMs(visualizer.speed);

  const displayCells =
    visualizer.currentStep?.cells ??
    visualizer.array.map((value) => ({
      value,
      highlight: "default" as const,
    }));

  const displayCapacity =
    visualizer.currentStep?.capacity ?? visualizer.array.length;

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
      timeComplexity="O(1)–O(n)"
      spaceComplexity="O(n)"
      timeComplexityInfo={pageMeta.timeComplexityInfo}
      spaceComplexityInfo={pageMeta.spaceComplexityInfo}
      leftPanelSectionLabel={t("dataSetup.label")}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <ArraySetupPanel
          array={visualizer.array}
          arraySize={visualizer.arraySize}
          operation={visualizer.operation}
          operationIndex={visualizer.operationIndex}
          operationValue={visualizer.operationValue}
          searchTarget={visualizer.searchTarget}
          needsIndexInput={visualizer.needsIndexInput}
          needsValueInput={visualizer.needsValueInput}
          needsSearchTarget={visualizer.needsSearchTarget}
          onArraySizeChange={visualizer.setArraySize}
          onRandomize={visualizer.randomizeData}
          onApplyCustomDataset={visualizer.applyCustomDataset}
          onOperationChange={visualizer.setOperation}
          onOperationIndexChange={visualizer.setOperationIndex}
          onOperationValueChange={visualizer.setOperationValue}
          onSearchTargetChange={visualizer.setSearchTarget}
        />
      }
    >
      <AlgorithmPageShell
        bottomColumnsOrder="explanation-first"
        heroLegend={<ArrayStructureLegendBar />}
        hero={
          <div className="flex min-h-[14rem] w-full items-center justify-center py-2">
            <ArrayStructureVisualizer
              cells={displayCells}
              capacity={displayCapacity}
              pointers={visualizer.currentStep?.pointers ?? []}
              stepTransitionMs={transitionMs}
            />
          </div>
        }
        statusSection={statusContent}
        codeColumn={
          <CodePanel
            codeByLanguage={arrayCode}
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

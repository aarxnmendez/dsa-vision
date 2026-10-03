import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { mergeSortCode } from "../data/mergeSortCode";
import { DatasetSetupPanel } from "../components/controls/DatasetSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { AlgorithmExplanationContent } from "../components/panels/AlgorithmExplanationContent";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { StatusCard } from "../components/panels/StatusCard";
import { InfiniteCanvas } from "../components/visualizers/InfiniteCanvas";
import { MergeSortTreeVisualizer } from "../components/visualizers/MergeSortTreeVisualizer";
import { MergeSortLegendBar } from "../components/visualizers/MergeSortLegendBar";
import { VisualizerIdleStatus } from "../components/visualizers/VisualizerIdleStatus";
import { useMergeSortVisualizer } from "../hooks/useMergeSortVisualizer";
import {
  useAlgorithmExplanation,
  usePageMeta,
} from "../hooks/useAlgorithmExplanation";
import { DATA_SETUP_ICON } from "../constants/copy";
import { layoutMergeSortTree } from "../utils/mergeSortTreeLayout";

export function MergeSortPage() {
  const { t } = useTranslation("common");
  const pageMeta = usePageMeta("mergeSort");
  const explanation = useAlgorithmExplanation("mergeSort");
  const visualizer = useMergeSortVisualizer();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFocused]);

  const treeNodes = useMemo(
    () => visualizer.currentStep?.nodes ?? [],
    [visualizer.currentStep?.nodes],
  );
  const treeLinks = useMemo(
    () => visualizer.currentStep?.links ?? [],
    [visualizer.currentStep?.links],
  );
  const layout = useMemo(
    () => layoutMergeSortTree(treeNodes, treeLinks),
    [treeLinks, treeNodes],
  );

  const treeView = useMemo(
    () => (
      <MergeSortTreeVisualizer nodes={treeNodes} links={treeLinks} />
    ),
    [treeLinks, treeNodes],
  );

  const playerControls = (
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
  );

  const statusContent = visualizer.currentStep ? (
    <StatusCard
      title={visualizer.currentStep.statusTitle}
      detail={visualizer.currentStep.statusDetail}
      isSuccess={visualizer.currentStep.isComplete}
    />
  ) : (
    <VisualizerIdleStatus message={t("idle.visualizer")} />
  );

  const canvas = (
    <InfiniteCanvas
      worldWidth={layout.width}
      worldHeight={layout.height}
      isFocused={isFocused}
      onFocusChange={setIsFocused}
    >
      {treeView}
    </InfiniteCanvas>
  );

  if (isFocused) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col bg-background">
        <div className="flex min-h-0 flex-1 flex-col px-3 pb-28 pt-3 sm:px-4">
          {canvas}
        </div>
        {playerControls}
      </div>
    );
  }

  return (
    <VisualizerLayout
      title={pageMeta.title}
      description={pageMeta.description}
      timeComplexity={pageMeta.headerTimeComplexity}
      spaceComplexity={pageMeta.headerSpaceComplexity}
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
          sizeMin={visualizer.minArraySize}
          sizeMax={visualizer.maxArraySize}
          customInputDescription={pageMeta.customInputHint}
          arrayPlaceholder="42, 17, 8, 31, 5"
          onApplyCustomDataset={({ array }) =>
            visualizer.applyCustomDataset(array)
          }
        />
      }
    >
      <AlgorithmPageShell
        bottomColumnsOrder="explanation-first"
        heroLegend={<MergeSortLegendBar />}
        hero={canvas}
        statusSection={statusContent}
        codeColumn={
          <CodePanel
            codeByLanguage={mergeSortCode}
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
        playerControls={playerControls}
      />
    </VisualizerLayout>
  );
}

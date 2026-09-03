import { getStepTransitionMs } from "../constants/player";
import { stackCode } from "../data/stackCode";
import { stackExplanation } from "../data/stackExplanation";
import { buildStackDisplayState } from "../algorithms/stackOperations";
import { StackSetupPanel } from "../components/controls/StackSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { AlgorithmExplanationContent } from "../components/panels/AlgorithmExplanationContent";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { StatusCard } from "../components/panels/StatusCard";
import {
  StackStructureLegendBar,
  StackVisualizer,
} from "../components/visualizers/StackVisualizer";
import { VisualizerIdleStatus } from "../components/visualizers/VisualizerIdleStatus";
import { useStackStructureVisualizer } from "../hooks/useStackStructureVisualizer";
import {
  STACK_SPACE_INFO,
  STACK_TIME_INFO,
} from "../constants/visualizerTokens";
import {
  CODE_PANEL_IDLE_FALLBACK,
  DATA_SETUP_LABEL,
  DATA_SETUP_ICON,
  STACK_IDLE_MESSAGE,
} from "../constants/copy";

const PAGE_DESCRIPTION =
  "LIFO stack with O(1) push, pop, and peek. Bounded capacity models overflow when the structure is full.";

export function StackPage() {
  const visualizer = useStackStructureVisualizer();
  const transitionMs = getStepTransitionMs(visualizer.speed);

  const idleDisplay = buildStackDisplayState(visualizer.values);

  const displayItems = visualizer.currentStep?.items ?? idleDisplay.items;
  const displaySize = visualizer.currentStep?.size ?? idleDisplay.size;
  const displayMaxCapacity =
    visualizer.currentStep?.maxCapacity ?? visualizer.maxCapacity;

  const statusContent = visualizer.currentStep ? (
    <StatusCard
      title={visualizer.currentStep.statusTitle}
      detail={visualizer.currentStep.stepMessage}
      pointerMovement={
        visualizer.currentStep.returnedValue !== null
          ? `Returned value: ${visualizer.currentStep.returnedValue}`
          : visualizer.currentStep.topIndex !== null
            ? `TOP index: ${visualizer.currentStep.topIndex}`
            : undefined
      }
      isSuccess={
        visualizer.currentStep.found ||
        visualizer.currentStep.phase === "complete"
      }
      isError={visualizer.currentStep.isError}
    />
  ) : (
    <VisualizerIdleStatus message={STACK_IDLE_MESSAGE} />
  );

  return (
    <VisualizerLayout
      title="Stack"
      description={PAGE_DESCRIPTION}
      timeComplexity="O(1)–O(n)"
      spaceComplexity="O(n)"
      timeComplexityInfo={STACK_TIME_INFO}
      spaceComplexityInfo={STACK_SPACE_INFO}
      leftPanelSectionLabel={DATA_SETUP_LABEL}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <StackSetupPanel
          values={visualizer.values}
          stackSize={visualizer.stackSize}
          operation={visualizer.operation}
          pushValue={visualizer.pushValue}
          onStackSizeChange={visualizer.setStackSize}
          onRandomize={visualizer.randomizeData}
          onApplyCustomDataset={visualizer.applyCustomDataset}
          onOperationChange={visualizer.setOperation}
          onPushValueChange={visualizer.setPushValue}
        />
      }
    >
      <AlgorithmPageShell
        bottomColumnsOrder="explanation-first"
        heroLegend={<StackStructureLegendBar />}
        hero={
          <div className="flex min-h-[18rem] w-full items-center justify-center py-2">
            <StackVisualizer
              items={displayItems}
              maxCapacity={displayMaxCapacity}
              size={displaySize}
              phase={visualizer.currentStep?.phase}
              isError={visualizer.currentStep?.isError}
              stepTransitionMs={transitionMs}
            />
          </div>
        }
        statusSection={statusContent}
        codeColumn={
          <CodePanel
            codeByLanguage={stackCode}
            activeLine={visualizer.currentStep?.codeLine ?? 1}
            stepExplanation={
              visualizer.currentStep?.stepExplanation ?? CODE_PANEL_IDLE_FALLBACK
            }
            showStepFooter
          />
        }
        explanationColumn={
          <ExplanationPanelShell>
            <AlgorithmExplanationContent {...stackExplanation} />
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

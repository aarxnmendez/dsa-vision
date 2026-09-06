import { getStepTransitionMs } from "../constants/player";
import { linkedListCode } from "../data/linkedListCode";
import { linkedListExplanation } from "../data/linkedListExplanation";
import { buildLinkedListDisplayState } from "../algorithms/linkedListOperations";
import { LinkedListSetupPanel } from "../components/controls/LinkedListSetupPanel";
import { PlayerControls } from "../components/controls/PlayerControls";
import { AlgorithmPageShell } from "../components/layout/AlgorithmPageShell";
import { VisualizerLayout } from "../components/layout/VisualizerLayout";
import { AlgorithmExplanationContent } from "../components/panels/AlgorithmExplanationContent";
import { CodePanel } from "../components/panels/CodePanel";
import { ExplanationPanelShell } from "../components/panels/ExplanationPanelShell";
import { StatusCard } from "../components/panels/StatusCard";
import {
  LinkedListStructureLegendBar,
  LinkedListStructureVisualizer,
} from "../components/visualizers/LinkedListStructureVisualizer";
import { VisualizerIdleStatus } from "../components/visualizers/VisualizerIdleStatus";
import { useLinkedListStructureVisualizer } from "../hooks/useLinkedListStructureVisualizer";
import {
  LINKED_LIST_SPACE_INFO,
  LINKED_LIST_TIME_INFO,
} from "../constants/visualizerTokens";
import {
  CODE_PANEL_IDLE_FALLBACK,
  DATA_SETUP_LABEL,
  DATA_SETUP_ICON,
  VISUALIZER_IDLE_MESSAGE,
} from "../constants/copy";

const PAGE_DESCRIPTION =
  "Pointer-based nodes with O(1) head and tail ops when pointers are maintained, plus O(n) search and in-place reversal.";

function formatPointerMovement(
  pointers: { id: string; nodeId: string }[],
): string | undefined {
  if (pointers.length === 0) return undefined;
  return pointers.map((pointer) => `${pointer.id} → node ${pointer.nodeId}`).join(" · ");
}

export function LinkedListPage() {
  const visualizer = useLinkedListStructureVisualizer();
  const transitionMs = getStepTransitionMs(visualizer.speed);

  const idleDisplay = buildLinkedListDisplayState(
    visualizer.listType,
    visualizer.values,
  );

  const displayNodes = visualizer.currentStep?.nodes ?? idleDisplay.nodes;
  const displayConnections =
    visualizer.currentStep?.connections ?? idleDisplay.connections;
  const displayListType =
    visualizer.currentStep?.listType ?? visualizer.listType;

  const statusContent = visualizer.currentStep ? (
    <StatusCard
      title={visualizer.currentStep.statusTitle}
      detail={visualizer.currentStep.stepMessage}
      pointerMovement={formatPointerMovement(visualizer.currentStep.pointers)}
      isSuccess={
        visualizer.currentStep.found ||
        visualizer.currentStep.phase === "complete"
      }
      isError={visualizer.currentStep.phase === "not-found"}
    />
  ) : (
    <VisualizerIdleStatus message={VISUALIZER_IDLE_MESSAGE} />
  );

  return (
    <VisualizerLayout
      title="Linked List"
      description={PAGE_DESCRIPTION}
      timeComplexity="O(1)–O(n)"
      spaceComplexity="O(n)"
      timeComplexityInfo={LINKED_LIST_TIME_INFO}
      spaceComplexityInfo={LINKED_LIST_SPACE_INFO}
      leftPanelSectionLabel={DATA_SETUP_LABEL}
      leftPanelSectionIcon={DATA_SETUP_ICON}
      leftPanel={
        <LinkedListSetupPanel
          values={visualizer.values}
          listSize={visualizer.listSize}
          listType={visualizer.listType}
          operation={visualizer.operation}
          operationIndex={visualizer.operationIndex}
          operationValue={visualizer.operationValue}
          searchTarget={visualizer.searchTarget}
          needsIndexInput={visualizer.needsIndexInput}
          needsValueInput={visualizer.needsValueInput}
          needsSearchTarget={visualizer.needsSearchTarget}
          onListSizeChange={visualizer.setListSize}
          onRandomize={visualizer.randomizeData}
          onApplyCustomDataset={visualizer.applyCustomDataset}
          onListTypeChange={visualizer.setListType}
          onOperationChange={visualizer.setOperation}
          onOperationIndexChange={visualizer.setOperationIndex}
          onOperationValueChange={visualizer.setOperationValue}
          onSearchTargetChange={visualizer.setSearchTarget}
        />
      }
    >
      <AlgorithmPageShell
        bottomColumnsOrder="explanation-first"
        heroLegend={<LinkedListStructureLegendBar />}
        hero={
          <div className="flex min-h-[14rem] w-full items-center justify-center py-2">
            <LinkedListStructureVisualizer
              listType={displayListType}
              nodes={displayNodes}
              connections={displayConnections}
              stepTransitionMs={transitionMs}
            />
          </div>
        }
        statusSection={statusContent}
        codeColumn={
          <CodePanel
            codeByLanguage={linkedListCode}
            activeLine={visualizer.currentStep?.codeLine ?? 1}
            stepExplanation={
              visualizer.currentStep?.stepExplanation ?? CODE_PANEL_IDLE_FALLBACK
            }
            showStepFooter
          />
        }
        explanationColumn={
          <ExplanationPanelShell>
            <AlgorithmExplanationContent {...linkedListExplanation} />
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

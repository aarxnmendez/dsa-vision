import { useId, useState, type ReactNode } from "react";
import type { CodeLanguage } from "../../data/binarySearchCode";
import { CODE_ACTIVE_LINE_CLASS } from "../../constants/visualizerTokens";
import { sectionLabelClass } from "../ui/sectionLabel";
import { CopyCodeButton } from "./CopyCodeButton";
import { EmbeddedPanelTabBar } from "./EmbeddedPanelTabBar";
import { LanguageSelector } from "./LanguageSelector";
import { CodePanelStepFooter } from "./CodePanelStepFooter";

export type CodePanelTab = "code" | "explanation";
export type CodePanelVariant = "sidebar" | "embedded";

interface CodePanelProps {
  codeByLanguage: Record<CodeLanguage, string[]>;
  explanation?: ReactNode;
  codeSectionLabel?: string;
  activeLine: number;
  stepExplanation?: string;
  stepFormula?: string;
  activeTab?: CodePanelTab;
  onTabChange?: (tab: CodePanelTab) => void;
  variant?: CodePanelVariant;
  showStepFooter?: boolean;
}

export function CodePanel({
  codeByLanguage,
  explanation,
  codeSectionLabel = "Algorithm",
  activeLine,
  stepExplanation,
  stepFormula,
  activeTab: controlledTab,
  onTabChange,
  variant = "sidebar",
  showStepFooter = true,
}: CodePanelProps) {
  const [internalTab, setInternalTab] = useState<CodePanelTab>("code");
  const activeTab = controlledTab ?? internalTab;
  const hasExplanation = explanation != null;
  const isEmbedded = variant === "embedded";
  const tabListId = useId();
  const codeTabId = `${tabListId}-code-tab`;
  const explanationTabId = `${tabListId}-explanation-tab`;
  const codePanelId = `${tabListId}-code-panel`;
  const explanationPanelId = `${tabListId}-explanation-panel`;

  const setActiveTab = (tab: CodePanelTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const [language, setLanguage] = useState<CodeLanguage>("python");

  const lines = codeByLanguage[language];

  const tabButtonBase =
    "px-6 py-3 font-bold rounded-t-xl border-2 border-b-0 transition-colors cursor-pointer focus:outline-none focus:ring-0 focus-visible:outline-none";

  const tabButtonClass = (tab: CodePanelTab) =>
    [
      tabButtonBase,
      activeTab === tab
        ? "bg-surface-container-lowest text-primary border-surface-variant"
        : "text-on-surface-variant hover:bg-surface-variant border-transparent",
    ].join(" ");

  const codeEditor = (
    <div className="min-h-0 min-w-0 flex-1 overflow-auto bg-inverse-surface">
      <div className="min-w-max py-4 font-mono text-sm leading-loose">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === activeLine;

          return (
            <div
              key={lineNumber}
              className={[
                "flex whitespace-pre border-l-4 py-0.5 pl-6 pr-6",
                isActive
                  ? CODE_ACTIVE_LINE_CLASS
                  : "border-transparent text-slate-400 opacity-80",
              ].join(" ")}
            >
              <span className="w-8 shrink-0 select-none pr-4 text-right tabular-nums text-slate-500">
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line || " "}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isEmbedded) {
    return (
      <div className="flex min-h-[22rem] min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-surface-variant bg-surface-container-lowest shadow-sm">
        <EmbeddedPanelTabBar icon="code" label="Code" />
        <div className="flex shrink-0 items-center justify-between gap-4 border-b-2 border-surface-variant bg-surface-bright px-4 py-3">
          <LanguageSelector value={language} onChange={setLanguage} />
          <CopyCodeButton code={lines.join("\n")} />
        </div>
        {codeEditor}
        {showStepFooter && (
          <CodePanelStepFooter
            stepExplanation={stepExplanation}
            stepFormula={stepFormula}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div
        role="tablist"
        aria-label="Code panel sections"
        className="flex shrink-0 gap-2 border-b-2 border-surface-variant bg-surface-container px-4 pt-4 pl-14"
      >
        <button
          type="button"
          role="tab"
          id={codeTabId}
          aria-selected={activeTab === "code"}
          aria-controls={codePanelId}
          onClick={() => setActiveTab("code")}
          className={tabButtonClass("code")}
        >
          Code
        </button>
        {hasExplanation && (
          <button
            type="button"
            role="tab"
            id={explanationTabId}
            aria-selected={activeTab === "explanation"}
            aria-controls={explanationPanelId}
            onClick={() => setActiveTab("explanation")}
            className={tabButtonClass("explanation")}
          >
            Explanation
          </button>
        )}
      </div>

      {activeTab === "code" || !hasExplanation ? (
        <div
          id={codePanelId}
          role="tabpanel"
          aria-labelledby={codeTabId}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b-2 border-surface-variant bg-surface-bright px-4 py-3">
            <h3 className={sectionLabelClass}>{codeSectionLabel}</h3>
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>

          {codeEditor}
        </div>
      ) : (
        <div
          id={explanationPanelId}
          role="tabpanel"
          aria-labelledby={explanationTabId}
          className="min-h-0 flex-1 overflow-y-auto bg-surface-bright p-6"
        >
          {explanation}
        </div>
      )}

      {showStepFooter && (
        <CodePanelStepFooter
          stepExplanation={stepExplanation}
          stepFormula={stepFormula}
          className="pb-32"
        />
      )}
    </div>
  );
}

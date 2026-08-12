import { useId, useState, type ReactNode } from "react";
import type { CodeLanguage } from "../../data/binarySearchCode";
import { Icon } from "../ui/Icon";
import { sectionLabelClass } from "../ui/sectionLabel";
import { LanguageSelector } from "./LanguageSelector";

export type CodePanelTab = "code" | "explanation";

interface CodePanelProps {
  codeByLanguage: Record<CodeLanguage, string[]>;
  explanation?: ReactNode;
  codeSectionLabel?: string;
  activeLine: number;
  stepExplanation: string;
  stepFormula?: string;
  activeTab?: CodePanelTab;
  onTabChange?: (tab: CodePanelTab) => void;
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
}: CodePanelProps) {
  const [internalTab, setInternalTab] = useState<CodePanelTab>("code");
  const activeTab = controlledTab ?? internalTab;
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

  return (
    <div className="flex flex-col h-full min-w-0">
      <div
        role="tablist"
        aria-label="Code panel sections"
        className="flex border-b-2 border-surface-variant bg-surface-container pt-4 px-4 pl-14 gap-2 shrink-0"
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
      </div>

      {activeTab === "code" ? (
        <div
          id={codePanelId}
          role="tabpanel"
          aria-labelledby={codeTabId}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="px-4 py-3 border-b-2 border-surface-variant flex items-center justify-between gap-4 bg-surface-bright shrink-0">
            <h3 className={sectionLabelClass}>{codeSectionLabel}</h3>
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>

          <div className="flex-1 min-h-0 min-w-0 overflow-auto bg-inverse-surface">
            <div className="min-w-max py-4 font-mono text-sm leading-loose">
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const isActive = lineNumber === activeLine;

                return (
                  <div
                    key={lineNumber}
                    className={[
                      "flex whitespace-pre pl-6 pr-6 py-0.5",
                      isActive
                        ? "bg-primary/20 text-primary-fixed font-semibold"
                        : "text-surface-dim opacity-50",
                    ].join(" ")}
                  >
                    <span className="w-8 shrink-0 text-right pr-4 select-none tabular-nums">
                      {lineNumber}
                    </span>
                    <span className="whitespace-pre">{line || " "}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div
          id={explanationPanelId}
          role="tabpanel"
          aria-labelledby={explanationTabId}
          className="flex-1 min-h-0 p-6 overflow-y-auto bg-surface-bright"
        >
          {explanation}
        </div>
      )}

      <div className="p-6 bg-surface border-t-4 border-surface-variant shrink-0 pb-32">
        <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
          <Icon name="lightbulb" />
          Current Step
        </h4>
        <p className="font-body-md text-on-surface leading-relaxed">
          {stepExplanation}
          {stepFormula && (
            <>
              <br />
              <br />
              <code className="bg-surface-container px-2 py-1 rounded-md border border-surface-variant whitespace-pre">
                {stepFormula}
              </code>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

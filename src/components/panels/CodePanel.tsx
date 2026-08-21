import { useState } from "react";
import type { CodeLanguage } from "../../data/binarySearchCode";
import { CODE_ACTIVE_LINE_CLASS } from "../../constants/visualizerTokens";
import { CopyCodeButton } from "./CopyCodeButton";
import { EmbeddedPanelTabBar } from "./EmbeddedPanelTabBar";
import { LanguageSelector } from "./LanguageSelector";
import { CodePanelStepFooter } from "./CodePanelStepFooter";

interface CodePanelProps {
  codeByLanguage: Record<CodeLanguage, string[]>;
  activeLine: number;
  stepExplanation?: string;
  stepFormula?: string;
  showStepFooter?: boolean;
}

export function CodePanel({
  codeByLanguage,
  activeLine,
  stepExplanation,
  stepFormula,
  showStepFooter = true,
}: CodePanelProps) {
  const [language, setLanguage] = useState<CodeLanguage>("python");
  const lines = codeByLanguage[language];

  return (
    <div className="flex min-h-[22rem] min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-surface-variant bg-surface-container-lowest shadow-sm">
      <EmbeddedPanelTabBar icon="code" label="Code" />
      <div className="flex shrink-0 items-center justify-between gap-4 border-b-2 border-surface-variant bg-surface-bright px-4 py-3">
        <LanguageSelector value={language} onChange={setLanguage} />
        <CopyCodeButton code={lines.join("\n")} />
      </div>
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
      {showStepFooter && (
        <CodePanelStepFooter
          stepExplanation={stepExplanation}
          stepFormula={stepFormula}
        />
      )}
    </div>
  );
}

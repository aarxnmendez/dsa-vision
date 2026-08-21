import { Icon } from "../ui/Icon";

interface CodePanelStepFooterProps {
  stepExplanation?: string;
  stepFormula?: string;
  className?: string;
}

export function CodePanelStepFooter({
  stepExplanation,
  stepFormula,
  className = "",
}: CodePanelStepFooterProps) {
  return (
    <div
      className={[
        "shrink-0 border-t-4 border-surface-variant bg-surface p-6",
        className,
      ].join(" ")}
    >
      <h4 className="mb-2 flex items-center gap-2 font-bold text-primary">
        <Icon name="lightbulb" />
        Current Step
      </h4>
      <p className="font-body-md leading-relaxed text-on-surface">
        {stepExplanation ?? "Set up your dataset, then press Play to begin."}
        {stepFormula && (
          <>
            <br />
            <br />
            <code className="whitespace-pre rounded-md border border-surface-variant bg-surface-container px-2 py-1">
              {stepFormula}
            </code>
          </>
        )}
      </p>
    </div>
  );
}

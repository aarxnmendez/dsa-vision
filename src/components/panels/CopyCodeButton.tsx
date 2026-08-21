import { useState } from "react";
import { CODE_PANEL_TOOLBAR_CONTROL_CLASS } from "../../constants/visualizerTokens";
import { Icon } from "../ui/Icon";

interface CopyCodeButtonProps {
  code: string;
}

const iconClassName =
  "text-[18px] [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_20]";

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Code copied" : "Copy code to clipboard"}
      className={[
        "inline-flex shrink-0 items-center gap-2 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        copied
          ? "cursor-pointer rounded-xl border-2 border-emerald-500/60 bg-emerald-500/10 px-4 py-2.5 font-body-md text-emerald-600 transition-colors"
          : [CODE_PANEL_TOOLBAR_CONTROL_CLASS, "text-primary hover:text-primary"].join(" "),
      ].join(" ")}
    >
      <Icon
        name={copied ? "check" : "content_copy"}
        className={iconClassName}
        filled={false}
      />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

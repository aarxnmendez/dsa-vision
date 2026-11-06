import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isAlgorithmAvailable, type AlgorithmMeta } from "../../types/algorithm";
import { RESUME_NAVIGATION_STATE } from "../../utils/visualizerSnapshot";
import { Icon } from "../ui/Icon";

const DISMISSED_KEY = "dsavision-resume-dismissed";

function readDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

interface ResumeToastProps {
  /** Last visualizer the visitor opened, only when it has saved data to restore. */
  lastVisited: AlgorithmMeta | null;
}

export function ResumeToast({ lastVisited }: ResumeToastProps) {
  const { t } = useTranslation("catalog");
  const [isDismissed, setIsDismissed] = useState(readDismissed);

  if (!lastVisited || !isAlgorithmAvailable(lastVisited) || isDismissed) {
    return null;
  }

  const title = t(`algorithms.${lastVisited.id}.title`, {
    defaultValue: lastVisited.title,
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // Dismissal only lasts for this view when storage is blocked.
    }
  };

  return (
    <aside
      role="status"
      aria-label={t("resume.ariaLabel")}
      className="resume-toast fixed bottom-4 right-4 z-40 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3 rounded-2xl border-2 border-surface-variant border-b-4 bg-surface-container-lowest p-4 shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t("resume.dismiss")}
        className="absolute right-2 top-2 flex size-7 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
      >
        <Icon name="close" filled={false} />
      </button>

      <div className="pr-6">
        <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">
          {t("resume.label")}
        </p>
        <p className="mt-0.5 font-headline-md text-base font-bold text-on-surface">
          {title}
        </p>
      </div>

      <Link
        to={lastVisited.route}
        state={RESUME_NAVIGATION_STATE}
        className="btn-3d inline-flex items-center justify-center gap-1.5 rounded-xl border-b-4 border-on-primary-fixed-variant bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:bg-primary-container hover:text-on-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("resume.action")}
        <Icon name="arrow_forward" filled={false} />
      </Link>
    </aside>
  );
}

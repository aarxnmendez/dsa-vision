import { useEffect } from "react";
import { createPortal } from "react-dom";
import { MOBILE_NOTICE_QUERY } from "../../constants/breakpoints";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { sectionLabelClass } from "../ui/sectionLabel";
import { Icon } from "../ui/Icon";

export function MobileNoticeOverlay() {
  const isSmallScreen = useMediaQuery(MOBILE_NOTICE_QUERY);

  useEffect(() => {
    document.body.style.overflow = isSmallScreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSmallScreen]);

  if (!isSmallScreen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/80 backdrop-blur-sm"
      aria-hidden={false}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="mobile-notice-title"
        aria-describedby="mobile-notice-description"
        className="w-full max-w-md bg-surface-container-lowest border-2 border-surface-variant border-b-4 rounded-3xl shadow-[0_16px_0_0_#dfe3e7] p-6 flex flex-col items-center text-center gap-5 pointer-events-auto"
      >
        <span className={sectionLabelClass}>Desktop experience required</span>

        <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
          <div className="flex items-center gap-1.5 text-primary">
            <Icon name="smartphone" className="text-[30px]" />
            <Icon name="sync_alt" className="text-[24px]" />
            <Icon name="laptop_mac" className="text-[30px]" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2
            id="mobile-notice-title"
            className="font-headline-md text-headline-md text-primary"
          >
            Screen size too small
          </h2>
          <p
            id="mobile-notice-description"
            className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
          >
            This interactive visualizer is designed for larger desktop displays.
            To properly view algorithms, animations, and code panels simultaneously,
            please expand your browser window or switch to a desktop device.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

import type { ReactNode } from "react";
import {
  EMBEDDED_PANEL_HEADER_CLASS,
  EMBEDDED_PANEL_TAB_CLASS,
} from "../../constants/visualizerTokens";
import { Icon } from "../ui/Icon";

interface EmbeddedPanelTabBarProps {
  icon: string;
  label: string;
  trailing?: ReactNode;
}

export function EmbeddedPanelTabBar({
  icon,
  label,
  trailing,
}: EmbeddedPanelTabBarProps) {
  return (
    <div className={EMBEDDED_PANEL_HEADER_CLASS}>
      <div className={EMBEDDED_PANEL_TAB_CLASS} aria-hidden="true">
        <Icon name={icon} className="text-[20px] text-primary/80" />
        {label}
      </div>

      {trailing && (
        <div className="mb-1 flex min-w-0 items-center justify-end gap-2 pb-1">
          {trailing}
        </div>
      )}
    </div>
  );
}

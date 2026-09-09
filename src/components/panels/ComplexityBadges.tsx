import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ComplexityInfoPopover } from "./ComplexityInfoPopover";

interface ComplexityInfo {
  title: string;
  text: string;
}

interface ComplexityBadgesProps {
  timeComplexity?: string;
  spaceComplexity?: string;
  timeInfo?: ComplexityInfo;
  spaceInfo?: ComplexityInfo;
}

type OpenPopover = "time" | "space" | null;

export function ComplexityBadges({
  timeComplexity = "O(log n)",
  spaceComplexity = "O(1)",
  timeInfo,
  spaceInfo,
}: ComplexityBadgesProps) {
  const { t } = useTranslation("common");
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null);

  const togglePopover = (type: OpenPopover) => {
    setOpenPopover((current) => (current === type ? null : type));
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {timeInfo && (
        <ComplexityInfoPopover
          label={`${t("complexity.timeLabel")}: ${timeComplexity}`}
          variant="time"
          popoverTitle={timeInfo.title}
          popoverText={timeInfo.text}
          isOpen={openPopover === "time"}
          onToggle={() => togglePopover("time")}
          onClose={() => setOpenPopover(null)}
        />
      )}
      {spaceInfo && (
        <ComplexityInfoPopover
          label={`${t("complexity.spaceLabel")}: ${spaceComplexity}`}
          variant="space"
          popoverTitle={spaceInfo.title}
          popoverText={spaceInfo.text}
          isOpen={openPopover === "space"}
          onToggle={() => togglePopover("space")}
          onClose={() => setOpenPopover(null)}
        />
      )}
    </div>
  );
}

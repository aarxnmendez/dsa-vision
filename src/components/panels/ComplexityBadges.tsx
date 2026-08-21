import { useState } from "react";
import { ComplexityInfoPopover } from "./ComplexityInfoPopover";
import {
  BINARY_SEARCH_SPACE_INFO,
  BINARY_SEARCH_TIME_INFO,
} from "../../constants/visualizerTokens";

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
  timeInfo = BINARY_SEARCH_TIME_INFO,
  spaceInfo = BINARY_SEARCH_SPACE_INFO,
}: ComplexityBadgesProps) {
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null);

  const togglePopover = (type: OpenPopover) => {
    setOpenPopover((current) => (current === type ? null : type));
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <ComplexityInfoPopover
        label={`Time Complexity: ${timeComplexity}`}
        variant="time"
        popoverTitle={timeInfo.title}
        popoverText={timeInfo.text}
        isOpen={openPopover === "time"}
        onToggle={() => togglePopover("time")}
        onClose={() => setOpenPopover(null)}
      />
      <ComplexityInfoPopover
        label={`Space Complexity: ${spaceComplexity}`}
        variant="space"
        popoverTitle={spaceInfo.title}
        popoverText={spaceInfo.text}
        isOpen={openPopover === "space"}
        onToggle={() => togglePopover("space")}
        onClose={() => setOpenPopover(null)}
      />
    </div>
  );
}

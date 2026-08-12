import { useState } from "react";
import { ComplexityInfoPopover } from "./ComplexityInfoPopover";

interface ComplexityBadgesProps {
  timeComplexity?: string;
  spaceComplexity?: string;
}

type OpenPopover = "time" | "space" | null;

const TIME_INFO = {
  title: "Logarithmic Time",
  text: "Execution time grows logarithmically relative to the input size. By halving the search space at each step, it remains exceptionally fast even for massive datasets.",
};

const SPACE_INFO = {
  title: "Constant Space",
  text: "The algorithm uses a fixed amount of additional memory (pointers only), regardless of the array size.",
};

export function ComplexityBadges({
  timeComplexity = "O(log n)",
  spaceComplexity = "O(1)",
}: ComplexityBadgesProps) {
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null);

  const togglePopover = (type: OpenPopover) => {
    setOpenPopover((current) => (current === type ? null : type));
  };

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      <ComplexityInfoPopover
        label={`Time: ${timeComplexity}`}
        variant="time"
        popoverTitle={TIME_INFO.title}
        popoverText={TIME_INFO.text}
        isOpen={openPopover === "time"}
        onToggle={() => togglePopover("time")}
        onClose={() => setOpenPopover(null)}
      />
      <ComplexityInfoPopover
        label={`Space: ${spaceComplexity}`}
        variant="space"
        popoverTitle={SPACE_INFO.title}
        popoverText={SPACE_INFO.text}
        isOpen={openPopover === "space"}
        onToggle={() => togglePopover("space")}
        onClose={() => setOpenPopover(null)}
      />
    </div>
  );
}

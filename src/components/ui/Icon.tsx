import type { LucideIcon } from "lucide-react";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  Check,
  Code,
  Copy,
  Crosshair,
  Cpu,
  Database,
  FilePenLine,
  Laptop,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Smartphone,
  Timer,
  X,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  arrow_back: ArrowLeft,
  check: Check,
  close: X,
  code: Code,
  content_copy: Copy,
  database: Database,
  edit_note: FilePenLine,
  laptop_mac: Laptop,
  lightbulb: Lightbulb,
  memory: Cpu,
  menu_book: BookOpen,
  my_location: Crosshair,
  pause: Pause,
  play_arrow: Play,
  refresh: RotateCcw,
  search: Search,
  shuffle: Shuffle,
  skip_next: SkipForward,
  skip_previous: SkipBack,
  smartphone: Smartphone,
  sort: ArrowDownUp,
  sync_alt: ArrowLeftRight,
  timer: Timer,
};

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

export function Icon({ name, className = "", filled = true }: IconProps) {
  const Component = iconMap[name];

  if (!Component) {
    return null;
  }

  return (
    <span
      className={["inline-flex shrink-0 items-center justify-center", className].join(
        " ",
      )}
      aria-hidden="true"
    >
      <Component
        className="size-[1em]"
        strokeWidth={filled ? 2.25 : 2}
        absoluteStrokeWidth
      />
    </span>
  );
}

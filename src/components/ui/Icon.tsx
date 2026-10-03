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
  Maximize2,
  Minimize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Smartphone,
  Timer,
  X,
} from "lucide-react";

const iconMap = {
  arrow_back: ArrowLeft,
  add: Plus,
  check: Check,
  close: X,
  code: Code,
  content_copy: Copy,
  database: Database,
  edit_note: FilePenLine,
  fullscreen: Maximize2,
  fullscreen_exit: Minimize2,
  laptop_mac: Laptop,
  lightbulb: Lightbulb,
  memory: Cpu,
  menu_book: BookOpen,
  my_location: Crosshair,
  pause: Pause,
  play_arrow: Play,
  remove: Minus,
  refresh: RotateCcw,
  search: Search,
  shuffle: Shuffle,
  skip_next: SkipForward,
  skip_previous: SkipBack,
  smartphone: Smartphone,
  sort: ArrowDownUp,
  sync_alt: ArrowLeftRight,
  timer: Timer,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  className?: string;
  filled?: boolean;
}

export function Icon({ name, className = "", filled = true }: IconProps) {
  const Component = iconMap[name];

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

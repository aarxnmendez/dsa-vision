import type { IconName } from "../components/ui/Icon";
import type { AlgorithmMeta } from "../types/algorithm";

export const CATEGORY_ICON_NAMES: Record<
  Exclude<AlgorithmMeta["category"], "all">,
  IconName
> = {
  arrays: "memory",
  "data-structures": "database",
  searching: "search",
  sorting: "sort",
  trees: "sync_alt",
  graphs: "sync_alt",
};

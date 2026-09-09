import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  isAlgorithmAvailable,
  type AlgorithmMeta,
} from "../../types/algorithm";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface AlgorithmCardProps {
  algorithm: AlgorithmMeta;
}

const complexityVariantMap = {
  success: "complexity-success",
  warning: "complexity-tertiary",
  error: "complexity-error",
  tertiary: "complexity-tertiary",
} as const;

const difficultyVariantMap = {
  beginner: "difficulty-beginner",
  intermediate: "difficulty-intermediate",
  advanced: "difficulty-advanced",
} as const;

type CategoryLabelKey =
  | "categories.array"
  | "categories.data-structures"
  | "categories.searching"
  | "categories.sorting"
  | "categories.trees"
  | "categories.graphs";

const categoryLabelKeys: Record<
  Exclude<AlgorithmMeta["category"], "all">,
  CategoryLabelKey
> = {
  arrays: "categories.array",
  "data-structures": "categories.data-structures",
  searching: "categories.searching",
  sorting: "categories.sorting",
  trees: "categories.trees",
  graphs: "categories.graphs",
};

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const { t: tCatalog } = useTranslation("catalog");
  const { t: tCommon } = useTranslation("common");
  const isAvailable = isAlgorithmAvailable(algorithm);

  const title = tCatalog(`algorithms.${algorithm.id}.title`, {
    defaultValue: algorithm.title,
  });
  const description = tCatalog(`algorithms.${algorithm.id}.description`, {
    defaultValue: algorithm.description,
  });
  const complexity = tCatalog(`algorithms.${algorithm.id}.complexity`, {
    defaultValue: algorithm.complexity,
  });

  return (
    <article
      className={[
        "bg-surface-container-lowest rounded-2xl border-2 border-surface-variant border-b-4 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        isAvailable
          ? "hover:bg-surface-bright hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(0,87,191,0.1)] group"
          : "opacity-95",
      ].join(" ")}
      aria-disabled={!isAvailable}
    >
      <div
        className={[
          `relative w-full aspect-[16/9] overflow-hidden rounded-t-xl p-3 ${algorithm.imageBg} border-b-2 border-surface-variant transition-colors duration-300 ease-in-out`,
          isAvailable ? "group-hover:border-primary/20" : "",
        ].join(" ")}
      >
        <img
          src={algorithm.imageUrl}
          alt=""
          width={algorithm.imageWidth}
          height={algorithm.imageHeight}
          loading="lazy"
          decoding="async"
          className="block h-full w-full rounded-lg object-cover"
        />
      </div>

      <div className="p-6 flex flex-col gap-4 flex-grow">
        <div className="flex flex-col items-start gap-2">
          <Badge variant={complexityVariantMap[algorithm.complexityVariant]}>
            {complexity}
          </Badge>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {title}
          </h2>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant={difficultyVariantMap[algorithm.difficulty]}>
            {tCommon(`difficulty.${algorithm.difficulty}`)}
          </Badge>
          <Badge variant="category">
            {tCatalog(categoryLabelKeys[algorithm.category])}
          </Badge>
          {!isAvailable && (
            <Badge variant="category">{tCommon("comingSoon")}</Badge>
          )}
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
          {description}
        </p>

        {isAvailable ? (
          <Link to={algorithm.route} className="mt-4 cursor-pointer">
            <Button fullWidth className="uppercase">
              {tCommon("explore")}
            </Button>
          </Link>
        ) : (
          <Button
            fullWidth
            disabled
            aria-disabled="true"
            className="mt-4 uppercase opacity-60 cursor-not-allowed"
          >
            {tCommon("comingSoon")}
          </Button>
        )}
      </div>
    </article>
  );
}

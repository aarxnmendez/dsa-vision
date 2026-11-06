import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  isAlgorithmAvailable,
  type AlgorithmMeta,
} from "../../types/algorithm";
import { CATEGORY_ICON_NAMES } from "../../constants/categoryIcons";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";

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


const cardBaseClass =
  "flex h-full flex-col gap-3 rounded-2xl border-2 border-surface-variant border-b-4 bg-surface-container-lowest p-5 transition-all duration-300 ease-in-out";

export function AlgorithmCard({
  algorithm,
}: AlgorithmCardProps) {
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

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-xl text-primary"
          aria-hidden="true"
        >
          <Icon name={CATEGORY_ICON_NAMES[algorithm.category]} filled={false} />
        </span>
        <Badge variant={complexityVariantMap[algorithm.complexityVariant]}>
          {complexity}
        </Badge>
      </div>

      <h2 className="font-headline-md text-headline-md text-on-surface">
        {title}
      </h2>

      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 flex-grow">
        {description}
      </p>

      <div className="mt-1 flex items-center justify-between gap-2">
        <Badge variant={difficultyVariantMap[algorithm.difficulty]}>
          {tCommon(`difficulty.${algorithm.difficulty}`)}
        </Badge>
        {isAvailable ? (
          <span className="inline-flex items-center gap-1 text-sm font-bold text-primary transition-transform duration-300 group-hover:translate-x-0.5">
            {tCommon("explore")}
            <Icon name="arrow_forward" filled={false} />
          </span>
        ) : (
          <Badge variant="category">{tCommon("comingSoon")}</Badge>
        )}
      </div>
    </>
  );

  if (!isAvailable) {
    return (
      <article
        className={[cardBaseClass, "opacity-70"].join(" ")}
        aria-disabled="true"
      >
        {content}
      </article>
    );
  }

  return (
    <Link
      to={algorithm.route}
      className={[
        cardBaseClass,
        "group cursor-pointer hover:border-primary/30 hover:bg-surface-bright hover:shadow-[0_8px_24px_rgba(0,87,191,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      ].join(" ")}
    >
      {content}
    </Link>
  );
}

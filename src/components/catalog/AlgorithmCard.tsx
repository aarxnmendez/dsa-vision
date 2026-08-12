import { Link } from "react-router-dom";
import type { AlgorithmMeta } from "../../types/algorithm";
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

const difficultyLabelMap = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

const categoryLabelMap = {
  arrays: "Array",
  sorting: "Sorting",
  trees: "Trees",
  graphs: "Graphs",
} as const;

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const isAvailable = algorithm.route !== "#";

  return (
    <article className="bg-surface-container-lowest rounded-2xl border-2 border-surface-variant border-b-4 flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:bg-surface-bright hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(0,87,191,0.1)] group">
      <div
        className={`h-48 ${algorithm.imageBg} w-full flex items-center justify-center p-4 border-b-2 border-surface-variant transition-colors duration-300 ease-in-out group-hover:border-primary/20`}
      >
        <img
          src={algorithm.imageUrl}
          alt={algorithm.title}
          className="object-contain h-full w-full rounded-xl"
        />
      </div>

      <div className="p-6 flex flex-col gap-4 flex-grow">
        <div className="flex justify-between items-start gap-3">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {algorithm.title}
          </h2>
          <Badge variant={complexityVariantMap[algorithm.complexityVariant]}>
            {algorithm.complexity}
          </Badge>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant={difficultyVariantMap[algorithm.difficulty]}>
            {difficultyLabelMap[algorithm.difficulty]}
          </Badge>
          <Badge variant="category">
            {categoryLabelMap[algorithm.category]}
          </Badge>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
          {algorithm.description}
        </p>

        {isAvailable ? (
          <Link to={algorithm.route} className="mt-4 cursor-pointer">
            <Button fullWidth className="uppercase">
              Explore
            </Button>
          </Link>
        ) : (
          <Button fullWidth disabled className="uppercase opacity-60 cursor-not-allowed">
            Coming Soon
          </Button>
        )}
      </div>
    </article>
  );
}

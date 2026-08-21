interface ArrayIndexLabelsProps {
  count: number;
  className?: string;
}

export function ArrayIndexLabels({
  count,
  className = "",
}: ArrayIndexLabelsProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <div
      className={[
        "flex w-full",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={`array-index-${index}`}
          className="flex min-w-0 flex-1 items-center justify-center text-center"
        >
          <span className="text-xs font-semibold tabular-nums text-slate-600">
            [{index}]
          </span>
        </div>
      ))}
    </div>
  );
}

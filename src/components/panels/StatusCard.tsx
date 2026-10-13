interface StatusCardProps {
  title: string;
  detail: string;
  pointerMovement?: string | string[];
  isSuccess?: boolean;
  isError?: boolean;
}

export function StatusCard({
  title,
  detail,
  pointerMovement,
  isSuccess = false,
  isError = false,
}: StatusCardProps) {
  const pointerLines = pointerMovement
    ? Array.isArray(pointerMovement)
      ? pointerMovement
      : [pointerMovement]
    : [];

  return (
    <div
      className={[
        "w-full min-h-28 max-w-lg mx-auto rounded-xl px-5 py-3 shadow-md flex flex-col justify-center gap-1.5 text-center border",
        isError
          ? "bg-error-container/30 border-error text-on-error-container"
          : isSuccess
            ? "bg-surface-container-lowest border-success/60"
            : "bg-surface-container-lowest border-success/30",
      ].join(" ")}
    >
      <p
        className={[
          "font-headline-md text-headline-md leading-snug",
          isError ? "text-error" : "text-on-surface",
        ].join(" ")}
      >
        {title}
      </p>
      <p
        className={[
          "font-body-md text-body-md leading-snug",
          isError
            ? "text-on-error-container"
            : isSuccess
              ? "text-secondary"
              : "text-on-surface-variant",
        ].join(" ")}
      >
        {detail}
      </p>
      {pointerLines.map((line, lineIndex) => (
        <p
          key={`${lineIndex}-${line}`}
          className="font-body-md text-body-md font-bold leading-snug text-primary"
        >
          {line}
        </p>
      ))}
    </div>
  );
}

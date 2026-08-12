type BadgeVariant =
  | "complexity-success"
  | "complexity-error"
  | "complexity-tertiary"
  | "difficulty-beginner"
  | "difficulty-intermediate"
  | "difficulty-advanced"
  | "category"
  | "time"
  | "space";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  "complexity-success":
    "bg-secondary-container text-on-secondary-container",
  "complexity-error": "bg-error-container text-on-error-container",
  "complexity-tertiary": "bg-tertiary-fixed text-on-tertiary-fixed",
  "difficulty-beginner": "bg-secondary-fixed-dim/20 text-secondary",
  "difficulty-intermediate": "bg-tertiary-fixed-dim/20 text-tertiary",
  "difficulty-advanced": "bg-error-container/50 text-error",
  category: "bg-surface-container text-on-surface-variant",
  time: "bg-success text-white border-b-4 border-success-dark",
  space: "bg-tertiary-fixed text-on-tertiary-fixed border-b-4 border-tertiary-fixed-dim",
};

export function Badge({
  children,
  variant = "category",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-label-caps text-label-caps px-2 py-1 rounded-full",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}

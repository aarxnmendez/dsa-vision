import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary border-b-4 border-on-primary-fixed-variant hover:bg-primary-container hover:text-on-primary-container",
  secondary:
    "bg-surface-container-lowest text-on-surface-variant border-2 border-surface-variant border-b-4 hover:bg-surface-container-low",
  success:
    "bg-success text-white border-b-4 border-success-dark hover:brightness-110",
  ghost:
    "bg-transparent text-on-surface-variant border-2 border-transparent hover:bg-surface-container",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "btn-3d font-body-lg text-body-lg font-semibold rounded-2xl px-4 py-3 transition-all duration-300 ease-in-out cursor-pointer disabled:cursor-not-allowed",
        variantClasses[variant],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

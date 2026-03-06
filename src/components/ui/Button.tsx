import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: "button";
  href?: never;
  variant?: ButtonVariant;
};

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: "a";
  href: string;
  variant?: ButtonVariant;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover hover:shadow-[0_0_0_4px_var(--accent-dim)]",
  ghost:
    "bg-transparent text-text-muted border border-border hover:text-text hover:border-text-subtle hover:bg-elevated",
};

export default function Button(props: ButtonProps) {
  const { variant = "primary", className = "", ...rest } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if (props.as === "a") {
    const { as: _, variant: _v, ...linkProps } = props as ButtonAsLink;
    return <a {...linkProps} className={classes} />;
  }

  const { as: _, variant: _v, ...btnProps } = props as ButtonAsButton;
  return <button {...btnProps} className={classes} />;
}

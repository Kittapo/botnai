import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidthMobile?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-strong text-surface border border-transparent shadow-[0_10px_28px_-10px_rgba(184,41,107,0.48)] hover:bg-[#9D2059] active:bg-[#891B4D]",
  secondary:
    "bg-surface/92 text-text border border-[#DEC9D4] shadow-[0_6px_20px_-10px_rgba(37,43,58,0.12)] hover:bg-secondary/60 hover:border-primary-strong/40 active:bg-secondary/80",
  ghost:
    "bg-transparent text-text border border-transparent hover:bg-secondary/45 active:bg-secondary/65",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "min-h-[48px] px-6 py-3 text-[0.95rem]",
  lg: "min-h-[52px] px-7 py-3.5 text-[1rem]",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "lg",
    fullWidthMobile = false,
    children,
    className = "",
    ...rest
  } = props;

  const classes = [
    "inline-flex items-center justify-center gap-2.5 rounded-full font-medium tracking-[0.01em] leading-[1.4]",
    "transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out",
    "md:hover:-translate-y-[1px] active:scale-[0.985]",
    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-strong",
    "disabled:opacity-55 disabled:pointer-events-none select-none",
    variantStyles[variant],
    sizeStyles[size],
    fullWidthMobile ? "w-full sm:w-auto" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && typeof props.href === "string") {
    const {
      href,
      variant: _variant,
      size: _size,
      fullWidthMobile: _fullWidthMobile,
      children: _children,
      className: _className,
      ...linkRest
    } = props;
    void _variant;
    void _size;
    void _fullWidthMobile;
    void _children;
    void _className;
    return (
      <Link
        href={href}
        data-cursor="interactive"
        className={classes}
        {...linkRest}
      >
        {children}
      </Link>
    );
  }

  const buttonRest = rest as Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof SharedProps
  >;

  return (
    <button
      type={buttonRest.type ?? "button"}
      data-cursor="interactive"
      className={classes}
      {...buttonRest}
    >
      {children}
    </button>
  );
}

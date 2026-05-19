import * as React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/src/lib/utils";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "glass";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  isLoading?: boolean;
}

export const LuxuryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "bg-ink-950 text-white hover:bg-ink-900 shadow-lg shadow-ink-950/20 active:scale-[0.98]",
      secondary:
        "bg-white text-ink-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm active:scale-[0.98]",
      tertiary:
        "bg-transparent text-slate-lux hover:bg-slate-100 active:scale-[0.98]",
      destructive:
        "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 active:scale-[0.98]",
      glass: "luxury-glass text-ink-900 hover:bg-white/90 active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-8 text-base gap-2.5",
      xl: "h-16 px-10 text-lg gap-3",
      icon: "h-11 w-11 flex items-center justify-center",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-button",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children as React.ReactNode}
      </motion.button>
    );
  },
);

LuxuryButton.displayName = "LuxuryButton";

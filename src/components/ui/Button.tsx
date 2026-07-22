import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { m } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[background-color,border-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-subtle hover:bg-primary/90 hover:shadow-[0_8px_20px_-6px_hsl(var(--primary)/0.45)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-subtle hover:bg-secondary/90 hover:shadow-[0_8px_20px_-6px_hsl(var(--secondary)/0.45)]",
        outline:
          "border border-border bg-transparent hover:bg-muted",
        ghost: "bg-transparent hover:bg-muted",
        destructive: "bg-danger text-danger-foreground hover:bg-danger/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

export interface ButtonProps extends NativeButtonProps, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const TAP_TRANSITION = { type: "spring", stiffness: 500, damping: 30 } as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    const inert = disabled || loading;
    return (
      <m.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={inert}
        aria-busy={loading || undefined}
        whileHover={inert || variant === "link" ? undefined : { y: -1 }}
        whileTap={inert || variant === "link" ? undefined : { y: 0, scale: 0.97 }}
        transition={TAP_TRANSITION}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </m.button>
    );
  }
);
Button.displayName = "Button";

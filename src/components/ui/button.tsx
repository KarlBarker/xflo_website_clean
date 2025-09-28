import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-button text-button font-button ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-interactive-primary text-content-inverse hover:bg-interactive-primary-hover shadow-button",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-button",
        outline:
          "border border-input border-stroke-primary bg-transparent hover:bg-surface-tertiary hover:text-content-primary shadow-button",
        secondary:
          "bg-interactive-secondary text-content-inverse hover:bg-interactive-secondary-hover shadow-button",
        ghost: "hover:bg-surface-tertiary hover:text-content-primary",
        link: "text-interactive-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-button px-3",
        lg: "h-11 rounded-button px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        role={asChild ? undefined : "button"}
        aria-disabled={props.disabled ? true : undefined}
        tabIndex={props.disabled ? -1 : 0}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

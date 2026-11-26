import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// shadcn/ui Button, restyled as NXTGEN's wide uppercase pills with a lift on hover.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent font-bold tracking-wide whitespace-nowrap uppercase transition-all duration-300 outline-none select-none hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-ring/60 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_8px_24px_-8px_rgba(200,54,58,0.6)] hover:bg-accent-700",
        secondary: "bg-secondary text-secondary-foreground shadow-[0_8px_24px_-8px_rgba(31,117,179,0.6)] hover:bg-brand-700",
        dark: "bg-navy-950 text-white shadow-[0_8px_24px_-8px_rgba(7,11,24,0.6)] hover:bg-navy-800",
        outline: "border-2 border-secondary bg-transparent text-brand-700 hover:bg-accent",
        white: "bg-white text-navy-900 shadow-lg hover:bg-accent",
        ghostLight: "border-2 border-white/50 text-white hover:border-white hover:bg-white/10",
        ghost: "normal-case hover:translate-y-0 hover:bg-muted",
        link: "normal-case text-secondary underline-offset-4 hover:translate-y-0 hover:underline",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "min-h-12 px-7 text-base",
        sm: "min-h-10 px-5 text-sm",
        lg: "min-h-14 min-w-60 px-8 text-[1.1875rem]",
        icon: "size-12 p-0",
        "icon-sm": "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

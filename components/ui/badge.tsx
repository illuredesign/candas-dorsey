import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-primary px-3 pt-[5px] pb-[3px] font-display text-[13px] tracking-[0.1em] uppercase text-primary-foreground [a]:hover:bg-primary/80",
        award:
          "bg-accent/15 px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-accent dark:bg-accent/10",
        metadata:
          "bg-foreground/5 px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-foreground/60 dark:bg-canvas-cream/8 dark:text-canvas-cream/60",
        secondary:
          "bg-secondary px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 px-2.5 py-1 font-mono text-[10px] text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-foreground [a]:hover:bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

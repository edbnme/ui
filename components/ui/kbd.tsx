import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-token w-fit min-w-5 items-center justify-center gap-1 rounded-control-xs bg-foreground/[.05] px-1 font-sans text-micro text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1 font-sans text-micro", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }

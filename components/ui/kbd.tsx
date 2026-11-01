import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-token w-fit min-w-5 items-center justify-center gap-1 rounded-control-xs bg-foreground/[.05] px-1 font-sans text-micro text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        // On the white tooltip and menu surfaces the resting fill is too
        // faint; a menu shortcut's key takes the shortcut's own ink.
        "in-[[data-slot=tooltip-content],[data-slot$=menu-content],[data-slot=menubar-content]]:bg-foreground/[.07] dark:in-[[data-slot=tooltip-content],[data-slot$=menu-content],[data-slot=menubar-content]]:bg-foreground/10 in-data-[slot$=-shortcut]:bg-foreground/[.07] in-data-[slot$=-shortcut]:text-current dark:in-data-[slot$=-shortcut]:bg-foreground/10",
        // Inside a button the key follows the button's ink, so it reads on
        // the ink default button as well as on the outline and ghost fills.
        "in-[button,[data-slot=button]]:bg-current/[.07] in-[button,[data-slot=button]]:text-current/70 dark:in-[button,[data-slot=button]]:bg-current/[.14]",
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

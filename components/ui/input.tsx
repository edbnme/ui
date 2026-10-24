import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-control border border-input bg-transparent px-3 py-1 text-[15px] outline-none pointer-coarse:h-10 pointer-coarse:text-base transition-[color,background-color] duration-(--motion-duration-press) ease-(--motion-ease-out) motion-reduce:transition-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-[15px] file:text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }

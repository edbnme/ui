import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      {/* No vertical padding: the browser centres a select's text in its
          box, and padding left the 28px size too short for a 15px line,
          so the text sat low and lost its descenders. */}
      <select
        data-slot="native-select"
        data-size={size}
        className="h-control w-full min-w-0 appearance-none rounded-control border border-input bg-transparent py-0 ps-3 pe-8 text-body pointer-coarse:min-h-control-touch pointer-coarse:text-base transition-[color,background-color] duration-(--motion-duration-press) motion-reduce:transition-none outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-control-sm data-[size=sm]:rounded-control-sm data-[size=sm]:ps-2.5 data-[size=sm]:pe-7 data-[size=sm]:text-small dark:aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40"
        {...props}
      />
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 end-2.5 size-4 -translate-y-1/2 text-muted-foreground select-none group-data-[size=sm]/native-select:end-2 group-data-[size=sm]/native-select:size-3.5" aria-hidden="true" data-slot="native-select-icon" />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }

"use client"

import { Meter as MeterPrimitive } from "@base-ui/react/meter"

import { cn } from "@/lib/utils"

// A value within a known range, such as storage or context used, rather
// than a task's progress (that's Progress). Like Progress it draws its own
// track after the label and value; `track={false}` leaves the value alone,
// for a meter that reads as text.
function Meter({
  className,
  children,
  track = true,
  ...props
}: MeterPrimitive.Root.Props & { track?: boolean }) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      className={cn("flex w-full flex-wrap gap-3", className)}
      {...props}
    >
      {children}
      {track && (
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      )}
    </MeterPrimitive.Root>
  )
}

function MeterTrack({ className, ...props }: MeterPrimitive.Track.Props) {
  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-foreground/10",
        className
      )}
      {...props}
    />
  )
}

function MeterIndicator({
  className,
  ...props
}: MeterPrimitive.Indicator.Props) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      className={cn(
        "h-full bg-primary transition-[width] duration-200 ease-(--motion-ease-out) motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn("text-body", className)}
      {...props}
    />
  )
}

function MeterValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      className={cn(
        "ms-auto text-small text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

export { Meter, MeterTrack, MeterIndicator, MeterLabel, MeterValue }

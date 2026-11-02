"use client"

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import { MinusIcon, MoveHorizontalIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// A number with steppers, such as a cart quantity or a seat count. Base UI
// keeps the value in range, steps with the arrow keys (Shift for the large
// step, Alt for the small one) and disables a stepper at its limit. The
// steppers are out of the tab order, so the field is one tab stop.
function NumberField({ className, ...props }: NumberFieldPrimitive.Root.Props) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-field"
      className={cn("flex flex-col items-start gap-2", className)}
      {...props}
    />
  )
}

// The bordered box around the input and its steppers. It takes the input's
// focus ring and invalid state, like InputGroup, and sizes to its content;
// pass `w-full` to fill a form column.
function NumberFieldGroup({
  className,
  ...props
}: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(
        "group/number-field-group relative flex h-control max-w-full min-w-0 items-center rounded-control border border-input bg-transparent p-px pointer-coarse:min-h-control-touch pointer-coarse:p-0.75 transition-[color,background-color] duration-(--motion-duration-press) motion-reduce:transition-none outline-none data-disabled:opacity-50 has-[[data-slot=number-field-input]:focus-visible]:outline-2 has-[[data-slot=number-field-input]:focus-visible]:outline-solid has-[[data-slot=number-field-input]:focus-visible]:-outline-offset-1 has-[[data-slot=number-field-input]:focus-visible]:outline-ring has-[[data-slot=number-field-input][aria-invalid=true]]:border-destructive has-[[data-slot=number-field-input][aria-invalid=true]]:ring-3 has-[[data-slot=number-field-input][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot=number-field-input][aria-invalid=true]]:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(
        "h-full w-14 min-w-0 grow bg-transparent px-1 text-center text-body tabular-nums outline-none pointer-coarse:text-base placeholder:text-muted-foreground disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

// Ghost icon buttons 2px in from the box's edge, so they take the small
// control radius. A stepper at its limit dims on its own; when the whole
// field is disabled the box dims instead, once.
const stepperClassName =
  "relative flex size-control-sm shrink-0 items-center justify-center rounded-control-sm text-muted-foreground outline-none select-none transition-[color,background-color] duration-100 motion-reduce:transition-none pointer-coarse:size-control pointer-coarse:rounded-control-xs pointer-coarse:after:absolute pointer-coarse:after:-inset-1 [@media(hover:hover)_and_(pointer:fine)]:not-data-disabled:hover:bg-foreground/[.04] [@media(hover:hover)_and_(pointer:fine)]:not-data-disabled:hover:text-foreground not-data-disabled:active:bg-foreground/[.07] not-data-disabled:active:text-foreground data-disabled:pointer-events-none not-group-data-disabled/number-field-group:data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

function NumberFieldDecrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      className={cn(stepperClassName, className)}
      {...props}
    >
      {children ?? <MinusIcon />}
    </NumberFieldPrimitive.Decrement>
  )
}

function NumberFieldIncrement({
  className,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      className={cn(stepperClassName, className)}
      {...props}
    >
      {children ?? <PlusIcon />}
    </NumberFieldPrimitive.Increment>
  )
}

// Drag across the label to change the value. The pointer is locked while
// scrubbing, so the area draws its own cursor in its place.
function NumberFieldScrubArea({
  className,
  children,
  ...props
}: NumberFieldPrimitive.ScrubArea.Props) {
  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn(
        "cursor-ew-resize select-none data-disabled:cursor-default data-readonly:cursor-default",
        className
      )}
      {...props}
    >
      {children}
      <NumberFieldPrimitive.ScrubAreaCursor
        data-slot="number-field-scrub-area-cursor"
        className="text-foreground drop-shadow-xs"
      >
        <MoveHorizontalIcon className="size-5" />
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  )
}

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldScrubArea,
}

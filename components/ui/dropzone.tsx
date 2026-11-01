"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

type DropzoneContextValue = {
  open: () => void
  dragging: boolean
  disabled: boolean
  registerTrigger: () => () => void
}

const DropzoneContext = React.createContext<DropzoneContextValue | null>(null)

function useDropzoneContext(part: string) {
  const context = React.useContext(DropzoneContext)
  if (!context) throw new Error(`${part} must be used within <Dropzone>`)
  return context
}

// Only drags that carry files light the zone up.
const carriesFiles = (event: React.DragEvent) =>
  event.dataTransfer.types.includes("Files")

// Takes files dropped on it or picked with the file dialog, and hands them
// to `onFiles`. As an `area` (the default) it's a dashed panel; the whole
// panel is the button (a click, Enter or Space opens the picker) unless it
// holds a DropzoneTrigger, which then opens the picker alone. As an
// `overlay` it wraps something else that takes drops, such as a chat
// composer: a DropzoneTrigger opens the dialog and DropzoneOverlay covers it
// while a file is held over it. While dragging, the root has
// `data-dragging`.
function Dropzone({
  className,
  mode = "area",
  onFiles,
  accept,
  multiple = true,
  disabled = false,
  name,
  children,
  onClick,
  onKeyDown,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...props
}: Omit<React.ComponentProps<"div">, "onDrop"> & {
  mode?: "area" | "overlay"
  onFiles?: (files: File[]) => void
  /** Passed to the file dialog, as on `<input type="file">`. */
  accept?: string
  multiple?: boolean
  disabled?: boolean
  /** The hidden file input's name, for a form that posts the files. */
  name?: string
  onDrop?: React.DragEventHandler<HTMLDivElement>
}) {
  const input = React.useRef<HTMLInputElement>(null)
  const depth = React.useRef(0)
  const [dragging, setDragging] = React.useState(false)
  const [triggers, setTriggers] = React.useState(0)

  const open = React.useCallback(() => {
    if (!disabled) input.current?.click()
  }, [disabled])

  const registerTrigger = React.useCallback(() => {
    setTriggers((count) => count + 1)
    return () => setTriggers((count) => count - 1)
  }, [])

  const context = React.useMemo(
    () => ({ open, dragging, disabled, registerTrigger }),
    [open, dragging, disabled, registerTrigger]
  )

  const take = (list: FileList | null) => {
    const files = Array.from(list ?? [])
    if (files.length > 0) onFiles?.(multiple ? files : files.slice(0, 1))
  }

  const area = mode === "area"
  // The panel itself is the button only when nothing inside opens the picker.
  const pressable = area && triggers === 0

  return (
    <DropzoneContext.Provider value={context}>
      <div
        data-slot="dropzone"
        data-mode={mode}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        role={pressable ? "button" : undefined}
        tabIndex={pressable ? (disabled ? -1 : 0) : undefined}
        aria-disabled={pressable && disabled ? true : undefined}
        className={cn(
          "group/dropzone relative",
          area &&
            "flex flex-col items-center justify-center gap-2.5 rounded-panel border border-dashed border-border px-6 py-7 text-center text-body outline-none transition-[border-color,background-color] duration-150 ease-(--motion-ease-out) motion-reduce:transition-none data-dragging:border-foreground/20 data-dragging:bg-foreground/[.02] data-disabled:pointer-events-none data-disabled:opacity-50",
          pressable &&
            "cursor-pointer focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[.02]",
          !area &&
            "rounded-card data-dragging:outline-2 data-dragging:outline-dashed data-dragging:outline-offset-2 data-dragging:outline-ring",
          className
        )}
        onClick={(event) => {
          onClick?.(event)
          // The hidden input's own click bubbles up here too.
          if (event.target === input.current) return
          if (pressable && !event.defaultPrevented) open()
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (
            !pressable ||
            event.defaultPrevented ||
            event.target !== event.currentTarget
          )
            return
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            open()
          }
        }}
        onDragEnter={(event) => {
          onDragEnter?.(event)
          if (disabled || !carriesFiles(event)) return
          event.preventDefault()
          depth.current += 1
          setDragging(true)
        }}
        onDragOver={(event) => {
          onDragOver?.(event)
          if (disabled || !carriesFiles(event)) return
          event.preventDefault()
          event.dataTransfer.dropEffect = "copy"
        }}
        onDragLeave={(event) => {
          onDragLeave?.(event)
          if (disabled || !carriesFiles(event)) return
          depth.current = Math.max(0, depth.current - 1)
          if (depth.current === 0) setDragging(false)
        }}
        onDrop={(event) => {
          onDrop?.(event)
          if (disabled || !carriesFiles(event)) return
          event.preventDefault()
          depth.current = 0
          setDragging(false)
          take(event.dataTransfer.files)
        }}
        {...props}
      >
        {children}
        <input
          ref={input}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          hidden
          tabIndex={-1}
          data-slot="dropzone-input"
          onChange={(event) => {
            take(event.target.files)
            // So picking the same file again still fires a change.
            event.target.value = ""
          }}
        />
      </div>
    </DropzoneContext.Provider>
  )
}

function DropzoneIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="dropzone-icon"
      className={cn(
        "flex size-control shrink-0 items-center justify-center rounded-control bg-muted text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropzoneTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dropzone-title"
      className={cn("text-body", className)}
      {...props}
    />
  )
}

function DropzoneDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="dropzone-description"
      className={cn("text-small text-muted-foreground", className)}
      {...props}
    />
  )
}

// Opens the file dialog: an overlay's attach button, or a visible button in
// an area (which then stops being a button itself).
function DropzoneTrigger({
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  const { open, disabled, registerTrigger } =
    useDropzoneContext("DropzoneTrigger")
  React.useLayoutEffect(registerTrigger, [registerTrigger])
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? undefined : "button",
        disabled: disabled || undefined,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          // Handled here, so an area dropzone around it doesn't open twice.
          event.preventDefault()
          open()
        },
      },
      props
    ),
    render,
    state: {
      slot: "dropzone-trigger",
    },
  })
}

// Covers an `overlay` dropzone while a file is held over it.
function DropzoneOverlay({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { dragging } = useDropzoneContext("DropzoneOverlay")
  if (!dragging) return null
  return (
    <div
      data-slot="dropzone-overlay"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-[inherit] bg-muted/95 text-body transition-opacity duration-150 starting:opacity-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export {
  Dropzone,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneOverlay,
  DropzoneTitle,
  DropzoneTrigger,
}

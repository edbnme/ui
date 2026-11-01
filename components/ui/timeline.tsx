"use client"

import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

type TimelineStatus = "pending" | "running" | "done" | "error"

const statusLabels: Record<TimelineStatus, string> = {
  pending: "Not started",
  running: "In progress",
  done: "Done",
  error: "Failed",
}

const TimelineItemContext = React.createContext<TimelineStatus | undefined>(
  undefined
)

// An ordered list of steps: a deploy, an agent run, an order's journey.
// A line joins each step's marker to the next; `connector={false}` drops it
// for a tighter list.
function Timeline({
  className,
  connector = true,
  ...props
}: React.ComponentProps<"ol"> & { connector?: boolean }) {
  return (
    <ol
      data-slot="timeline"
      data-connector={connector}
      className={cn("group/timeline grid", className)}
      {...props}
    />
  )
}

function TimelineItem({
  className,
  status,
  ...props
}: React.ComponentProps<"li"> & { status?: TimelineStatus }) {
  return (
    <TimelineItemContext.Provider value={status}>
      <li
        data-slot="timeline-item"
        data-status={status}
        aria-current={status === "running" ? "step" : undefined}
        className={cn(
          "group/timeline-item relative grid grid-cols-[1rem_minmax(0,1fr)] gap-x-3 not-last:pb-1.5 group-data-[connector=true]/timeline:not-last:pb-5 group-data-[connector=true]/timeline:not-last:before:absolute group-data-[connector=true]/timeline:not-last:before:start-[calc(0.5rem-0.5px)] group-data-[connector=true]/timeline:not-last:before:top-[calc(1lh+0.25rem)] group-data-[connector=true]/timeline:not-last:before:bottom-1 group-data-[connector=true]/timeline:not-last:before:w-px group-data-[connector=true]/timeline:not-last:before:bg-border",
          className
        )}
        {...props}
      />
    </TimelineItemContext.Provider>
  )
}

// The step's marker: a dot while pending, a spinner while running, a check
// once done and a cross on an error. The icon is hidden from screen readers,
// which hear `label` instead (by default the status in words; pass "" when
// the text says it already). A marker that changes grows in; the ones there
// at first are simply there. Children replace the icon; `{null}` shows none.
function TimelineIndicator({
  className,
  status: statusProp,
  label,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  status?: TimelineStatus
  label?: string
}) {
  const itemStatus = React.useContext(TimelineItemContext)
  const status = statusProp ?? itemStatus ?? "pending"
  const [firstStatus] = React.useState(status)
  const enter =
    status !== firstStatus &&
    "transition-[opacity,scale] duration-200 ease-(--motion-ease-out) starting:scale-50 starting:opacity-0 motion-reduce:transition-none"
  const text = label ?? statusLabels[status]

  return (
    <span
      data-slot="timeline-indicator"
      data-status={status}
      className={cn(
        "grid size-4 shrink-0 place-items-center in-data-[slot=timeline-item]:h-lh in-data-[slot=timeline-item]:w-4 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <span aria-hidden className="grid place-items-center">
        {children !== undefined
          ? children
          : status === "running" ? (
            <Spinner key={status} className={cn("size-3.5", enter)} />
          ) : status === "done" ? (
            <CheckIcon
              key={status}
              className={cn("text-muted-foreground", enter)}
            />
          ) : status === "error" ? (
            <XIcon key={status} className={cn(enter)} />
          ) : (
            <span
              key={status}
              className="size-1 rounded-full bg-muted-foreground/40"
            />
          )}
      </span>
      {text && <span className="sr-only">{text}</span>}
    </span>
  )
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn(
        "flex min-w-0 flex-wrap items-baseline gap-x-3",
        className
      )}
      {...props}
    />
  )
}

// Ink while the step runs or has failed; muted before and after.
function TimelineTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="timeline-title"
      className={cn(
        "min-w-0 flex-1 truncate transition-colors duration-200 ease-(--motion-ease-out) motion-reduce:transition-none group-data-[status=done]/timeline-item:text-muted-foreground group-data-[status=pending]/timeline-item:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TimelineDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-description"
      className={cn("basis-full truncate text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
}
export type { TimelineStatus }

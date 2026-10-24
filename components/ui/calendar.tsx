"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  useDayPicker,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  // Six weeks in every month, so the calendar's height never jumps.
  fixedWeeks = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks={fixedWeeks}
      className={cn(
        "group/calendar bg-background p-3 [--cell-radius:var(--radius-control)] [--cell-size:--spacing(8)] pointer-coarse:[--cell-size:--spacing(10)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1 text-[15px]",
          defaultClassNames.dropdowns
        ),
        // The month and year dropdowns are native selects laid over their
        // label, so the label is the 32px target and carries the states.
        dropdown_root: cn(
          "relative rounded-(--cell-radius) transition-[background-color] duration-100 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:has-[select:hover]:bg-foreground/[.04] has-[select:focus-visible]:outline-2 has-[select:focus-visible]:outline-solid has-[select:focus-visible]:outline-offset-2 has-[select:focus-visible]:outline-ring",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none",
          captionLayout === "label"
            ? "text-[15px]"
            : "flex h-(--cell-size) items-center gap-1 rounded-(--cell-radius) ps-2 pe-1.5 text-[15px] [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[13px] [font-weight:inherit] text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[13px] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-s-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-s-(--cell-radius) bg-foreground/[.04] after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-foreground/[.04]",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-e-(--cell-radius) bg-foreground/[.04] after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-foreground/[.04]",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-foreground/[.04] text-foreground data-[selected=true]:bg-transparent",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      // Module-level parts, so a new selection updates the days in place.
      // Parts defined inline here were new component types on every
      // render, which remounted the whole grid on each click.
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarRoot({
  className,
  rootRef,
  ...props
}: React.ComponentProps<"div"> & { rootRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...props}
    />
  )
}

function CalendarChevron({
  className,
  orientation,
  ...props
}: React.ComponentProps<"svg"> & {
  orientation?: "up" | "down" | "left" | "right"
}) {
  const Icon =
    orientation === "left"
      ? ChevronLeftIcon
      : orientation === "right"
        ? ChevronRightIcon
        : ChevronDownIcon
  return <Icon className={cn("size-4", className)} {...props} />
}

function CalendarWeekNumber({
  children,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </td>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()
  const { dayPickerProps } = useDayPicker()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(
        (locale ?? dayPickerProps.locale)?.code
      )}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none focus-visible:-outline-offset-2 data-[selected-single=true]:focus-visible:-outline-offset-4 data-[selected-single=true]:focus-visible:outline-primary-foreground data-[range-start=true]:focus-visible:-outline-offset-4 data-[range-start=true]:focus-visible:outline-primary-foreground data-[range-end=true]:focus-visible:-outline-offset-4 data-[range-end=true]:focus-visible:outline-primary-foreground data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-e-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-foreground/[.04] data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-s-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:data-[selected-single=true]:bg-primary [@media(hover:hover)_and_(pointer:fine)]:hover:data-[selected-single=true]:text-primary-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:data-[range-start=true]:bg-primary [@media(hover:hover)_and_(pointer:fine)]:hover:data-[range-start=true]:text-primary-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:data-[range-end=true]:bg-primary [@media(hover:hover)_and_(pointer:fine)]:hover:data-[range-end=true]:text-primary-foreground [&>span]:text-[13px] [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

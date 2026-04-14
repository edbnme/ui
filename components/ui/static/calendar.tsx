/**
 * Calendar — Date picker with single, multiple, and range selection.
 * Built on react-day-picker library.
 *
 * @example
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 *
 * @see https://daypicker.dev
 */
"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- CALENDAR ---------------------------------------------------------------

type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cn(
          "absolute left-1 top-0 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          "absolute right-1 top-0 inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse space-x-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md p-0 font-normal transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "aria-selected:opacity-100"
        ),
        range_end: "day-range-end rounded-r-md",
        range_start: "day-range-start rounded-l-md",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <CaretLeft className="h-4 w-4" />
          ) : (
            <CaretRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

// ---- EXPORTS ----------------------------------------------------------------

export { Calendar, type CalendarProps };

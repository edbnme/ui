/**
 * Calendar - Date picker with single and multiple selection.
 * Built on DayPicker v10 via the `@daypicker/react` package.
 *
 * The wrapper forwards supported DayPicker props and keeps every visual style
 * in this file so previews, manual copy, and registry installs share one source.
 *
 * Anatomy:
 * ```tsx
 * const [date, setDate] = React.useState<Date | undefined>(new Date());
 *
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * ```
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui - https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/calendar
 * @upstream   DayPicker - https://daypicker.dev
 * @registryDescription Date picker with single and multiple selection via DayPicker.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import {
  DayPicker,
  type ChevronProps,
  type DayPickerProps,
  type RootProps,
} from "@daypicker/react";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
} from "@phosphor-icons/react";
import {
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectRoot,
  SelectScrollDownArrow,
  SelectScrollUpArrow,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ---- CALENDAR ---------------------------------------------------------------

export type CalendarProps = Extract<
  DayPickerProps,
  { mode?: "single" | "multiple" | undefined }
>;
type DayPickerComponents = NonNullable<DayPickerProps["components"]>;
type CalendarDropdownProps = React.ComponentProps<
  NonNullable<DayPickerComponents["Dropdown"]>
>;

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as { current: T | null }).current = value;
  }
}

function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach((ref) => assignRef(ref, value));
  };
}

function CalendarChevron({
  className,
  disabled: _disabled,
  orientation = "right",
  size,
  ...props
}: ChevronProps) {
  const Icon =
    orientation === "left"
      ? CaretLeft
      : orientation === "right"
        ? CaretRight
        : orientation === "up"
          ? CaretUp
          : CaretDown;

  return (
    <Icon
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
      size={size}
      weight="bold"
      {...props}
    />
  );
}

function createDropdownChangeEvent(value: number) {
  const target = { value: String(value) };

  return {
    target,
    currentTarget: target,
  } as React.ChangeEvent<HTMLSelectElement>;
}

function CalendarDropdown({
  options,
  value,
  onChange,
  className,
  disabled,
  style,
  "aria-label": ariaLabel,
  id,
  name,
  form,
  required,
}: CalendarDropdownProps) {
  const selectedValue =
    typeof value === "number" ? value : value == null ? null : Number(value);
  const items = React.useMemo(
    () =>
      options?.map((option) => ({
        label: option.label,
        value: option.value,
      })) ?? [],
    [options]
  );
  const getOptionLabel = React.useCallback(
    (optionValue: number | null) =>
      options?.find((option) => option.value === optionValue)?.label,
    [options]
  );

  return (
    <SelectRoot<number>
      disabled={disabled}
      form={form}
      id={id}
      items={items}
      modal={false}
      name={name}
      onValueChange={(nextValue) => {
        if (typeof nextValue !== "number") return;
        onChange?.(createDropdownChangeEvent(nextValue));
      }}
      required={required}
      value={selectedValue}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "h-8 w-auto min-w-24 rounded-full border-border/70 bg-background/80 px-3 text-[0.92rem] font-semibold shadow-sm",
          "hover:bg-muted/70",
          "data-popup-open:bg-muted/80",
          className
        )}
        disabled={disabled}
        style={style}
      >
        <SelectValue placeholder={ariaLabel ?? "Select"}>
          {(currentValue: number | null) =>
            getOptionLabel(currentValue) ?? getOptionLabel(selectedValue)
          }
        </SelectValue>
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner alignItemWithTrigger={false} sideOffset={8}>
          <SelectScrollUpArrow>
            <CaretUp aria-hidden className="relative z-10 size-3.5" />
          </SelectScrollUpArrow>
          <SelectPopup className="min-w-32 rounded-xl border-border/70 bg-popover/95 p-1 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-popover/90">
            <SelectList className="max-h-64">
              {options?.map((option) => (
                <SelectItem
                  disabled={option.disabled}
                  key={option.value}
                  value={option.value}
                >
                  <SelectItemIndicator />
                  <SelectItemText>{option.label}</SelectItemText>
                </SelectItem>
              ))}
            </SelectList>
          </SelectPopup>
          <SelectScrollDownArrow>
            <CaretDown aria-hidden className="relative z-10 size-3.5" />
          </SelectScrollDownArrow>
        </SelectPositioner>
      </SelectPortal>
    </SelectRoot>
  );
}

const calendarNavigationButtonClassName = cn(
  "inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground shadow-sm",
  "transition-[background-color,color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
  "hover:bg-muted hover:text-foreground",
  "active:scale-[0.96]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "aria-disabled:pointer-events-none aria-disabled:opacity-40 motion-reduce:transition-none"
);

const calendarSelectionButtonClassName = cn(
  "[&>button]:bg-[var(--calendar-selection)] [&>button]:text-[var(--calendar-selection-foreground)]",
  "[&>button]:shadow-[0_10px_24px_-14px_var(--calendar-selection)]",
  "[&>button]:hover:bg-[var(--calendar-selection)] [&>button]:hover:text-[var(--calendar-selection-foreground)]"
);

/**
 * Calendar - accessible date picker.
 *
 * @since 0.1.0
 */
const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  function Calendar(
    {
      className,
      classNames,
      showOutsideDays = true,
      captionLayout = "label",
      navLayout = "around",
      components,
      ...props
    },
    ref
  ) {
    const { Root: RootComponent, ...customComponents } = components ?? {};
    const CalendarRoot = React.useCallback(
      ({ rootRef, ...rootProps }: RootProps) => {
        const mergedRef = composeRefs(rootRef, ref);

        if (RootComponent) {
          return (
            <RootComponent
              rootRef={mergedRef}
              {...rootProps}
              data-slot="calendar"
            />
          );
        }

        return <div ref={mergedRef} {...rootProps} data-slot="calendar" />;
      },
      [RootComponent, ref]
    );

    return (
      <DayPicker
        showOutsideDays={showOutsideDays}
        captionLayout={captionLayout}
        navLayout={navLayout}
        className={cn(
          "w-fit min-w-[calc(var(--cell-size)*7+1.5rem)] rounded-2xl border border-border/70 bg-card/95 p-3 text-card-foreground shadow-[0_22px_55px_-34px_rgb(0_0_0/0.65)] backdrop-blur-xl",
          "supports-[backdrop-filter]:bg-card/85",
          "[--cell-radius:0.72rem] [--cell-size:2.375rem]",
          "[--calendar-selection:var(--chart-3)] [--calendar-selection-foreground:var(--primary-foreground)]",
          "dark:[--calendar-selection:var(--chart-1)] dark:[--calendar-selection-foreground:var(--sidebar-primary-foreground)]",
          "sm:[--cell-size:2.5rem]",
          className
        )}
        classNames={{
          months: "relative flex flex-col gap-5 sm:flex-row",
          month: "relative w-full space-y-3",
          month_caption: "relative flex h-9 items-center justify-center px-10",
          caption_label:
            "inline-flex items-center justify-center gap-1.5 text-[0.92rem] font-semibold leading-none text-foreground",
          nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between",
          button_previous: cn(
            calendarNavigationButtonClassName,
            navLayout === "around" && "absolute left-0 top-0 z-10"
          ),
          button_next: cn(
            calendarNavigationButtonClassName,
            navLayout === "around" && "absolute right-0 top-0 z-10"
          ),
          chevron: "size-4",
          dropdowns: "flex items-center justify-center gap-1.5",
          dropdown_root:
            "relative inline-flex h-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background/80 px-3 text-foreground shadow-sm transition-[background-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-muted/70 focus-within:ring-2 focus-within:ring-ring/70 focus-within:ring-offset-2 focus-within:ring-offset-background",
          dropdown: cn(
            "absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring/70"
          ),
          months_dropdown: "min-w-28",
          years_dropdown: "min-w-20",
          month_grid:
            "w-full border-separate border-spacing-x-0 border-spacing-y-1",
          weekdays: "",
          weekday:
            "h-7 text-center text-[0.72rem] font-semibold uppercase text-muted-foreground/70",
          week: "",
          weeks: "",
          day: cn(
            "relative h-[var(--cell-size)] w-[var(--cell-size)] p-0 text-center align-middle text-[0.875rem]",
            "focus-within:relative focus-within:z-20"
          ),
          day_button: cn(
            "relative inline-flex h-[var(--cell-size)] w-[var(--cell-size)] items-center justify-center rounded-[var(--cell-radius)] p-0 font-medium text-foreground",
            "transition-[background-color,color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
            "hover:bg-muted hover:text-foreground active:scale-[0.96]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/75 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none motion-reduce:transition-none"
          ),
          selected: calendarSelectionButtonClassName,
          today:
            "[&>button]:font-semibold [&>button]:ring-1 [&>button]:ring-[color-mix(in_oklab,var(--calendar-selection)_42%,var(--ring))]",
          outside:
            "text-muted-foreground/45 opacity-70 data-[selected=true]:opacity-100 [&>button]:text-muted-foreground/45 data-[selected=true]:[&>button]:!bg-[var(--calendar-selection)] data-[selected=true]:[&>button]:!text-[var(--calendar-selection-foreground)]",
          disabled:
            "opacity-45 [&>button]:cursor-not-allowed [&>button]:text-muted-foreground/45 [&>button]:line-through [&>button]:decoration-muted-foreground/35",
          hidden: "invisible",
          focused: "relative z-10",
          week_number_header:
            "h-7 w-[var(--cell-size)] text-center text-[0.72rem] font-semibold uppercase text-muted-foreground/50",
          week_number:
            "h-[var(--cell-size)] w-[var(--cell-size)] text-center text-[0.75rem] font-medium text-muted-foreground/55",
          footer:
            "mt-3 rounded-xl bg-muted/50 px-3 py-2 text-center text-[0.8rem] text-muted-foreground",
          ...classNames,
        }}
        components={{
          Dropdown: CalendarDropdown,
          Chevron: CalendarChevron,
          Root: CalendarRoot,
          ...customComponents,
        }}
        {...props}
      />
    );
  }
);
Calendar.displayName = "Calendar";

// ---- EXPORTS ----------------------------------------------------------------

export { Calendar };

/**
 * Dropdown Menu Component (Static Version)
 *
 * A comprehensive dropdown menu system with keyboard navigation
 * and full accessibility support. Uses CSS animations only.
 *
 * Built on Radix UI primitives.
 *
 * Based on WAI-ARIA Menu Button pattern.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import { forwardRef, type ReactNode } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, CaretRight, Circle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// =============================================================================
// DROPDOWN MENU ROOT
// =============================================================================

export interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  dir?: "ltr" | "rtl";
}

function DropdownMenu({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  modal = false,
  dir,
}: DropdownMenuProps) {
  return (
    <DropdownMenuPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
      dir={dir}
      data-slot="dropdown-menu"
    >
      {children}
    </DropdownMenuPrimitive.Root>
  );
}

DropdownMenu.displayName = "DropdownMenu";

// =============================================================================
// DROPDOWN MENU PORTAL
// =============================================================================

export interface DropdownMenuPortalProps {
  children: ReactNode;
  container?: HTMLElement | null;
  forceMount?: true;
}

function DropdownMenuPortal({
  children,
  container,
  forceMount,
}: DropdownMenuPortalProps) {
  return (
    <DropdownMenuPrimitive.Portal
      container={container}
      forceMount={forceMount}
      data-slot="dropdown-menu-portal"
    >
      {children}
    </DropdownMenuPrimitive.Portal>
  );
}

DropdownMenuPortal.displayName = "DropdownMenuPortal";

// =============================================================================
// DROPDOWN MENU TRIGGER
// =============================================================================

export interface DropdownMenuTriggerProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.Trigger
> {
  asChild?: boolean;
}

const DropdownMenuTrigger = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>(({ className, asChild = false, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    asChild={asChild}
    data-slot="dropdown-menu-trigger"
    className={cn(
      "outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// =============================================================================
// DROPDOWN MENU CONTENT
// =============================================================================

export interface DropdownMenuContentProps extends Omit<
  React.ComponentProps<typeof DropdownMenuPrimitive.Content>,
  "asChild"
> {
  sideOffset?: number;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  loop?: boolean;
  forceMount?: true;
}

const DropdownMenuContent = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(
  (
    {
      className,
      sideOffset = 6,
      align = "start",
      side = "bottom",
      loop = true,
      forceMount,
      children,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        side={side}
        loop={loop}
        forceMount={forceMount}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className={cn(
          // Layout
          "z-100 min-w-32 overflow-hidden rounded-2xl border p-2",
          // Colors
          "bg-popover text-popover-foreground border-border",
          // Shadow
          "shadow-lg",
          // Sizing
          "max-h-(--radix-dropdown-menu-content-available-height)",
          // Transform origin
          "origin-(--radix-dropdown-menu-content-transform-origin)",
          // Scroll
          "overflow-y-auto",
          // CSS animations
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          "duration-150",
          className
        )}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
);

DropdownMenuContent.displayName = "DropdownMenuContent";

// =============================================================================
// DROPDOWN MENU GROUP
// =============================================================================

export type DropdownMenuGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Group
>;

function DropdownMenuGroup({ className, ...props }: DropdownMenuGroupProps) {
  return (
    <DropdownMenuPrimitive.Group
      data-slot="dropdown-menu-group"
      className={cn(className)}
      {...props}
    />
  );
}

DropdownMenuGroup.displayName = "DropdownMenuGroup";

// =============================================================================
// DROPDOWN MENU ITEM
// =============================================================================

export interface DropdownMenuItemProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.Item
> {
  inset?: boolean;
  variant?: "default" | "destructive";
}

const DropdownMenuItem = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, inset, variant = "default", children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    data-slot="dropdown-menu-item"
    data-inset={inset ? "true" : undefined}
    data-variant={variant}
    className={cn(
      // Layout
      "relative flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
      // Focus & interaction
      "outline-none select-none",
      "transition-colors duration-75",
      "focus:bg-accent focus:text-accent-foreground",
      // Destructive variant
      "data-[variant=destructive]:text-destructive",
      "data-[variant=destructive]:focus:bg-destructive/10",
      "dark:data-[variant=destructive]:focus:bg-destructive/20",
      "data-[variant=destructive]:focus:text-destructive",
      "data-[variant=destructive]:*:[svg]:text-destructive!",
      // Icon styling
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      // Disabled state
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      // Inset padding
      inset && "pl-8",
      // SVG sizing
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.Item>
));

DropdownMenuItem.displayName = "DropdownMenuItem";

// =============================================================================
// DROPDOWN MENU CHECKBOX ITEM
// =============================================================================

export type DropdownMenuCheckboxItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
>;

const DropdownMenuCheckboxItem = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    data-slot="dropdown-menu-checkbox-item"
    className={cn(
      // Layout
      "relative flex cursor-default items-center gap-2 rounded-lg py-2 pr-2.5 pl-9 text-sm",
      // Focus & interaction
      "outline-none select-none",
      "transition-colors duration-75",
      "focus:bg-accent focus:text-accent-foreground",
      // Disabled state
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      // SVG sizing
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="pointer-events-none absolute left-2.5 flex size-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-4" aria-hidden="true" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

// =============================================================================
// DROPDOWN MENU RADIO GROUP
// =============================================================================

export type DropdownMenuRadioGroupProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.RadioGroup
>;

function DropdownMenuRadioGroup({
  className,
  ...props
}: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      className={cn(className)}
      {...props}
    />
  );
}

DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

// =============================================================================
// DROPDOWN MENU RADIO ITEM
// =============================================================================

export type DropdownMenuRadioItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.RadioItem
>;

const DropdownMenuRadioItem = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    data-slot="dropdown-menu-radio-item"
    className={cn(
      // Layout
      "relative flex cursor-default items-center gap-2 rounded-lg py-2 pr-2.5 pl-9 text-sm",
      // Focus & interaction
      "outline-none select-none",
      "transition-colors duration-75",
      "focus:bg-accent focus:text-accent-foreground",
      // Disabled state
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      // SVG sizing
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    <span className="pointer-events-none absolute left-2.5 flex size-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle
          className="size-2.5 fill-current"
          aria-hidden="true"
          weight="fill"
        />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

// =============================================================================
// DROPDOWN MENU LABEL
// =============================================================================

export interface DropdownMenuLabelProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.Label
> {
  inset?: boolean;
}

const DropdownMenuLabel = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    data-slot="dropdown-menu-label"
    data-inset={inset ? "true" : undefined}
    className={cn(
      "px-2.5 py-2 text-xs font-semibold",
      "text-foreground/80",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));

DropdownMenuLabel.displayName = "DropdownMenuLabel";

// =============================================================================
// DROPDOWN MENU SEPARATOR
// =============================================================================

export type DropdownMenuSeparatorProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Separator
>;

const DropdownMenuSeparator = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    data-slot="dropdown-menu-separator"
    className={cn("bg-border/40 -mx-1 my-1 h-px", className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// =============================================================================
// DROPDOWN MENU SHORTCUT
// =============================================================================

export type DropdownMenuShortcutProps = React.ComponentProps<"kbd">;

function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <kbd
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-[10px] tracking-widest",
        "text-muted-foreground/60",
        className
      )}
      {...props}
    />
  );
}

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// =============================================================================
// DROPDOWN MENU SUB
// =============================================================================

export interface DropdownMenuSubProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function DropdownMenuSub({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: DropdownMenuSubProps) {
  return (
    <DropdownMenuPrimitive.Sub
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      data-slot="dropdown-menu-sub"
    >
      {children}
    </DropdownMenuPrimitive.Sub>
  );
}

DropdownMenuSub.displayName = "DropdownMenuSub";

// =============================================================================
// DROPDOWN MENU SUB TRIGGER
// =============================================================================

export interface DropdownMenuSubTriggerProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> {
  inset?: boolean;
}

const DropdownMenuSubTrigger = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    data-slot="dropdown-menu-sub-trigger"
    data-inset={inset ? "true" : undefined}
    className={cn(
      // Layout
      "flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
      // Focus & interaction
      "outline-none select-none",
      "transition-colors duration-75",
      "focus:bg-accent focus:text-accent-foreground",
      // Open state
      "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      // Icon styling
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      // Inset padding
      inset && "pl-8",
      // SVG sizing
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    {children}
    <CaretRight className="ml-auto size-4" aria-hidden="true" />
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

// =============================================================================
// DROPDOWN MENU SUB CONTENT
// =============================================================================

export interface DropdownMenuSubContentProps extends React.ComponentProps<
  typeof DropdownMenuPrimitive.SubContent
> {
  sideOffset?: number;
  alignOffset?: number;
}

const DropdownMenuSubContent = forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, sideOffset = 2, alignOffset = -4, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    data-slot="dropdown-menu-sub-content"
    sideOffset={sideOffset}
    alignOffset={alignOffset}
    className={cn(
      // Layout
      "z-100 min-w-32 overflow-hidden rounded-2xl border p-2",
      // Colors
      "bg-popover text-popover-foreground border-border",
      // Shadow
      "shadow-lg",
      // Transform origin
      "origin-(--radix-dropdown-menu-content-transform-origin)",
      // CSS animations
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      "duration-150",
      className
    )}
    {...props}
  />
));

DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

// =============================================================================
// EXPORTS
// =============================================================================

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};

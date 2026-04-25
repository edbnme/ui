/**
 * Popover — anchored popup surface built on Base UI's Popover primitive.
 *
 * Use for transient contextual content attached to a trigger button:
 * settings, mini-forms, rich tooltips, quick actions. For modal decisions
 * use `AlertDialog`; for larger overlays use `Dialog`.
 *
 * Every sub-component accepts Base UI's `render` prop for element
 * polymorphism (the Base UI equivalent of the Radix / shadcn `asChild`).
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.3.0
 * @brand      edbn/ui — <https://ui.edbn.me>
 * @docs       https://ui.edbn.me/docs/components/popover
 * @source     https://ui.edbn.me/r/popover.json
 * @registry   https://ui.edbn.me/r
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/popover
 * @a11y       WAI-ARIA Dialog (non-modal) pattern when not modal; focus
 *             trap when `modal`; automatic `aria-labelledby` /
 *             `aria-describedby` wiring via Base UI; Escape and outside
 *             click dismissal.
 *
 * ## Anatomy
 * ```tsx
 * <PopoverRoot>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverPortal>
 *     <PopoverPositioner sideOffset={8}>
 *       <PopoverPopup>
 *         <PopoverArrow />
 *         <PopoverCloseIconButton />       // optional corner X
 *         <PopoverTitle>Settings</PopoverTitle>
 *         <PopoverDescription>Configure…</PopoverDescription>
 *       </PopoverPopup>
 *     </PopoverPositioner>
 *   </PopoverPortal>
 * </PopoverRoot>
 * ```
 *
 * ## Hover-triggered popover (preview card style)
 * ```tsx
 * <PopoverTrigger openOnHover delay={100} closeDelay={200}>User</PopoverTrigger>
 * ```
 *
 * ## Detached trigger with typed payload
 * ```tsx
 * const handle = createPopoverHandle<{ userId: string }>();
 * <PopoverTrigger handle={handle} payload={{ userId: "1" }}>Profile</PopoverTrigger>
 * <PopoverRoot handle={handle}>
 *   {({ payload }) => <PopoverPortal>…</PopoverPortal>}
 * </PopoverRoot>
 * ```
 * @registryDescription Floating popover with auto-positioning and focus management.
 * @registryCssVars
 */
"use client";

import * as React from "react";
import { Popover } from "@base-ui/react/popover";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- POPOVER ROOT -----------------------------------------------------------

/**
 * Top-level Popover provider. Forwards all Base UI `Popover.Root` props
 * including `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`,
 * `modal`, `actionsRef`, `handle`, `defaultTriggerId`, `triggerId`.
 *
 * @since 0.3.0
 */
export type PopoverRootProps = React.ComponentProps<typeof Popover.Root>;
const PopoverRoot = (props: PopoverRootProps) => <Popover.Root {...props} />;
PopoverRoot.displayName = "PopoverRoot";

// ---- POPOVER TRIGGER --------------------------------------------------------

/**
 * Button that opens the popover. Supports hover-triggered open via
 * `openOnHover`, with configurable `delay` and `closeDelay`. Unstyled by
 * default (focus ring only) — compose with your own button surface via
 * `className` or `render`.
 *
 * **Data attributes** — `data-popup-open`, `data-pressed`.
 *
 * **Passthrough props** — `className`, `closeDelay`, `delay`, `handle`,
 * `id`, `nativeButton`, `openOnHover`, `payload`, `render`, `style`, plus
 * native `<button>` attrs.
 *
 * @since 0.3.0
 */
export type PopoverTriggerProps = React.ComponentProps<typeof Popover.Trigger>;
function PopoverTrigger({ className, ...props }: PopoverTriggerProps) {
  return (
    <Popover.Trigger
      data-slot="popover-trigger"
      className={cn(
        "inline-flex items-center justify-center",
        "select-none transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
PopoverTrigger.displayName = "PopoverTrigger";

// ---- POPOVER PORTAL ---------------------------------------------------------

/**
 * Portals popover content into a stable DOM location. Pass `keepMounted` to
 * retain children when closed (for external animators).
 *
 * **Passthrough props** — `className`, `container`, `keepMounted`, `render`,
 * `style`.
 *
 * @since 0.3.0
 */
export type PopoverPortalProps = React.ComponentProps<typeof Popover.Portal>;
const PopoverPortal = (props: PopoverPortalProps) => (
  <Popover.Portal {...props} />
);
PopoverPortal.displayName = "PopoverPortal";

// ---- POPOVER BACKDROP -------------------------------------------------------

/**
 * Optional dimming overlay behind the popup when `modal` is true. Not used
 * for non-modal popovers.
 *
 * **Data attributes** — `data-open`, `data-closed`, `data-starting-style`,
 * `data-ending-style`.
 *
 * @since 0.3.0
 */
export type PopoverBackdropProps = React.ComponentProps<
  typeof Popover.Backdrop
>;
function PopoverBackdrop({ className, ...props }: PopoverBackdropProps) {
  return (
    <Popover.Backdrop
      data-slot="popover-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
        "transition-opacity duration-150 ease-out",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        className
      )}
      {...props}
    />
  );
}
PopoverBackdrop.displayName = "PopoverBackdrop";

// ---- POPOVER POSITIONER -----------------------------------------------------

/**
 * Positions the popup relative to its anchor (the trigger by default). Set
 * `side`, `align`, `sideOffset`, `alignOffset`, `collisionAvoidance`, and
 * `collisionBoundary` to tune placement.
 *
 * **Data attributes** — `data-align`, `data-anchor-hidden`, `data-open`,
 * `data-closed`, `data-side`.
 *
 * **CSS variables** — `--anchor-height`, `--anchor-width`,
 * `--available-height`, `--available-width`, `--positioner-height`,
 * `--positioner-width`, `--transform-origin`.
 *
 * @since 0.3.0
 */
export type PopoverPositionerProps = React.ComponentProps<
  typeof Popover.Positioner
>;
function PopoverPositioner({ className, ...props }: PopoverPositionerProps) {
  return (
    <Popover.Positioner
      data-slot="popover-positioner"
      className={cn("z-50", className)}
      {...props}
    />
  );
}
PopoverPositioner.displayName = "PopoverPositioner";

// ---- POPOVER POPUP ----------------------------------------------------------

/**
 * The popover surface. Uses `--transform-origin` from the positioner so the
 * scale-in animates from the anchor direction (Apple-like).
 *
 * **Data attributes** — `data-align`, `data-instant`, `data-open`,
 * `data-closed`, `data-side`, `data-starting-style`, `data-ending-style`.
 *
 * **CSS variables** — `--popup-height`, `--popup-width`.
 *
 * @since 0.3.0
 */
export type PopoverPopupProps = React.ComponentProps<typeof Popover.Popup>;
function PopoverPopup({ className, ...props }: PopoverPopupProps) {
  return (
    <Popover.Popup
      data-slot="popover-popup"
      className={cn(
        "relative z-50 w-72 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-xl",
        // Transform origin from positioner so the scale animates from the anchor
        "origin-(--transform-origin) transform-gpu",
        "transition-[scale,opacity] duration-150 ease-out",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        // Instant transitions (e.g. re-open while exit anim running) skip scale
        "data-instant:transition-none",
        // Reduced motion
        "motion-reduce:transform-none motion-reduce:transition-opacity",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        "focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
PopoverPopup.displayName = "PopoverPopup";

// ---- POPOVER ARROW ----------------------------------------------------------

/**
 * Small triangle indicating the popover's anchor direction. Rotates
 * automatically via the `data-side` attribute.
 *
 * **Data attributes** — `data-align`, `data-open`, `data-closed`,
 * `data-side`, `data-uncentered`.
 *
 * @since 0.3.0
 */
export type PopoverArrowProps = React.ComponentProps<typeof Popover.Arrow>;
function PopoverArrow({ className, children, ...props }: PopoverArrowProps) {
  return (
    <Popover.Arrow
      data-slot="popover-arrow"
      className={cn(
        // Rotate arrow to match the side the popup is on.
        "data-[side=top]:rotate-180",
        "data-[side=left]:-rotate-90",
        "data-[side=right]:rotate-90",
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          aria-hidden
          width="14"
          height="7"
          viewBox="0 0 14 7"
          className="block fill-popover stroke-border"
        >
          <path d="M0,0 L7,7 L14,0" strokeWidth="1" />
        </svg>
      )}
    </Popover.Arrow>
  );
}
PopoverArrow.displayName = "PopoverArrow";

// ---- POPOVER TITLE ----------------------------------------------------------

/**
 * Popover title, wired to `aria-labelledby`. Optional for popovers but
 * recommended for any popover carrying substantive content.
 *
 * @since 0.3.0
 */
export type PopoverTitleProps = React.ComponentProps<typeof Popover.Title>;
function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <Popover.Title
      data-slot="popover-title"
      className={cn("text-sm leading-none font-semibold", className)}
      {...props}
    />
  );
}
PopoverTitle.displayName = "PopoverTitle";

// ---- POPOVER DESCRIPTION ----------------------------------------------------

/**
 * Popover description, wired to `aria-describedby`.
 *
 * @since 0.3.0
 */
export type PopoverDescriptionProps = React.ComponentProps<
  typeof Popover.Description
>;
function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <Popover.Description
      data-slot="popover-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
PopoverDescription.displayName = "PopoverDescription";

// ---- POPOVER CLOSE ----------------------------------------------------------

/**
 * Unstyled action that closes the popover. For the common corner-X pattern
 * use {@link PopoverCloseIconButton}; for footer buttons place a
 * `PopoverClose` inside your own layout.
 *
 * **Passthrough props** — `className`, `nativeButton`, `render`, `style`,
 * plus native `<button>` attrs.
 *
 * @since 0.3.0
 */
export type PopoverCloseProps = React.ComponentProps<typeof Popover.Close>;
function PopoverClose({ className, ...props }: PopoverCloseProps) {
  return (
    <Popover.Close
      data-slot="popover-close"
      className={cn(
        "inline-flex items-center justify-center",
        "select-none transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
PopoverClose.displayName = "PopoverClose";

// ---- POPOVER CLOSE ICON BUTTON ----------------------------------------------

/**
 * Styled corner-X close button for Popover. Absolutely positioned 28px hit
 * target with the Phosphor X icon and a screen-reader-only "Close" label.
 * Place inside a `PopoverPopup`.
 *
 * @since 0.3.0
 * @example
 * ```tsx
 * <PopoverPopup>
 *   <PopoverCloseIconButton />
 *   …
 * </PopoverPopup>
 * ```
 */
export type PopoverCloseIconButtonProps = PopoverCloseProps;
function PopoverCloseIconButton({
  className,
  "aria-label": ariaLabel = "Close popover",
  ...props
}: PopoverCloseIconButtonProps) {
  return (
    <Popover.Close
      data-slot="popover-close-icon-button"
      aria-label={ariaLabel}
      className={cn(
        "absolute top-2 right-2",
        "inline-flex size-7 items-center justify-center rounded-full",
        "text-muted-foreground opacity-70 transition-opacity",
        "hover:bg-muted hover:opacity-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    >
      <X aria-hidden className="size-3.5" weight="bold" />
      <span className="sr-only">Close</span>
    </Popover.Close>
  );
}
PopoverCloseIconButton.displayName = "PopoverCloseIconButton";

// ---- POPOVER VIEWPORT -------------------------------------------------------

/**
 * Optional viewport for coordinating multi-content popover transitions
 * (rare; used when the popover's inner content swaps while remaining open).
 *
 * @since 0.3.0
 */
export type PopoverViewportProps = React.ComponentProps<
  typeof Popover.Viewport
>;
function PopoverViewport({ className, ...props }: PopoverViewportProps) {
  return (
    <Popover.Viewport
      data-slot="popover-viewport"
      className={className}
      {...props}
    />
  );
}
PopoverViewport.displayName = "PopoverViewport";

// ---- POPOVER HANDLE (detached-trigger API) ----------------------------------

/**
 * Handle type produced by {@link createPopoverHandle}. Pass the same handle
 * to `<PopoverRoot>` and detached `<PopoverTrigger>`s.
 *
 * @since 0.3.0
 */
const PopoverHandle = Popover.Handle;

/**
 * Creates a typed handle for detached triggers. The generic is the payload
 * type carried from the trigger to the root's function-as-children.
 *
 * @since 0.3.0
 */
const createPopoverHandle = Popover.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverBackdrop,
  PopoverPositioner,
  PopoverPopup,
  PopoverArrow,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverCloseIconButton,
  PopoverViewport,
  PopoverHandle,
  createPopoverHandle,
};

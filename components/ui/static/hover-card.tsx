/**
 * Hover Card — A floating card revealed when hovering (or focusing) a trigger.
 *
 * Ideal for inline previews: user mentions (`@username`), link previews,
 * glossary terms, data peeks. Activation is both hover + keyboard focus,
 * with configurable open/close delays. Built on the Base UI `PreviewCard`
 * primitive — the trigger is an anchor element by default, so the popup
 * must remain supplementary (the `href` still navigates on click).
 *
 * Anatomy:
 * ```tsx
 * <HoverCardRoot>
 *   <HoverCardTrigger href="/user">@username</HoverCardTrigger>
 *   <HoverCardPortal>
 *     <HoverCardBackdrop />          // optional — rarely used
 *     <HoverCardPositioner>
 *       <HoverCardPopup>
 *         <HoverCardArrow />
 *         …card content…
 *       </HoverCardPopup>
 *     </HoverCardPositioner>
 *   </HoverCardPortal>
 * </HoverCardRoot>
 * ```
 *
 * Accessibility: the trigger remains a semantic link; screen-reader users
 * receive the popup through the `aria-describedby` wiring applied by Base UI
 * when the card opens via keyboard focus.
 *
 * Motion: uses transform-origin driven scale + opacity enter/exit. All motion
 * collapses under `prefers-reduced-motion` via `motion-reduce` variants.
 *
 * @version 0.3.0
 * @package    @edbn/ui
 * @brand      edbn/ui -- https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/hover-card
 * @upstream   Base UI v1.2.0 -- https://base-ui.com/react/components/preview-card
 * @registryDescription Rich content card that appears on hover, built on Base UI PreviewCard.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { PreviewCard } from "@base-ui/react/preview-card";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

/**
 * Stateful root for a hover card.
 *
 * Coordinates the uncontrolled (`defaultOpen`) or controlled (`open` +
 * `onOpenChange`) open state and renders no DOM itself. The `openDelay` and
 * `closeDelay` props let consumers tune hover intent — defaults favour a
 * calm, non-jumpy feel.
 *
 * @since 0.1.0
 */
const HoverCardRoot = PreviewCard.Root;

// ---- TRIGGER ----------------------------------------------------------------

type HoverCardTriggerProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Trigger
>;

/**
 * Anchor-shaped element that opens the hover card on pointer-over or focus.
 *
 * Defaults to an `<a>` (because `PreviewCard.Trigger` renders an anchor) — use
 * the `render` prop to morph into any interactive element while preserving
 * Base UI's hover-intent wiring.
 *
 * Data attributes:
 * - `data-popup-open` — present while the card is visible
 *
 * @since 0.1.0
 */
function HoverCardTrigger({ className, ...props }: HoverCardTriggerProps) {
  return (
    <PreviewCard.Trigger
      data-slot="hover-card-trigger"
      className={cn(
        "cursor-pointer underline decoration-muted-foreground/40 underline-offset-4",
        "transition-colors hover:decoration-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}
HoverCardTrigger.displayName = "HoverCardTrigger";

// ---- PORTAL -----------------------------------------------------------------

/**
 * Teleports the card into `document.body` (or a custom `container`).
 *
 * Use whenever the trigger sits inside a scrollable/overflow-clipped ancestor
 * so the popup can float freely above the page.
 *
 * @since 0.1.0
 */
const HoverCardPortal = PreviewCard.Portal;

// ---- BACKDROP ---------------------------------------------------------------

type HoverCardBackdropProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Backdrop
>;

/**
 * Invisible layer behind the popup, useful for outside-click capture in
 * modal-flavoured hover cards. Rarely rendered — included for completeness.
 *
 * @since 0.3.0
 */
function HoverCardBackdrop({ className, ...props }: HoverCardBackdropProps) {
  return (
    <PreviewCard.Backdrop
      data-slot="hover-card-backdrop"
      className={cn("fixed inset-0 z-50", className)}
      {...props}
    />
  );
}
HoverCardBackdrop.displayName = "HoverCardBackdrop";

// ---- POSITIONER -------------------------------------------------------------

type HoverCardPositionerProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Positioner
>;

/**
 * Floating-UI-powered wrapper that positions the card relative to its
 * trigger. Handles collision detection, flipping, and the `--transform-origin`
 * CSS variable consumed by `HoverCardPopup` for entry animations.
 *
 * Data attributes:
 * - `data-side` — `top` | `right` | `bottom` | `left` (resolved side)
 * - `data-align` — `start` | `center` | `end`
 *
 * CSS variables:
 * - `--anchor-width`, `--anchor-height` — trigger size
 * - `--available-width`, `--available-height` — collision viewport size
 * - `--transform-origin` — anchor-aware origin for scale animations
 *
 * @since 0.1.0
 */
function HoverCardPositioner({
  className,
  sideOffset = 8,
  ...props
}: HoverCardPositionerProps) {
  return (
    <PreviewCard.Positioner
      data-slot="hover-card-positioner"
      sideOffset={sideOffset}
      className={cn("z-50", className)}
      {...props}
    />
  );
}
HoverCardPositioner.displayName = "HoverCardPositioner";

// ---- POPUP ------------------------------------------------------------------

type HoverCardPopupProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Popup
>;

/**
 * The visible card surface. Reads `--transform-origin` from the positioner
 * so the scale animation always emanates from the trigger edge.
 *
 * Data attributes:
 * - `data-starting-style`, `data-ending-style` — drive enter/exit transitions
 * - `data-side` — mirrors the positioner for side-aware styling
 *
 * @since 0.1.0
 */
function HoverCardPopup({ className, ...props }: HoverCardPopupProps) {
  return (
    <PreviewCard.Popup
      data-slot="hover-card-popup"
      className={cn(
        "w-72 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "origin-(--transform-origin) transform-gpu",
        "transition-[scale,opacity] duration-200",
        "data-starting-style:scale-95 data-starting-style:opacity-0",
        "data-ending-style:scale-95 data-ending-style:opacity-0",
        "motion-reduce:transition-none",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        className
      )}
      {...props}
    />
  );
}
HoverCardPopup.displayName = "HoverCardPopup";

// ---- ARROW ------------------------------------------------------------------

type HoverCardArrowProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Arrow
>;

/**
 * Decorative pointer that visually connects the popup to its trigger.
 *
 * Consumers normally use the default SVG, but can pass custom `children` for
 * a bespoke arrow. The SVG is composed from two paths so the border renders
 * correctly on every side.
 *
 * Data attributes:
 * - `data-side` — used to nudge the arrow into position per side
 *
 * @since 0.1.0
 */
function HoverCardArrow({
  className,
  children,
  ...props
}: HoverCardArrowProps) {
  return (
    <PreviewCard.Arrow
      data-slot="hover-card-arrow"
      className={cn(
        "data-[side=bottom]:-top-2",
        "data-[side=left]:-right-3.25",
        "data-[side=right]:-left-3.25",
        "data-[side=top]:-bottom-2",
        className
      )}
      {...props}
    >
      {children ?? (
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
          <path
            d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.859 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66437 2.60207Z"
            className="fill-popover"
          />
          <path
            d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5765 6.27318C17.0207 6.67083 17.5879 6.93172 18.1962 7H20V8H18.5765C17.5468 8 16.5936 7.63423 15.859 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V7H2.13172C2.72674 6.93172 3.29392 6.67083 3.73818 6.27318L8.99542 1.85876Z"
            className="fill-border"
          />
        </svg>
      )}
    </PreviewCard.Arrow>
  );
}
HoverCardArrow.displayName = "HoverCardArrow";

// ---- VIEWPORT ---------------------------------------------------------------

type HoverCardViewportProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Viewport
>;

/**
 * Optional wrapper used inside `HoverCardPopup` to crop and animate content
 * transitions when the same card hosts multiple trigger sources. Leave
 * unmounted unless you're orchestrating shared-element transitions.
 *
 * @since 0.2.0
 */
function HoverCardViewport({ className, ...props }: HoverCardViewportProps) {
  return (
    <PreviewCard.Viewport
      data-slot="hover-card-viewport"
      className={className}
      {...props}
    />
  );
}
HoverCardViewport.displayName = "HoverCardViewport";

// ---- IMPERATIVE HANDLE ------------------------------------------------------

/**
 * Ref-like imperative handle (returned from `createHoverCardHandle`) for
 * opening/closing the card from outside React tree — useful for global
 * keyboard shortcuts or programmatic tours.
 *
 * @since 0.2.0
 */
const HoverCardHandle = PreviewCard.Handle;

/**
 * Factory that produces a stable `HoverCardHandle` you can pass to
 * `<HoverCardRoot handle={…} />` and call `.open()` / `.close()` on.
 *
 * @since 0.2.0
 */
const createHoverCardHandle = PreviewCard.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardBackdrop,
  HoverCardPositioner,
  HoverCardPopup,
  HoverCardArrow,
  HoverCardViewport,
  HoverCardHandle,
  createHoverCardHandle,
};

export type {
  HoverCardTriggerProps,
  HoverCardBackdropProps,
  HoverCardPositionerProps,
  HoverCardPopupProps,
  HoverCardArrowProps,
  HoverCardViewportProps,
};

/**
 * Tooltip — lightweight informational popup shown on hover / focus.
 *
 * Use for terse ancillary labels (icon-only buttons, badge details, key
 * hints). For interactive content use `Popover`; for a richer hovercard
 * use `HoverCard`.
 *
 * Wrap a subtree in `TooltipProvider` to share `delay`, `closeDelay`, and
 * `hoverable` across many tooltips. A lone `TooltipRoot` also works — the
 * provider's settings simply merge in when present.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.3.0
 * @brand      edbn/ui — <https://ui.edbn.me>
 * @docs       https://ui.edbn.me/docs/components/tooltip
 * @source     https://ui.edbn.me/r/tooltip.json
 * @registry   https://ui.edbn.me/r
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/tooltip
 * @a11y       WAI-ARIA Tooltip pattern; `role="tooltip"` applied by Base
 *             UI; dismisses on Escape; hidden from pointer-down on the
 *             trigger; respects `prefers-reduced-motion`.
 *
 * **Breaking change (0.3.0)** — the backward-compat aliases `Tooltip` and
 * `TooltipContent` are removed. Use `TooltipRoot` and `TooltipPopup`.
 *
 * ## Anatomy
 * ```tsx
 * <TooltipProvider>
 *   <TooltipRoot>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipPortal>
 *       <TooltipPositioner sideOffset={6}>
 *         <TooltipPopup>
 *           <TooltipArrow />
 *           Useful hint
 *         </TooltipPopup>
 *       </TooltipPositioner>
 *     </TooltipPortal>
 *   </TooltipRoot>
 * </TooltipProvider>
 * ```
 * @registryDescription Accessible tooltip with auto-positioning and delay.
 */
"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

// ---- TOOLTIP PROVIDER -------------------------------------------------------

/**
 * Shares `delay`, `closeDelay`, and `hoverable` settings with all nested
 * tooltips. Optional — a standalone `TooltipRoot` works without a provider.
 *
 * @since 0.3.0
 */
export type TooltipProviderProps = React.ComponentProps<
  typeof TooltipPrimitive.Provider
>;
const TooltipProvider = (props: TooltipProviderProps) => (
  <TooltipPrimitive.Provider {...props} />
);
TooltipProvider.displayName = "TooltipProvider";

// ---- TOOLTIP ROOT -----------------------------------------------------------

/**
 * Top-level Tooltip state holder. Forwards all Base UI `Tooltip.Root`
 * props: `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`,
 * `delay`, `closeDelay`, `hoverable`, `trackCursorAxis`, `actionsRef`,
 * `handle`, `defaultTriggerId`, `triggerId`.
 *
 * @since 0.3.0
 */
export type TooltipRootProps = React.ComponentProps<
  typeof TooltipPrimitive.Root
>;
const TooltipRoot = (props: TooltipRootProps) => (
  <TooltipPrimitive.Root {...props} />
);
TooltipRoot.displayName = "TooltipRoot";

// ---- TOOLTIP TRIGGER --------------------------------------------------------

/**
 * Element that owns the tooltip. Unstyled by default — compose via
 * `render` to wrap any existing button / link. When `asChild`-style usage
 * is needed, pass `render={<YourButton />}` (Base UI idiom).
 *
 * **Passthrough props** — `className`, `handle`, `id`, `payload`, `render`,
 * `style`, plus native `<button>` attrs.
 *
 * @since 0.3.0
 */
export type TooltipTriggerProps = React.ComponentProps<
  typeof TooltipPrimitive.Trigger
>;
function TooltipTrigger({ className, ...props }: TooltipTriggerProps) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      className={cn(
        "inline-flex items-center justify-center",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}
TooltipTrigger.displayName = "TooltipTrigger";

// ---- TOOLTIP PORTAL ---------------------------------------------------------

/**
 * Portals tooltip content into a stable DOM location (defaults to body).
 *
 * @since 0.3.0
 */
export type TooltipPortalProps = React.ComponentProps<
  typeof TooltipPrimitive.Portal
>;
const TooltipPortal = (props: TooltipPortalProps) => (
  <TooltipPrimitive.Portal {...props} />
);
TooltipPortal.displayName = "TooltipPortal";

// ---- TOOLTIP POSITIONER -----------------------------------------------------

/**
 * Floating positioner. Default `sideOffset={6}` matches our design-tone
 * spacing for compact tooltips.
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
export type TooltipPositionerProps = React.ComponentProps<
  typeof TooltipPrimitive.Positioner
>;
function TooltipPositioner({
  className,
  sideOffset = 6,
  ...props
}: TooltipPositionerProps) {
  return (
    <TooltipPrimitive.Positioner
      data-slot="tooltip-positioner"
      sideOffset={sideOffset}
      className={cn("z-50", className)}
      {...props}
    />
  );
}
TooltipPositioner.displayName = "TooltipPositioner";

// ---- TOOLTIP POPUP ----------------------------------------------------------

/**
 * The tooltip surface. Uses `--transform-origin` from the positioner so
 * the subtle scale-in animates from the anchor edge.
 *
 * **Data attributes** — `data-instant`, `data-open`, `data-closed`,
 * `data-starting-style`, `data-ending-style`, `data-side`.
 *
 * @since 0.3.0
 */
export type TooltipPopupProps = React.ComponentProps<
  typeof TooltipPrimitive.Popup
>;
function TooltipPopup({ className, ...props }: TooltipPopupProps) {
  return (
    <TooltipPrimitive.Popup
      data-slot="tooltip-popup"
      className={cn(
        "z-50 max-w-xs rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md",
        "origin-(--transform-origin) transform-gpu",
        "transition-[scale,opacity] duration-100 ease-out",
        "data-starting-style:scale-90 data-starting-style:opacity-0",
        "data-ending-style:scale-90 data-ending-style:opacity-0",
        // Instant re-open on rapid hover — skip scale animation
        "data-instant:transition-none",
        // Reduced motion — fade only, no scale
        "motion-reduce:transform-none motion-reduce:transition-opacity",
        "motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100",
        className,
      )}
      {...props}
    />
  );
}
TooltipPopup.displayName = "TooltipPopup";

// ---- TOOLTIP ARROW ----------------------------------------------------------

/**
 * Arrow indicating the tooltip's anchor direction. Rotates automatically
 * based on `data-side`.
 *
 * @since 0.3.0
 */
export type TooltipArrowProps = React.ComponentProps<
  typeof TooltipPrimitive.Arrow
>;
function TooltipArrow({ className, children, ...props }: TooltipArrowProps) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        "data-[side=top]:rotate-180",
        "data-[side=left]:-rotate-90",
        "data-[side=right]:rotate-90",
        className,
      )}
      {...props}
    >
      {children ?? (
        <svg
          aria-hidden
          width="10"
          height="5"
          viewBox="0 0 10 5"
          className="block fill-foreground"
        >
          <path d="M0 5L5 0L10 5H0Z" />
        </svg>
      )}
    </TooltipPrimitive.Arrow>
  );
}
TooltipArrow.displayName = "TooltipArrow";

// ---- TOOLTIP VIEWPORT -------------------------------------------------------

/**
 * Optional viewport for coordinating multi-tooltip transitions (e.g. a
 * single tooltip surface that morphs between triggers). Rarely needed.
 *
 * @since 0.3.0
 */
export type TooltipViewportProps = React.ComponentProps<
  typeof TooltipPrimitive.Viewport
>;
function TooltipViewport({ className, ...props }: TooltipViewportProps) {
  return (
    <TooltipPrimitive.Viewport
      data-slot="tooltip-viewport"
      className={className}
      {...props}
    />
  );
}
TooltipViewport.displayName = "TooltipViewport";

// ---- TOOLTIP HANDLE (detached-trigger API) ----------------------------------

/**
 * Handle type produced by {@link createTooltipHandle}. Enables detached
 * triggers that control a remote `TooltipRoot`.
 *
 * @since 0.3.0
 */
const TooltipHandle = TooltipPrimitive.Handle;

/**
 * Creates a typed handle for detached triggers.
 *
 * @since 0.3.0
 */
const createTooltipHandle = TooltipPrimitive.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  TooltipArrow,
  TooltipViewport,
  TooltipHandle,
  createTooltipHandle,
};

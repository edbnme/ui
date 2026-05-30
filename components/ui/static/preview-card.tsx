/**
 * Preview Card — Full-width, rich hover preview (user profiles, article peeks).
 *
 * `PreviewCard` and `HoverCard` both wrap Base UI's `PreviewCard` primitive
 * but are tuned for different defaults:
 * - `HoverCard` → inline mention-style peek (narrower, subtle underline)
 * - `PreviewCard` → GitHub-style profile peek (wider, more emphasised trigger)
 *
 * Anatomy:
 * ```tsx
 * <PreviewCardRoot>
 *   <PreviewCardTrigger href="/user">@username</PreviewCardTrigger>
 *   <PreviewCardPortal>
 *     <PreviewCardBackdrop />
 *     <PreviewCardPositioner>
 *       <PreviewCardPopup>
 *         <PreviewCardArrow />
 *         <PreviewCardViewport>
 *         …profile content…
 *         </PreviewCardViewport>
 *       </PreviewCardPopup>
 *     </PreviewCardPositioner>
 *   </PreviewCardPortal>
 * </PreviewCardRoot>
 * ```
 *
 * Motion: scale + opacity in/out driven by data-attribute states. Respects
 * `prefers-reduced-motion` via `motion-reduce:` variants.
 *
 * @version 0.3.0
 * @package    @edbn/ui
 * @brand      edbn/ui -- https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/preview-card
 * @upstream   Base UI v1.4.1 -- https://base-ui.com/react/components/preview-card
 * @registryDescription Link preview card with rich content and auto-positioning on hover.
 * @registryIsNew
 */

"use client";

import * as React from "react";
import { PreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

/**
 * Stateful root — coordinates open state, hover intent, and imperative
 * handle wiring. Supports `defaultOpen` / `open` + `onOpenChange`, plus
 * `actionsRef`, detached trigger handles, trigger IDs, and payload render
 * children.
 *
 * @since 0.1.0
 */
export type PreviewCardRootProps<Payload = unknown> =
  PreviewCard.Root.Props<Payload>;

function PreviewCardRoot<Payload = unknown>(
  props: PreviewCardRootProps<Payload>
) {
  return <PreviewCard.Root {...props} />;
}
PreviewCardRoot.displayName = "PreviewCardRoot";

// ---- TRIGGER ----------------------------------------------------------------

export type PreviewCardTriggerProps<Payload = unknown> =
  PreviewCard.Trigger.Props<Payload> & React.RefAttributes<HTMLElement>;

/**
 * Anchor element that reveals the card on hover or keyboard focus.
 *
 * Styled more prominently than `HoverCardTrigger` (solid underline + primary
 * colour) because preview cards usually anchor onto named entities like
 * usernames, article titles, or repo names.
 *
 * Data attributes:
 * - `data-popup-open` — present while the card is visible
 *
 * @since 0.1.0
 */
function PreviewCardTrigger<Payload = unknown>({
  className,
  ...props
}: PreviewCardTriggerProps<Payload>) {
  return (
    <PreviewCard.Trigger
      data-slot="preview-card-trigger"
      className={cn(
        "text-primary underline decoration-primary/50 underline-offset-4",
        "transition-colors hover:decoration-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}
PreviewCardTrigger.displayName = "PreviewCardTrigger";

// ---- PORTAL -----------------------------------------------------------------

/**
 * Teleports the card into `document.body` (or a custom `container`).
 *
 * @since 0.1.0
 */
const PreviewCardPortal = PreviewCard.Portal;

// ---- BACKDROP ---------------------------------------------------------------

export type PreviewCardBackdropProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Backdrop
>;

/**
 * Invisible full-viewport layer — enable for modal-flavoured cards where
 * outside clicks should dismiss. Rendered behind the popup but above page
 * content.
 *
 * @since 0.3.0
 */
function PreviewCardBackdrop({
  className,
  ...props
}: PreviewCardBackdropProps) {
  return (
    <PreviewCard.Backdrop
      data-slot="preview-card-backdrop"
      className={cn("fixed inset-0 z-50", className)}
      {...props}
    />
  );
}
PreviewCardBackdrop.displayName = "PreviewCardBackdrop";

// ---- POSITIONER -------------------------------------------------------------

export type PreviewCardPositionerProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Positioner
>;

/**
 * Floating-UI wrapper that handles side selection, flipping, shifting, and
 * exposes CSS variables (`--anchor-width`, `--available-height`,
 * `--transform-origin`, …) consumed by popups and arrows.
 *
 * Data attributes:
 * - `data-side` — `top` | `right` | `bottom` | `left`
 * - `data-align` — `start` | `center` | `end`
 *
 * @since 0.1.0
 */
function PreviewCardPositioner({
  className,
  sideOffset = 8,
  ...props
}: PreviewCardPositionerProps) {
  return (
    <PreviewCard.Positioner
      data-slot="preview-card-positioner"
      sideOffset={sideOffset}
      className={cn("z-50", className)}
      {...props}
    />
  );
}
PreviewCardPositioner.displayName = "PreviewCardPositioner";

// ---- POPUP ------------------------------------------------------------------

export type PreviewCardPopupProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Popup
>;

/**
 * The visible preview surface. Wider than `HoverCardPopup` by default
 * (`w-80`) because it hosts structured profile-style content.
 *
 * Data attributes:
 * - `data-starting-style`, `data-ending-style` — enter / exit transition hooks
 * - `data-side` — mirrors the positioner for side-aware tweaks
 *
 * @since 0.1.0
 */
function PreviewCardPopup({ className, ...props }: PreviewCardPopupProps) {
  return (
    <PreviewCard.Popup
      data-slot="preview-card-popup"
      className={cn(
        "z-50 w-80 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
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
PreviewCardPopup.displayName = "PreviewCardPopup";

// ---- ARROW ------------------------------------------------------------------

export type PreviewCardArrowProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Arrow
>;

/**
 * Decorative pointer connecting popup to trigger.
 *
 * By default Base UI renders a simple triangle; we leave the `[&>svg]` fill/
 * stroke hooks in place so a consumer can drop in a custom SVG without
 * re-wiring colours.
 *
 * Data attributes:
 * - `data-side` — for side-aware positioning
 *
 * @since 0.1.0
 */
function PreviewCardArrow({ className, ...props }: PreviewCardArrowProps) {
  return (
    <PreviewCard.Arrow
      data-slot="preview-card-arrow"
      className={cn(
        "relative -top-px -z-10",
        "[&>svg]:fill-popover [&>svg]:stroke-border",
        className
      )}
      {...props}
    />
  );
}
PreviewCardArrow.displayName = "PreviewCardArrow";

// ---- VIEWPORT ---------------------------------------------------------------

export type PreviewCardViewportProps = React.ComponentPropsWithoutRef<
  typeof PreviewCard.Viewport
>;

/**
 * Optional viewport wrapper for orchestrating shared-element transitions
 * when a single card hosts multiple triggers. Leave unmounted unless you
 * need animated content swaps.
 *
 * @since 0.2.0
 */
function PreviewCardViewport({
  className,
  ...props
}: PreviewCardViewportProps) {
  return (
    <PreviewCard.Viewport
      data-slot="preview-card-viewport"
      className={cn("relative h-full w-full overflow-clip", className)}
      {...props}
    />
  );
}
PreviewCardViewport.displayName = "PreviewCardViewport";

// ---- IMPERATIVE HANDLE ------------------------------------------------------

/**
 * Imperative handle type (produced by `createPreviewCardHandle`) exposing
 * `.open()` / `.close()` for programmatic control — useful for tours,
 * debugging, or global shortcuts.
 *
 * @since 0.2.0
 */
const PreviewCardHandle = PreviewCard.Handle;

/**
 * Factory for a stable handle instance. Pass the returned handle to
 * `<PreviewCardRoot handle={…} />`.
 *
 * @since 0.2.0
 */
const createPreviewCardHandle = PreviewCard.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  PreviewCardRoot,
  PreviewCardTrigger,
  PreviewCardPortal,
  PreviewCardBackdrop,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardArrow,
  PreviewCardViewport,
  PreviewCardHandle,
  createPreviewCardHandle,
};

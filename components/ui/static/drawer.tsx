/**
 * Drawer — bottom / side sheet with native swipe gestures, snap points,
 * and nested-drawer support.
 *
 * Built on Base UI's Drawer (v1.2.0 — currently exposed via the
 * `DrawerPreview` namespace). For centered modals use `Dialog`; for
 * transient anchored surfaces use `Popover`.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.3.0
 * @brand      edbn/ui — <https://ui.edbn.me>
 * @docs       https://ui.edbn.me/docs/components/drawer
 * @source     https://ui.edbn.me/r/drawer.json
 * @registry   https://ui.edbn.me/r
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/drawer
 * @a11y       WAI-ARIA Dialog pattern; focus trap; Escape dismissal;
 *             scroll-lock on `<body>`; inert background; respects
 *             `prefers-reduced-motion`; swipe gestures are decorative —
 *             every swipe-to-dismiss has an equivalent `DrawerClose`
 *             button for keyboard / AT users.
 *
 * ## Anatomy
 * ```tsx
 * <DrawerRoot>
 *   <DrawerTrigger>Open</DrawerTrigger>
 *   <DrawerPortal>
 *     <DrawerBackdrop />
 *     <DrawerViewport>
 *       <DrawerPopup>
 *         <DrawerHandle />
 *         <DrawerContent>
 *           <DrawerTitle>Filters</DrawerTitle>
 *           <DrawerDescription>Refine your results.</DrawerDescription>
 *         </DrawerContent>
 *         <DrawerCloseIconButton />
 *       </DrawerPopup>
 *     </DrawerViewport>
 *   </DrawerPortal>
 * </DrawerRoot>
 * ```
 *
 * ## Snap points
 * ```tsx
 * <DrawerRoot snapPoints={[0.4, 1]} defaultSnapPoint={0.4}>
 *   …
 * </DrawerRoot>
 * ```
 *
 * ## Nested drawers
 * ```tsx
 * <DrawerProvider>
 *   <DrawerRoot>
 *     …
 *     <DrawerPopup>
 *       <DrawerRoot>    {/* nested *\/}
 *         …
 *       </DrawerRoot>
 *     </DrawerPopup>
 *   </DrawerRoot>
 * </DrawerProvider>
 * ```
 * @registryDescription Bottom sheet drawer with swipe-to-dismiss and smooth spring animations.
 * @registryIsNew
 */
"use client";

import * as React from "react";
import { DrawerPreview as Drawer } from "@base-ui/react/drawer";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// ---- DRAWER PROVIDER --------------------------------------------------------

/**
 * Optional ancestor that coordinates nested drawer layering (exposes the
 * `--nested-drawers` CSS variable on child popups so you can stack them
 * with visual depth).
 *
 * @since 0.3.0
 */
export type DrawerProviderProps = React.ComponentProps<typeof Drawer.Provider>;
const DrawerProvider = (props: DrawerProviderProps) => (
  <Drawer.Provider {...props} />
);
DrawerProvider.displayName = "DrawerProvider";

// ---- DRAWER ROOT ------------------------------------------------------------

/**
 * Top-level Drawer state holder. Forwards all Base UI `Drawer.Root` props:
 * `actionsRef`, `defaultOpen`, `defaultSnapPoint`, `defaultTriggerId`,
 * `disablePointerDismissal`, `handle`, `modal`, `onOpenChange`,
 * `onOpenChangeComplete`, `onSnapPointChange`, `open`, `snapPoint`,
 * `snapPoints`, `snapToSequentialPoints`, `swipeDirection`, `triggerId`.
 *
 * @since 0.3.0
 */
export type DrawerRootProps = React.ComponentProps<typeof Drawer.Root>;
const DrawerRoot = (props: DrawerRootProps) => <Drawer.Root {...props} />;
DrawerRoot.displayName = "DrawerRoot";

// ---- DRAWER TRIGGER ---------------------------------------------------------

/**
 * Button that opens the drawer. Unstyled by default — compose with your
 * own button surface via `className` or `render`.
 *
 * @since 0.3.0
 */
export type DrawerTriggerProps = React.ComponentProps<typeof Drawer.Trigger>;
function DrawerTrigger({ className, ...props }: DrawerTriggerProps) {
  return (
    <Drawer.Trigger
      data-slot="drawer-trigger"
      className={cn(
        "inline-flex select-none items-center justify-center",
        "transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
DrawerTrigger.displayName = "DrawerTrigger";

// ---- DRAWER PORTAL ----------------------------------------------------------

/**
 * Portals drawer content into a stable DOM location.
 *
 * @since 0.3.0
 */
export type DrawerPortalProps = React.ComponentProps<typeof Drawer.Portal>;
const DrawerPortal = (props: DrawerPortalProps) => <Drawer.Portal {...props} />;
DrawerPortal.displayName = "DrawerPortal";

// ---- DRAWER BACKDROP --------------------------------------------------------

/**
 * Dimming overlay behind the drawer. Opacity is synced to swipe progress
 * via the `--drawer-swipe-progress` CSS variable — you can leverage this
 * to fade background UI in tandem with the drag.
 *
 * **CSS variables** — `--drawer-swipe-progress`.
 *
 * @since 0.3.0
 */
export type DrawerBackdropProps = React.ComponentProps<typeof Drawer.Backdrop>;
function DrawerBackdrop({ className, ...props }: DrawerBackdropProps) {
  return (
    <Drawer.Backdrop
      data-slot="drawer-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-xs",
        "transition-opacity duration-200 ease-out",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        "motion-reduce:backdrop-blur-none motion-reduce:transition-opacity",
        className,
      )}
      {...props}
    />
  );
}
DrawerBackdrop.displayName = "DrawerBackdrop";

// ---- DRAWER VIEWPORT --------------------------------------------------------

/**
 * Full-viewport wrapper that contains the popup and reacts to swipe
 * gestures. Required when you want the drawer to swipe-dismiss.
 *
 * @since 0.3.0
 */
export type DrawerViewportProps = React.ComponentProps<typeof Drawer.Viewport>;
function DrawerViewport({ className, ...props }: DrawerViewportProps) {
  return (
    <Drawer.Viewport
      data-slot="drawer-viewport"
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center",
        className,
      )}
      {...props}
    />
  );
}
DrawerViewport.displayName = "DrawerViewport";

// ---- DRAWER POPUP -----------------------------------------------------------

/**
 * The drawer surface. Slides in from the bottom by default; change via
 * `swipeDirection` on `DrawerRoot`.
 *
 * **Data attributes** — `data-expanded`, `data-nested-drawer-open`,
 * `data-nested-drawer-swiping`, `data-swipe-direction`,
 * `data-swipe-dismiss`, `data-swiping`.
 *
 * **CSS variables** — `--drawer-frontmost-height`, `--drawer-height`,
 * `--drawer-snap-point-offset`, `--drawer-swipe-movement-x`,
 * `--drawer-swipe-movement-y`, `--drawer-swipe-strength`,
 * `--nested-drawers`.
 *
 * @since 0.3.0
 */
export type DrawerPopupProps = React.ComponentProps<typeof Drawer.Popup>;
function DrawerPopup({ className, ...props }: DrawerPopupProps) {
  return (
    <Drawer.Popup
      data-slot="drawer-popup"
      className={cn(
        "relative z-50 mt-24 flex max-h-[96svh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-background text-foreground shadow-2xl",
        // Live-follow swipe drag
        "translate-y-(--drawer-swipe-movement-y)",
        // Spring-in on open; follows snap-point offset for smooth snapping
        "transition-transform duration-300 ease-out",
        "data-starting-style:translate-y-full data-ending-style:translate-y-full",
        // During user swipe, disable transitions for 1:1 follow
        "data-swiping:transition-none",
        // Nested-drawer scale-down of parent
        "data-nested-drawer-open:scale-[0.96] data-nested-drawer-open:opacity-90",
        "motion-reduce:transition-opacity",
        "motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-ending-style:translate-y-0",
        "motion-reduce:data-starting-style:opacity-0 motion-reduce:data-ending-style:opacity-0",
        "focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
DrawerPopup.displayName = "DrawerPopup";

// ---- DRAWER HANDLE (visual grip) -------------------------------------------

/**
 * Visual "grab handle" rendered at the top of a bottom drawer. Purely
 * decorative (`aria-hidden`) — the swipe gesture is handled by the
 * viewport.
 *
 * @since 0.3.0
 */
export interface DrawerHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
function DrawerHandle({ className, ...props }: DrawerHandleProps) {
  return (
    <div
      aria-hidden
      data-slot="drawer-handle"
      className={cn(
        "mx-auto mt-2 mb-1 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/30",
        className,
      )}
      {...props}
    />
  );
}
DrawerHandle.displayName = "DrawerHandle";

// ---- DRAWER CONTENT ---------------------------------------------------------

/**
 * Scrollable content region inside a drawer popup.
 *
 * @since 0.3.0
 */
export type DrawerContentProps = React.ComponentProps<typeof Drawer.Content>;
function DrawerContent({ className, ...props }: DrawerContentProps) {
  return (
    <Drawer.Content
      data-slot="drawer-content"
      className={cn(
        "flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}
DrawerContent.displayName = "DrawerContent";

// ---- DRAWER TITLE -----------------------------------------------------------

/**
 * Drawer title, wired to `aria-labelledby`.
 *
 * @since 0.3.0
 */
export type DrawerTitleProps = React.ComponentProps<typeof Drawer.Title>;
function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  return (
    <Drawer.Title
      data-slot="drawer-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}
DrawerTitle.displayName = "DrawerTitle";

// ---- DRAWER DESCRIPTION -----------------------------------------------------

/**
 * Drawer description, wired to `aria-describedby`.
 *
 * @since 0.3.0
 */
export type DrawerDescriptionProps = React.ComponentProps<
  typeof Drawer.Description
>;
function DrawerDescription({ className, ...props }: DrawerDescriptionProps) {
  return (
    <Drawer.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
DrawerDescription.displayName = "DrawerDescription";

// ---- DRAWER CLOSE -----------------------------------------------------------

/**
 * Unstyled action that closes the drawer. Use inside a footer or compose
 * with your own button surface. For the common corner-X pattern use
 * {@link DrawerCloseIconButton}.
 *
 * @since 0.3.0
 */
export type DrawerCloseProps = React.ComponentProps<typeof Drawer.Close>;
function DrawerClose({ className, ...props }: DrawerCloseProps) {
  return (
    <Drawer.Close
      data-slot="drawer-close"
      className={cn(
        "inline-flex select-none items-center justify-center",
        "transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
DrawerClose.displayName = "DrawerClose";

// ---- DRAWER CLOSE ICON BUTTON -----------------------------------------------

/**
 * Styled corner-X close button for Drawer. Absolutely positioned 32px hit
 * target with Phosphor X icon and a screen-reader-only "Close" label.
 * Place inside a `DrawerPopup`.
 *
 * @since 0.3.0
 * @example
 * ```tsx
 * <DrawerPopup>
 *   <DrawerCloseIconButton />
 *   …
 * </DrawerPopup>
 * ```
 */
export type DrawerCloseIconButtonProps = DrawerCloseProps;
function DrawerCloseIconButton({
  className,
  "aria-label": ariaLabel = "Close drawer",
  ...props
}: DrawerCloseIconButtonProps) {
  return (
    <Drawer.Close
      data-slot="drawer-close-icon-button"
      aria-label={ariaLabel}
      className={cn(
        "absolute top-3 right-3",
        "inline-flex size-8 items-center justify-center rounded-full",
        "text-muted-foreground opacity-70 transition-opacity",
        "hover:bg-muted hover:opacity-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <X aria-hidden className="size-4" weight="bold" />
      <span className="sr-only">Close</span>
    </Drawer.Close>
  );
}
DrawerCloseIconButton.displayName = "DrawerCloseIconButton";

// ---- DRAWER INDENT ----------------------------------------------------------

/**
 * Wraps the host page content so it can "indent" (scale down / slide
 * back) while a drawer is open, creating a layered feel.
 *
 * @since 0.3.0
 */
export type DrawerIndentProps = React.ComponentProps<typeof Drawer.Indent>;
function DrawerIndent({ className, ...props }: DrawerIndentProps) {
  return (
    <Drawer.Indent
      data-slot="drawer-indent"
      className={cn(
        "transition-transform duration-300 ease-out",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}
DrawerIndent.displayName = "DrawerIndent";

// ---- DRAWER INDENT BACKGROUND -----------------------------------------------

/**
 * Paints the exposed area behind the indented content while the drawer is
 * open. Typically a solid dark colour that matches the OS-level backdrop.
 *
 * @since 0.3.0
 */
export type DrawerIndentBackgroundProps = React.ComponentProps<
  typeof Drawer.IndentBackground
>;
function DrawerIndentBackground({
  className,
  ...props
}: DrawerIndentBackgroundProps) {
  return (
    <Drawer.IndentBackground
      data-slot="drawer-indent-background"
      className={cn("fixed inset-0 -z-10 bg-black", className)}
      {...props}
    />
  );
}
DrawerIndentBackground.displayName = "DrawerIndentBackground";

// ---- DRAWER HANDLE REF (detached-trigger API) -------------------------------

/**
 * Creates a typed handle for detached triggers (shared with Dialog's
 * handle implementation in Base UI). Use when the trigger lives outside
 * the drawer's render tree.
 *
 * @since 0.3.0
 */
const createDrawerHandle = Drawer.createHandle;

// ---- EXPORTS ----------------------------------------------------------------

export {
  DrawerProvider,
  DrawerRoot,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerViewport,
  DrawerPopup,
  DrawerHandle,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerCloseIconButton,
  DrawerIndent,
  DrawerIndentBackground,
  createDrawerHandle,
};

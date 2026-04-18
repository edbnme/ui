/**
 * Switch — Toggle for binary on / off settings.
 *
 * Built on the Base UI `Switch` primitive. Uses an iOS-style sliding thumb
 * with smooth spring-free easing tuned for a quiet, precise feel. Supports
 * controlled / uncontrolled state, form integration, and full ARIA wiring.
 *
 * Anatomy:
 * ```tsx
 * <label className="flex items-center gap-2">
 *   <SwitchRoot defaultChecked>
 *     <SwitchThumb />
 *   </SwitchRoot>
 *   <span className="text-sm font-medium">Dark mode</span>
 * </label>
 * ```
 *
 * Accessibility: rendered as a `<button role="switch">` with `aria-checked`
 * managed by Base UI. Space / Enter toggles. A hidden `<input>` provides
 * native form submission behavior.
 *
 * @package    @edbn/ui
 * @version    0.3.0
 * @since      0.1.0
 * @brand      edbn/ui — https://ui.edbn.me
 * @docs       https://ui.edbn.me/docs/components/switch
 * @upstream   Base UI v1.2.0 — https://base-ui.com/react/components/switch
 * @registryDescription Toggle switch with accessible on/off states.
 */

"use client";

import * as React from "react";
import { Switch } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

// ---- ROOT -------------------------------------------------------------------

export type SwitchRootProps = React.ComponentPropsWithoutRef<typeof Switch.Root>;

/**
 * The track element. The thumb rides inside it — its translation is driven
 * by the `data-checked` attribute on the root, which scoped Tailwind
 * selectors can hook into.
 *
 * Data attributes:
 * - `data-checked`, `data-unchecked`
 * - `data-disabled`, `data-readonly`, `data-required`
 *
 * @since 0.1.0
 */
function SwitchRoot({ className, ...props }: SwitchRootProps) {
  return (
    <Switch.Root
      data-slot="switch-root"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm",
        "transition-colors duration-200 ease-out motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "bg-input data-checked:bg-primary",
        className
      )}
      {...props}
    />
  );
}
SwitchRoot.displayName = "SwitchRoot";

// ---- THUMB ------------------------------------------------------------------

export type SwitchThumbProps = React.ComponentPropsWithoutRef<
  typeof Switch.Thumb
>;

/**
 * The sliding knob. Translates `4px` (the track's internal padding width)
 * when `data-checked`, giving the familiar iOS-style snap.
 *
 * @since 0.1.0
 */
function SwitchThumb({ className, ...props }: SwitchThumbProps) {
  return (
    <Switch.Thumb
      data-slot="switch-thumb"
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0",
        "transition-transform duration-200 ease-out motion-reduce:transition-none",
        "translate-x-0 data-checked:translate-x-4",
        className
      )}
      {...props}
    />
  );
}
SwitchThumb.displayName = "SwitchThumb";

// ---- EXPORTS ----------------------------------------------------------------

export { SwitchRoot, SwitchThumb };

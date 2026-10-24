import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The edbn-base curves (rounded-card/panel/control) are theme radii, so a
// size's own `rounded-[6px]` replaces a component's `rounded-control`
// instead of losing to it in the stylesheet.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["card", "panel", "control"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

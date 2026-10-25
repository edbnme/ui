import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// edbn-base's size scale, so classes merge as Tailwind's own do: stock
// tailwind-merge reads `text-small` as a text colour and drops it next to
// `text-muted-foreground`, and keeps `h-control` beside a `className="h-9"`
// that should replace it.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["body", "small", "micro", "stat"],
      radius: ["card", "panel", "control", "control-sm", "control-xs"],
      spacing: [
        "control",
        "control-xs",
        "control-sm",
        "control-lg",
        "control-touch",
        "token",
      ],
      container: ["menu", "popover", "compact", "dialog", "wide"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

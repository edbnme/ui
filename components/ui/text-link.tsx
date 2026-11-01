import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// A link in running text. It takes the size of the text around it. Render a
// framework link with `render={<Link href="…" />}`, or an action that reads
// as a link (Undo, Retry, Resend) with `render={<button />}`. A link that
// looks like a button is `buttonVariants()` on an `<a>` instead.
const textLinkVariants = cva(
  "rounded-[2px] underline-offset-[3px] outline-none transition-[color,text-decoration-color] duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:text-muted-foreground disabled:no-underline aria-disabled:pointer-events-none aria-disabled:text-muted-foreground aria-disabled:no-underline data-disabled:pointer-events-none data-disabled:text-muted-foreground data-disabled:no-underline",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted:
          "text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
      },
      underline: {
        // A faint rule that darkens under the pointer.
        always:
          "underline decoration-foreground/20 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-foreground/60",
        hover:
          "underline-offset-4 decoration-current [@media(hover:hover)_and_(pointer:fine)]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
      underline: "always",
    },
  }
)

function TextLink({
  className,
  variant = "default",
  underline = "always",
  render,
  ...props
}: useRender.ComponentProps<"a"> & VariantProps<typeof textLinkVariants>) {
  // A rendered <button> would otherwise submit the form it sits in.
  const rendersButton = React.isValidElement(render) && render.type === "button"

  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        ...(rendersButton ? { type: "button" } : {}),
        className: cn(textLinkVariants({ variant, underline }), className),
      },
      props
    ),
    render,
    state: {
      slot: "text-link",
      variant,
    },
  })
}

export { TextLink, textLinkVariants }

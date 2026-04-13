import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// =============================================================================
// MESSAGE
// =============================================================================

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  /** Determines alignment and styling. Required. */
  from: "user" | "assistant";
};

/**
 * Main message container. Uses CSS group selectors (`.is-user`, `.is-assistant`)
 * so child components style themselves based on the sender — no React context needed.
 *
 * User messages align right; assistant messages align left via `flex-row-reverse`.
 */
export function Message({ className, from, ...props }: MessageProps) {
  return (
    <div
      data-slot="message"
      className={cn(
        "group flex w-full items-end justify-end gap-3 py-5",
        from === "user"
          ? "is-user"
          : "is-assistant flex-row-reverse justify-end",
        className
      )}
      {...props}
    />
  );
}

Message.displayName = "Message";

// =============================================================================
// MESSAGE CONTENT
// =============================================================================

const messageContentVariants = cva(
  "flex flex-col gap-2 overflow-hidden rounded-2xl text-sm",
  {
    variants: {
      variant: {
        contained: [
          "max-w-[80%] px-5 py-3.5",
          "group-[.is-user]:bg-primary/90 group-[.is-user]:text-primary-foreground",
          "group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground/90",
        ],
        flat: [
          "group-[.is-user]:max-w-[80%] group-[.is-user]:bg-secondary group-[.is-user]:px-5 group-[.is-user]:py-3.5 group-[.is-user]:text-foreground",
          "group-[.is-assistant]:text-foreground/90",
        ],
      },
    },
    defaultVariants: {
      variant: "contained",
    },
  }
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>;

/**
 * Container for the message body. Supports two visual variants:
 * - `"contained"` (default): Background color + padding, different for user/assistant.
 * - `"flat"`: Minimal styling, useful for assistant messages in a clean layout.
 */
export function MessageContent({
  children,
  className,
  variant,
  ...props
}: MessageContentProps) {
  return (
    <div
      data-slot="message-content"
      className={cn(messageContentVariants({ variant, className }))}
      {...props}
    >
      {children}
    </div>
  );
}

MessageContent.displayName = "MessageContent";

// =============================================================================
// MESSAGE AVATAR
// =============================================================================

export type MessageAvatarProps = HTMLAttributes<HTMLDivElement> & {
  /** Avatar image URL. */
  src?: string;
  /** Name used for the fallback text (first 2 characters). */
  name?: string;
};

/**
 * Avatar circle with image + text fallback. Shows `name.slice(0, 2)` when no
 * image is provided or while the image is loading.
 */
export function MessageAvatar({
  src,
  name,
  className,
  ...props
}: MessageAvatarProps) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border/50",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          alt=""
          src={src}
          className="mt-0 mb-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted/60 text-xs font-medium text-muted-foreground">
          {name?.slice(0, 2) || "ME"}
        </div>
      )}
    </div>
  );
}

MessageAvatar.displayName = "MessageAvatar";

// =============================================================================
// EXPORTS
// =============================================================================

export { messageContentVariants };

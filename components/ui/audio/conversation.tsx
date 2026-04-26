"use client";

/**
 * Conversation
 * @registryDescription Auto-scrolling conversation container with sticky-to-bottom behavior and scroll affordance.
 * @registryCategory chat
 */

import * as React from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";

// ---- CONVERSATION -----------------------------------------------------------

export type ConversationProps = React.ComponentProps<typeof StickToBottom>;

/**
 * Scrolling conversation container with auto-scroll and sticky-to-bottom
 * behavior. Built on `use-stick-to-bottom`.
 */
export function Conversation({ className, ...props }: ConversationProps) {
  return (
    <StickToBottom
      data-slot="conversation"
      className={cn("relative flex-1 overflow-y-auto", className)}
      initial="smooth"
      resize="smooth"
      role="log"
      {...props}
    />
  );
}

Conversation.displayName = "Conversation";

// ---- CONVERSATION CONTENT ---------------------------------------------------

export type ConversationContentProps = React.ComponentProps<
  typeof StickToBottom.Content
>;

export function ConversationContent({
  className,
  ...props
}: ConversationContentProps) {
  return (
    <StickToBottom.Content
      data-slot="conversation-content"
      className={cn("p-6", className)}
      {...props}
    />
  );
}

ConversationContent.displayName = "ConversationContent";

// ---- CONVERSATION EMPTY STATE -----------------------------------------------

export type ConversationEmptyStateProps = Omit<
  React.ComponentProps<"div">,
  "title"
> & {
  /** Title text displayed in the empty state. */
  title?: React.ReactNode;
  /** Description text below the title. */
  description?: React.ReactNode;
  /** Optional icon element displayed above the title. */
  icon?: React.ReactNode;
};

/**
 * Placeholder shown when the conversation has no messages.
 * Pass `children` to fully override the default rendering.
 */
export function ConversationEmptyState({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) {
  return (
    <div
      data-slot="conversation-empty-state"
      className={cn(
        "flex size-full flex-col items-center justify-center gap-4 p-8 text-center",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {icon && (
            <div className="text-muted-foreground bg-muted/30 rounded-2xl p-4">
              {icon}
            </div>
          )}
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
            {description && (
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

ConversationEmptyState.displayName = "ConversationEmptyState";

// ---- CONVERSATION SCROLL BUTTON ---------------------------------------------

export type ConversationScrollButtonProps = React.ComponentProps<"button">;

/**
 * Scroll-to-bottom button that auto-hides when the user is already at the
 * bottom of the conversation.
 */
export function ConversationScrollButton({
  className,
  children,
  ...props
}: ConversationScrollButtonProps) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = React.useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (isAtBottom) return null;

  return (
    <button
      data-slot="conversation-scroll-button"
      type="button"
      onClick={handleScrollToBottom}
      className={cn(
        "absolute bottom-4 left-[50%] -translate-x-1/2 rounded-full shadow-lg shadow-black/10",
        "inline-flex size-9 items-center justify-center",
        "backdrop-blur-lg bg-background/80 border border-border/50",
        "text-muted-foreground hover:text-foreground",
        "transition-[background-color,color,box-shadow,transform,opacity] duration-200 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className
      )}
      {...props}
    >
      {children ?? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </button>
  );
}

ConversationScrollButton.displayName = "ConversationScrollButton";

// ---- RE-EXPORT --------------------------------------------------------------

export { useStickToBottomContext };

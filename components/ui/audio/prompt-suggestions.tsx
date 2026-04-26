"use client";

/**
 * Prompt Suggestions
 * @registryDescription List and grid prompt suggestions for assistant empty states and quick actions.
 * @registryCategory chat
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

interface Suggestion {
  /** Display text for the suggestion */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Optional icon to render */
  icon?: React.ReactNode;
  /** Optional value passed to onSelect (defaults to title) */
  value?: string;
}

interface PromptSuggestionsProps
  extends
    Omit<React.ComponentProps<"div">, "onSelect">,
    VariantProps<typeof promptSuggestionsVariants> {
  /** Array of suggestions to display */
  suggestions: Suggestion[];
  /** Called when a suggestion is selected */
  onSelect?: (value: string) => void;
  /** Heading text */
  heading?: string;
}

interface PromptSuggestionItemProps extends Omit<
  React.ComponentProps<"button">,
  "onSelect"
> {
  suggestion: Suggestion;
  onSelect?: (value: string) => void;
}

// ---- VARIANTS ---------------------------------------------------------------

const promptSuggestionsVariants = cva("w-full", {
  variants: {
    layout: {
      list: "flex flex-col gap-2",
      grid: "grid gap-2",
    },
    columns: {
      1: "",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: {
    layout: "grid",
    columns: 2,
  },
});

// ---- COMPONENTS -------------------------------------------------------------

function PromptSuggestionItem({
  suggestion,
  onSelect,
  className,
  ...props
}: PromptSuggestionItemProps) {
  return (
    <button
      type="button"
      data-slot="prompt-suggestion-item"
      onClick={() => onSelect?.(suggestion.value ?? suggestion.title)}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl text-left",
        "border border-border/50 bg-background",
        "shadow-xs shadow-black/5",
        "hover:bg-muted/40 hover:shadow-sm hover:-translate-y-0.5",
        "transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {suggestion.icon && (
        <span className="shrink-0 mt-0.5 text-muted-foreground/70">
          {suggestion.icon}
        </span>
      )}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[15px] font-medium text-foreground truncate">
          {suggestion.title}
        </span>
        {suggestion.description && (
          <span className="text-[13px] text-muted-foreground line-clamp-2">
            {suggestion.description}
          </span>
        )}
      </div>
    </button>
  );
}

function PromptSuggestions({
  suggestions,
  onSelect,
  heading,
  layout = "grid",
  columns = 2,
  className,
  ...props
}: PromptSuggestionsProps) {
  return (
    <div
      data-slot="prompt-suggestions"
      className={cn("space-y-3", className)}
      {...props}
    >
      {heading && (
        <h3 className="text-sm font-medium text-muted-foreground tracking-tight">
          {heading}
        </h3>
      )}
      <div
        className={cn(
          promptSuggestionsVariants({ layout, columns }),
          layout === "list" && "grid-cols-1"
        )}
      >
        {suggestions.map((suggestion) => (
          <PromptSuggestionItem
            key={suggestion.value ?? suggestion.title}
            suggestion={suggestion}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

PromptSuggestions.displayName = "PromptSuggestions";
PromptSuggestionItem.displayName = "PromptSuggestions.Item";

export { PromptSuggestions, PromptSuggestionItem, promptSuggestionsVariants };
export type { PromptSuggestionsProps, Suggestion };

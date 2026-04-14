"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// ---- TYPES ------------------------------------------------------------------

interface ChatInputProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Controlled value */
  value?: string;
  /** Called when value changes */
  onValueChange?: (value: string) => void;
  /** Called when the user submits (Enter without Shift) */
  onSubmit?: (value: string) => void;
  /** Whether the input is disabled (e.g., during streaming) */
  disabled?: boolean;
  /** Maximum number of rows before scrolling */
  maxRows?: number;
  /** Content to render before the textarea (e.g., attachments) */
  leading?: React.ReactNode;
  /** Content to render after the textarea (e.g., send button) */
  trailing?: React.ReactNode;
}

interface ChatInputTextareaProps extends Omit<
  React.ComponentProps<"textarea">,
  "value" | "onChange"
> {}

interface ChatInputActionProps extends React.ComponentProps<"button"> {
  /** Visual variant */
  variant?: "default" | "primary";
}

// ---- CONTEXT ----------------------------------------------------------------

interface ChatInputContextValue {
  value: string;
  setValue: (value: string) => void;
  handleSubmit: () => void;
  disabled: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  maxRows: number;
}

const ChatInputContext = React.createContext<ChatInputContextValue | null>(
  null
);

function useChatInputContext() {
  const context = React.useContext(ChatInputContext);
  if (!context) {
    throw new Error(
      "ChatInput compound components must be used within ChatInput"
    );
  }
  return context;
}

// ---- VARIANTS ---------------------------------------------------------------

const chatInputActionVariants = cva(
  "flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:text-foreground hover:bg-muted",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ---- AUTO-RESIZE HOOK -------------------------------------------------------

function useAutoResize(
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxRows: number
) {
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate max height based on line height
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingBottom = parseFloat(computedStyle.paddingBottom);
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;

    // Set height to scrollHeight, capped at maxHeight
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [textareaRef, value, maxRows]);
}

// ---- COMPONENTS -------------------------------------------------------------

function ChatInputRoot({
  placeholder = "Type a message...",
  value: controlledValue,
  onValueChange,
  onSubmit,
  disabled = false,
  maxRows = 5,
  leading,
  trailing,
  className,
  children,
  ...props
}: ChatInputProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const value = controlledValue ?? internalValue;
  const setValue = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [controlledValue, onValueChange]
  );

  const handleSubmit = React.useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit?.(trimmed);
    setValue("");
  }, [value, disabled, onSubmit, setValue]);

  const contextValue = React.useMemo(
    () => ({ value, setValue, handleSubmit, disabled, textareaRef, maxRows }),
    [value, setValue, handleSubmit, disabled, maxRows]
  );

  return (
    <ChatInputContext.Provider value={contextValue}>
      <div
        data-slot="chat-input"
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm p-2",
          "shadow-xs shadow-black/5",
          "focus-within:ring-2 focus-within:ring-ring/40 focus-within:ring-offset-2",
          "transition-shadow",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {leading}
        {children || <ChatInputTextarea placeholder={placeholder} />}
        {trailing}
      </div>
    </ChatInputContext.Provider>
  );
}

function ChatInputTextarea({
  className,
  placeholder,
  ...props
}: ChatInputTextareaProps) {
  const { value, setValue, handleSubmit, disabled, textareaRef, maxRows } =
    useChatInputContext();

  useAutoResize(textareaRef, value, maxRows);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <textarea
      ref={textareaRef}
      data-slot="chat-input-textarea"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      rows={1}
      className={cn(
        "flex-1 resize-none bg-transparent text-sm text-foreground",
        "placeholder:text-muted-foreground/50",
        "focus:outline-none",
        "min-h-9 py-2 px-2",
        className
      )}
      {...props}
    />
  );
}

function ChatInputAction({
  variant,
  className,
  ...props
}: ChatInputActionProps) {
  return (
    <button
      type="button"
      data-slot="chat-input-action"
      className={cn(chatInputActionVariants({ variant }), className)}
      {...props}
    />
  );
}

// ---- COMPOUND COMPONENT -----------------------------------------------------

ChatInputRoot.displayName = "ChatInput";
ChatInputTextarea.displayName = "ChatInput.Textarea";
ChatInputAction.displayName = "ChatInput.Action";

const ChatInput = Object.assign(ChatInputRoot, {
  Textarea: ChatInputTextarea,
  Action: ChatInputAction,
});

export { ChatInput, useChatInputContext, chatInputActionVariants };
export type { ChatInputProps, ChatInputTextareaProps, ChatInputActionProps };

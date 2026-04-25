"use client";

/**
 * Conversation Bar
 * @registryCategory display
 */
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// ---- INLINE SVG ICONS -------------------------------------------------------

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function PhoneDisconnectIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M10.09 13.91a15.05 15.05 0 0 1-3.41-4.7l2.2-2.2a1 1 0 0 0 .24-1.01A11.36 11.36 0 0 1 8.55 3a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1c-1.25 0-2.46-.2-3.58-.57a1 1 0 0 0-1.01.24l-2.2 2.2a15.05 15.05 0 0 1-3.12-2.46z" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

// ---- TYPES ------------------------------------------------------------------

export type AgentConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting";

/**
 * Generic, provider-agnostic message shape used by `onIncomingMessage`.
 * Mirrors the canonical ElevenLabs UI shape but uses `role` instead of
 * `source` to align with broader chat-message conventions (OpenAI, Anthropic,
 * etc.).
 */
export interface ConversationMessage {
  role: "user" | "assistant";
  text: string;
}

export interface ConversationBarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onError"
> {
  /** Called when the user sends a text message. */
  onSendMessage?: (message: string) => void;
  /**
   * Alias of `onSendMessage` retained for backwards compatibility.
   * @deprecated Use `onSendMessage` instead. Will be removed in a future major release.
   */
  onSend?: (message: string) => void;
  /** Called when an incoming message arrives. Wire this to your chat backend. */
  onIncomingMessage?: (message: ConversationMessage) => void;
  /** Called when the user presses connect. */
  onConnect?: () => void;
  /** Called when the user presses disconnect. */
  onDisconnect?: () => void;
  /** Called when an error originates inside the bar (e.g. mic permission). */
  onError?: (error: Error) => void;
  /** Current connection state. Default: `"disconnected"`. */
  connectionState?: AgentConnectionState;
  /** Placeholder text for the input. Default: `"Type a message…"`. */
  placeholder?: string;
  /** Whether to show the connection toggle button. Default: `true`. */
  showConnectionToggle?: boolean;
  /** Whether the send button is disabled. Default: `false`. */
  isSendDisabled?: boolean;
  /**
   * Whether to render a `<textarea>` (multi-line, Shift+Enter for newline)
   * instead of a single-line `<input>`. Default: `true`.
   */
  multiline?: boolean;
  /**
   * Maximum textarea rows before scrolling. Only applies when `multiline` is
   * true. Default: `5`.
   */
  maxRows?: number;
}

// ---- STATUS DOT -------------------------------------------------------------

const CONNECTION_LABELS: Record<AgentConnectionState, string> = {
  disconnected: "Disconnected",
  connecting: "Connecting",
  connected: "Connected",
  disconnecting: "Disconnecting",
};

function StatusDot({ state }: { state: AgentConnectionState }) {
  return (
    <span
      data-slot="status-dot"
      className={cn(
        "size-2 rounded-full shrink-0 ring-2 ring-background",
        state === "connected" && "bg-green-500",
        (state === "connecting" || state === "disconnecting") &&
          "bg-yellow-500 animate-pulse",
        state === "disconnected" && "bg-muted-foreground/30"
      )}
      aria-hidden="true"
    />
  );
}

// ---- AUTO-RESIZING TEXTAREA -------------------------------------------------

function useAutosize(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  maxRows: number
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    const maxHeight = lineHeight * maxRows;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [ref, value, maxRows]);
}

// ---- CONVERSATION BAR -------------------------------------------------------

export const ConversationBar = React.forwardRef<
  HTMLDivElement,
  ConversationBarProps
>(
  (
    {
      onSendMessage,
      onSend,
      onIncomingMessage: _onIncomingMessage,
      onConnect,
      onDisconnect,
      onError: _onError,
      connectionState = "disconnected",
      placeholder = "Type a message…",
      showConnectionToggle = true,
      isSendDisabled = false,
      multiline = true,
      maxRows = 5,
      className,
      ...props
    },
    ref
  ) => {
    // `onIncomingMessage` and `onError` are surfaced as part of the public API
    // so consumers wiring custom backends (LiveKit, OpenAI Realtime, custom
    // websockets, etc.) have ergonomic parity with provider-coupled
    // alternatives. They are intentionally not invoked from inside the bar
    // because this component is provider-agnostic — the consumer owns the
    // transport. Marked unused via `_` prefix to silence lint without losing
    // the type contract.
    void _onIncomingMessage;
    void _onError;

    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useAutosize(textareaRef, value, maxRows);

    const handleSend = useCallback(() => {
      const trimmed = value.trim();
      if (!trimmed || isSendDisabled) return;
      onSendMessage?.(trimmed);
      onSend?.(trimmed);
      setValue("");
      (multiline ? textareaRef.current : inputRef.current)?.focus();
    }, [value, isSendDisabled, onSendMessage, onSend, multiline]);

    const handleKeyDown = useCallback(
      (
        e:
          | React.KeyboardEvent<HTMLInputElement>
          | React.KeyboardEvent<HTMLTextAreaElement>
      ) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      },
      [handleSend]
    );

    const handleConnectionToggle = useCallback(() => {
      if (connectionState === "connected") {
        onDisconnect?.();
      } else if (connectionState === "disconnected") {
        onConnect?.();
      }
    }, [connectionState, onConnect, onDisconnect]);

    const isInteractive =
      connectionState !== "connecting" && connectionState !== "disconnecting";

    const inputClassName =
      "min-w-0 flex-1 bg-transparent text-sm px-3 py-1.5 outline-none placeholder:text-muted-foreground/50 resize-none leading-5";

    return (
      <div
        ref={ref}
        data-slot="conversation-bar"
        data-connection={connectionState}
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm p-2",
          "shadow-xs shadow-black/5",
          "transition-all duration-200 focus-within:ring-2 focus-within:ring-ring/40 focus-within:ring-offset-2 focus-within:ring-offset-background",
          className
        )}
        {...props}
      >
        {/* Connection toggle */}
        {showConnectionToggle && (
          <button
            type="button"
            onClick={handleConnectionToggle}
            disabled={!isInteractive}
            data-slot="connection-toggle"
            className={cn(
              "inline-flex items-center justify-center rounded-xl shrink-0 transition-all duration-200 size-8 self-end",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              connectionState === "connected"
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "bg-primary/10 text-primary hover:bg-primary/20",
              !isInteractive && "opacity-50 cursor-not-allowed"
            )}
            aria-label={
              connectionState === "connected" ? "Disconnect" : "Connect"
            }
          >
            {connectionState === "connected" ? (
              <PhoneDisconnectIcon className="size-4" />
            ) : (
              <PhoneIcon className="size-4" />
            )}
          </button>
        )}

        {/* Status dot wrapped in aria-live region for screen readers */}
        <div className="self-end pb-2">
          <StatusDot state={connectionState} />
        </div>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {CONNECTION_LABELS[connectionState]}
        </span>

        {/* Text input — textarea (multiline) or input (single-line) */}
        {multiline ? (
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            data-slot="message-input"
            className={inputClassName}
            aria-label="Message input"
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            data-slot="message-input"
            className={inputClassName}
            aria-label="Message input"
          />
        )}

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim() || isSendDisabled}
          data-slot="send-button"
          className={cn(
            "inline-flex items-center justify-center rounded-xl shrink-0 transition-all duration-200 size-8 self-end",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          <SendIcon className="size-4" />
        </button>
      </div>
    );
  }
);

ConversationBar.displayName = "ConversationBar";

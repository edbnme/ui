"use client";

import * as React from "react";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AgentConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting";

export interface ConversationBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Called when the user sends a text message */
  onSend?: (message: string) => void;
  /** Called when the user presses connect */
  onConnect?: () => void;
  /** Called when the user presses disconnect */
  onDisconnect?: () => void;
  /** Current connection state. Default: "disconnected" */
  connectionState?: AgentConnectionState;
  /** Placeholder text for the input. Default: "Type a message…" */
  placeholder?: string;
  /** Whether to show the connection toggle button. Default: true */
  showConnectionToggle?: boolean;
  /** Whether the send button is disabled. Default: false */
  isSendDisabled?: boolean;
}

// ---------------------------------------------------------------------------
// StatusDot
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// ConversationBar
// ---------------------------------------------------------------------------

export const ConversationBar = React.forwardRef<
  HTMLDivElement,
  ConversationBarProps
>(
  (
    {
      onSend,
      onConnect,
      onDisconnect,
      connectionState = "disconnected",
      placeholder = "Type a message…",
      showConnectionToggle = true,
      isSendDisabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSend = useCallback(() => {
      const trimmed = value.trim();
      if (!trimmed || isSendDisabled) return;
      onSend?.(trimmed);
      setValue("");
      inputRef.current?.focus();
    }, [value, isSendDisabled, onSend]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    return (
      <div
        ref={ref}
        data-slot="conversation-bar"
        data-connection={connectionState}
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm p-2",
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
              "inline-flex items-center justify-center rounded-xl shrink-0 transition-all duration-200 size-8",
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

        {/* Status dot */}
        <StatusDot state={connectionState} />

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          data-slot="message-input"
          className="min-w-0 flex-1 bg-transparent text-sm px-3 py-1.5 outline-none placeholder:text-muted-foreground/50"
          aria-label="Message input"
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!value.trim() || isSendDisabled}
          data-slot="send-button"
          className={cn(
            "inline-flex items-center justify-center rounded-xl shrink-0 transition-all duration-200 size-8",
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

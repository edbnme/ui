"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronsUpDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Voice {
  /** Unique voice identifier (matches ElevenLabs.Voice.voiceId) */
  voiceId: string;
  /** Display name */
  name: string;
  /** Optional preview audio URL */
  previewUrl?: string;
  /** Optional labels (e.g., accent, gender, age, description, use_case) */
  labels?: Record<string, string | undefined>;
  /** Optional description */
  description?: string;
  /** Optional category */
  category?: string;
}

export interface VoicePickerProps {
  /** List of available voices */
  voices: Voice[];
  /** Selected voice ID (controlled) */
  value?: string;
  /** Called when selection changes */
  onValueChange?: (voiceId: string) => void;
  /** Placeholder text. Default: "Select a voice…" */
  placeholder?: string;
  /** Optional CSS classes for the trigger button */
  className?: string;
  /** Control popover open state */
  open?: boolean;
  /** Callback when popover open state changes */
  onOpenChange?: (open: boolean) => void;
}

// ---------------------------------------------------------------------------
// useAudioPreview
// ---------------------------------------------------------------------------

function useAudioPreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const play = useCallback((voiceId: string, url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingId(voiceId);

    audio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
    };

    audio.onerror = () => {
      setPlayingId(null);
      audioRef.current = null;
    };

    audio.play().catch(() => {
      setPlayingId(null);
      audioRef.current = null;
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { playingId, play, stop };
}

// ---------------------------------------------------------------------------
// VoicePickerItem
// ---------------------------------------------------------------------------

export interface VoicePickerItemProps {
  voice: Voice;
  isSelected: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onPreviewPlay: () => void;
  onPreviewStop: () => void;
}

export function VoicePickerItem({
  voice,
  isSelected,
  isPlaying,
  onSelect,
  onPreviewPlay,
  onPreviewStop,
}: VoicePickerItemProps) {
  const labelParts = [
    voice.labels?.accent,
    voice.labels?.gender,
    voice.labels?.age,
  ].filter(Boolean);

  return (
    <div
      data-slot="voice-picker-item"
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 cursor-pointer transition-all duration-200",
        "hover:bg-accent/50",
        isSelected && "bg-accent ring-1 ring-ring"
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
    >
      {/* Selection indicator */}
      <div
        className={cn(
          "size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
          isSelected
            ? "border-primary bg-primary"
            : "border-muted-foreground/30"
        )}
      >
        {isSelected && <CheckIcon className="size-3 text-primary-foreground" />}
      </div>

      {/* Voice info */}
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">{voice.name}</div>
        {voice.description && (
          <div className="text-xs text-muted-foreground truncate">
            {voice.description}
          </div>
        )}
        {labelParts.length > 0 && (
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs mt-0.5">
            {labelParts.map((label, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>·</span>}
                <span className="capitalize">{label}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Preview button */}
      {voice.previewUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            isPlaying ? onPreviewStop() : onPreviewPlay();
          }}
          data-slot="preview-button"
          className={cn(
            "inline-flex items-center justify-center size-8 rounded-full shrink-0 transition-colors",
            "hover:bg-accent",
            isPlaying
              ? "text-destructive"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={isPlaying ? "Stop preview" : "Play preview"}
        >
          {isPlaying ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="size-4" />
          )}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// VoicePicker
// ---------------------------------------------------------------------------

export function VoicePicker({
  voices,
  value,
  onValueChange,
  placeholder = "Select a voice…",
  className,
  open,
  onOpenChange,
}: VoicePickerProps) {
  const { playingId, play, stop } = useAudioPreview();
  const [search, setSearch] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled
    ? (v: boolean) => onOpenChange?.(v)
    : setInternalOpen;

  const selectedVoice = voices.find((v) => v.voiceId === value);

  // Filter voices by search
  const filteredVoices = search
    ? voices.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    : voices;

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setIsOpen]);

  return (
    <div ref={dropdownRef} data-slot="voice-picker" className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        data-slot="voice-picker-trigger"
        className={cn(
          "flex w-full items-center justify-between rounded-xl border border-border/50 bg-background px-3 py-2 text-sm",
          "hover:bg-accent/50 transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedVoice ? (
          <span className="truncate">{selectedVoice.name}</span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          data-slot="voice-picker-dropdown"
          className={cn(
            "absolute z-50 mt-1 w-full rounded-xl border border-border/50 bg-background shadow-lg",
            "max-h-[300px] flex flex-col overflow-hidden"
          )}
        >
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <SearchIcon className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search voices…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>

          {/* Voice list */}
          <div
            className="overflow-y-auto p-1"
            role="listbox"
            aria-label="Select a voice"
          >
            {filteredVoices.length === 0 ? (
              <div className="text-center text-muted-foreground/50 py-6 text-sm">
                No voices found
              </div>
            ) : (
              filteredVoices.map((voice) => (
                <VoicePickerItem
                  key={voice.voiceId}
                  voice={voice}
                  isSelected={voice.voiceId === value}
                  isPlaying={playingId === voice.voiceId}
                  onSelect={() => {
                    onValueChange?.(voice.voiceId);
                  }}
                  onPreviewPlay={() => play(voice.voiceId, voice.previewUrl!)}
                  onPreviewStop={stop}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

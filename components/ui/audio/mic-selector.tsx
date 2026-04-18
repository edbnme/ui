"use client";

/**
 * Mic Selector
 * @registryCategory audio
 */

import { useEffect, useRef, useState } from "react";

import { useAudioDevices as useSharedAudioDevices } from "@/hooks/use-audio-devices";
import { cn } from "@/lib/utils";
import { LiveWaveform } from "./live-waveform";

// ---- ICONS -----------------------------------------------------------------

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function MicOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12" />
      <path d="M5 10a7 7 0 0 0 12 5" />
      <path d="M15 9.34V4a3 3 0 0 0-5.68-1.33" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function ChevronUpDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ---- TYPES -----------------------------------------------------------------

export interface AudioDevice {
  deviceId: string;
  label: string;
  groupId: string;
}

export interface MicSelectorProps {
  value?: string;
  onValueChange?: (deviceId: string) => void;
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  disabled?: boolean;
  className?: string;
}

// ---- COMPONENT -------------------------------------------------------------

export function MicSelector({
  value,
  onValueChange,
  muted,
  onMutedChange,
  disabled,
  className,
}: MicSelectorProps) {
  const { devices, loading, error, hasPermission, loadDevices } =
    useAudioDevices();
  const [selectedDevice, setSelectedDevice] = useState<string>(value || "");
  const [internalMuted, setInternalMuted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMuted = muted !== undefined ? muted : internalMuted;

  useEffect(() => {
    if (value !== undefined) {
      setSelectedDevice(value);
    }
  }, [value]);

  const defaultDeviceId = devices[0]?.deviceId || "";

  useEffect(() => {
    if (!selectedDevice && defaultDeviceId) {
      setSelectedDevice(defaultDeviceId);
      onValueChange?.(defaultDeviceId);
    }
  }, [defaultDeviceId, onValueChange, selectedDevice]);

  const currentDevice = devices.find(
    (device) => device.deviceId === selectedDevice
  ) ||
    devices[0] || {
      label: loading ? "Loading..." : "No microphone",
      deviceId: "",
      groupId: "",
    };

  const handleDeviceSelect = (deviceId: string, event?: React.MouseEvent) => {
    event?.preventDefault();
    setSelectedDevice(deviceId);
    onValueChange?.(deviceId);
  };

  const handleDropdownOpenChange = async (open: boolean) => {
    setIsDropdownOpen(open);
    if (open && !hasPermission && !loading) {
      await loadDevices();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    if (muted === undefined) {
      setInternalMuted(nextMuted);
    }
    onMutedChange?.(nextMuted);
  };

  const isPreviewActive = isDropdownOpen && !isMuted;

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isDropdownOpen]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      data-slot="mic-selector"
    >
      <button
        type="button"
        onClick={() => void handleDropdownOpenChange(!isDropdownOpen)}
        disabled={loading || disabled}
        className={cn(
          "hover:bg-accent flex w-40 min-w-0 shrink cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors sm:w-48",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
      >
        {isMuted ? (
          <MicOffIcon className="h-4 w-4 flex-shrink-0" />
        ) : (
          <MicIcon className="h-4 w-4 flex-shrink-0" />
        )}
        <span className="min-w-0 flex-1 truncate text-left text-xs sm:text-sm">
          {currentDevice.label}
        </span>
        <ChevronUpDownIcon className="h-3 w-3 flex-shrink-0" />
      </button>

      {isDropdownOpen && (
        <div className="absolute bottom-full left-1/2 z-50 mb-1 w-72 -translate-x-1/2 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {loading ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Loading devices...
            </div>
          ) : error ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Error: {error}
            </div>
          ) : (
            devices.map((device) => (
              <button
                key={device.deviceId}
                type="button"
                onClick={(event) => handleDeviceSelect(device.deviceId, event)}
                className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <span className="truncate">{device.label}</span>
                {selectedDevice === device.deviceId && (
                  <CheckIcon className="h-4 w-4 flex-shrink-0" />
                )}
              </button>
            ))
          )}
          {devices.length > 0 && (
            <>
              <div className="my-1 h-px bg-border" />
              <div className="flex items-center gap-2 p-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    toggleMute();
                  }}
                  className="inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm hover:bg-accent"
                >
                  {isMuted ? (
                    <MicOffIcon className="h-4 w-4" />
                  ) : (
                    <MicIcon className="h-4 w-4" />
                  )}
                  <span className="text-sm">{isMuted ? "Unmute" : "Mute"}</span>
                </button>
                <div className="bg-accent ml-auto w-16 overflow-hidden rounded-md p-1.5">
                  <LiveWaveform
                    active={isPreviewActive}
                    deviceId={selectedDevice || defaultDeviceId}
                    mode="static"
                    height={15}
                    barWidth={3}
                    barGap={1}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

MicSelector.displayName = "MicSelector";

// ---- HOOK: useAudioDevices -------------------------------------------------

export function useAudioDevices() {
  const {
    devices,
    error,
    hasEnumerated,
    hasPermission,
    isRequesting,
    requestPermission,
  } = useSharedAudioDevices({ kind: "audioinput" });

  return {
    devices: devices.map((device) => ({
      deviceId: device.deviceId,
      label: device.label,
      groupId: device.groupId,
    })),
    loading: !hasEnumerated || isRequesting,
    error,
    hasPermission,
    loadDevices: requestPermission,
  };
}

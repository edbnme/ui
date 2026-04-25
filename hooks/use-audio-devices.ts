"use client";

/**
 * useAudioDevices
 * @registryDescription Hook for enumerating audio input devices with permission handling.
 * @registryVariant audio
 */

import { useCallback, useEffect, useState } from "react";

// ---- TYPES -----------------------------------------------------------------

interface AudioDevice {
  /** Unique device identifier */
  deviceId: string;
  /** Human-readable device label (empty until permission granted) */
  label: string;
  /** Device kind: audioinput, audiooutput, videoinput */
  kind: MediaDeviceKind;
  /** Group ID (devices from same hardware share a groupId) */
  groupId: string;
}

interface UseAudioDevicesOptions {
  /** Filter to specific device kind. Default: "audioinput" */
  kind?: MediaDeviceKind;
  /** Whether to request permission on mount. Default: false */
  requestOnMount?: boolean;
}

interface UseAudioDevicesReturn {
  /** Available audio devices */
  devices: AudioDevice[];
  /** Currently active device ID */
  activeDeviceId: string | null;
  /** Active MediaStream from selected device */
  stream: MediaStream | null;
  /** Whether permission has been granted */
  hasPermission: boolean;
  /** Whether we're requesting permission */
  isRequesting: boolean;
  /** Whether the initial device enumeration has completed */
  hasEnumerated: boolean;
  /** Error message */
  error: string | null;
  /** Request microphone permission and enumerate devices */
  requestPermission: () => Promise<void>;
  /** Select a specific device by ID */
  selectDevice: (deviceId: string) => Promise<void>;
  /** Stop the active stream */
  stopStream: () => void;
}

// ---- HELPERS ---------------------------------------------------------------

function formatDeviceLabel(device: MediaDeviceInfo, kind: MediaDeviceKind) {
  const fallbackPrefix = kind === "audioinput" ? "Microphone" : "Speaker";
  const fallback = `${fallbackPrefix} ${device.deviceId.slice(0, 8)}`;
  return (device.label || fallback).replace(/\s*\([^)]*\)/g, "").trim();
}

function stopTracks(stream: MediaStream | null) {
  if (!stream) {
    return;
  }

  stream.getTracks().forEach((track) => track.stop());
}

// ---- HOOK ------------------------------------------------------------------

export function useAudioDevices(
  options: UseAudioDevicesOptions = {}
): UseAudioDevicesReturn {
  const { kind = "audioinput", requestOnMount = false } = options;

  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasEnumerated, setHasEnumerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enumerateDevices = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.enumerateDevices
    ) {
      setError("MediaDevices API not available");
      setHasEnumerated(true);
      return;
    }

    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const filtered = allDevices
        .filter((device) => device.kind === kind)
        .map((device) => ({
          deviceId: device.deviceId,
          label: formatDeviceLabel(device, kind),
          kind: device.kind,
          groupId: device.groupId,
        }));

      setDevices(filtered);
      setActiveDeviceId((currentDeviceId) => {
        if (
          currentDeviceId &&
          filtered.some((device) => device.deviceId === currentDeviceId)
        ) {
          return currentDeviceId;
        }

        return filtered[0]?.deviceId ?? null;
      });
      setHasEnumerated(true);
    } catch {
      setError("Failed to enumerate devices");
      setHasEnumerated(true);
    }
  }, [kind]);

  const requestPermission = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setError("getUserMedia not available");
      return;
    }

    setIsRequesting(true);
    setError(null);

    try {
      stopTracks(stream);

      const constraints: MediaStreamConstraints = {
        audio: kind === "audioinput" ? true : true,
      };
      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      setStream(mediaStream);
      setHasPermission(true);

      const tracks = mediaStream.getAudioTracks();
      if (tracks.length > 0) {
        const settings = tracks[0].getSettings();
        setActiveDeviceId(settings.deviceId || null);
      }

      await enumerateDevices();
    } catch (err) {
      if (err instanceof DOMException) {
        switch (err.name) {
          case "NotAllowedError":
            setError("Microphone permission denied");
            break;
          case "NotFoundError":
            setError("No microphone found");
            break;
          case "NotReadableError":
            setError("Microphone is in use by another application");
            break;
          default:
            setError(`Microphone error: ${err.message}`);
        }
      } else {
        setError("Failed to access microphone");
      }
    } finally {
      setIsRequesting(false);
      setHasEnumerated(true);
    }
  }, [enumerateDevices, kind, stream]);

  const selectDevice = useCallback(
    async (deviceId: string) => {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        return;
      }

      stopTracks(stream);
      setError(null);
      setIsRequesting(true);

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } },
        });
        setStream(mediaStream);
        setActiveDeviceId(deviceId);
        setHasPermission(true);
        await enumerateDevices();
      } catch {
        setError("Failed to switch device");
      } finally {
        setIsRequesting(false);
        setHasEnumerated(true);
      }
    },
    [enumerateDevices, stream]
  );

  const stopStream = useCallback(() => {
    stopTracks(stream);
    setStream(null);
    setActiveDeviceId(null);
  }, [stream]);

  useEffect(() => {
    if (requestOnMount) {
      void requestPermission();
      return;
    }

    void enumerateDevices();
  }, [enumerateDevices, requestOnMount, requestPermission]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      return;
    }

    const handler = () => {
      void enumerateDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handler);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handler);
    };
  }, [enumerateDevices]);

  useEffect(() => {
    return () => {
      stopTracks(stream);
    };
  }, [stream]);

  return {
    devices,
    activeDeviceId,
    stream,
    hasPermission,
    isRequesting,
    hasEnumerated,
    error,
    requestPermission,
    selectDevice,
    stopStream,
  };
}

export type { AudioDevice, UseAudioDevicesOptions, UseAudioDevicesReturn };

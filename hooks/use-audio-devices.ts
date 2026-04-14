"use client";

import { useCallback, useEffect, useState } from "react";

// ---- TYPES ------------------------------------------------------------------

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
  /** Error message */
  error: string | null;
  /** Request microphone permission and enumerate devices */
  requestPermission: () => Promise<void>;
  /** Select a specific device by ID */
  selectDevice: (deviceId: string) => Promise<void>;
  /** Stop the active stream */
  stopStream: () => void;
}

// ---- HOOK -------------------------------------------------------------------

export function useAudioDevices(
  options: UseAudioDevicesOptions = {}
): UseAudioDevicesReturn {
  const { kind = "audioinput", requestOnMount = false } = options;

  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enumerate devices (only returns labels after permission is granted)
  const enumerateDevices = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.enumerateDevices
    ) {
      setError("MediaDevices API not available");
      return;
    }

    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const filtered = allDevices
        .filter((d) => d.kind === kind)
        .map((d) => ({
          deviceId: d.deviceId,
          label:
            d.label ||
            `${kind === "audioinput" ? "Microphone" : "Speaker"} ${d.deviceId.slice(0, 5)}`,
          kind: d.kind,
          groupId: d.groupId,
        }));
      setDevices(filtered);
    } catch {
      setError("Failed to enumerate devices");
    }
  }, [kind]);

  // Request permission
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
      const constraints: MediaStreamConstraints =
        kind === "audioinput" ? { audio: true } : { audio: true };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);

      // Get the active device ID from the track
      const tracks = mediaStream.getAudioTracks();
      if (tracks.length > 0) {
        const settings = tracks[0].getSettings();
        setActiveDeviceId(settings.deviceId || null);
      }

      // Now enumerate with labels available
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
    }
  }, [kind, enumerateDevices]);

  // Select a specific device
  const selectDevice = useCallback(
    async (deviceId: string) => {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        return;
      }

      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      setError(null);
      setIsRequesting(true);

      try {
        const constraints: MediaStreamConstraints = {
          audio: { deviceId: { exact: deviceId } },
        };
        const mediaStream =
          await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        setActiveDeviceId(deviceId);
      } catch {
        setError("Failed to switch device");
      } finally {
        setIsRequesting(false);
      }
    },
    [stream]
  );

  // Stop stream
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
      setActiveDeviceId(null);
    }
  }, [stream]);

  // Request on mount if option is set
  useEffect(() => {
    if (requestOnMount) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for device changes (hot-plug)
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;

    const handler = () => {
      enumerateDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handler);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handler);
    };
  }, [enumerateDevices]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    devices,
    activeDeviceId,
    stream,
    hasPermission,
    isRequesting,
    error,
    requestPermission,
    selectDevice,
    stopStream,
  };
}

export type { AudioDevice, UseAudioDevicesOptions, UseAudioDevicesReturn };

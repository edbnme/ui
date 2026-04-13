/**
 * Audio hook registry configuration
 *
 * NOTE: Keys use "use-audio-*" or "use-*" prefix.
 * The `variant: "audio"` field distinguishes these from static hooks.
 *
 * @see update-registry.mjs for the main orchestrator
 */

export const audioHookComponents = {
  "use-audio-player": {
    type: "registry:hook",
    title: "useAudioPlayer",
    description:
      "Hook for controlling audio playback with play, pause, seek, volume, and speed.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-audio-player.ts", type: "registry:hook" }],
    variant: "audio",
  },

  "use-audio-volume": {
    type: "registry:hook",
    title: "useAudioVolume",
    description:
      "Hook that tracks real-time volume level from an audio source using Web Audio API AnalyserNode.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-audio-volume.ts", type: "registry:hook" }],
    variant: "audio",
  },

  "use-audio-devices": {
    type: "registry:hook",
    title: "useAudioDevices",
    description:
      "Hook for enumerating audio input devices with permission handling.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-audio-devices.ts", type: "registry:hook" }],
    variant: "audio",
  },

  "use-multiband-volume": {
    type: "registry:hook",
    title: "useMultibandVolume",
    description:
      "Hook that splits audio frequency data into configurable bands for equalizer visualization.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-multiband-volume.ts", type: "registry:hook" }],
    variant: "audio",
  },

  "use-bar-animator": {
    type: "registry:hook",
    title: "useBarAnimator",
    description:
      "Hook that provides smooth bar animation for audio visualizers with decay and randomization.",
    dependencies: [],
    registryDependencies: [],
    inlineDependencies: [],
    files: [{ path: "hooks/use-bar-animator.ts", type: "registry:hook" }],
    variant: "audio",
  },
};

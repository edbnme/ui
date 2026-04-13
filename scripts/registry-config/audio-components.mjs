/**
 * Audio component registry configuration
 *
 * NOTE: Keys use "audio-" prefix to avoid name collisions with static components.
 * The `variant: "audio"` field distinguishes these from static/maps variants.
 *
 * @see update-registry.mjs for the main orchestrator
 */

export const audioComponents = {
  // ===========================================================================
  // Phase 2 — Core Chat Components
  // ===========================================================================

  "audio-message": {
    type: "registry:ui",
    title: "Message",
    description:
      "Chat message bubble with role-based styling (user/assistant), avatar, and alignment.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/audio/message.tsx", type: "registry:ui" }],
    variant: "audio",
  },

  "audio-conversation": {
    type: "registry:ui",
    title: "Conversation",
    description:
      "Scrollable message container with auto-scroll to bottom using use-stick-to-bottom.",
    dependencies: ["use-stick-to-bottom"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/audio/conversation.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  "audio-response": {
    type: "registry:ui",
    title: "Response",
    description:
      "Streaming markdown response renderer using streamdown with syntax highlighting.",
    dependencies: ["streamdown", "@streamdown/code"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/audio/response.tsx", type: "registry:ui" }],
    variant: "audio",
  },

  "audio-chat-input": {
    type: "registry:ui",
    title: "Chat Input",
    description:
      "Multi-modal chat input with auto-resize textarea, voice toggle, file attachments, and submit on Enter.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/audio/chat-input.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  "audio-thinking-indicator": {
    type: "registry:ui",
    title: "Thinking Indicator",
    description:
      "Animated thinking indicator with three variants: bouncing dots, pulse ring, and shimmer line.",
    dependencies: ["motion/react", "class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: ["motion-lib"],
    files: [
      {
        path: "components/ui/audio/thinking-indicator.tsx",
        type: "registry:ui",
      },
    ],
    variant: "audio",
  },

  "audio-prompt-suggestions": {
    type: "registry:ui",
    title: "Prompt Suggestions",
    description:
      "Grid of clickable prompt suggestion cards with icons and descriptions.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      {
        path: "components/ui/audio/prompt-suggestions.tsx",
        type: "registry:ui",
      },
    ],
    variant: "audio",
  },

  "audio-feedback": {
    type: "registry:ui",
    title: "Feedback",
    description:
      "Thumbs up/down action bar with copy and regenerate for AI messages.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/audio/feedback.tsx", type: "registry:ui" }],
    variant: "audio",
  },

  "audio-token-counter": {
    type: "registry:ui",
    title: "Token Counter",
    description:
      "Token usage progress bar with model info badge and cost display.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/audio/token-counter.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  // ===========================================================================
  // Phase 3 — Audio Components
  // ===========================================================================

  "audio-player": {
    type: "registry:ui",
    title: "Audio Player",
    description:
      "Full-featured audio player with play/pause, scrubbing, volume, and speed controls.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: ["use-audio-player"],
    files: [
      { path: "components/ui/audio/audio-player.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  "audio-scrub-bar": {
    type: "registry:ui",
    title: "Scrub Bar",
    description:
      "Audio timeline scrubber with progress display and click-to-seek.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/audio/scrub-bar.tsx", type: "registry:ui" }],
    variant: "audio",
  },

  "audio-live-waveform": {
    type: "registry:ui",
    title: "Live Waveform",
    description:
      "Real-time waveform visualization from a live audio stream using Web Audio API.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/audio/live-waveform.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  "audio-bar-visualizer": {
    type: "registry:ui",
    title: "Bar Visualizer",
    description:
      "Multi-band frequency bar equalizer visualization with customizable band count.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      {
        path: "components/ui/audio/bar-visualizer.tsx",
        type: "registry:ui",
      },
    ],
    variant: "audio",
  },

  "audio-waveform": {
    type: "registry:ui",
    title: "Waveform",
    description:
      "Static waveform display for pre-recorded audio with progress overlay.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/audio/waveform.tsx", type: "registry:ui" }],
    variant: "audio",
  },

  "audio-recorder": {
    type: "registry:ui",
    title: "Audio Recorder",
    description:
      "Audio recording component with timer, pause/resume, levels visualization, and download.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      {
        path: "components/ui/audio/audio-recorder.tsx",
        type: "registry:ui",
      },
    ],
    variant: "audio",
  },

  "audio-mic-selector": {
    type: "registry:ui",
    title: "Mic Selector",
    description:
      "Microphone input device selector dropdown with permission handling.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: ["use-audio-devices"],
    files: [
      { path: "components/ui/audio/mic-selector.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  "audio-voice-button": {
    type: "registry:ui",
    title: "Voice Button",
    description:
      "Push-to-talk style voice button with idle/listening/speaking states and mini waveform.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/audio/voice-button.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  // ===========================================================================
  // Phase 4 — Display & Interaction Components
  // ===========================================================================

  "audio-matrix": {
    type: "registry:ui",
    title: "Matrix",
    description:
      "SVG dot-matrix display with animated presets (idle, thinking, speaking, off).",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/audio/matrix.tsx", type: "registry:ui" }],
    variant: "audio",
  },

  "audio-shimmering-text": {
    type: "registry:ui",
    title: "Shimmering Text",
    description:
      "Animated gradient shimmer text effect with viewport-triggered animation.",
    dependencies: ["motion/react", "class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      {
        path: "components/ui/audio/shimmering-text-audio.tsx",
        type: "registry:ui",
      },
    ],
    variant: "audio",
  },

  "audio-code-block": {
    type: "registry:ui",
    title: "Code Block",
    description:
      "Syntax-highlighted code block with copy button, line numbers, and language badge. Requires shiki and a useShikiHighlight hook.",
    dependencies: [
      "class-variance-authority",
      "@phosphor-icons/react",
      "shiki",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/audio/code-block.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  "audio-speech-input": {
    type: "registry:ui",
    title: "Speech Input",
    description:
      "Web Speech API powered speech-to-text input with permission handling and error states.",
    dependencies: ["class-variance-authority", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/audio/speech-input.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  "audio-conversation-bar": {
    type: "registry:ui",
    title: "Conversation Bar",
    description:
      "Text input with send button and connection toggle for voice/chat sessions.",
    dependencies: ["class-variance-authority", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      {
        path: "components/ui/audio/conversation-bar.tsx",
        type: "registry:ui",
      },
    ],
    variant: "audio",
  },

  "audio-transcript-viewer": {
    type: "registry:ui",
    title: "Transcript Viewer",
    description:
      "Real-time transcript display with per-character highlighting, auto-scroll, and timestamp seek.",
    dependencies: ["class-variance-authority"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      {
        path: "components/ui/audio/transcript-viewer.tsx",
        type: "registry:ui",
      },
    ],
    variant: "audio",
  },

  "audio-voice-picker": {
    type: "registry:ui",
    title: "Voice Picker",
    description:
      "Selectable voice list with labels, descriptions, and audio preview playback.",
    dependencies: ["class-variance-authority", "@phosphor-icons/react"],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [
      { path: "components/ui/audio/voice-picker.tsx", type: "registry:ui" },
    ],
    variant: "audio",
  },

  // ===========================================================================
  // Phase 5 — Orb (Optional Heavy)
  // ===========================================================================

  "audio-orb": {
    type: "registry:ui",
    title: "Orb",
    description:
      "Three.js animated orb with state-driven distortion and CSS-only fallback. Optional — adds ~1MB bundle (three + @react-three/fiber + @react-three/drei).",
    dependencies: [
      "class-variance-authority",
      "@react-three/fiber",
      "@react-three/drei",
      "three",
    ],
    registryDependencies: ["utils"],
    inlineDependencies: [],
    files: [{ path: "components/ui/audio/orb.tsx", type: "registry:ui" }],
    variant: "audio",
  },
};

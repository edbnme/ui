"use client";


/**
 * Orb
 * @registryCategory display
 */

import { useEffect, useMemo, useRef, type RefObject } from "react";
import dynamic from "next/dynamic";

// ---- TYPES ------------------------------------------------------------------

export type AgentState = null | "thinking" | "listening" | "talking";

type OrbProps = {
  colors?: [string, string];
  colorsRef?: RefObject<[string, string]>;
  resizeDebounce?: number;
  seed?: number;
  agentState?: AgentState;
  volumeMode?: "auto" | "manual";
  manualInput?: number;
  manualOutput?: number;
  inputVolumeRef?: RefObject<number>;
  outputVolumeRef?: RefObject<number>;
  getInputVolume?: () => number;
  getOutputVolume?: () => number;
  className?: string;
};

// ---- HELPERS ----------------------------------------------------------------

function splitmix32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

// ---- MODULE CACHE (lazy-loaded for SSR safety) ------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let r3fCache: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dreiCache: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let threeCache: any = null;

function getR3F(): typeof import("@react-three/fiber") {
  if (!r3fCache) r3fCache = require("@react-three/fiber");
  return r3fCache;
}

function getDrei(): typeof import("@react-three/drei") {
  if (!dreiCache) dreiCache = require("@react-three/drei");
  return dreiCache;
}

function getTHREE(): typeof import("three") {
  if (!threeCache) threeCache = require("three");
  return threeCache;
}

// ---- SHADERS ----------------------------------------------------------------

const vertexShader = /* glsl */ `
uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uAnimation;
uniform float uInverted;
uniform float uOffsets[7];
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uInputVolume;
uniform float uOutputVolume;
uniform float uOpacity;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

const float PI = 3.14159265358979323846;

bool drawOval(vec2 polarUv, vec2 polarCenter, float a, float b, bool reverseGradient, float softness, out vec4 color) {
    vec2 p = polarUv - polarCenter;
    float oval = (p.x * p.x) / (a * a) + (p.y * p.y) / (b * b);
    float edge = smoothstep(1.0, 1.0 - softness, oval);
    if (edge > 0.0) {
        float gradient = reverseGradient ? (1.0 - (p.x / a + 1.0) / 2.0) : ((p.x / a + 1.0) / 2.0);
        gradient = mix(0.5, gradient, 0.1);
        color = vec4(vec3(gradient), 0.85 * edge);
        return true;
    }
    return false;
}

vec3 colorRamp(float grayscale, vec3 color1, vec3 color2, vec3 color3, vec3 color4) {
    if (grayscale < 0.33) {
        return mix(color1, color2, grayscale * 3.0);
    } else if (grayscale < 0.66) {
        return mix(color2, color3, (grayscale - 0.33) * 3.0);
    } else {
        return mix(color3, color4, (grayscale - 0.66) * 3.0);
    }
}

vec2 hash2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(
        mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
    return 0.5 + 0.5 * n;
}

float sharpRing(vec3 decomposed, float time) {
    float ringStart = 1.0;
    float ringWidth = 0.3;
    float noiseScale = 5.0;
    float noise = mix(
        noise2D(vec2(decomposed.x, time) * noiseScale),
        noise2D(vec2(decomposed.y, time) * noiseScale),
        decomposed.z
    );
    noise = (noise - 0.5) * 2.5;
    return ringStart + noise * ringWidth * 1.5;
}

float smoothRing(vec3 decomposed, float time) {
    float ringStart = 0.9;
    float ringWidth = 0.2;
    float noiseScale = 6.0;
    float noise = mix(
        noise2D(vec2(decomposed.x, time) * noiseScale),
        noise2D(vec2(decomposed.y, time) * noiseScale),
        decomposed.z
    );
    noise = (noise - 0.5) * 5.0;
    return ringStart + noise * ringWidth;
}

float flow(vec3 decomposed, float time) {
    return mix(
        texture2D(uPerlinTexture, vec2(time, decomposed.x / 2.0)).r,
        texture2D(uPerlinTexture, vec2(time, decomposed.y / 2.0)).r,
        decomposed.z
    );
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float radius = length(uv);
    float theta = atan(uv.y, uv.x);
    if (theta < 0.0) theta += 2.0 * PI;

    vec3 decomposed = vec3(
        theta / (2.0 * PI),
        mod(theta / (2.0 * PI) + 0.5, 1.0) + 1.0,
        abs(theta / PI - 1.0)
    );

    float noise = flow(decomposed, radius * 0.03 - uAnimation * 0.2) - 0.5;
    theta += noise * mix(0.08, 0.25, uOutputVolume);

    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

    float originalCenters[7];
    originalCenters[0] = 0.0;
    originalCenters[1] = 0.5 * PI;
    originalCenters[2] = 1.0 * PI;
    originalCenters[3] = 1.5 * PI;
    originalCenters[4] = 2.0 * PI;
    originalCenters[5] = 2.5 * PI;
    originalCenters[6] = 3.0 * PI;

    float centers[7];
    for (int i = 0; i < 7; i++) {
        centers[i] = originalCenters[i] + 0.5 * sin(uTime / 20.0 + uOffsets[i]);
    }

    float a, b;
    vec4 ovalColor;

    for (int i = 0; i < 7; i++) {
        float tnoise = texture2D(uPerlinTexture, vec2(mod(centers[i] + uTime * 0.05, 1.0), 0.5)).r;
        a = 0.5 + tnoise * 0.3;
        b = tnoise * mix(3.5, 2.5, uInputVolume);
        bool reverseGradient = (i / 2 * 2 != i);

        float distTheta = min(
            abs(theta - centers[i]),
            min(
                abs(theta + 2.0 * PI - centers[i]),
                abs(theta - 2.0 * PI - centers[i])
            )
        );
        float distRadius = radius;
        float softness = 0.6;

        if (drawOval(vec2(distTheta, distRadius), vec2(0.0, 0.0), a, b, reverseGradient, softness, ovalColor)) {
            color.rgb = mix(color.rgb, ovalColor.rgb, ovalColor.a);
            color.a = max(color.a, ovalColor.a);
        }
    }

    float ringRadius1 = sharpRing(decomposed, uTime * 0.1);
    float ringRadius2 = smoothRing(decomposed, uTime * 0.1);

    float inputRadius1 = radius + uInputVolume * 0.2;
    float inputRadius2 = radius + uInputVolume * 0.15;
    float opacity1 = mix(0.2, 0.6, uInputVolume);
    float opacity2 = mix(0.15, 0.45, uInputVolume);

    float ringAlpha1 = (inputRadius2 >= ringRadius1) ? opacity1 : 0.0;
    float ringAlpha2 = smoothstep(ringRadius2 - 0.05, ringRadius2 + 0.05, inputRadius1) * opacity2;

    float totalRingAlpha = max(ringAlpha1, ringAlpha2);

    vec3 ringColor = vec3(1.0);
    color.rgb = 1.0 - (1.0 - color.rgb) * (1.0 - ringColor * totalRingAlpha);

    vec3 color1 = vec3(0.0, 0.0, 0.0);
    vec3 color2 = uColor1;
    vec3 color3 = uColor2;
    vec3 color4 = vec3(1.0, 1.0, 1.0);

    float luminance = mix(color.r, 1.0 - color.r, uInverted);
    color.rgb = colorRamp(luminance, color1, color2, color3, color4);

    color.a *= uOpacity;

    gl_FragColor = color;
}
`;

// ---- SCENE COMPONENT --------------------------------------------------------

function Scene({
  colors,
  colorsRef,
  seed,
  agentState,
  volumeMode,
  manualInput,
  manualOutput,
  inputVolumeRef,
  outputVolumeRef,
  getInputVolume,
  getOutputVolume,
}: {
  colors: [string, string];
  colorsRef?: RefObject<[string, string]>;
  seed?: number;
  agentState: AgentState;
  volumeMode: "auto" | "manual";
  manualInput?: number;
  manualOutput?: number;
  inputVolumeRef?: RefObject<number>;
  outputVolumeRef?: RefObject<number>;
  getInputVolume?: () => number;
  getOutputVolume?: () => number;
}) {
  const THREE = getTHREE();
  const { useFrame, useThree } = getR3F();
  const { useTexture } = getDrei();

  const { gl } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const circleRef = useRef<any>(null);
  const initialColorsRef = useRef<[string, string]>(colors);
  const targetColor1Ref = useRef(new THREE.Color(colors[0]));
  const targetColor2Ref = useRef(new THREE.Color(colors[1]));
  const animSpeedRef = useRef(0.1);
  const perlinNoiseTexture = useTexture(
    "https://storage.googleapis.com/eleven-public-cdn/images/perlin-noise.png"
  );

  const agentRef = useRef<AgentState>(agentState);
  const modeRef = useRef<"auto" | "manual">(volumeMode);
  const manualInRef = useRef<number>(manualInput ?? 0);
  const manualOutRef = useRef<number>(manualOutput ?? 0);
  const curInRef = useRef(0);
  const curOutRef = useRef(0);

  useEffect(() => {
    agentRef.current = agentState;
  }, [agentState]);

  useEffect(() => {
    modeRef.current = volumeMode;
  }, [volumeMode]);

  useEffect(() => {
    manualInRef.current = clamp01(
      manualInput ?? inputVolumeRef?.current ?? getInputVolume?.() ?? 0
    );
  }, [manualInput, inputVolumeRef, getInputVolume]);

  useEffect(() => {
    manualOutRef.current = clamp01(
      manualOutput ?? outputVolumeRef?.current ?? getOutputVolume?.() ?? 0
    );
  }, [manualOutput, outputVolumeRef, getOutputVolume]);

  const random = useMemo(
    () => splitmix32(seed ?? Math.floor(Math.random() * 2 ** 32)),
    [seed]
  );
  const offsets = useMemo(
    () =>
      new Float32Array(Array.from({ length: 7 }, () => random() * Math.PI * 2)),
    [random]
  );

  useEffect(() => {
    targetColor1Ref.current = new THREE.Color(colors[0]);
    targetColor2Ref.current = new THREE.Color(colors[1]);
  }, [colors, THREE]);

  useEffect(() => {
    const apply = () => {
      if (!circleRef.current) return;
      const isDark = document.documentElement.classList.contains("dark");
      circleRef.current.material.uniforms.uInverted.value = isDark ? 1 : 0;
    };

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useFrame((_: unknown, delta: number) => {
    const mat = circleRef.current?.material;
    if (!mat) return;
    const live = colorsRef?.current;
    if (live) {
      if (live[0]) targetColor1Ref.current.set(live[0]);
      if (live[1]) targetColor2Ref.current.set(live[1]);
    }
    const u = mat.uniforms;
    u.uTime.value += delta * 0.5;

    if (u.uOpacity.value < 1) {
      u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 2);
    }

    let targetIn = 0;
    let targetOut = 0.3;
    if (modeRef.current === "manual") {
      targetIn = clamp01(
        manualInput ?? inputVolumeRef?.current ?? getInputVolume?.() ?? 0
      );
      targetOut = clamp01(
        manualOutput ?? outputVolumeRef?.current ?? getOutputVolume?.() ?? 0
      );
    } else {
      const t = u.uTime.value * 2;
      if (agentRef.current === null) {
        targetIn = 0;
        targetOut = 0.3;
      } else if (agentRef.current === "listening") {
        targetIn = clamp01(0.55 + Math.sin(t * 3.2) * 0.35);
        targetOut = 0.45;
      } else if (agentRef.current === "talking") {
        targetIn = clamp01(0.65 + Math.sin(t * 4.8) * 0.22);
        targetOut = clamp01(0.75 + Math.sin(t * 3.6) * 0.22);
      } else {
        const base = 0.38 + 0.07 * Math.sin(t * 0.7);
        const wander = 0.05 * Math.sin(t * 2.1) * Math.sin(t * 0.37 + 1.2);
        targetIn = clamp01(base + wander);
        targetOut = clamp01(0.48 + 0.12 * Math.sin(t * 1.05 + 0.6));
      }
    }

    curInRef.current += (targetIn - curInRef.current) * 0.2;
    curOutRef.current += (targetOut - curOutRef.current) * 0.2;

    const targetSpeed = 0.1 + (1 - Math.pow(curOutRef.current - 1, 2)) * 0.9;
    animSpeedRef.current += (targetSpeed - animSpeedRef.current) * 0.12;

    u.uAnimation.value += delta * animSpeedRef.current;
    u.uInputVolume.value = curInRef.current;
    u.uOutputVolume.value = curOutRef.current;

    u.uColor1.value.lerp(targetColor1Ref.current, 0.08);
    u.uColor2.value.lerp(targetColor2Ref.current, 0.08);
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setTimeout(() => {
        gl.forceContextRestore();
      }, 1);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    return () =>
      canvas.removeEventListener("webglcontextlost", onContextLost, false);
  }, [gl]);

  const uniforms = useMemo(() => {
    const THREE_MOD = getTHREE();
    perlinNoiseTexture.wrapS = THREE_MOD.RepeatWrapping;
    perlinNoiseTexture.wrapT = THREE_MOD.RepeatWrapping;
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    return {
      uColor1: new THREE_MOD.Uniform(
        new THREE_MOD.Color(initialColorsRef.current[0])
      ),
      uColor2: new THREE_MOD.Uniform(
        new THREE_MOD.Color(initialColorsRef.current[1])
      ),
      uOffsets: { value: offsets },
      uPerlinTexture: new THREE_MOD.Uniform(perlinNoiseTexture),
      uTime: new THREE_MOD.Uniform(0),
      uAnimation: new THREE_MOD.Uniform(0.1),
      uInverted: new THREE_MOD.Uniform(isDark ? 1 : 0),
      uInputVolume: new THREE_MOD.Uniform(0),
      uOutputVolume: new THREE_MOD.Uniform(0),
      uOpacity: new THREE_MOD.Uniform(0),
    };
  }, [perlinNoiseTexture, offsets]);

  return (
    <mesh ref={circleRef}>
      <circleGeometry args={[3.5, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        transparent={true}
      />
    </mesh>
  );
}

// ---- ORB CANVAS (dynamically imported for SSR safety) -----------------------

function OrbCanvas({
  colors = ["#CADCFC", "#A0B9D1"],
  colorsRef,
  resizeDebounce = 100,
  seed,
  agentState = null,
  volumeMode = "auto",
  manualInput,
  manualOutput,
  inputVolumeRef,
  outputVolumeRef,
  getInputVolume,
  getOutputVolume,
}: Omit<OrbProps, "className">) {
  const { Canvas } = getR3F();

  return (
    <Canvas
      resize={{ debounce: resizeDebounce }}
      gl={{
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
      }}
    >
      <Scene
        colors={colors}
        colorsRef={colorsRef}
        seed={seed}
        agentState={agentState}
        volumeMode={volumeMode}
        manualInput={manualInput}
        manualOutput={manualOutput}
        inputVolumeRef={inputVolumeRef}
        outputVolumeRef={outputVolumeRef}
        getInputVolume={getInputVolume}
        getOutputVolume={getOutputVolume}
      />
    </Canvas>
  );
}

const DynamicOrbCanvas = dynamic(
  () => Promise.resolve({ default: OrbCanvas }),
  { ssr: false }
);

// ---- MAIN COMPONENT ---------------------------------------------------------

export function Orb({
  colors = ["#CADCFC", "#A0B9D1"],
  colorsRef,
  resizeDebounce = 100,
  seed,
  agentState = null,
  volumeMode = "auto",
  manualInput,
  manualOutput,
  inputVolumeRef,
  outputVolumeRef,
  getInputVolume,
  getOutputVolume,
  className,
}: OrbProps) {
  return (
    <div className={className ?? "relative h-full w-full"}>
      <DynamicOrbCanvas
        colors={colors}
        colorsRef={colorsRef}
        resizeDebounce={resizeDebounce}
        seed={seed}
        agentState={agentState}
        volumeMode={volumeMode}
        manualInput={manualInput}
        manualOutput={manualOutput}
        inputVolumeRef={inputVolumeRef}
        outputVolumeRef={outputVolumeRef}
        getInputVolume={getInputVolume}
        getOutputVolume={getOutputVolume}
      />
    </div>
  );
}

export type { OrbProps };

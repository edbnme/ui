/**
 * Slide to Unlock Component
 *
 * A sleek, interactive slider inspired by the classic iPhone OS "slide to unlock" gesture.
 * Features drag-to-unlock, smooth animations, and customizable appearance.
 *
 * Credits: Original implementation by @ncdai (https://chanhdai.com/components/slide-to-unlock)
 *
 * @packageDocumentation
 */

"use client";

import * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";

import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

type SlideToUnlockContextValue = {
  x: MotionValue<number>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  handleWidth: number;
  textOpacity: MotionValue<number>;
  onDragStart: () => void;
  onDragEnd: () => void;
};

// =============================================================================
// CONTEXT
// =============================================================================

const SlideToUnlockContext = createContext<SlideToUnlockContextValue | null>(
  null,
);

function useSlideToUnlock() {
  const context = useContext(SlideToUnlockContext);
  if (!context) {
    throw new Error(
      "SlideToUnlock components must be used within SlideToUnlock",
    );
  }
  return context;
}

// =============================================================================
// ROOT COMPONENT
// =============================================================================

export type SlideToUnlockProps = React.ComponentProps<"div"> & {
  /** Width of the draggable handle in pixels */
  handleWidth?: number;
  /** Callback function triggered when the handle reaches the end */
  onUnlock?: () => void;
};

/**
 * SlideToUnlock Root Component
 *
 * Provides context for all child components and manages the unlock state.
 *
 * @example
 * ```tsx
 * <SlideToUnlock onUnlock={() => console.log('Unlocked!')}>
 *   <SlideToUnlockTrack>
 *     <SlideToUnlockText>
 *       <ShimmeringText text="slide to unlock" />
 *     </SlideToUnlockText>
 *     <SlideToUnlockHandle />
 *   </SlideToUnlockTrack>
 * </SlideToUnlock>
 * ```
 */
export function SlideToUnlock({
  className,
  handleWidth = 56,
  children,
  onUnlock,
  ...props
}: SlideToUnlockProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

  const fadeDistance = handleWidth;
  const textOpacity = useTransform(x, [0, fadeDistance], [1, 0]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);

    const trackWidth = trackRef.current?.offsetWidth || 0;
    const maxX = trackWidth - handleWidth;

    if (x.get() >= maxX) {
      onUnlock?.();
    } else {
      animate(x, 0, { type: "spring", bounce: 0, duration: 0.25 });
    }
  }, [x, onUnlock, handleWidth]);

  return (
    <SlideToUnlockContext.Provider
      value={{
        x,
        trackRef,
        isDragging,
        handleWidth,
        textOpacity,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
      }}
    >
      <div
        data-slot="slide-to-unlock"
        className={cn(
          "w-[216px] rounded-xl bg-zinc-100 p-1 shadow-inner ring ring-black/5 ring-inset",
          "dark:bg-zinc-900 dark:ring-white/10",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SlideToUnlockContext.Provider>
  );
}

SlideToUnlock.displayName = "SlideToUnlock";

// =============================================================================
// TRACK COMPONENT
// =============================================================================

export type SlideToUnlockTrackProps = React.ComponentProps<"div">;

/**
 * SlideToUnlockTrack - Container for text and handle
 *
 * The track defines the draggable area for the handle.
 */
export function SlideToUnlockTrack({
  className,
  children,
  ...props
}: SlideToUnlockTrackProps) {
  const { trackRef } = useSlideToUnlock();

  return (
    <div
      ref={trackRef}
      data-slot="slide-to-unlock-track"
      className={cn(
        "relative flex h-10 items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

SlideToUnlockTrack.displayName = "SlideToUnlockTrack";

// =============================================================================
// TEXT COMPONENT
// =============================================================================

export type SlideToUnlockTextProps = Omit<
  HTMLMotionProps<"div">,
  "children"
> & {
  /** Text content or render function that receives dragging state */
  children:
    | React.ReactNode
    | ((props: { isDragging: boolean }) => React.ReactNode);
};

/**
 * SlideToUnlockText - Label that fades as handle is dragged
 *
 * Accepts children as a render function to access the dragging state,
 * useful for coordinating with ShimmeringText animations.
 *
 * @example
 * ```tsx
 * <SlideToUnlockText>
 *   {({ isDragging }) => (
 *     <ShimmeringText text="slide to unlock" isStopped={isDragging} />
 *   )}
 * </SlideToUnlockText>
 * ```
 */
export function SlideToUnlockText({
  className,
  children,
  style,
  ...props
}: SlideToUnlockTextProps) {
  const { handleWidth, textOpacity, isDragging } = useSlideToUnlock();

  return (
    <motion.div
      data-slot="slide-to-unlock-text"
      data-dragging={isDragging}
      className={cn("pl-1 text-lg font-medium", className)}
      style={{ marginLeft: handleWidth, opacity: textOpacity, ...style }}
      {...props}
    >
      {typeof children === "function" ? children({ isDragging }) : children}
    </motion.div>
  );
}

SlideToUnlockText.displayName = "SlideToUnlockText";

// =============================================================================
// HANDLE COMPONENT
// =============================================================================

export type SlideToUnlockHandleProps = HTMLMotionProps<"div">;

/**
 * Default arrow icon for the handle
 */
const DefaultArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" aria-hidden>
    <path
      d="M237.66,133.66l-96,96A8,8,0,0,1,128,224V184H48a16,16,0,0,1-16-16V88A16,16,0,0,1,48,72h80V32a8,8,0,0,1,13.66-5.66l96,96A8,8,0,0,1,237.66,133.66Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * SlideToUnlockHandle - Draggable handle element
 *
 * The main interactive element that users drag to unlock.
 *
 * @example
 * ```tsx
 * // Default arrow icon
 * <SlideToUnlockHandle />
 *
 * // Custom icon
 * <SlideToUnlockHandle>
 *   <LockIcon />
 * </SlideToUnlockHandle>
 * ```
 */
export function SlideToUnlockHandle({
  className,
  children,
  style,
  ...props
}: SlideToUnlockHandleProps) {
  const { x, trackRef, onDragStart, onDragEnd, handleWidth } =
    useSlideToUnlock();

  return (
    <motion.div
      data-slot="slide-to-unlock-handle"
      className={cn(
        "absolute top-0 left-0 flex h-10 cursor-grab items-center justify-center rounded-lg",
        "bg-white text-zinc-400 shadow-sm active:cursor-grabbing",
        "dark:bg-zinc-700 dark:text-zinc-300",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
        className,
      )}
      style={{ width: handleWidth, x, ...style }}
      drag="x"
      dragDirectionLock
      dragConstraints={trackRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      {...props}
    >
      {children ?? <DefaultArrowIcon />}
    </motion.div>
  );
}

SlideToUnlockHandle.displayName = "SlideToUnlockHandle";

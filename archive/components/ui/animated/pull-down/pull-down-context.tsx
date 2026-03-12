/**
 * PullDownContext — Shared context, types, and hooks for the PullDown component tree.
 * @module pull-down/pull-down-context
 */
"use client";

// =============================================================================
// IMPORTS
// =============================================================================

import * as React from "react";
import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
  type KeyboardEvent,
  type RefObject,
  type MutableRefObject,
} from "react";

// =============================================================================
// TYPES
// =============================================================================

/** Direction the menu expands from trigger */
export type PullDownDirection = "top" | "bottom" | "left" | "right";

/** Anchor point alignment */
export type PullDownAnchor = "start" | "center" | "end";

/** Spring configuration for animations */
export interface PullDownSpringConfig {
  stiffness: number;
  damping: number;
  mass?: number;
}

/** Detailed animation configuration */
export interface PullDownAnimationConfig {
  /** Spring stiffness for shape morph */
  morphStiffness?: number;
  /** Spring damping for shape morph */
  morphDamping?: number;
  /** Spring stiffness for content fade */
  contentStiffness?: number;
  /** Spring damping for content fade */
  contentDamping?: number;
  /** Delay before content appears (seconds) */
  contentDelay?: number;
  /** Scale when content is hidden */
  contentScale?: number;
  /** Blur amount for trigger icon (px) */
  triggerBlur?: number;
  /** Blur amount for content (px) */
  contentBlur?: number;
}

/** Root component props */
export interface PullDownProps {
  children: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Detailed animation configuration */
  animationConfig?: PullDownAnimationConfig;
  /** Close when clicking outside the menu */
  closeOnClickOutside?: boolean;
  /** Close when pressing Escape key */
  closeOnEscape?: boolean;
  /** Enable modal behavior with focus trapping */
  modal?: boolean;
  /** Direction the menu expands from trigger */
  direction?: PullDownDirection;
  /** Anchor point alignment */
  anchor?: PullDownAnchor;
  /** Spring animation duration in seconds (default: 0.25) */
  visualDuration?: number;
  /** Spring animation bounce (default: 0.2) */
  bounce?: number;
}

/** Container component props */
export interface PullDownContainerProps {
  children: ReactNode;
  /** Size of the closed button state - number for square, or { width, height } for rectangular */
  buttonSize?: number | { width: number; height: number };
  /** Fixed width when open */
  menuWidth?: number;
  /** Border radius of the open menu state */
  menuRadius?: number;
  /** Border radius of the closed button state (defaults to pill shape) */
  buttonRadius?: number;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
}

/** Trigger component props */
export interface PullDownTriggerProps {
  children: ReactNode;
  /** Disable the trigger */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
}

/** Content component props */
export interface PullDownContentProps {
  children: ReactNode;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
  /** Callback when content animation completes */
  onAnimationComplete?: () => void;
}

/** Item component props */
export interface PullDownItemProps {
  children: ReactNode;
  /** Called when item is selected */
  onSelect?: () => void;
  /** Disable the item */
  disabled?: boolean;
  /** Close menu after selection */
  closeOnSelect?: boolean;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
}

/** Portal component props */
export interface PullDownPortalProps {
  children: ReactNode;
  /** Container element for the portal */
  container?: HTMLElement | null;
}

/** Overlay component props */
export interface PullDownOverlayProps {
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
  /** Click handler (defaults to closing menu) */
  onClick?: () => void;
}

/** SubMenu component props */
export interface PullDownSubMenuProps {
  children: ReactNode;
  /** Unique identifier for this submenu */
  id: string;
}

/** SubMenuTrigger component props */
export interface PullDownSubMenuTriggerProps {
  /** Static children or render prop receiving isActive state */
  children: ReactNode | ((isActive: boolean) => ReactNode);
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
  /** Disable the trigger */
  disabled?: boolean;
}

/** SubMenuContent component props */
export interface PullDownSubMenuContentProps {
  children: ReactNode;
  /** Additional class names */
  className?: string;
  /** Additional styles */
  style?: CSSProperties;
}

/** Internal context state */
export interface PullDownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: MutableRefObject<HTMLElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  animationConfig: Required<PullDownAnimationConfig>;
  closeOnClickOutside: boolean;
  closeOnEscape: boolean;
  modal: boolean;
  isOpenAnimationCompleteRef: MutableRefObject<boolean>;
  direction: PullDownDirection;
  anchor: PullDownAnchor;
  activeSubmenu: string | null;
  setActiveSubmenu: (id: string | null) => void;
  isSubmenuClosing: boolean;
  visualDuration: number;
  bounce: number;
  disableAnimation: boolean;
}

/** SubMenu context value */
export interface PullDownSubMenuContextValue {
  id: string;
  triggerRef: MutableRefObject<HTMLDivElement | null>;
}

// =============================================================================
// CONTEXT
// =============================================================================

export const PullDownContext = createContext<PullDownContextValue | null>(null);

export function usePullDownContext(
  componentName = "PullDown"
): PullDownContextValue {
  const context = useContext(PullDownContext);
  if (!context) {
    throw new Error(
      `${componentName} must be used within <PullDown>. ` +
        "Wrap your component tree with <PullDown>"
    );
  }
  return context;
}

export const SubMenuContext = createContext<PullDownSubMenuContextValue | null>(
  null
);

export function useSubMenuContext(): PullDownSubMenuContextValue {
  const context = useContext(SubMenuContext);
  if (!context) {
    throw new Error(
      "SubMenu components must be used within a <PullDown.SubMenu> component"
    );
  }
  return context;
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook for controlled/uncontrolled state pattern
 */
export function useControllable<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const wasControlled = useRef(isControlled);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      wasControlled.current !== isControlled
    ) {
      console.warn(
        "PullDown: A component is changing from",
        wasControlled.current ? "controlled" : "uncontrolled",
        "to",
        isControlled ? "controlled" : "uncontrolled",
        ". This is likely a bug."
      );
    }
    wasControlled.current = isControlled;
  }, [isControlled]);

  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  return [value, setValue];
}

/**
 * Hook to detect clicks outside elements
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: globalThis.MouseEvent | TouchEvent) {
      const target = event.target as Node;
      const isOutside = refs.every((ref) => {
        return !ref.current || !ref.current.contains(target);
      });

      if (isOutside) {
        handler();
      }
    }

    const doc = refs[0]?.current?.ownerDocument ?? document;
    doc.addEventListener("mousedown", handleClick);
    doc.addEventListener("touchstart", handleClick, { passive: true });

    return () => {
      doc.removeEventListener("mousedown", handleClick);
      doc.removeEventListener("touchstart", handleClick);
    };
  }, [refs, handler, enabled]);
}

/**
 * Hook to handle escape key press
 */
export function useEscapeKey(handler: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        handler();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handler, enabled]);
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  const QUERY = "(prefers-reduced-motion: reduce)";

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(QUERY).matches;
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mediaQuery = window.matchMedia(QUERY);
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  }, []);

  const getServerSnapshot = useCallback(() => false, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

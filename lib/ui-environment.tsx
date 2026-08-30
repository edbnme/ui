"use client";

import * as React from "react";

export type PortalContainer =
  | HTMLElement
  | ShadowRoot
  | React.RefObject<HTMLElement | ShadowRoot | null>
  | null;

export type UIEnvironment = {
  window?: Window | null;
  document?: Document | null;
  portalContainer?: PortalContainer;
};

export type PopupMotion = "pointer" | "instant";

export type PopupChangeEventDetails = {
  event?: Event;
  reason?: string;
};

const UIEnvironmentContext = React.createContext<UIEnvironment | undefined>(
  undefined
);

const PopupMotionContext = React.createContext<PopupMotion>("instant");

function getPopupMotion(
  eventDetails: PopupChangeEventDetails | undefined
): PopupMotion {
  const event = eventDetails?.event;
  if (!event) return "instant";

  const type = event.type.toLowerCase();
  if (type.startsWith("key") || type === "focus" || type === "blur") {
    return "instant";
  }

  if (type === "click" && "detail" in event && event.detail === 0) {
    return "instant";
  }

  return /^(?:click|mouse|pointer|touch)/.test(type) ? "pointer" : "instant";
}

function UIEnvironmentProvider({
  value,
  children,
}: {
  value: UIEnvironment;
  children: React.ReactNode;
}) {
  return (
    <UIEnvironmentContext.Provider value={value}>
      {children}
    </UIEnvironmentContext.Provider>
  );
}

function PopupMotionProvider({
  value,
  children,
}: {
  value: PopupMotion;
  children: React.ReactNode;
}) {
  return (
    <PopupMotionContext.Provider value={value}>
      {children}
    </PopupMotionContext.Provider>
  );
}

function useUIWindow() {
  const environment = React.useContext(UIEnvironmentContext);

  if (environment?.window !== undefined) {
    return environment.window;
  }

  return typeof window === "undefined" ? null : window;
}

function useUIDocument() {
  const environment = React.useContext(UIEnvironmentContext);

  if (environment?.document !== undefined) {
    return environment.document;
  }

  if (environment?.window !== undefined) {
    return environment.window?.document ?? null;
  }

  return typeof document === "undefined" ? null : document;
}

function usePortalContainer(container?: PortalContainer) {
  const environment = React.useContext(UIEnvironmentContext);

  return container !== undefined ? container : environment?.portalContainer;
}

function useUIEnvironmentActive() {
  return React.useContext(UIEnvironmentContext) !== undefined;
}

function usePopupMotion() {
  return React.useContext(PopupMotionContext);
}

function usePopupMotionState<Details extends PopupChangeEventDetails>(
  open: boolean | undefined,
  onOpenChange?: (open: boolean, eventDetails: Details) => void
) {
  const [motion, setMotion] = React.useState<PopupMotion>("instant");
  const previousOpen = React.useRef(open);
  const pendingOpen = React.useRef<boolean | null>(null);

  React.useLayoutEffect(() => {
    if (open === undefined) {
      pendingOpen.current = null;
      return;
    }

    if (open !== previousOpen.current) {
      previousOpen.current = open;
      if (pendingOpen.current !== open) setMotion("instant");
    }
    pendingOpen.current = null;
  }, [open]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean, eventDetails: Details) => {
      pendingOpen.current = nextOpen;
      setMotion(getPopupMotion(eventDetails));
      onOpenChange?.(nextOpen, eventDetails);
    },
    [onOpenChange]
  );

  return [motion, handleOpenChange] as const;
}

function setUIDocumentCookie(ownerDocument: Document | null, value: string) {
  if (ownerDocument) ownerDocument.cookie = value;
}

export {
  getPopupMotion,
  PopupMotionProvider,
  setUIDocumentCookie,
  UIEnvironmentProvider,
  usePopupMotion,
  usePopupMotionState,
  useUIDocument,
  useUIEnvironmentActive,
  usePortalContainer,
  useUIWindow,
};

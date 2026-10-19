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

const UIEnvironmentContext = React.createContext<UIEnvironment | undefined>(
  undefined
);

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

function setUIDocumentCookie(ownerDocument: Document | null, value: string) {
  if (ownerDocument) ownerDocument.cookie = value;
}

export {
  setUIDocumentCookie,
  UIEnvironmentProvider,
  useUIDocument,
  useUIEnvironmentActive,
  usePortalContainer,
  useUIWindow,
};

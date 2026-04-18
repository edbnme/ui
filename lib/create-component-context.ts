/**
 * create-component-context — typed React context factory.
 *
 * @registryDescription Factory for creating strict React contexts with typed hooks and display-name friendly debugging.
 */

import * as React from "react";

/**
 * Creates a typed React context with a hook that throws if used outside its provider.
 * Shared utility for components that follow the Provider → useContext pattern.
 *
 * @example
 * const [CarouselProvider, useCarousel] = createComponentContext<CarouselContextProps>("Carousel");
 */
export function createComponentContext<T>(name: string) {
  const Ctx = React.createContext<T | null>(null);
  Ctx.displayName = name;

  const useCtx = () => {
    const ctx = React.useContext(Ctx);
    if (!ctx) {
      throw new Error(`use${name} must be used within <${name}>`);
    }
    return ctx;
  };

  return [Ctx.Provider, useCtx] as const;
}

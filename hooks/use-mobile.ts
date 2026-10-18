import * as React from "react"

import { useUIWindow } from "@/lib/ui-environment"

const MOBILE_BREAKPOINT = 768

/**
 * Below 768px. Read from the media query as the component renders, so a
 * client render never starts as desktop and flips after mounting. On the
 * server, and while hydrating server HTML, it's false.
 */
export function useIsMobile() {
  const ownerWindow = useUIWindow()
  const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mql = ownerWindow?.matchMedia?.(query)
      if (!mql) return () => {}
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [ownerWindow, query]
  )

  return React.useSyncExternalStore(
    subscribe,
    () => ownerWindow?.matchMedia?.(query).matches ?? false,
    () => false
  )
}

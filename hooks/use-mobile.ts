import * as React from "react"

import { useUIWindow } from "@/lib/ui-environment"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const ownerWindow = useUIWindow()
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (!ownerWindow) return

    const mql = ownerWindow.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    )
    const onChange = () => {
      setIsMobile(ownerWindow.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(ownerWindow.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [ownerWindow])

  return !!isMobile
}

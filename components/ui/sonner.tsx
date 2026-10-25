"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group motion-reduce:[&_[data-sonner-toast]]:transition-opacity motion-reduce:[&_[data-sonner-toast]]:duration-100 motion-reduce:[&_.sonner-loading-bar]:animate-none"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin motion-reduce:animate-none" />
        ),
      }}
      style={
        {
          fontFamily: "var(--font-sans)",
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "transparent",
          // The 14px panel radius, like the other floating surfaces.
          "--border-radius": "14px",
          // The dialog width, like the other toasts.
          "--width": "var(--container-dialog)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          // Our floating-paper shadow and one text weight over Sonner's own.
          toast: "cn-toast font-sans text-body! shadow-popup!",
          title: "text-body! [font-weight:inherit]!",
          description: "text-small! [font-weight:inherit]!",
          // Actions are default buttons: 32px, 15px text, the 10px curve.
          actionButton: "h-control! rounded-control! px-3! text-body! [font-weight:inherit]!",
          cancelButton: "h-control! rounded-control! px-3! text-body! [font-weight:inherit]!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

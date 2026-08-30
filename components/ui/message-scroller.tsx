"use client"

import * as React from "react"
import { useRender } from "@base-ui/react/use-render"
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"

import { useUIEnvironmentActive } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon } from "lucide-react"

function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>
) {
  return <MessageScrollerPrimitive.Provider {...props} />
}

function MessageScroller({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className={cn(
        "size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent",
        className
      )}
      {...props}
    />
  )
}

function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className={cn("flex h-max min-h-full flex-col gap-6", className)}
      {...props}
    />
  )
}

function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Item>) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className={cn(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className
      )}
      {...props}
    />
  )
}

type MessageScrollerButtonProps = React.ComponentProps<
  typeof MessageScrollerPrimitive.Button
> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">

function MessageScrollerButton(props: MessageScrollerButtonProps) {
  const environmentActive = useUIEnvironmentActive()

  if (environmentActive) return <EnvironmentMessageScrollerButton {...props} />

  return <DefaultMessageScrollerButton {...props} />
}

function DefaultMessageScrollerButton({
  direction = "end",
  className,
  children,
  render,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: MessageScrollerButtonProps) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      data-variant={variant}
      data-size={size}
      direction={direction}
      className={cn(
        "absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
        className
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon
          />
          <span className="sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  )
}

function EnvironmentMessageScrollerButton({
  behavior = "smooth",
  children,
  className,
  direction = "end",
  onClick,
  ref,
  render,
  size = "icon-sm",
  tabIndex,
  type = "button",
  variant = "secondary",
  ...props
}: MessageScrollerButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [active, setActive] = React.useState(false)

  const getViewport = React.useCallback(
    () =>
      buttonRef.current
        ?.closest<HTMLElement>("[data-slot='message-scroller']")
        ?.querySelector<HTMLElement>("[data-slot='message-scroller-viewport']") ??
      null,
    []
  )

  React.useLayoutEffect(() => {
    const viewport = getViewport()
    if (!viewport) return

    const sync = () => {
      const remaining =
        viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop
      setActive(direction === "end" ? remaining > 8 : viewport.scrollTop > 8)
    }
    const ownerWindow = viewport.ownerDocument.defaultView
    const ResizeObserverConstructor = ownerWindow?.ResizeObserver
    const resizeObserver = ResizeObserverConstructor
      ? new ResizeObserverConstructor(sync)
      : null

    sync()
    viewport.addEventListener("scroll", sync, { passive: true })
    resizeObserver?.observe(viewport)

    return () => {
      viewport.removeEventListener("scroll", sync)
      resizeObserver?.disconnect()
    }
  }, [direction, getViewport])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!active) return
    onClick?.(event)
    if (event.defaultPrevented) return

    const viewport = getViewport()
    if (!viewport) return
    event.currentTarget.blur()
    viewport.scrollTo({
      behavior,
      top: direction === "end" ? viewport.scrollHeight : 0,
    })
  }

  return useRender({
    defaultTagName: "button",
    render: (render ?? (
      <Button variant={variant} size={size} />
    )) as useRender.RenderProp<{ active: boolean; direction: typeof direction }>,
    ref: ref ? [buttonRef, ref] : buttonRef,
    state: { active, direction },
    stateAttributesMapping: {
      active: (value) => ({ "data-active": value ? "true" : "false" }),
      direction: (value) => ({ "data-direction": value }),
    },
    props: {
      ...props,
      "data-size": size,
      "data-slot": "message-scroller-button",
      "data-variant": variant,
      children: children ?? (
        <>
          <ArrowDownIcon />
          <span className="sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      ),
      className: cn(
        "absolute inset-s-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
        className
      ),
      inert: active ? undefined : true,
      onClick: handleClick,
      tabIndex: active ? tabIndex : -1,
      type,
    },
  })
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}

"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { usePortalContainer } from "@/lib/ui-environment"
import { cn } from "@/lib/utils"
import { InputGroupTextarea } from "@/components/ui/input-group"

// ---- Triggers ---------------------------------------------------------------

type MentionTrigger =
  | string
  | {
      /** The character that starts a suggestion, such as "@" or "/". */
      char: string
      /** Only at the very start of the text, as a slash command is. */
      startOnly?: boolean
      /** Lets the query hold one space, for a first and last name. */
      allowSpace?: boolean
    }

/** The trigger being typed at the caret: its character, query and start. */
type MentionMatch = { char: string; query: string; start: number }

type MentionItemGroup<Item> = { value: string; items: Item[] }
type MentionItems<Item> = Item[] | MentionItemGroup<Item>[]

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

function findMatch(
  text: string,
  caret: number,
  triggers: MentionTrigger[]
): MentionMatch | null {
  const before = text.slice(0, caret)
  for (const trigger of triggers) {
    const { char, startOnly = false, allowSpace = false } =
      typeof trigger === "string" ? { char: trigger } : trigger
    const c = escapeRegExp(char)
    const word = `[^\\s${c}]*`
    const query = allowSpace ? `${word}(?: ${word})?` : word
    const match = new RegExp(
      `${startOnly ? "^" : "(?:^|\\s)"}${c}(${query})$`
    ).exec(before)
    if (match)
      return {
        char,
        query: match[1],
        start: caret - match[1].length - char.length,
      }
  }
  return null
}

function countItems(items: unknown[]) {
  return items.reduce<number>((count, item) => {
    const group = item as Partial<MentionItemGroup<unknown>>
    return count + (Array.isArray(group?.items) ? group.items.length : 1)
  }, 0)
}

const defaultItemToString = (item: unknown) =>
  typeof item === "object" && item !== null && "label" in item
    ? String((item as { label: unknown }).label)
    : String(item)

// ---- Caret position ---------------------------------------------------------

// The text metrics a copy of the textarea needs to lay out its text the same.
const MIRRORED_STYLES = [
  "boxSizing",
  "width",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "letterSpacing",
  "lineHeight",
  "tabSize",
  "textIndent",
  "textTransform",
  "wordSpacing",
] as const

function copyTextStyles(from: HTMLElement, to: HTMLElement) {
  const computed = getComputedStyle(from)
  for (const property of MIRRORED_STYLES) to.style[property] = computed[property]
  to.style.borderStyle = "solid"
  to.style.borderColor = "transparent"
}

// Where `index` sits in the textarea, as a rectangle on the page, measured
// with an invisible copy of the text up to it.
function caretRect(textarea: HTMLTextAreaElement, index: number): DOMRect {
  const doc = textarea.ownerDocument
  const mirror = doc.createElement("div")
  copyTextStyles(textarea, mirror)
  Object.assign(mirror.style, {
    position: "absolute",
    visibility: "hidden",
    top: "0",
    left: "0",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    overflow: "hidden",
  })
  mirror.textContent = textarea.value.slice(0, index)
  const marker = doc.createElement("span")
  marker.textContent = textarea.value.slice(index) || "."
  mirror.appendChild(marker)
  doc.body.appendChild(mirror)
  const box = textarea.getBoundingClientRect()
  const lineHeight =
    parseFloat(getComputedStyle(textarea).lineHeight) || marker.offsetHeight
  const rect = new DOMRect(
    box.left + marker.offsetLeft - textarea.scrollLeft,
    box.top + marker.offsetTop - textarea.scrollTop,
    0,
    lineHeight
  )
  mirror.remove()
  return rect
}

// ---- Root -------------------------------------------------------------------

type MentionContextValue = {
  text: string
  open: boolean
  count: number
  match: MentionMatch | null
  anchor: { getBoundingClientRect: () => DOMRect }
  setTextarea: (element: HTMLTextAreaElement | null) => void
  onTextChange: (value: string, caret: number) => void
  onCaretChange: (caret: number) => void
  setFocused: (focused: boolean) => void
  dismiss: () => void
  insertHighlighted: () => boolean
}

const MentionContext = React.createContext<MentionContextValue | null>(null)

function useMentionContext(part: string) {
  const context = React.useContext(MentionContext)
  if (!context) throw new Error(`${part} must be used within <Mention>`)
  return context
}

type MentionActions = {
  /** Replaces the text and puts the caret at `caret`, as after a delete. */
  replace: (value: string, caret?: number) => void
}

// A textarea that suggests people, files or commands as you type a trigger
// character, built on Base UI's Combobox with the textarea as its input.
// Focus stays in the textarea: the arrows move through the list, Enter or
// Tab inserts the highlighted item and Esc closes the list until a new
// trigger starts. The list opens for typing, not for a caret that lands on
// text that's already there.
//
// `items` are the suggestions for the trigger being typed: an array (flat
// or grouped as `{ value, items }`), or a function of the match that
// returns one. Inserting writes the trigger, the item's label and a space.
function Mention<Item>({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  triggers = ["@"],
  items,
  itemToStringLabel = defaultItemToString,
  onItemInsert,
  openWhenEmpty = false,
  actionsRef,
  children,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Default `["@"]`. Earlier triggers win when two match. */
  triggers?: MentionTrigger[]
  items: MentionItems<Item> | ((match: MentionMatch) => MentionItems<Item>)
  /** The text inserted after the trigger. Defaults to `item.label`. */
  itemToStringLabel?: (item: Item) => string
  onItemInsert?: (item: Item, match: MentionMatch) => void
  /** Keep the list open with no suggestions, to show MentionEmpty. */
  openWhenEmpty?: boolean
  actionsRef?: React.Ref<MentionActions>
  children?: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const text = valueProp ?? uncontrolled
  const [caret, setCaret] = React.useState(0)
  const [focused, setFocused] = React.useState(false)
  // Where the trigger being typed starts, and where Esc last closed one.
  const [typedAt, setTypedAt] = React.useState<number | null>(null)
  const [dismissedAt, setDismissedAt] = React.useState<number | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const pendingCaret = React.useRef<number | null>(null)
  const highlighted = React.useRef<Item | undefined>(undefined)
  const setTextarea = React.useCallback(
    (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element
    },
    []
  )

  const setText = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const match = findMatch(text, caret, triggers)
  const suggestions: MentionItems<Item> = match
    ? typeof items === "function"
      ? items(match)
      : items
    : []
  const count = countItems(suggestions)
  const open =
    focused &&
    match !== null &&
    match.start === typedAt &&
    match.start !== dismissedAt &&
    (count > 0 || openWhenEmpty)

  const replace = React.useCallback(
    (next: string, position = next.length) => {
      setText(next)
      setCaret(position)
      setTypedAt(null)
      pendingCaret.current = position
    },
    [setText]
  )
  React.useImperativeHandle(actionsRef, () => ({ replace }), [replace])

  // Once React has written the new text, puts the caret where an insert or
  // a replace left it.
  React.useLayoutEffect(() => {
    const position = pendingCaret.current
    const element = textareaRef.current
    if (position === null || !element) return
    pendingCaret.current = null
    element.setSelectionRange(position, position)
  })

  const insert = (item: Item) => {
    if (!match) return
    const token = `${match.char}${itemToStringLabel(item)}`
    const rest = text.slice(caret)
    replace(
      text.slice(0, match.start) +
        token +
        (rest.startsWith(" ") ? "" : " ") +
        rest,
      match.start + token.length + 1
    )
    onItemInsert?.(item, match)
  }

  const matchStart = match?.start
  const anchor = React.useMemo(
    () => ({
      getBoundingClientRect: () => {
        const element = textareaRef.current
        if (!element || matchStart === undefined) return new DOMRect()
        return caretRect(element, matchStart)
      },
    }),
    [matchStart]
  )

  const context: MentionContextValue = {
    text,
    open,
    count,
    match,
    anchor,
    setTextarea,
    onTextChange: (next, position) => {
      const start = findMatch(next, position, triggers)?.start ?? null
      setText(next)
      setCaret(position)
      setTypedAt(start)
      // A new trigger, or none, ends an Esc.
      if (start !== dismissedAt) setDismissedAt(null)
    },
    onCaretChange: setCaret,
    setFocused,
    dismiss: () => setDismissedAt(match?.start ?? null),
    insertHighlighted: () => {
      if (highlighted.current === undefined) return false
      insert(highlighted.current)
      return true
    },
  }

  return (
    <MentionContext.Provider value={context}>
      <ComboboxPrimitive.Root<Item>
        items={suggestions as Item[]}
        filter={null}
        value={null}
        onValueChange={(item) => {
          if (item !== null) insert(item)
        }}
        inputValue={text}
        open={open}
        onOpenChange={(next, details) => {
          if (!next && details.reason === "escape-key") context.dismiss()
        }}
        openOnInputClick={false}
        autoHighlight
        itemToStringLabel={itemToStringLabel}
        onItemHighlighted={(item) => {
          highlighted.current = item
        }}
      >
        {children}
      </ComboboxPrimitive.Root>
    </MentionContext.Provider>
  )
}

// ---- Textarea ---------------------------------------------------------------

// The prompt field: an InputGroupTextarea, so it takes the composer's look
// inside `<InputGroup variant="composer">`. `highlight` draws behind the
// text, laid out exactly like it, for marking inserted tokens.
function MentionTextarea({
  className,
  highlight,
  onKeyDown,
  onScroll,
  ...props
}: Omit<React.ComponentProps<"textarea">, "value" | "defaultValue"> & {
  highlight?: React.ReactNode
}) {
  const mention = useMentionContext("MentionTextarea")
  const { setTextarea } = mention
  const textarea = React.useRef<HTMLTextAreaElement | null>(null)
  const mirror = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useCallback(
    (element: HTMLTextAreaElement | null) => {
      textarea.current = element
      setTextarea(element)
    },
    [setTextarea]
  )

  React.useLayoutEffect(() => {
    if (mirror.current && textarea.current)
      copyTextStyles(textarea.current, mirror.current)
  })

  return (
    <div data-slot="mention-field" className="relative grid min-w-0 flex-1">
      {highlight !== undefined && (
        <div
          ref={mirror}
          aria-hidden
          data-slot="mention-highlight"
          className="pointer-events-none absolute inset-0 overflow-hidden wrap-break-word whitespace-pre-wrap text-transparent [scrollbar-gutter:stable]"
        >
          {highlight}
          {/* Keeps a final empty line as tall as the textarea's. */}{" "}
        </div>
      )}
      <ComboboxPrimitive.Input
        render={
          <InputGroupTextarea
            ref={textareaRef}
            className={cn(
              "relative block w-full",
              highlight !== undefined && "[scrollbar-gutter:stable]",
              className
            )}
            {...props}
          />
        }
        onChange={(event) => {
          const { value, selectionStart } = event.currentTarget
          mention.onTextChange(value, selectionStart ?? value.length)
        }}
        onSelect={(event) =>
          mention.onCaretChange(event.currentTarget.selectionStart ?? 0)
        }
        onFocus={() => mention.setFocused(true)}
        onBlur={() => mention.setFocused(false)}
        onScroll={(event) => {
          onScroll?.(event as unknown as React.UIEvent<HTMLTextAreaElement>)
          if (mirror.current)
            mirror.current.scrollTop = event.currentTarget.scrollTop
        }}
        onKeyDown={(event) => {
          const forward = () =>
            onKeyDown?.(
              event as unknown as React.KeyboardEvent<HTMLTextAreaElement>
            )
          // Closed, the textarea keeps its own keys: arrows move the caret,
          // Home and End go to the line's ends, Esc doesn't clear the text.
          if (!mention.open || event.nativeEvent.isComposing) {
            event.preventBaseUIHandler()
            forward()
            return
          }
          if (event.key === "Home" || event.key === "End") {
            event.preventBaseUIHandler()
            return
          }
          if (event.key === "Escape") {
            // Handled here, so a dialog around it stays open.
            event.preventDefault()
            event.stopPropagation()
            event.preventBaseUIHandler()
            mention.dismiss()
            return
          }
          if (event.key === "Tab" && !event.shiftKey) {
            if (mention.insertHighlighted()) {
              event.preventDefault()
              event.preventBaseUIHandler()
            }
            return
          }
          // Base UI moves through the list and inserts on Enter.
          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Enter"
          )
            return
          forward()
        }}
      />
    </div>
  )
}

// ---- Popup ------------------------------------------------------------------

// Opens at the trigger character, above the line by default, and flips
// below when there's no room.
function MentionPopup({
  className,
  side = "top",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset"
  >) {
  const { anchor } = useMentionContext("MentionPopup")
  const portalContainer = usePortalContainer()

  return (
    <ComboboxPrimitive.Portal container={portalContainer}>
      <ComboboxPrimitive.Positioner
        anchor={anchor}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 outline-none"
      >
        <ComboboxPrimitive.Popup
          data-slot="mention-popup"
          className={cn(
            "group/mention-popup relative w-popover max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-panel bg-popover text-popover-foreground shadow-popup outline-none transition-[opacity,scale] duration-(--motion-duration-surface-in) ease-(--motion-ease-out) data-starting-style:scale-[.98] data-starting-style:opacity-0 data-ending-style:scale-[.98] data-ending-style:opacity-0 data-ending-style:duration-(--motion-duration-surface-out) motion-reduce:transition-opacity motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100 contrast-more:shadow-none contrast-more:outline contrast-more:outline-foreground forced-colors:bg-[Canvas] forced-colors:text-[CanvasText] forced-colors:outline forced-colors:outline-[CanvasText]",
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function MentionList({
  className,
  "aria-label": ariaLabel = "Suggestions",
  ...props
}: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="mention-list"
      aria-label={ariaLabel}
      className={cn(
        "no-scrollbar grid max-h-[min(15rem,var(--available-height))] scroll-py-1 gap-1 overflow-y-auto overscroll-contain p-1 text-body data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function MentionGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="mention-group"
      className={cn(className)}
      {...props}
    />
  )
}

function MentionGroupLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="mention-group-label"
      className={cn(
        "px-3 pt-1.5 pb-1 text-small text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function MentionCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection {...props} />
}

// An option, ink while highlighted, like a Command item.
function MentionItem({ className, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="mention-item"
      className={cn(
        "group/mention-item relative flex min-h-control w-full cursor-default items-center gap-3 rounded-control px-3 py-2 text-body leading-4 outline-none select-none pointer-coarse:min-h-control-touch data-highlighted:bg-primary data-highlighted:text-primary-foreground data-highlighted:**:text-current data-disabled:pointer-events-none data-disabled:opacity-50 forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

// The quieter text after an option's name, such as a person's team.
function MentionItemDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="mention-item-description"
      className={cn(
        "ms-auto truncate text-muted-foreground group-data-highlighted/mention-item:opacity-70",
        className
      )}
      {...props}
    />
  )
}

function MentionEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="mention-empty"
      className={cn(
        "hidden w-full px-3 py-2 text-body text-muted-foreground group-data-empty/mention-popup:block",
        className
      )}
      {...props}
    />
  )
}

// A polite live region: the number of suggestions while the list is open,
// otherwise its children (your own messages, such as "Mentioned Maya").
// The explicit aria-live keeps it audible while the open list hides the
// rest of the page from screen readers.
function MentionStatus({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { open, count } = useMentionContext("MentionStatus")
  return (
    <p
      role="status"
      aria-live="polite"
      data-slot="mention-status"
      className={cn("sr-only", className)}
      {...props}
    >
      {open
        ? `${count} ${count === 1 ? "suggestion" : "suggestions"}`
        : children}
    </p>
  )
}

export {
  Mention,
  MentionCollection,
  MentionEmpty,
  MentionGroup,
  MentionGroupLabel,
  MentionItem,
  MentionItemDescription,
  MentionList,
  MentionPopup,
  MentionStatus,
  MentionTextarea,
}
export type { MentionActions, MentionItemGroup, MentionMatch, MentionTrigger }

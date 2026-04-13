"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CopyIcon, CheckIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { useShikiHighlight } from "@/hooks/use-shiki-highlight";

// =============================================================================
// TYPES
// =============================================================================

interface CodeBlockProps
  extends React.ComponentProps<"div">, VariantProps<typeof codeBlockVariants> {
  /** Source code to display */
  code: string;
  /** Language for syntax highlighting. Default: "tsx" */
  language?: string;
  /** Whether to show line numbers. Default: false */
  showLineNumbers?: boolean;
  /** Whether to show the copy button. Default: true */
  showCopy?: boolean;
  /** Optional title / filename shown in header */
  title?: string;
  /** Maximum height before scrolling */
  maxHeight?: number | string;
}

// =============================================================================
// VARIANTS
// =============================================================================

const codeBlockVariants = cva(
  "flex flex-col overflow-hidden rounded-xl ring-1 ring-border ring-inset text-sm font-mono",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-[13px]",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

// =============================================================================
// COPY BUTTON
// =============================================================================

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-accent/60 transition-all duration-200"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </button>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

function CodeBlock({
  code,
  language = "tsx",
  showLineNumbers = false,
  showCopy = true,
  title,
  maxHeight,
  size,
  className,
  ...props
}: CodeBlockProps) {
  const highlighted = useShikiHighlight(code, language);

  const normalizedCode = code || "";
  const lines = normalizedCode.split("\n");
  const lineCount =
    lines.length > 1 && lines[lines.length - 1] === ""
      ? lines.length - 1
      : lines.length;

  const gutterWidth = `${Math.max(2, String(lineCount).length)}ch`;

  const showHeader = title || showCopy;

  return (
    <div
      data-slot="code-block"
      className={cn(
        "bg-muted/40 dark:bg-muted/10",
        codeBlockVariants({ size }),
        className
      )}
      {...props}
    >
      {/* Header */}
      {showHeader && (
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/30 dark:border-border/30 dark:bg-muted/20 px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            {title && (
              <span className="text-[12px] text-muted-foreground">{title}</span>
            )}
            {!title && (
              <span className="text-[11px] text-muted-foreground/50 uppercase tracking-wide">
                {language}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {showCopy && <CopyButton code={normalizedCode} />}
          </div>
        </div>
      )}

      {/* Code area */}
      <div
        className="overflow-auto"
        style={
          maxHeight
            ? {
                maxHeight:
                  typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
              }
            : undefined
        }
      >
        <div
          className={cn(
            "flex leading-[20px] transition-opacity duration-150",
            highlighted ? "opacity-100" : "opacity-40"
          )}
        >
          {/* Line numbers */}
          {showLineNumbers && (
            <div
              className="sticky left-0 z-10 shrink-0 select-none border-r border-border/40 dark:border-border/20 bg-muted/30 dark:bg-muted/10 px-2 py-3 text-right text-muted-foreground/40 dark:text-muted-foreground/30"
              style={{ minWidth: `calc(${gutterWidth} + 16px)` }}
              aria-hidden="true"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="h-[20px]">
                  {i + 1}
                </div>
              ))}
            </div>
          )}

          {/* Code content */}
          <div className="min-w-0 flex-1 p-3">
            {highlighted ? (
              <div className="[&_pre]:bg-transparent! [&_pre]:m-0! [&_pre]:p-0! [&_pre]:text-inherit! [&_pre]:leading-[20px]! [&_code]:bg-transparent! [&_.shiki]:bg-transparent! [&_pre]:whitespace-pre!">
                {highlighted}
              </div>
            ) : (
              <pre className="m-0 whitespace-pre bg-transparent p-0 leading-[20px] text-foreground/80">
                <code>{normalizedCode}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CodeBlock.displayName = "CodeBlock";

export { CodeBlock, codeBlockVariants };
export type { CodeBlockProps };

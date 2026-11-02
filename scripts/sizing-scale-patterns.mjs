// Class names that step off the size scale in lib/styles/base.css. The
// components' ESLint config rejects them, and the site's lint and tests
// apply the same list to its blocks. A documented exception carries
// `scale-exception: <reason>` in the comment that disables the rule.
export const OFF_SCALE_CLASSES = [
  {
    // 16px on touch inputs stops iOS zooming in.
    pattern: /(?<!pointer-coarse:)\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/,
    message:
      "Use text-body, text-small, text-micro, text-stat, text-title, text-headline or text-display.",
  },
  {
    pattern: /\btext-\[(\d|\.\d|length:)/,
    message:
      "Use text-body, text-small, text-micro, text-stat, text-title, text-headline or text-display, not an arbitrary size.",
  },
  {
    pattern: /\bleading-(snug|normal|relaxed|tight|loose|\[)/,
    message:
      "The text tokens carry their line-height; rows may fix leading-4 or leading-5.",
  },
  {
    pattern: /\bfont-(medium|semibold|bold)\b/,
    message: "One weight: hierarchy comes from size and ink.",
  },
  {
    // Checkboxes (4px) and chart swatches (2px) keep their own radii.
    pattern:
      /\brounded(-[setblr]{1,2})?-(sm|md|xl|2xl|3xl)\b|\brounded(-[setblr]{1,2})?-\[(?![24]px\])\d+px\]/,
    message:
      "Use rounded-card, rounded-panel, rounded-control, rounded-control-sm or rounded-control-xs.",
  },
  {
    pattern:
      /\bmax-w-(xs|sm|md|lg|xl|[2-9]xl|\d+)\b|\bmax-w-\[\d+(px|rem)|(?<![\w-])w-\[\d{2,}/,
    message:
      "Use the width tokens: menu, popover, compact, dialog, wide or page.",
  },
  {
    pattern: /\b(min-)?h-(7|9|10|11|12)\b|\bsize-(9|10|11)\b/,
    message:
      "Use the control sizes: control-xs, control-sm, control, control-lg, control-touch or token.",
  },
];

// What a page built from the components (a block, a template, the site's
// showcase) may not do on top of that. A component may: the tab list's 3px
// inset and a 2px resize handle are part of its geometry, but a page that
// picks its own px is a page that drifts from its neighbours.
export const PAGE_OFF_SCALE_CLASSES = [
  {
    pattern:
      /(?<![\w-])-?(min-|max-)?(h|w|size|[mp][xytblrse]?|gap(-[xy])?|space-[xy])-\[-?\d*\.?\d+(px|rem)\]/,
    message:
      "No arbitrary px or rem: use the control, width and spacing steps.",
  },
  {
    pattern: /(?<![\w-])(size|h|w)-4\.5\b/,
    message:
      "Icons are size-3.5 beside text-small and size-4 beside text-body.",
  },
  {
    pattern: /\bfont-\[\d|\[font-weight:\s*\d/,
    message: "One weight: font-normal (480), from the tokens.",
  },
  {
    pattern: /@(min|max)-\[\d*\.?\d+(px|rem)\]/,
    message:
      "Use the named container sizes (@xl, @2xl, @3xl, @5xl…), not a px breakpoint.",
  },
];

// Raw elements at a control's height take the control tokens, which a
// theme can change and the touch step follows. JSX-aware, so an icon's
// size-6 is left alone: the site's edbn/consistent-control-size rule
// applies it to lowercase elements only.
export const RAW_CONTROL_HEIGHTS = {
  pattern: /^(h-[68]|min-h-8|size-[68])$/,
  tokens: {
    "h-8": "h-control",
    "min-h-8": "min-h-control",
    "size-8": "size-control",
    "h-6": "h-control-xs",
    "size-6": "size-control-xs",
  },
};

/** `no-restricted-syntax` entries for string literals and template text. */
const toSyntax = (patterns) =>
  patterns.flatMap(({ pattern, message }) => [
    { selector: `Literal[value=${pattern}]`, message },
    { selector: `TemplateElement[value.raw=${pattern}]`, message },
  ]);

export const offScaleSyntax = toSyntax(OFF_SCALE_CLASSES);
export const pageOffScaleSyntax = toSyntax(PAGE_OFF_SCALE_CLASSES);

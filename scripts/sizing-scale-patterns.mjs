// Class names that step off the size scale in lib/styles/base.css. The
// components' ESLint config rejects them, and the site's lint and tests
// apply the same list to its blocks. A documented exception carries
// `scale-exception: <reason>` in the comment that disables the rule.
export const OFF_SCALE_CLASSES = [
  {
    // 16px on touch inputs stops iOS zooming in.
    pattern: /(?<!pointer-coarse:)\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/,
    message: "Use text-body, text-small or text-micro.",
  },
  {
    pattern: /\btext-\[(\d|\.\d|length:)/,
    message: "Use text-body, text-small or text-micro, not an arbitrary size.",
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
      "Use the width tokens: menu, popover, compact, dialog or wide.",
  },
  {
    pattern: /\b(min-)?h-(7|9|10|11|12)\b|\bsize-(9|10|11)\b/,
    message:
      "Use the control sizes: control-xs, control-sm, control, control-lg, control-touch or token.",
  },
];

/** `no-restricted-syntax` entries for string literals and template text. */
export const offScaleSyntax = OFF_SCALE_CLASSES.flatMap(
  ({ pattern, message }) => [
    { selector: `Literal[value=${pattern}]`, message },
    { selector: `TemplateElement[value.raw=${pattern}]`, message },
  ]
);

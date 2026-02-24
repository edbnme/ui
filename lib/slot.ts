/**
 * Slot Component - Polymorphic Rendering
 *
 * A vendored Slot implementation for the `asChild` prop pattern.
 * Merges props, classNames, styles, event handlers, and refs onto a single child element.
 *
 * Based on shadcn/ui Slot pattern (MIT licensed), simplified for our use cases:
 * - Conditional component pattern: `const Comp = asChild ? Slot : "button"`
 * - Early-return pattern: `if (asChild) return <Slot>{children}</Slot>`
 *
 * @packageDocumentation
 */

import * as React from "react";

type AnyProps = Record<string, unknown>;

type AnyFn = (...args: unknown[]) => unknown;

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const result: AnyProps = { ...slotProps };

  for (const key in childProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    const isHandler = /^on[A-Z]/.test(key);

    if (isHandler) {
      if (slotValue && childValue) {
        result[key] = (...args: unknown[]) => {
          (childValue as AnyFn)(...args);
          (slotValue as AnyFn)(...args);
        };
      } else {
        result[key] = childValue || slotValue;
      }
    } else if (key === "style") {
      result[key] = { ...(slotValue as object), ...(childValue as object) };
    } else if (key === "className") {
      result[key] = [slotValue, childValue].filter(Boolean).join(" ");
    } else {
      result[key] = childValue !== undefined ? childValue : slotValue;
    }
  }

  return result;
}

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (!React.isValidElement(children)) {
    if (
      process.env.NODE_ENV !== "production" &&
      children !== null &&
      children !== undefined
    ) {
      console.warn("Slot: Expected a single React element child");
    }
    return null;
  }

  const childElement = children as React.ReactElement<
    AnyProps & { ref?: React.Ref<unknown> }
  >;
  const mergedProps = mergeProps(slotProps, childElement.props);

  const childRef = (childElement as { ref?: React.Ref<unknown> }).ref;

  return React.cloneElement(childElement, {
    ...mergedProps,
    ref: forwardedRef
      ? mergeRefs(forwardedRef, childRef as React.Ref<HTMLElement>)
      : (childRef as React.Ref<HTMLElement>),
  });
});

Slot.displayName = "Slot";

export { Slot, mergeRefs, mergeProps };
export type { SlotProps };

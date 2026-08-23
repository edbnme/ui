# Contributing

Thanks for considering contributing to ui.edbn.me.

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/ui.edbn.me.git
cd ui.edbn.me
npm install
npm run dev
```

## Before you start

Open an issue first if you're planning to add a new component or make significant changes. This helps avoid wasted effort.

## Component guidelines

- Use TypeScript
- Start from the pinned shadcn Base UI source when an official component exists
- Keep public APIs composable and accessible
- Support both light and dark themes
- Test on mobile and desktop
- Include proper ARIA attributes

Example structure:

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const MyComponent = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-styles", className)}
        {...props}
      />
    );
  }
);
MyComponent.displayName = "MyComponent";

export { MyComponent };
```

## Registry

After adding or modifying a component:

1. Update `registry.json`
2. Run `npm run registry:validate`
3. Run `npm run registry:build`

## Tests

Write tests for new components:

```tsx
import { render, screen } from "@testing-library/react";
import { MyComponent } from "@/components/ui/my-component";

describe("MyComponent", () => {
  it("renders", () => {
    render(<MyComponent>Hello</MyComponent>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

Run tests before committing:

```bash
npm run test
npm run lint
```

## Pull requests

- Keep PRs focused on a single change
- Write clear commit messages
- Update docs if needed
- Make sure tests pass

## Questions?

Open an issue or check existing discussions.

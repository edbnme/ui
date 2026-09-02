# Contributing

Thanks for considering contributing to ui.edbn.me.

## Setup

```bash
git clone https://github.com/kewonit/ui.edbn.me.git
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

## Contribution license

By submitting a pull request, patch, issue attachment, or other contribution
to the public source, you represent that you have the legal authority to grant
the rights in that contribution and that it does not include confidential
information, trade secrets, malware, personal data that you are not authorized
to disclose, or third-party material that you cannot lawfully contribute.

You retain ownership of your contribution. You grant EDBN and its successors a
perpetual, worldwide, irrevocable, royalty-free, transferable, sublicensable,
and relicensable license to reproduce, prepare derivative works from, modify,
publicly perform, publicly display, distribute, make, have made, use, offer to
sell, sell, import, and otherwise exploit the contribution, alone or combined
with other material, under the source-available dual license or any other
license selected by EDBN. You also grant EDBN a patent license to the extent
your contribution necessarily practices patent claims that you can license.

EDBN may use, relicense, or distribute the contribution without additional
payment, attribution, or approval unless a separate written agreement says
otherwise. This contribution notice does not claim that the repository operates
a separate signed CLA or DCO program. Third-party material remains subject to
its original license and is not relicensed by this notice.

## Pull requests

- Keep PRs focused on a single change
- Write clear commit messages
- Update docs if needed
- Make sure tests pass

## Questions?

Open an issue or check existing discussions.

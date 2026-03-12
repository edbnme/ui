"use client";

import {
  ArrowRightIcon,
  LightningIcon,
  MinusIcon,
} from "@phosphor-icons/react/dist/ssr";
import { CodeViewer } from "@/components/site/docs/shared/code-viewer";
import { Tabs, Tab } from "@/components/site/docs/shared/tabs";
import { ExplorerLink } from "../../explorer-link";

export default function AnimatedVsStaticContent() {
  return (
    <>
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Choosing a Variant
        </h1>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg">
          Every component ships in two variants. Same API, same props. The
          difference is how things move.
        </p>
      </div>

      <div className="mt-10">
        <div className="not-prose overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium w-1/3"></th>
                <th className="px-4 py-3 text-left font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <LightningIcon
                      className="size-4 text-amber-500"
                      weight="duotone"
                    />
                    Animated
                  </span>
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <MinusIcon
                      className="size-4 text-slate-500"
                      weight="duotone"
                    />
                    Static
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  Engine
                </td>
                <td className="px-4 py-3">
                  Spring physics (<code>motion/react</code>)
                </td>
                <td className="px-4 py-3">CSS transitions</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  Bundle
                </td>
                <td className="px-4 py-3">~30 KB gzipped</td>
                <td className="px-4 py-3">0 KB</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  Enter / exit
                </td>
                <td className="px-4 py-3">
                  <code>AnimatePresence</code>, layout morphs
                </td>
                <td className="px-4 py-3">
                  <code>@keyframes</code> via tw-animate-css
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  Gestures
                </td>
                <td className="px-4 py-3">
                  <code>whileHover</code>, <code>whileTap</code>,{" "}
                  <code>drag</code>
                </td>
                <td className="px-4 py-3">
                  <code>:hover</code>, <code>:active</code>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-foreground">
                  Reduced motion
                </td>
                <td className="px-4 py-3">
                  System + <code>MotionProvider</code>
                </td>
                <td className="px-4 py-3">
                  <code>prefers-reduced-motion</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Install</h2>

          <Tabs items={["Animated", "Static"]} defaultValue="Animated">
            <Tab value="Animated">
              <CodeViewer
                code="npx shadcn@latest add https://ui.edbn.me/r/button.json"
                language="bash"
              />
            </Tab>
            <Tab value="Static">
              <CodeViewer
                code="npx shadcn@latest add https://ui.edbn.me/r/button-static.json"
                language="bash"
              />
            </Tab>
          </Tabs>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Switching</h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Change the import path. That&apos;s it.
          </p>
          <CodeViewer
            code={`// Animated (with motion/react)\nimport { Button } from "@/components/ui/animated/button"\n\n// Static (CSS-only)\nimport { Button } from "@/components/ui/static/button"`}
          />
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Disabling motion
          </h2>
          <CodeViewer code={`<Button disableAnimation />`} />
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            Per-component. Or globally via{" "}
            <code>&lt;MotionProvider reducedMotion=&quot;always&quot;&gt;</code>
            .
          </p>
        </section>

        <div className="mt-14">
          <ExplorerLink
            slug="alert-dialog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Browse components
            <ArrowRightIcon className="size-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </ExplorerLink>
        </div>
      </div>
    </>
  );
}

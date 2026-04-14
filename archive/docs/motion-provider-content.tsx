"use client";

import { Callout } from "@/components/site/docs/shared/callout";
import { CodeViewer } from "@/components/site/docs/shared/code-viewer";
import { PropsTable } from "@/components/site/docs/shared/props-table";
import { Steps, Step } from "@/components/site/docs/shared/steps";
import { Tabs, Tab } from "@/components/site/docs/shared/tabs";

export default function MotionProviderContent() {
  return (
    <>
      {/* Hero */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Motion Provider
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg max-w-xl leading-relaxed">
          A context provider for global motion configuration. Controls animation
          behavior based on user preferences, device capabilities, and explicit
          settings.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {/* Overview */}
        <section>
          <h2
            id="overview"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            Overview
          </h2>
          <p className="mb-6 text-muted-foreground">
            The MotionProvider wraps your app to provide consistent motion
            settings. All animated components automatically respect these
            settings.
          </p>

          <CodeViewer
            code={`// app/layout.tsx
import { MotionProvider } from "@/components/motion-provider"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  )
}`}
          />
        </section>

        {/* Installation */}
        <section>
          <h2
            id="installation"
            className="mb-6 text-xl font-semibold tracking-tight"
          >
            Installation
          </h2>

          <Steps>
            <Step>
              <h3 className="mb-2 text-lg font-medium">Install dependencies</h3>
              <CodeViewer code="npm install motion" language="bash" />
            </Step>

            <Step>
              <h3 className="mb-2 text-lg font-medium">
                Add the MotionProvider component
              </h3>
              <p className="mb-4 text-muted-foreground">
                Use the CLI to add the MotionProvider to your project:
              </p>
              <CodeViewer
                language="bash"
                code="npx shadcn@latest add https://ui.edbn.me/r/motion-provider.json"
              />
            </Step>

            <Step>
              <h3 className="mb-2 text-lg font-medium">Wrap your app</h3>
              <p className="mb-4 text-muted-foreground">
                Add the provider to your root layout.
              </p>
              <CodeViewer
                code={`<MotionProvider>
  {children}
</MotionProvider>`}
              />
            </Step>
          </Steps>
        </section>

        {/* Configuration */}
        <section>
          <h2
            id="configuration"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            Configuration
          </h2>
          <p className="mb-6 text-muted-foreground">
            Control how animations behave across your application.
          </p>

          <Tabs items={["Respect System", "Always Reduce", "Never Reduce"]}>
            <Tab value="Respect System">
              <CodeViewer
                code={`// Default: respects user's system preferences
<MotionProvider reducedMotion="user">
  {children}
</MotionProvider>

// prefers-reduced-motion: reduce â†’ animations disabled
// prefers-reduced-motion: no-preference â†’ animations enabled`}
              />
            </Tab>
            <Tab value="Always Reduce">
              <CodeViewer
                code={`// Force reduced motion (no animations)
<MotionProvider reducedMotion="always">
  {children}
</MotionProvider>

// Useful for:
// - Accessibility testing
// - Performance-critical apps
// - User preference overrides`}
              />
            </Tab>
            <Tab value="Never Reduce">
              <CodeViewer
                code={`// Always enable animations (use carefully)
<MotionProvider reducedMotion="never">
  {children}
</MotionProvider>

// âš ï¸ Ignores user accessibility preferences
// Only use when animations are essential to UX`}
              />
            </Tab>
          </Tabs>
        </section>

        {/* Low Power Detection */}
        <section>
          <h2
            id="low-power-detection"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            Low Power Detection
          </h2>
          <p className="mb-6 text-muted-foreground">
            Automatically disable animations on battery-constrained devices.
          </p>

          <CodeViewer
            code={`// Auto-disable animations on low-power devices
<MotionProvider lowPowerAutoDisable>
  {children}
</MotionProvider>

// Detects:
// - Battery level < 20%
// - Battery saver mode
// - Low CPU core count
// - Device not charging`}
          />

          <Callout title="Battery API" type="info" className="mt-4">
            Uses the Navigator Battery API where available. Falls back to CPU
            core detection on unsupported browsers.
          </Callout>
        </section>

        {/* Hooks */}
        <section>
          <h2 id="hooks" className="mb-2 text-xl font-semibold tracking-tight">
            Hooks
          </h2>
          <p className="mb-6 text-muted-foreground">
            Access motion configuration from any component.
          </p>

          <h3 className="mb-4 text-lg font-medium">useMotionConfig</h3>
          <CodeViewer
            code={`import { useMotionConfig } from "@/components/motion-provider"

function MyComponent() {
  const { reducedMotion, lowPowerAutoDisable } = useMotionConfig()
  
  return (
    <div>
      <p>Reduced motion: {reducedMotion}</p>
      <p>Low power auto-disable: {lowPowerAutoDisable ? "yes" : "no"}</p>
    </div>
  )
}`}
          />

          <h3 className="mb-4 mt-8 text-lg font-medium">
            useShouldDisableAnimation
          </h3>
          <CodeViewer
            code={`import { useShouldDisableAnimation } from "@/components/motion-provider"

function AnimatedComponent({ disableAnimation }) {
  // Combines: prop override + context settings + system preferences
  const shouldDisable = useShouldDisableAnimation(disableAnimation)
  
  if (shouldDisable) {
    return <div>Static version</div>
  }
  
  return <motion.div animate={{ opacity: 1 }}>Animated version</motion.div>
}`}
          />
        </section>

        {/* API Reference */}
        <section>
          <h2
            id="api-reference"
            className="mb-6 text-xl font-semibold tracking-tight"
          >
            API Reference
          </h2>

          <h3 className="mb-4 text-lg font-medium">MotionProvider Props</h3>
          <PropsTable
            data={[
              {
                name: "reducedMotion",
                type: '"user" | "always" | "never"',
                default: '"user"',
                description: "How to handle reduced motion",
              },
              {
                name: "lowPowerAutoDisable",
                type: "boolean",
                default: "true",
                description: "Auto-disable on low battery",
              },
              {
                name: "children",
                type: "React.ReactNode",
                description: "Child components",
              },
            ]}
          />
        </section>

        <Callout title="Component Integration" type="warn">
          All edbn/ui components use{" "}
          <code className="text-xs">useShouldDisableAnimation</code> internally.
          They accept a <code className="text-xs">disableAnimation</code> prop
          for per-instance overrides.
        </Callout>
      </div>
    </>
  );
}

import { Callout } from "@/components/site/docs/shared/callout";
import { CodeViewer } from "@/components/site/docs/shared/code-viewer";
import { SimpleTable } from "@/components/site/docs/shared/props-table";
import { Tabs, Tab } from "@/components/site/docs/shared/tabs";

export function HooksMotionSection() {
  return (
    <>
      {/* useReducedMotion */}
      <section>
        <h2
          id="usereducedmotion"
          className="mb-2 text-xl font-semibold tracking-tight"
        >
          useReducedMotion
        </h2>
        <p className="mb-6 text-muted-foreground">
          Detects the user&apos;s{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            prefers-reduced-motion
          </code>{" "}
          preference with support for manual overrides.
        </p>

        <Tabs items={["Usage", "API"]}>
          <Tab value="Usage">
            <CodeViewer
              code={`import { useReducedMotion } from "@/hooks/use-reduced-motion"

function AnimatedComponent() {
  const { prefersReducedMotion, setOverride, clearOverride } = useReducedMotion()
  
  if (prefersReducedMotion) {
    return <div>Static content</div>
  }
  
  return (
    <motion.div animate={{ opacity: 1 }}>
      Animated content
    </motion.div>
  )
}

// Override user preference temporarily
function SettingsPanel() {
  const { setOverride, clearOverride } = useReducedMotion()
  
  return (
    <div>
      <button onClick={() => setOverride(true)}>Disable animations</button>
      <button onClick={() => setOverride(false)}>Enable animations</button>
      <button onClick={clearOverride}>Use system preference</button>
    </div>
  )
}`}
            />
          </Tab>
          <Tab value="API">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold">
                      Return Value
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-primary">
                      prefersReducedMotion
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      boolean
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Current preference (includes overrides)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-primary">
                      setOverride
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {`(value: boolean) => void`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Override system preference
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs text-primary">
                      clearOverride
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {`() => void`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      Reset to system preference
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Tab>
        </Tabs>
      </section>

      {/* useLowPowerDevice */}
      <section>
        <h2
          id="uselowpowerdevice"
          className="mb-2 text-xl font-semibold tracking-tight"
        >
          useLowPowerDevice
        </h2>
        <p className="mb-6 text-muted-foreground">
          Detects low-power devices using Battery API and hardware detection.
        </p>

        <Tabs items={["Usage", "API"]}>
          <Tab value="Usage">
            <CodeViewer
              code={`import { useLowPowerDevice } from "@/hooks/use-low-power-device"

function OptimizedComponent() {
  const { 
    isLowPower, 
    shouldReduceAnimations,
    batteryLevel,
    isCharging,
    hardwareConcurrency
  } = useLowPowerDevice()
  
  return (
    <div>
      <p>Low power: {isLowPower ? "Yes" : "No"}</p>
      <p>Battery: {batteryLevel !== null ? \`\${batteryLevel * 100}%\` : "N/A"}</p>
      <p>CPU Cores: {hardwareConcurrency}</p>
    </div>
  )
}

// Adaptive animations
function AnimatedCard() {
  const { shouldReduceAnimations } = useLowPowerDevice()
  
  return (
    <motion.div
      animate={{ scale: 1 }}
      transition={{
        type: shouldReduceAnimations ? "tween" : "spring",
        duration: shouldReduceAnimations ? 0.2 : undefined,
      }}
    >
      Card content
    </motion.div>
  )
}`}
            />
          </Tab>
          <Tab value="API">
            <SimpleTable
              columns={[
                { header: "Return Value", key: "name", isPrimary: true },
                { header: "Type", key: "type", isCode: true },
                { header: "Description", key: "description" },
              ]}
              data={[
                {
                  name: "isLowPower",
                  type: "boolean",
                  description: "True if device is low-power",
                },
                {
                  name: "shouldReduceAnimations",
                  type: "boolean",
                  description: "True if animations should be simplified",
                },
                {
                  name: "batteryLevel",
                  type: "number | null",
                  description: "Battery level (0-1) or null",
                },
                {
                  name: "isCharging",
                  type: "boolean",
                  description: "Whether device is charging",
                },
                {
                  name: "hardwareConcurrency",
                  type: "number",
                  description: "Number of CPU cores",
                },
              ]}
            />
          </Tab>
        </Tabs>

        <Callout title="Dependencies" type="info" className="mt-4">
          These hooks have minimal dependencies - most only require React. The{" "}
          <code className="text-xs">useLowPowerDevice</code> hook may require
          browser APIs like the Battery API.
        </Callout>
      </section>
    </>
  );
}

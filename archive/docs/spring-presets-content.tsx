"use client";

import { Callout } from "@/components/site/docs/shared/callout";
import { CodeViewer } from "@/components/site/docs/shared/code-viewer";
import { SimpleTable } from "@/components/site/docs/shared/props-table";
import { Tabs, Tab } from "@/components/site/docs/shared/tabs";

export default function SpringPresetsContent() {
  return (
    <>
      {/* Hero */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Motion Utilities
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg max-w-xl leading-relaxed">
          Spring presets, transition configurations, and animation variant
          factories. The foundation for all edbn/ui motion.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {/* Spring Presets */}
        <section>
          <h2
            id="spring-presets"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            Spring Presets
          </h2>
          <p className="mb-6 text-muted-foreground">
            Pre-configured spring physics for consistent animations across your
            app.
          </p>

          <Tabs items={["Usage", "Values"]}>
            <Tab value="Usage">
              <CodeViewer
                code={`import { springPresets } from "@/lib/motion"

// Use with Motion components
<motion.div
  animate={{ scale: 1 }}
  transition={springPresets.snappy}
>
  Snappy animation
</motion.div>

// Available presets
springPresets.snappy      // Quick, responsive (buttons, toggles)
springPresets.bouncy      // Playful with overshoot (notifications)
springPresets.smooth      // Smooth, no bounce (modals, sheets)
springPresets.gentle      // Subtle, barely perceptible (fades)
springPresets.interactive // For user interactions (drag)
springPresets.morphing    // For layoutId transitions (zero bounce)`}
              />
            </Tab>
            <Tab value="Values">
              <SimpleTable
                columns={[
                  { header: "Preset", key: "preset", isPrimary: true },
                  { header: "Stiffness", key: "stiffness", isCode: true },
                  { header: "Damping", key: "damping", isCode: true },
                  { header: "Mass", key: "mass", isCode: true },
                  { header: "Use Case", key: "useCase" },
                ]}
                data={[
                  {
                    preset: "snappy",
                    stiffness: "400",
                    damping: "30",
                    mass: "1",
                    useCase: "Quick UI responses",
                  },
                  {
                    preset: "bouncy",
                    stiffness: "300",
                    damping: "15",
                    mass: "1",
                    useCase: "Playful elements",
                  },
                  {
                    preset: "smooth",
                    stiffness: "200",
                    damping: "25",
                    mass: "1",
                    useCase: "Modals, overlays",
                  },
                  {
                    preset: "interactive",
                    stiffness: "500",
                    damping: "35",
                    mass: "0.8",
                    useCase: "Button press, hover",
                  },
                ]}
              />
            </Tab>
          </Tabs>
        </section>

        {/* Transitions */}
        <section>
          <h2
            id="transitions"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            Transitions
          </h2>
          <p className="mb-6 text-muted-foreground">
            Common transition configurations for consistent timing.
          </p>

          <CodeViewer
            code={`import { transitions } from "@/lib/motion"

// Fade transition (opacity changes)
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={transitions.fade}
/>

// Scale transition (grow/shrink)
<motion.div
  initial={{ scale: 0.95 }}
  animate={{ scale: 1 }}
  transition={transitions.scale}
/>

// Slide transition (position changes)
<motion.div
  initial={{ y: 20 }}
  animate={{ y: 0 }}
  transition={transitions.slide}
/>

// Available transitions:
transitions.fade     // duration: 0.15, ease: "easeOut"
transitions.scale    // springPresets.snappy
transitions.slide    // springPresets.smooth
transitions.stagger  // For staggered children`}
          />
        </section>

        {/* Stagger Variants */}
        <section>
          <h2
            id="stagger-variants"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            Stagger Variants
          </h2>
          <p className="mb-6 text-muted-foreground">
            Factory functions for creating staggered animations.
          </p>

          <Tabs items={["Container", "Items"]}>
            <Tab value="Container">
              <CodeViewer
                code={`import { createStaggerVariants } from "@/lib/motion"

// Create container variants
const containerVariants = createStaggerVariants({
  staggerChildren: 0.05,  // 50ms between each child
  delayChildren: 0.1,     // 100ms before first child
})

// Use with AnimatePresence
<motion.ul
  variants={containerVariants}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.label}
    </motion.li>
  ))}
</motion.ul>`}
              />
            </Tab>
            <Tab value="Items">
              <CodeViewer
                code={`import { createStaggerItemVariants } from "@/lib/motion"

// Create item variants
const itemVariants = createStaggerItemVariants({
  y: 10,        // Start 10px below
  x: 0,         // No horizontal offset
  scale: 0.95,  // Start slightly smaller
  opacity: 0,   // Start invisible
})

// Or use defaults
const defaultItems = createStaggerItemVariants()
// Default: { y: 8, scale: 0.98, opacity: 0 }

// Custom per-direction
const slideInRight = createStaggerItemVariants({ x: -20 })
const slideInLeft = createStaggerItemVariants({ x: 20 })
const popIn = createStaggerItemVariants({ scale: 0.5, y: 0 })`}
              />
            </Tab>
          </Tabs>
        </section>

        {/* Slide Variants */}
        <section>
          <h2
            id="slide-variants"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            Slide Variants
          </h2>
          <p className="mb-6 text-muted-foreground">
            Create directional slide animations for sheets and modals.
          </p>

          <CodeViewer
            code={`import { createSlideVariants } from "@/lib/motion"

// Slide from right (default for sheets)
const rightSlide = createSlideVariants("right")
// initial: { x: "100%" }
// animate: { x: 0 }
// exit: { x: "100%" }

// Slide from bottom
const bottomSlide = createSlideVariants("bottom")
// initial: { y: "100%" }
// animate: { y: 0 }
// exit: { y: "100%" }

// All directions
createSlideVariants("top")
createSlideVariants("right")
createSlideVariants("bottom")
createSlideVariants("left")

// Usage
<motion.div
  variants={bottomSlide}
  initial="initial"
  animate="animate"
  exit="exit"
>
  Sheet content
</motion.div>`}
          />
        </section>

        {/* Drag Config */}
        <section>
          <h2
            id="drag-config"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            Drag Config
          </h2>
          <p className="mb-6 text-muted-foreground">
            Configuration for drag-to-dismiss gestures.
          </p>

          <CodeViewer
            code={`import { dragConfig } from "@/lib/motion"

// Sheet drag configuration
const { 
  dismissThreshold,    // 100 - pixels to trigger dismiss
  velocityThreshold,   // 500 - px/s to trigger dismiss
} = dragConfig.sheet

// Dialog drag configuration  
const { 
  dismissThreshold,    // 80
  velocityThreshold,   // 300
} = dragConfig.dialog

// Custom drag handling
function handleDragEnd(event, info) {
  const { velocity, offset } = info
  
  if (
    offset.y > dragConfig.sheet.dismissThreshold ||
    velocity.y > dragConfig.sheet.velocityThreshold
  ) {
    onClose()
  }
}`}
          />
        </section>

        {/* Animation Keyframes */}
        <section>
          <h2
            id="css-keyframes"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            CSS Keyframes
          </h2>
          <p className="mb-6 text-muted-foreground">
            CSS keyframes defined in globals.css for non-Motion animations.
          </p>

          <CodeViewer
            code={`/* globals.css - CSS keyframes */

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes blur-in {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(var(--blur-lg));
  }
}

@keyframes spring-in {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  60% {
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Usage */
.my-element {
  animation: scale-in 0.3s ease-out;
}`}
          />
        </section>

        {/* Blur Scale */}
        <section>
          <h2
            id="blur-scale"
            className="mb-2 text-xl font-semibold tracking-tight"
          >
            Blur Scale
          </h2>
          <p className="mb-6 text-muted-foreground">
            Consistent blur values for glassmorphism effects.
          </p>

          <SimpleTable
            columns={[
              { header: "Variable", key: "variable", isPrimary: true },
              { header: "Value", key: "value", isCode: true },
              { header: "Use Case", key: "useCase" },
            ]}
            data={[
              {
                variable: "--blur-sm",
                value: "4px",
                useCase: "Subtle backgrounds",
              },
              {
                variable: "--blur-md",
                value: "8px",
                useCase: "Cards, tooltips",
              },
              {
                variable: "--blur-lg",
                value: "16px",
                useCase: "Popovers, dropdowns",
              },
              {
                variable: "--blur-xl",
                value: "24px",
                useCase: "Modals, dialogs",
              },
              {
                variable: "--blur-2xl",
                value: "40px",
                useCase: "Full-screen overlays",
              },
              {
                variable: "--blur-3xl",
                value: "64px",
                useCase: "Hero sections",
              },
            ]}
          />
        </section>

        <Callout title="Performance" type="warn">
          <code className="text-xs">backdrop-filter: blur()</code> can be
          expensive on mobile devices. Use the{" "}
          <code className="text-xs">useLowPowerDevice</code> hook to reduce blur
          on low-power devices.
        </Callout>
      </div>
    </>
  );
}

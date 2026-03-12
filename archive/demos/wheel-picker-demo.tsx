"use client";

import { useState } from "react";
import {
  WheelPicker,
  WheelPickerWrapper,
  type WheelPickerOption,
} from "@/components/ui/wheel-picker";

const frameworkOptions: WheelPickerOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "next", label: "Next.js" },
];

const monthOptions: WheelPickerOption[] = [
  { value: "jan", label: "January" },
  { value: "feb", label: "February" },
  { value: "mar", label: "March" },
  { value: "apr", label: "April" },
  { value: "may", label: "May" },
  { value: "jun", label: "June" },
  { value: "jul", label: "July" },
  { value: "aug", label: "August" },
  { value: "sep", label: "September" },
  { value: "oct", label: "October" },
  { value: "nov", label: "November" },
  { value: "dec", label: "December" },
];

export default function WheelPickerDemo() {
  const [framework, setFramework] = useState("react");
  const [month, setMonth] = useState("jan");

  return (
    <div className="space-y-8">
      {/* Basic */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Framework Picker
        </p>
        <div className="flex flex-col items-center gap-4">
          <WheelPickerWrapper className="max-w-64">
            <WheelPicker
              options={frameworkOptions}
              value={framework}
              onValueChange={setFramework}
            />
          </WheelPickerWrapper>
          <p className="text-sm text-muted-foreground">
            Selected:{" "}
            <code className="text-foreground font-mono">{framework}</code>
          </p>
        </div>
      </div>

      {/* Month Picker */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Month Picker
        </p>
        <div className="flex flex-col items-center gap-4">
          <WheelPickerWrapper className="max-w-64">
            <WheelPicker
              options={monthOptions}
              value={month}
              onValueChange={setMonth}
            />
          </WheelPickerWrapper>
          <p className="text-sm text-muted-foreground">
            Selected: <code className="text-foreground font-mono">{month}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

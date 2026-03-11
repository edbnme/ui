import path from "path";
import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "../vitest.config.base";

const isCI = !!process.env.CI;
const isStrictCoverage = process.env.STRICT_COVERAGE === "true";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      setupFiles: ["./src/__tests__/setup/test-setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx}"],

      coverage: {
        reportsDirectory: "./coverage",
        include: ["components/ui/**/*.tsx", "hooks/**/*.ts", "lib/**/*.ts"],
        thresholds: isStrictCoverage
          ? {
              lines: 90,
              functions: 90,
              branches: 85,
              statements: 90,
            }
          : {
              lines: 25,
              functions: 20,
              branches: 30,
              statements: 25,
            },
      },

      maxWorkers: isCI ? 2 : undefined,
      isolate: false,
    },

    resolve: {
      alias: {
        "@/test": path.resolve(__dirname, "./src/__tests__"),
        "@/components": path.resolve(__dirname, "./components"),
        "@/src/components": path.resolve(__dirname, "./src/components"),
        "@/lib": path.resolve(__dirname, "./lib"),
        "@/hooks": path.resolve(__dirname, "./hooks"),
        "@": path.resolve(__dirname, "./"),
      },
    },
  })
);

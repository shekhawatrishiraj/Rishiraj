import { defineConfig, globalIgnores } from "eslint/config";
import { createRequire } from "node:module";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const require = createRequire(import.meta.url);
const designPlugin = require("./eslint-plugin/index.js");

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "eslint-plugin/**",             // CJS plugin — requires require()
  ]),
  // Design system enforcement rules
  {
    plugins: { "design-system": designPlugin },
    files: ["src/**/*.tsx", "src/**/*.ts"],
    ignores: [
      "src/components/ui/**",          // shadcn primitives
      "src/app/globals.css",           // token definitions
      "src/**/celebration/**",         // confetti canvas — intentionally raw
      "src/components/persona-switcher.tsx", // dev tool — intentional dark surface
      "src/components/annotation-overlay.tsx", // dev tool — intentional dark surface
      "src/app/dev/**",                        // dev tools — intentional raw colors
      "src/components/ai-elements/terminal.tsx", // terminal — intentional dark surface
    ],
    rules: {
      "design-system/no-hardcoded-colors": "error",
      "design-system/no-raw-scale-colors": "error",
      "design-system/no-banned-arbitrary-font-sizes": "error",
      "design-system/approved-hover-patterns": "error",
      "design-system/no-inline-color-styles": "error",
      "design-system/no-raw-container-width": "error",
      "design-system/no-inline-empty-state": "warn",
      "design-system/text-xs-line-height": "warn",
      "design-system/no-dots-three-horizontal": "error",
    },
  },
]);

export default eslintConfig;

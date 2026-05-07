/**
 * Minimal ESLint config for lint-staged pre-commit hook.
 * Only runs design system rules — ignores pre-existing
 * warnings/errors from other plugins (react-hooks, typescript-eslint, etc.)
 */
import { defineConfig } from "eslint/config";
import { createRequire } from "node:module";
import tsParser from "@typescript-eslint/parser";

const require = createRequire(import.meta.url);
const designPlugin = require("./eslint-plugin/index.js");

const lintStagedConfig = defineConfig([
  {
    files: ["src/**/*.tsx", "src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    linterOptions: {
      noInlineConfig: true,
    },
    plugins: { "design-system": designPlugin },
    ignores: [
      "src/components/ui/**",
      "src/app/globals.css",
      "src/**/celebration/**",
      "src/components/persona-switcher.tsx",
      "src/components/annotation-overlay.tsx",
      "src/app/dev/**",
      "src/components/ai-elements/terminal.tsx",
    ],
    rules: {
      "design-system/no-hardcoded-colors": "error",
      "design-system/no-raw-scale-colors": "error",
      "design-system/no-banned-arbitrary-font-sizes": "error",
      "design-system/approved-hover-patterns": "error",
      "design-system/no-inline-color-styles": "error",
    },
  },
]);

export default lintStagedConfig;

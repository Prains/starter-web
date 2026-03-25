// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import sonarjs from "eslint-plugin-sonarjs";

/* eslint sonarjs/no-hardcoded-passwords: off */
export default withNuxt(
  {
    ignores: [".bun/**", ".context/**", ".data/**"],
  },
  sonarjs.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  {
    files: ["**/*.vue"],
    rules: {
      "vue/block-order": ["error", { order: ["template", "script", "style"] }],
    },
  },
  {
    files: ["**/pages/**/*.vue", "**/layouts/**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  {
    files: ["test/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "sonarjs/no-nested-functions": "off",
      "sonarjs/no-hardcoded-passwords": "off",
      "sonarjs/cognitive-complexity": "off",
      "import/first": "off",
      "unicorn/no-null": "off",
      "unicorn/consistent-function-scoping": "off",
    },
  },
  {
    files: ["prisma/seed.ts"],
    rules: {
      "sonarjs/no-hardcoded-passwords": "off",
    },
  },
  {
    files: [String.raw`**/pages/**/\[*\].vue`],
    rules: {
      "unicorn/filename-case": "off",
    },
  },
);

// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
export default withNuxt(
  {
    ignores: [
      ".bun/**",
      ".context/**",
      ".data/**",
      "dist/**",
      "prisma/generated/**",
    ],
  },
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
);

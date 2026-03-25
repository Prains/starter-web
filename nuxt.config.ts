import {
  getAuthRuntimeConfigDefaults,
} from "./shared/auth-env";

const runtimeConfigDefaults = getAuthRuntimeConfigDefaults(process.env);

export default defineNuxtConfig({
  compatibilityDate: "2026-03-25",
  ssr: true,
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
    "@vueuse/nuxt",
  ],
  runtimeConfig: runtimeConfigDefaults,
  nitro: {
    preset: "bun",
  },
  css: ["~/assets/css/main.css"],
  devtools: {
    enabled: true,
  },
});

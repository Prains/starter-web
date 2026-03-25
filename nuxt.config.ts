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
  runtimeConfig: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    AUTH_EMAIL_MODE: process.env.AUTH_EMAIL_MODE,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
  },
  nitro: {
    preset: "bun",
  },
  css: ["~/assets/css/main.css"],
  devtools: {
    enabled: true,
  },
});

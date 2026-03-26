<template>
  <UApp :locale="ru">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { ru } from "@nuxt/ui/locale";

const appName = "Plancy";
const appDescription = "Minimal Nuxt starter with live Prisma, Better Auth, and oRPC scaffolding.";

useHead({
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - ${appName}` : appName),
  htmlAttrs: { lang: "en" },
  meta: [
    { name: "theme-color", content: "#f4f4f5" },
  ],
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  ],
});

useSeoMeta({
  description: appDescription,
  robots: "index, follow",
  ogType: "website",
  ogTitle: appName,
  ogDescription: appDescription,
  ogImage: "/favicon.svg",
  ogImageAlt: appName,
  ogSiteName: appName,
  ogLocale: "en_US",
  twitterCard: "summary_large_image",
  twitterTitle: appName,
  twitterDescription: appDescription,
  twitterImage: "/favicon.svg",
  formatDetection: "telephone=no",
});
</script>

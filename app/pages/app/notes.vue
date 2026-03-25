<template>
  <section class="rounded-[2rem] border border-dashed border-slate-900/20 bg-white/75 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
    <p class="text-xs uppercase tracking-[0.35em] text-teal-700/70">
      Notes route
    </p>
    <h2 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
      Reference notes UI arrives next.
    </h2>
    <p class="mt-4 max-w-2xl text-base leading-7 text-slate-600">
      This placeholder keeps `/app/notes` in the route map now, so redirect sanitization and guest protection are already real before the notes module is implemented.
    </p>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app",
  middleware: ["auth"],
});
</script>

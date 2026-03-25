<template>
  <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div class="rounded-[2rem] border border-slate-900/10 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <p class="text-xs uppercase tracking-[0.35em] text-teal-700/70">
        Dashboard entry
      </p>
      <h2 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        You are inside the protected app shell.
      </h2>
      <p class="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        This page is intentionally small. Its job is to prove the auth gate, the redirect contract, and the session-aware layout before the notes reference module arrives.
      </p>
    </div>

    <div class="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-8 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
      <p class="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
        Next stops
      </p>
      <ul class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
        <li>Use the Notes route to exercise protected navigation.</li>
        <li>Open Profile to inspect session data and sign out.</li>
        <li>Return to `/auth/*` routes to confirm guest-only redirects.</li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app",
  middleware: ["auth"],
});
</script>

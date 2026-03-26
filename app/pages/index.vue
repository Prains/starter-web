<template>
  <main class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_45%),linear-gradient(180deg,#fafaf9_0%,#f4f4f5_100%)] px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto flex max-w-5xl flex-col gap-8">
      <section class="rounded-3xl border border-muted/60 bg-default/90 p-6 shadow-sm sm:p-8">
        <p class="text-sm font-medium uppercase tracking-[0.24em] text-dimmed">
          Plancy starter
        </p>
        <h1 class="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
          NuxtWelcome with live backend scaffolding
        </h1>
        <p class="mt-4 max-w-2xl text-base leading-7 text-toned sm:text-lg">
          This starter keeps Prisma, Better Auth, and oRPC wired for real work while the UI stays
          intentionally minimal. Set <code>DATABASE_URL</code>, run Prisma migrate, and start
          building.
        </p>
        <div class="mt-6 flex flex-wrap gap-3 text-sm text-toned">
          <span class="rounded-full border border-muted/70 bg-elevated px-3 py-1.5">Prisma</span>
          <span class="rounded-full border border-muted/70 bg-elevated px-3 py-1.5">Better Auth</span>
          <span class="rounded-full border border-muted/70 bg-elevated px-3 py-1.5">oRPC</span>
          <span class="rounded-full border border-muted/70 bg-elevated px-3 py-1.5">NuxtWelcome</span>
        </div>
        <pre class="mt-6 overflow-x-auto rounded-2xl bg-elevated p-4 text-sm text-toned"><code>bun install
# set DATABASE_URL in .env
bunx prisma migrate dev
bun run dev</code></pre>
      </section>

      <section class="rounded-3xl border border-muted/60 bg-default/80 p-3 shadow-sm sm:p-4">
        <NuxtWelcome />
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Starter",
});
</script>

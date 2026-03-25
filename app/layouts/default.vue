<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.22),_transparent_38%),linear-gradient(180deg,_#fcfcf9_0%,_#f4efe6_100%)] text-slate-950">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8">
      <header class="mb-10 flex flex-col gap-5 border-b border-slate-900/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <NuxtLink to="/" class="w-fit">
          <span class="block text-xs uppercase tracking-[0.35em] text-slate-500">
            Public starter
          </span>
          <span class="mt-1 block text-2xl font-semibold tracking-tight text-slate-950">
            Plancy Notes
          </span>
        </NuxtLink>

        <div class="flex flex-wrap gap-3">
          <UButton to="/auth/login" color="neutral" variant="ghost">
            Sign in
          </UButton>
          <UButton to="/auth/register">
            Create account
          </UButton>
        </div>
      </header>

      <main class="flex-1">
        <slot />
      </main>

      <footer class="mt-12 border-t border-slate-900/10 pt-6 text-sm text-slate-600">
        Nuxt 4, Better Auth, Prisma 7, oRPC, Pinia Colada.
      </footer>
    </div>
  </div>
</template>

<template>
  <section class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
    <div class="space-y-8">
      <div class="space-y-4">
        <p class="text-xs uppercase tracking-[0.35em] text-teal-800/70">
          Public landing
        </p>
        <h1 class="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
          A clean public starter with auth, redirect safety, and a reference notes app.
        </h1>
        <p class="max-w-2xl text-lg leading-8 text-slate-700">
          This starter is intentionally small, but it already includes the parts that usually break first: protected routes, token completion pages, and a typed backend surface.
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <UButton to="/auth/register" size="xl">
          Start with the register flow
        </UButton>
        <UButton to="/app" size="xl" color="neutral" variant="outline">
          Inspect the protected app route
        </UButton>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-[1.75rem] border border-slate-900/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p class="text-sm font-medium text-slate-950">`/auth/login`</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            Email-password sign-in plus magic-link request.
          </p>
        </div>
        <div class="rounded-[1.75rem] border border-slate-900/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p class="text-sm font-medium text-slate-950">`/auth/reset`</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            Request and completion states for reset-password links.
          </p>
        </div>
        <div class="rounded-[1.75rem] border border-slate-900/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p class="text-sm font-medium text-slate-950">`/app/*`</p>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            Protected pages that preserve the current path during login redirects.
          </p>
        </div>
      </div>
    </div>

    <div class="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-8 text-slate-100 shadow-[0_40px_120px_rgba(15,23,42,0.2)]">
      <p class="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
        Route map
      </p>
      <div class="mt-6 space-y-5">
        <div>
          <p class="font-medium text-white">Public</p>
          <p class="mt-1 text-sm text-slate-300">`/`, `/auth/login`, `/auth/register`, `/auth/reset`, `/auth/verify`, `/auth/magic-link`</p>
        </div>
        <div>
          <p class="font-medium text-white">Protected</p>
          <p class="mt-1 text-sm text-slate-300">`/app`, `/app/notes`, `/app/profile`</p>
        </div>
        <div>
          <p class="font-medium text-white">Redirect rule</p>
          <p class="mt-1 text-sm text-slate-300">Only relative `/app` targets survive sanitization.</p>
        </div>
      </div>
    </div>
  </section>
</template>

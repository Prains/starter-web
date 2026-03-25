<template>
  <div class="min-h-screen bg-[linear-gradient(135deg,_#0f172a_0%,_#11243c_45%,_#184e63_100%)] text-white">
    <div class="mx-auto grid min-h-screen max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
      <section class="space-y-8 rounded-[2rem] border border-white/10 bg-white/8 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)] backdrop-blur md:p-10">
        <div class="space-y-4">
          <p class="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
            Starter auth flow
          </p>
          <h1 class="max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Ship a production-shaped auth surface without starting from zero.
          </h1>
          <p class="max-w-xl text-base leading-7 text-slate-200">
            The public starter keeps onboarding, token flows, and protected app entry points aligned from day one.
          </p>
        </div>

        <div class="grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-black/10 p-4">
            <p class="font-medium text-white">Email + password</p>
            <p class="mt-2 text-slate-300">Typed forms with inline feedback.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-black/10 p-4">
            <p class="font-medium text-white">Token pages</p>
            <p class="mt-2 text-slate-300">Reset, verification, and magic-link completion.</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-black/10 p-4">
            <p class="font-medium text-white">Safe redirects</p>
            <p class="mt-2 text-slate-300">Only relative `/app` destinations are allowed.</p>
          </div>
        </div>
      </section>

      <main class="mx-auto w-full max-w-xl">
        <slot />
      </main>
    </div>
  </div>
</template>

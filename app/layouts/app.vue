<template>
  <div class="min-h-screen bg-[linear-gradient(180deg,_#f7f8f2_0%,_#edf4ef_44%,_#eef3f8_100%)] text-slate-950">
    <div class="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-8">
      <header class="mb-8 rounded-[2rem] border border-slate-900/10 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-teal-700/70">
              Authenticated shell
            </p>
            <h1 class="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Plancy starter app
            </h1>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <UButton to="/app" color="neutral" variant="ghost">
              Overview
            </UButton>
            <UButton to="/app/notes" color="neutral" variant="ghost">
              Notes
            </UButton>
            <UButton to="/app/profile" color="neutral" variant="ghost">
              Profile
            </UButton>
            <div class="rounded-full border border-slate-900/10 bg-slate-900 px-4 py-2 text-sm text-white">
              {{ currentEmail }}
            </div>
            <UButton color="neutral" variant="outline" @click="handleSignOut">
              Sign out
            </UButton>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { authClient, useAuthSession } from "../utils/auth-client";

const session = useAuthSession();
const currentUser = computed(() => session.value.data?.user ?? null);
const currentEmail = computed(() => currentUser.value?.email ?? "Unknown user");

const handleSignOut = async () => {
  await authClient.signOut();
  await navigateTo("/auth/login", { replace: true });
};
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
    <div class="rounded-[2rem] border border-slate-900/10 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <p class="text-xs uppercase tracking-[0.35em] text-teal-700/70">
        Profile
      </p>
      <h2 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        Session-backed account details
      </h2>

      <dl class="mt-8 space-y-5">
        <div>
          <dt class="text-sm font-medium text-slate-500">Name</dt>
          <dd class="mt-1 text-lg text-slate-950">
            {{ currentUser?.name || "Unknown" }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-slate-500">Email</dt>
          <dd class="mt-1 text-lg text-slate-950">
            {{ currentUser?.email || "Unknown" }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-slate-500">Email verified</dt>
          <dd class="mt-1 text-lg text-slate-950">
            {{ currentUser?.emailVerified ? "Yes" : "No" }}
          </dd>
        </div>
      </dl>
    </div>

    <div class="rounded-[2rem] border border-slate-900/10 bg-slate-950 p-8 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
      <p class="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
        Session actions
      </p>
      <p class="mt-4 text-sm leading-6 text-slate-300">
        Profile keeps a local sign-out entry so generated projects do not hide session controls inside an unrelated menu.
      </p>
      <UButton class="mt-6" color="neutral" variant="outline" @click="handleSignOut">
        Sign out
      </UButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { authClient, useAuthSession } from "../../utils/auth-client";

definePageMeta({
  layout: "app",
  middleware: ["auth"],
});

const session = useAuthSession();
const currentUser = computed(() => session.value.data?.user ?? null);

const handleSignOut = async () => {
  await authClient.signOut();
  await navigateTo("/auth/login", { replace: true });
};
</script>

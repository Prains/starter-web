<template>
  <div class="space-y-6 rounded-[2rem] border border-white/15 bg-white p-8 text-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
    <div class="space-y-2">
      <p class="text-xs uppercase tracking-[0.3em] text-teal-700/70">
        Magic link
      </p>
      <h2 class="text-3xl font-semibold tracking-tight text-slate-950">
        Complete your sign-in link
      </h2>
      <p class="text-sm leading-6 text-slate-600">
        Magic links bounce through this public page so invalid tokens can recover cleanly.
      </p>
    </div>

    <UAlert
      v-if="token && pageState.status === 'idle'"
      color="info"
      variant="soft"
      title="Completing sign-in"
      description="We are forwarding you to the secure verification endpoint."
    />

    <UAlert
      v-if="pageState.status === 'invalid'"
      color="warning"
      variant="soft"
      title="This magic link can no longer be used"
      description="Start a new sign-in from the login page."
    />

    <div v-if="pageState.status === 'invalid' || !token" class="flex flex-wrap gap-3">
      <UButton :to="pageState.status === 'invalid' ? pageState.ctaTo : '/auth/login'">
        {{ pageState.status === "invalid" ? pageState.ctaLabel : "Back to login" }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  buildMagicLinkVerificationUrl,
  resolveMagicLinkPageState,
} from "../../utils/auth-pages";
import { sanitizeAppRedirect } from "../../utils/auth-routing";

definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

const route = useRoute();
const redirectTarget = computed(() =>
  sanitizeAppRedirect(
    typeof route.query.redirect === "string" ? route.query.redirect : null,
  ),
);
const token = computed(() =>
  typeof route.query.token === "string" ? route.query.token : null,
);
const errorCode = computed(() =>
  typeof route.query.error === "string" ? route.query.error : null,
);
const pageState = computed(() => resolveMagicLinkPageState(errorCode.value));

onMounted(() => {
  if (!token.value || errorCode.value) {
    return;
  }

  window.location.assign(
    buildMagicLinkVerificationUrl(token.value, redirectTarget.value),
  );
});
</script>

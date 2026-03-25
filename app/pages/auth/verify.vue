<template>
  <div class="space-y-6 rounded-[2rem] border border-white/15 bg-white p-8 text-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
    <div class="space-y-2">
      <p class="text-xs uppercase tracking-[0.3em] text-teal-700/70">
        Verify email
      </p>
      <h2 class="text-3xl font-semibold tracking-tight text-slate-950">
        Complete email verification
      </h2>
      <p class="text-sm leading-6 text-slate-600">
        This page finishes verification links and provides a resend path when the token is no longer usable.
      </p>
    </div>

    <UAlert
      v-if="isCompleting"
      color="info"
      variant="soft"
      title="Completing verification"
      description="Hold on while we confirm your email."
    />

    <UAlert
      v-if="pageState.status === 'invalid'"
      color="warning"
      variant="soft"
      title="This verification link is no longer valid"
      description="Send yourself a fresh verification email to continue."
    />

    <UAlert
      v-if="inlineError"
      color="error"
      variant="soft"
      title="Verification failed"
      :description="inlineError"
    />

    <UAlert
      v-if="notice"
      color="success"
      variant="soft"
      title="Email sent"
      :description="notice"
    />

    <UForm
      v-if="!verificationToken || pageState.status === 'invalid' || inlineError"
      :state="resendState"
      :schema="verificationRequestSchema"
      class="space-y-4"
      @submit="handleResend"
    >
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="resendState.email"
          type="email"
          autocomplete="email"
          placeholder="demo@example.com"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" :loading="isResending">
        {{ pageState.status === "invalid" ? pageState.ctaLabel : "Send verification email" }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive } from "vue";

import {
  type VerificationRequestForm,
  verificationRequestSchema,
} from "../../../shared/validation/auth";
import {
  completeEmailVerification,
  resendVerificationEmail,
  resolveVerificationPageState,
} from "../../utils/auth-pages";
import { sanitizeAppRedirect } from "../../utils/auth-routing";
import { authClient } from "../../utils/auth-client";

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
const verificationToken = computed(() =>
  typeof route.query.token === "string" ? route.query.token : null,
);
const errorCode = computed(() =>
  typeof route.query.error === "string" ? route.query.error : null,
);
const pageState = computed(() => resolveVerificationPageState(errorCode.value));

const resendState = reactive<VerificationRequestForm>({
  email: "",
});

const inlineError = ref<string | null>(null);
const notice = ref<string | null>(null);
const isResending = ref(false);
const isCompleting = ref(false);

onMounted(async () => {
  if (!verificationToken.value || errorCode.value) {
    return;
  }

  inlineError.value = null;
  notice.value = null;
  isCompleting.value = true;

  try {
    const result = await completeEmailVerification(
      authClient,
      verificationToken.value,
      redirectTarget.value,
    );

    if (!result.ok) {
      inlineError.value = result.errorMessage;
      return;
    }

    await navigateTo(result.redirectTo, { replace: true });
  } finally {
    isCompleting.value = false;
  }
});

const handleResend = async (event: FormSubmitEvent<VerificationRequestForm>) => {
  inlineError.value = null;
  notice.value = null;
  isResending.value = true;

  try {
    const result = await resendVerificationEmail(
      authClient,
      event.data.email,
      redirectTarget.value,
      window.location.origin,
    );

    if (!result.ok) {
      inlineError.value = result.errorMessage;
      return;
    }

    notice.value = result.noticeMessage;
  } finally {
    isResending.value = false;
  }
};
</script>

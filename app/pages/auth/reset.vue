<template>
  <div class="space-y-6 rounded-[2rem] border border-white/15 bg-white p-8 text-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
    <div class="space-y-2">
      <p class="text-xs uppercase tracking-[0.3em] text-teal-700/70">
        Reset password
      </p>
      <h2 class="text-3xl font-semibold tracking-tight text-slate-950">
        {{ resetToken ? "Set a new password" : "Request a reset link" }}
      </h2>
      <p class="text-sm leading-6 text-slate-600">
        {{ resetToken ? "Complete the reset and continue back into the protected app." : "We route reset links back through this public completion page." }}
      </p>
    </div>

    <UAlert
      v-if="pageState.status === 'invalid'"
      color="warning"
      variant="soft"
      title="This reset link is no longer valid"
      description="Request a fresh reset link to continue."
    />

    <UAlert
      v-if="inlineError"
      color="error"
      variant="soft"
      title="Reset failed"
      :description="inlineError"
    />

    <UAlert
      v-if="notice"
      color="success"
      variant="soft"
      title="Check your inbox"
      :description="notice"
    />

    <UForm
      v-if="resetToken"
      :state="completionState"
      :schema="passwordResetCompletionSchema"
      class="space-y-4"
      @submit="handleCompletionSubmit"
    >
      <UFormField label="New password" name="newPassword" required>
        <UInput
          v-model="completionState.newPassword"
          type="password"
          autocomplete="new-password"
          placeholder="DemoPassword123!"
          class="w-full"
        />
      </UFormField>

      <div class="flex flex-wrap gap-3">
        <UButton type="submit" :loading="isCompleting">
          Save new password
        </UButton>
        <UButton
          v-if="pageState.status === 'invalid'"
          to="/auth/reset"
          color="neutral"
          variant="ghost"
        >
          {{ pageState.ctaLabel }}
        </UButton>
      </div>
    </UForm>

    <UForm
      v-else
      :state="requestState"
      :schema="passwordResetRequestSchema"
      class="space-y-4"
      @submit="handleRequestSubmit"
    >
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="requestState.email"
          type="email"
          autocomplete="email"
          placeholder="demo@example.com"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" :loading="isRequesting">
        Send reset link
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive } from "vue";

import {
  type PasswordResetCompletionForm,
  type PasswordResetRequestForm,
  passwordResetCompletionSchema,
  passwordResetRequestSchema,
} from "../../../shared/validation/auth";
import {
  completePasswordReset,
  requestPasswordResetLink,
  resolveResetPageState,
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
const resetToken = computed(() =>
  typeof route.query.token === "string" ? route.query.token : null,
);
const errorCode = computed(() =>
  typeof route.query.error === "string" ? route.query.error : null,
);
const pageState = computed(() => resolveResetPageState(errorCode.value));

const requestState = reactive<PasswordResetRequestForm>({
  email: "",
});
const completionState = reactive<PasswordResetCompletionForm>({
  newPassword: "",
});

const inlineError = ref<string | null>(null);
const notice = ref<string | null>(null);
const isRequesting = ref(false);
const isCompleting = ref(false);

const handleRequestSubmit = async (
  event: FormSubmitEvent<PasswordResetRequestForm>,
) => {
  inlineError.value = null;
  notice.value = null;
  isRequesting.value = true;

  try {
    const result = await requestPasswordResetLink(
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
    isRequesting.value = false;
  }
};

const handleCompletionSubmit = async (
  event: FormSubmitEvent<PasswordResetCompletionForm>,
) => {
  if (!resetToken.value) {
    return;
  }

  inlineError.value = null;
  notice.value = null;
  isCompleting.value = true;

  try {
    const result = await completePasswordReset(
      authClient,
      {
        token: resetToken.value,
        newPassword: event.data.newPassword,
      },
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
};
</script>

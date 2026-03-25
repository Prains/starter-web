<template>
  <div class="space-y-6 rounded-[2rem] border border-white/15 bg-white p-8 text-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
    <div class="space-y-2">
      <p class="text-xs uppercase tracking-[0.3em] text-teal-700/70">
        Login
      </p>
      <h2 class="text-3xl font-semibold tracking-tight text-slate-950">
        Sign in to the starter app
      </h2>
      <p class="text-sm leading-6 text-slate-600">
        Continue with email and password, or request a magic link to the same app workspace.
      </p>
    </div>

    <UAlert
      v-if="inlineError"
      color="error"
      variant="soft"
      title="Sign-in failed"
      :description="inlineError"
    />

    <UAlert
      v-if="notice"
      color="success"
      variant="soft"
      title="Check your inbox"
      :description="notice"
    />

    <UForm :state="loginState" :schema="loginFormSchema" class="space-y-4" @submit="handleSubmit">
      <UFormField label="Email" name="email" required>
        <UInput
          v-model="loginState.email"
          type="email"
          autocomplete="email"
          placeholder="demo@example.com"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
          v-model="loginState.password"
          type="password"
          autocomplete="current-password"
          placeholder="DemoPassword123!"
          class="w-full"
        />
      </UFormField>

      <div class="flex flex-wrap items-center gap-3 pt-2">
        <UButton type="submit" :loading="isSubmitting">
          Sign in
        </UButton>
        <UButton to="/auth/reset" color="neutral" variant="ghost">
          Forgot password?
        </UButton>
      </div>
    </UForm>

    <div class="border-t border-slate-200 pt-6">
      <p class="mb-3 text-sm font-medium text-slate-950">
        Prefer a magic link?
      </p>
      <UForm
        :state="magicLinkState"
        :schema="magicLinkRequestSchema"
        class="space-y-4"
        @submit="handleMagicLinkRequest"
      >
        <UFormField label="Email" name="email" required>
          <UInput
            v-model="magicLinkState.email"
            type="email"
            autocomplete="email"
            placeholder="demo@example.com"
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" color="neutral" variant="outline" :loading="isMagicLinkSubmitting">
          Email me a sign-in link
        </UButton>
      </UForm>
    </div>

    <p class="text-sm text-slate-600">
      New here?
      <NuxtLink to="/auth/register" class="font-medium text-teal-700">
        Create an account
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive } from "vue";

import {
  type LoginForm,
  type MagicLinkRequestForm,
  loginFormSchema,
  magicLinkRequestSchema,
} from "../../../shared/validation/auth";
import { requestMagicLink, submitLogin } from "../../utils/auth-pages";
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

const loginState = reactive<LoginForm>({
  email: "",
  password: "",
});

const magicLinkState = reactive<MagicLinkRequestForm>({
  email: "",
});

const inlineError = ref<string | null>(null);
const notice = ref<string | null>(null);
const isSubmitting = ref(false);
const isMagicLinkSubmitting = ref(false);

const handleSubmit = async (event: FormSubmitEvent<LoginForm>) => {
  inlineError.value = null;
  notice.value = null;
  isSubmitting.value = true;

  try {
    const result = await submitLogin(authClient, event.data, redirectTarget.value);

    if (!result.ok) {
      inlineError.value = result.errorMessage;
      return;
    }

    await navigateTo(result.redirectTo, { replace: true });
  } finally {
    isSubmitting.value = false;
  }
};

const handleMagicLinkRequest = async (
  event: FormSubmitEvent<MagicLinkRequestForm>,
) => {
  inlineError.value = null;
  notice.value = null;
  isMagicLinkSubmitting.value = true;

  try {
    const result = await requestMagicLink(
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
    magicLinkState.email = event.data.email;
  } finally {
    isMagicLinkSubmitting.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 rounded-[2rem] border border-white/15 bg-white p-8 text-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
    <div class="space-y-2">
      <p class="text-xs uppercase tracking-[0.3em] text-teal-700/70">
        Register
      </p>
      <h2 class="text-3xl font-semibold tracking-tight text-slate-950">
        Create your starter account
      </h2>
      <p class="text-sm leading-6 text-slate-600">
        Registration sends the verification link to the starter completion page, not to the app shell directly.
      </p>
    </div>

    <UAlert
      v-if="inlineError"
      color="error"
      variant="soft"
      title="Registration failed"
      :description="inlineError"
    />

    <UAlert
      v-if="notice"
      color="success"
      variant="soft"
      title="Check your inbox"
      :description="notice"
    />

    <UForm :state="state" :schema="registerFormSchema" class="space-y-4" @submit="handleSubmit">
      <UFormField label="Name" name="name" required>
        <UInput
          v-model="state.name"
          autocomplete="name"
          placeholder="Demo User"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Email" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="demo@example.com"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="new-password"
          placeholder="DemoPassword123!"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" :loading="isSubmitting">
        Create account
      </UButton>
    </UForm>

    <p class="text-sm text-slate-600">
      Already have access?
      <NuxtLink to="/auth/login" class="font-medium text-teal-700">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive } from "vue";

import {
  type RegisterForm,
  registerFormSchema,
} from "../../../shared/validation/auth";
import { submitRegistration } from "../../utils/auth-pages";
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

const state = reactive<RegisterForm>({
  name: "",
  email: "",
  password: "",
});

const inlineError = ref<string | null>(null);
const notice = ref<string | null>(null);
const isSubmitting = ref(false);

const handleSubmit = async (event: FormSubmitEvent<RegisterForm>) => {
  inlineError.value = null;
  notice.value = null;
  isSubmitting.value = true;

  try {
    const result = await submitRegistration(
      authClient,
      event.data,
      redirectTarget.value,
      window.location.origin,
    );

    if (!result.ok) {
      inlineError.value = result.errorMessage;
      return;
    }

    notice.value = result.noticeMessage;
    state.password = "";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

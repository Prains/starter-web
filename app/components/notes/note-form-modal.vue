<template>
  <UModal
    v-model:open="open"
    :title="modalTitle"
    :description="modalDescription"
    :dismissible="!state.isSubmitting"
    :close="!state.isSubmitting"
    :ui="{
      content: 'sm:max-w-2xl',
      body: 'p-0',
    }"
    @after:leave="emit('after:leave')"
  >
    <template #body>
      <UForm
        :state="state.values"
        :schema="noteFormSchema"
        class="space-y-5 p-6"
        @submit="handleSubmit"
      >
        <UFormField label="Title" name="title" required>
          <UInput
            v-model="state.values.title"
            placeholder="Product launch checklist"
            class="w-full"
            :disabled="state.isSubmitting"
          />
        </UFormField>

        <UFormField label="Content" name="content">
          <UTextarea
            v-model="state.values.content"
            :rows="8"
            placeholder="Use this starter modal to demonstrate validation, loading, and retry states."
            class="w-full"
            :disabled="state.isSubmitting"
          />
        </UFormField>

        <div
          v-if="state.feedbackMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
        >
          {{ state.feedbackMessage }}
        </div>

        <div class="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-slate-500">
            {{ helperCopy }}
          </p>

          <div class="flex items-center justify-end gap-3">
            <UButton
              type="button"
              color="neutral"
              variant="ghost"
              :disabled="state.isSubmitting"
              @click="handleCancel"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              icon="i-lucide-save"
              :loading="state.isSubmitting"
              :disabled="state.isSubmitting"
            >
              {{ submitLabel }}
            </UButton>
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive } from "vue";

import {
  createNoteFormController,
  type NoteFormControllerState,
  type NoteRecord,
} from "../../utils/notes-ui";
import { noteFormSchema, type NoteForm } from "../../../shared/validation/note-form";

type NoteFormModalResult = false | {
  ok: true;
  note: NoteRecord;
  feedbackMessage: string;
};

interface Properties {
  note?: NoteRecord | null;
  redirectPath?: string;
  refetchNotes?: () => Promise<unknown> | unknown;
}

const properties = defineProps<Properties>();

const emit = defineEmits<{
  close: [value?: NoteFormModalResult];
  "after:leave": [];
}>();

const open = defineModel<boolean>("open", { default: true });

const createNote = useCreateNote();
const updateNote = useUpdateNote();

const controller = createNoteFormController({
  mode: properties.note ? "edit" : "create",
  note: properties.note ?? undefined,
  redirectPath: properties.redirectPath,
  createNote: (input) => createNote.mutateAsync(input),
  updateNote: (input) => updateNote.mutateAsync(input),
  refetchNotes: properties.refetchNotes,
  navigateToLogin: (redirectTo) => navigateTo(redirectTo, { replace: true }),
});

const state = reactive<NoteFormControllerState>(controller.state);

const modalTitle = computed(() =>
  properties.note ? "Edit note" : "Create note",
);
const modalDescription = computed(() =>
  properties.note
    ? "Update a note without leaving the authenticated shell."
    : "Open the reference overlay to create a starter note.",
);
const helperCopy = computed(() =>
  properties.note
    ? "The modal only closes after a successful update."
    : "Client-side validation runs through UForm before the mutation.",
);
const submitLabel = computed(() =>
  properties.note ? "Save changes" : "Create note",
);

watch(
  () => [properties.note, properties.redirectPath, properties.refetchNotes] as const,
  () => {
    controller.reset({
      mode: properties.note ? "edit" : "create",
      note: properties.note ?? undefined,
      redirectPath: properties.redirectPath,
      refetchNotes: properties.refetchNotes,
    });
  },
  { immediate: true, deep: true },
);

async function handleSubmit(event: FormSubmitEvent<NoteForm>) {
  state.values.title = event.data.title;
  state.values.content = event.data.content;

  const result = await controller.submit();

  if (result.ok) {
    emit("close", result);
  }
}

function handleCancel() {
  if (state.isSubmitting) {
    return;
  }

  emit("close", false);
}
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-[2rem] border border-slate-900/10 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="text-xs uppercase tracking-[0.35em] text-teal-700/70">
            Reference module
          </p>
          <h2 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Notes CRUD with oRPC, Better Auth, and overlays
          </h2>
          <p class="mt-4 text-base leading-7 text-slate-600">
            This page demonstrates the starter's authenticated data path: typed
            queries, mutation invalidation, retryable errors, and an overlay-based
            modal that stays open until the mutation succeeds.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div class="rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            {{ noteCountLabel }}
          </div>
          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-refresh-cw"
            :loading="isRefreshing"
            @click="handleRetry"
          >
            Refresh
          </UButton>
          <UButton icon="i-lucide-plus" @click="handleCreate">
            New note
          </UButton>
        </div>
      </div>
    </div>

    <div
      v-if="collectionState.kind === 'loading'"
      class="flex min-h-[18rem] items-center justify-center rounded-[2rem] border border-slate-900/10 bg-white/75 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
    >
      <div class="flex items-center gap-3 text-slate-500">
        <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
        <span>{{ collectionState.description }}</span>
      </div>
    </div>

    <UEmpty
      v-else-if="collectionState.kind === 'error'"
      icon="i-lucide-cloud-off"
      :title="collectionState.title"
      :description="collectionState.description"
      :actions="[
        {
          label: collectionState.retryLabel,
          icon: 'i-lucide-refresh-cw',
          color: 'neutral',
          variant: 'outline',
          onClick: handleRetry,
        },
      ]"
      class="rounded-[2rem] border border-slate-900/10 bg-white/80 py-20 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
    />

    <UEmpty
      v-else-if="collectionState.kind === 'empty'"
      icon="i-lucide-notebook-tabs"
      :title="collectionState.title"
      :description="collectionState.description"
      :actions="[
        {
          label: 'Create note',
          icon: 'i-lucide-plus',
          onClick: handleCreate,
        },
      ]"
      class="rounded-[2rem] border border-slate-900/10 bg-white/80 py-20 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
    />

    <div
      v-else
      class="grid gap-4 lg:grid-cols-2"
    >
      <article
        v-for="note in collectionState.notes"
        :key="note.id"
        class="group rounded-[2rem] border border-slate-900/10 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
              Updated {{ formatNoteTimestamp(note.updated_at) }}
            </p>
            <h3 class="mt-2 line-clamp-2 text-xl font-semibold tracking-tight text-slate-950">
              {{ note.title }}
            </h3>
          </div>

          <div class="flex items-center gap-1">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-pencil-line"
              aria-label="Edit note"
              @click="handleEdit(note)"
            />
            <UButton
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              aria-label="Delete note"
              :loading="deletingNoteId === note.id"
              :disabled="deletingNoteId === note.id"
              @click="handleDelete(note)"
            />
          </div>
        </div>

        <p class="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
          {{ note.content || "No content yet. Use this card to demo empty note bodies too." }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { NoteRecord } from "../../utils/notes-ui";
import {
  resolveNotesCollectionState,
  submitDeleteNoteAction,
} from "../../utils/notes-ui";

definePageMeta({
  layout: "app",
  middleware: ["auth"],
});

const NOTES_ROUTE = "/app/notes";

const overlay = useOverlay();
const toast = useToast();
const noteFormModal = useNoteFormModalOverlay(overlay);

const {
  data: notes,
  error,
  status,
  isLoading,
  refetch,
} = useNotes();
const deleteNote = useDeleteNote();

const deletingNoteId = ref<string | null>(null);
type NoteModalSuccessResult = {
  ok: true;
  note: NoteRecord;
  feedbackMessage: string;
};

const collectionState = computed(() =>
  resolveNotesCollectionState({
    isPending: status.value === "pending" || (isLoading.value && !notes.value),
    error: error.value,
    notes: notes.value ?? undefined,
  }),
);

const noteCountLabel = computed(() => {
  const noteCount =
    collectionState.value.kind === "ready" ? collectionState.value.notes.length : 0;

  return `${noteCount} ${noteCount === 1 ? "note" : "notes"}`;
});

const isRefreshing = computed(
  () => isLoading.value && collectionState.value.kind !== "loading",
);

function formatNoteTimestamp(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function handleRetry() {
  await refetch();
}

async function handleCreate() {
  const instance = noteFormModal.open({
    redirectPath: NOTES_ROUTE,
    refetchNotes: () => refetch(),
  });
  const result = (await instance.result) as
    | NoteModalSuccessResult
    | false
    | undefined;

  if (result && "ok" in result && result.ok) {
    toast.add({
      title: result.feedbackMessage,
      color: "success",
    });
  }
}

async function handleEdit(note: NoteRecord) {
  const instance = noteFormModal.open({
    note,
    redirectPath: NOTES_ROUTE,
    refetchNotes: () => refetch(),
  });
  const result = (await instance.result) as
    | NoteModalSuccessResult
    | false
    | undefined;

  if (result && "ok" in result && result.ok) {
    toast.add({
      title: result.feedbackMessage,
      color: "success",
    });
  }
}

async function handleDelete(note: NoteRecord) {
  deletingNoteId.value = note.id;

  const result = await submitDeleteNoteAction({
    noteId: note.id,
    redirectPath: NOTES_ROUTE,
    deleteNote: (input) => deleteNote.mutateAsync(input),
    refetchNotes: () => refetch(),
    navigateToLogin: (redirectTo) => navigateTo(redirectTo, { replace: true }),
  });

  deletingNoteId.value = null;

  if (result.ok) {
    toast.add({
      title: result.feedbackMessage,
      color: "success",
    });
    return;
  }

  if (result.code !== "UNAUTHORIZED") {
    toast.add({
      title: "Notes",
      description: result.feedbackMessage,
      color: "error",
    });
  }
}
</script>

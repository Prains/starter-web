# UI Patterns

> Purpose: starter rules for modal and form UI on Nuxt UI v4.

## Nuxt UI v4

This starter uses Nuxt UI v4, not v3.

- Use `:items`, not `:options`
- Use `value-key`, not `value-attribute`
- Use `label-key`, not `option-attribute`

## useOverlay

All programmatic modals should use `useOverlay()` through dedicated helpers in `app/composables/modals.ts`.

```ts
const overlay = useOverlay();
const noteFormModal = useNoteFormModalOverlay(overlay);
```

Prefer the composable helper over calling `overlay.create()` inline once the modal has a canonical project wrapper.

## Modal composables

Keep the overlay entrypoint small:

```ts
import type { Component } from "vue";
import { LazyNotesNoteFormModal } from "#components";

function createOverlay<T extends Component>(component: T) {
  return (overlay: ReturnType<typeof useOverlay>) => overlay.create(component);
}

export const useNoteFormModalOverlay = createOverlay(LazyNotesNoteFormModal);
```

Rules:

- expose one composable per reusable modal
- keep modal ownership in `app/composables/modals.ts`
- let pages and feature composables call `overlay.open(...)` and await `instance.result`

## UForm

All starter forms use `UForm` plus Zod.

```vue
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  content: z.string().trim().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  title: "",
  content: "",
});

const handleSubmit = (event: FormSubmitEvent<Schema>) => {
  saveMutation.mutate(event.data);
};
</script>
```

Rules:

- use `UForm`
- wrap each field with `UFormField`
- keep validation in Zod
- submit handlers should work with `event.data`
- submit buttons stay inside the form
- cancel buttons use `type="button"`

## Modal submit flow

The starter note modal is the reference pattern:

- client-side validation happens through `UForm` and Zod
- loading state disables duplicate submission
- server errors keep the modal open
- success resolves the overlay and closes the modal

Do not close a modal before the mutation succeeds.

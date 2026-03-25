# Vue Patterns

Mirror of `.codex/docs/vue-patterns.md`.

## generic components

Use `generic="..."` in `<script setup>` when a reusable component needs typed slot props.

```vue
<script setup lang="ts" generic="T extends { value: string; label: string }">
interface Props {
  items: T[];
}

defineProps<Props>();

defineSlots<{
  item: (props: { item: T }) => unknown;
}>();
</script>
```

Avoid template casts like `item as Something`.

## defineModel

Prefer `defineModel()` for ordinary `v-model` bindings.

```ts
const open = defineModel<boolean>("open", { default: true });
const search = defineModel<string>({ default: "" });
```

Use computed get/set only when you need value transformation or extra side effects.

## createReusableTemplate

Use `createReusableTemplate` when one component repeats the same markup fragment and extracting a separate component would add noise.

```ts
import { createReusableTemplate } from "@vueuse/core";

const [DefineBadge, ReuseBadge] = createReusableTemplate();
```

Rules:

- define the fragment once in `Define*`
- render it where needed with `Reuse*`
- put `v-if` on `Reuse*`, not `Define*`

## focused components

Keep Vue files small and single-purpose.

- page files coordinate data loading and route concerns
- modal files own local form UI
- composables own reusable state and mutation logic
- helpers own framework-light logic that should be easy to test

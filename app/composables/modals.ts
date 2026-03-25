import type { Component } from "vue";
import { LazyNotesNoteFormModal } from "#components";

function createOverlay<T extends Component>(component: T) {
  return (overlay: ReturnType<typeof useOverlay>) => overlay.create(component);
}

export const useNoteFormModalOverlay = createOverlay(LazyNotesNoteFormModal);

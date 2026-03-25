import { useMutation, useQuery, useQueryCache } from "@pinia/colada";

import { useORPC } from "../utils/orpc";
import type { NoteForm } from "../../shared/validation/note-form";

type ORPCUtils = ReturnType<typeof useORPC>;
type ORPCCreateNoteInput = Parameters<ORPCUtils["notes"]["create"]["call"]>[0];
type ORPCUpdateNoteInput = Parameters<ORPCUtils["notes"]["update"]["call"]>[0];
type ORPCDeleteNoteInput = Parameters<ORPCUtils["notes"]["delete"]["call"]>[0];

type CreateNoteInput = {
  data: NoteForm;
};

type UpdateNoteInput = {
  where: {
    id: string;
  };
  data: NoteForm;
};

type DeleteNoteInput = {
  where: {
    id: string;
  };
};

export function useNotes() {
  const orpc = useORPC();

  return useQuery(
    orpc.notes.list.queryOptions({
      input: {},
      staleTime: 30_000,
    }),
  );
}

export function useCreateNote() {
  const orpc = useORPC();
  const queryCache = useQueryCache();
  const listKey = orpc.notes.list.key({
    input: {},
  });

  return useMutation({
    mutation: (input: CreateNoteInput) =>
      orpc.notes.create.call(input as ORPCCreateNoteInput),
    onSuccess: () => {
      queryCache.invalidateQueries({
        key: listKey,
      });
    },
  });
}

export function useUpdateNote() {
  const orpc = useORPC();
  const queryCache = useQueryCache();
  const listKey = orpc.notes.list.key({
    input: {},
  });

  return useMutation({
    mutation: (input: UpdateNoteInput) =>
      orpc.notes.update.call(input as ORPCUpdateNoteInput),
    onSuccess: () => {
      queryCache.invalidateQueries({
        key: listKey,
      });
    },
  });
}

export function useDeleteNote() {
  const orpc = useORPC();
  const queryCache = useQueryCache();
  const listKey = orpc.notes.list.key({
    input: {},
  });

  return useMutation({
    mutation: (input: DeleteNoteInput) =>
      orpc.notes.delete.call(input as ORPCDeleteNoteInput),
    onSuccess: () => {
      queryCache.invalidateQueries({
        key: listKey,
      });
    },
  });
}

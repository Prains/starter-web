import { buildLoginRedirect } from "../../shared/auth-routes";
import { noteFormSchema, type NoteForm } from "../../shared/validation/note-form";

export type NoteRecord = {
  id: string;
  title: string;
  content: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

type NoteFieldName = keyof NoteForm;
type NoteFieldErrors = Partial<Record<NoteFieldName, string>>;
type NoteErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

type NoteCollectionState =
  | {
      kind: "loading";
      title: string;
      description: string;
    }
  | {
      kind: "empty";
      title: string;
      description: string;
    }
  | {
      kind: "error";
      title: string;
      description: string;
      retryLabel: string;
    }
  | {
      kind: "ready";
      notes: NoteRecord[];
    };

type SuccessFormResult = {
  ok: true;
  note: NoteRecord;
  feedbackMessage: string;
};

type FailedFormResult = {
  ok: false;
  code: NoteErrorCode;
  feedbackMessage: string | null;
  fieldErrors?: NoteFieldErrors;
  redirectTo?: string;
};

type DeleteSuccessResult = {
  ok: true;
  feedbackMessage: string;
};

type DeleteFailureResult = {
  ok: false;
  code: Exclude<NoteErrorCode, "VALIDATION_ERROR">;
  feedbackMessage: string;
  redirectTo?: string;
};

type NoteMutationError = {
  code?: string;
  message?: string;
  data?: {
    message?: string;
  };
};

type RefetchNotes = () => Promise<unknown> | unknown;
type NavigateToLogin = (redirectTo: string) => Promise<unknown> | unknown;

type CreateNoteInput = {
  data: NoteForm;
};

type UpdateNoteInput = {
  where: {
    id: string;
  };
  data: NoteForm;
};

export type NoteFormControllerState = {
  values: NoteForm;
  fieldErrors: NoteFieldErrors;
  feedbackMessage: string | null;
  isSubmitting: boolean;
};

type NoteFormControllerOptions = {
  mode: "create" | "edit";
  note?: NoteRecord;
  redirectPath?: string;
  createNote: (input: CreateNoteInput) => Promise<NoteRecord>;
  updateNote: (input: UpdateNoteInput) => Promise<NoteRecord>;
  refetchNotes?: RefetchNotes;
  navigateToLogin: NavigateToLogin;
};

type NoteFormController = {
  state: NoteFormControllerState;
  setField: (field: NoteFieldName, value: string) => void;
  reset: (
    overrides?: Partial<Pick<NoteFormControllerOptions, "mode" | "note" | "redirectPath" | "refetchNotes">>,
  ) => void;
  submit: () => Promise<SuccessFormResult | FailedFormResult>;
};

type DeleteNoteActionOptions = {
  noteId: string;
  redirectPath?: string;
  deleteNote: (input: { where: { id: string } }) => Promise<unknown>;
  refetchNotes?: RefetchNotes;
  navigateToLogin: NavigateToLogin;
};

const NOTES_LOADING_TITLE = "Loading notes";
const NOTES_LOADING_DESCRIPTION =
  "Fetching the latest notes for this account.";
const NOTES_EMPTY_TITLE = "No notes yet";
const NOTES_EMPTY_DESCRIPTION =
  "Create the first note to see the starter CRUD flow.";
const NOTES_ERROR_TITLE = "Unable to load notes";
const NOTES_ERROR_RETRY_LABEL = "Try again";
const NOTE_CREATED_MESSAGE = "Note created.";
const NOTE_UPDATED_MESSAGE = "Note updated.";
const NOTE_DELETED_MESSAGE = "Note deleted.";
const NOTE_SAVE_RETRY_MESSAGE = "We couldn't save the note. Try again.";
const NOTE_DELETE_RETRY_MESSAGE = "We couldn't delete the note. Try again.";
const NOTE_MISSING_MESSAGE = "This note no longer exists. Refreshing the list.";
const SESSION_EXPIRED_MESSAGE = "Your session expired. Sign in again.";
const FALLBACK_LIST_ERROR_MESSAGE =
  "Something went wrong while loading notes.";

function createNoteValues(note?: NoteRecord): NoteForm {
  return {
    title: note?.title ?? "",
    content: note?.content ?? "",
  };
}

function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const error_ = error as NoteMutationError;

  return error_.code;
}

function getErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (!error || typeof error !== "object") {
    return undefined;
  }

  const error_ = error as NoteMutationError;

  return error_.data?.message ?? error_.message;
}

function getFirstFieldErrors(values: {
  title?: string[];
  content?: string[];
}): NoteFieldErrors {
  const fieldErrors: NoteFieldErrors = {};

  for (const field of ["title", "content"] as const) {
    const message = values[field]?.[0];

    if (message) {
      fieldErrors[field] = message;
    }
  }

  return fieldErrors;
}

async function refreshNotes(refetchNotes?: RefetchNotes) {
  if (!refetchNotes) {
    return;
  }

  try {
    await refetchNotes();
  } catch {
    // The page state will continue to show the existing error surface.
  }
}

export function resolveNotesCollectionState(input: {
  isPending: boolean;
  error: unknown;
  notes: NoteRecord[] | null | undefined;
}): NoteCollectionState {
  if (input.isPending) {
    return {
      kind: "loading",
      title: NOTES_LOADING_TITLE,
      description: NOTES_LOADING_DESCRIPTION,
    };
  }

  if (input.error) {
    return {
      kind: "error",
      title: NOTES_ERROR_TITLE,
      description: getErrorMessage(input.error) ?? FALLBACK_LIST_ERROR_MESSAGE,
      retryLabel: NOTES_ERROR_RETRY_LABEL,
    };
  }

  if (!input.notes || input.notes.length === 0) {
    return {
      kind: "empty",
      title: NOTES_EMPTY_TITLE,
      description: NOTES_EMPTY_DESCRIPTION,
    };
  }

  return {
    kind: "ready",
    notes: input.notes,
  };
}

export function createNoteFormController(
  options: NoteFormControllerOptions,
): NoteFormController {
  let mode = options.mode;
  let currentNote = options.note;
  let redirectPath = options.redirectPath ?? "/app/notes";
  let refetchNotes = options.refetchNotes;
  let pendingSubmission: Promise<SuccessFormResult | FailedFormResult> | null =
    null;

  const state: NoteFormControllerState = {
    values: createNoteValues(options.note),
    fieldErrors: {},
    feedbackMessage: null,
    isSubmitting: false,
  };

  function reset(
    overrides: Partial<
      Pick<
        NoteFormControllerOptions,
        "mode" | "note" | "redirectPath" | "refetchNotes"
      >
    > = {},
  ) {
    mode = overrides.mode ?? mode;
    currentNote = overrides.note ?? currentNote;
    redirectPath = overrides.redirectPath ?? redirectPath;
    refetchNotes = overrides.refetchNotes ?? refetchNotes;
    pendingSubmission = null;

    state.values.title = currentNote?.title ?? "";
    state.values.content = currentNote?.content ?? "";
    state.fieldErrors = {};
    state.feedbackMessage = null;
    state.isSubmitting = false;
  }

  function setField(field: NoteFieldName, value: string) {
    state.values[field] = value;
    state.fieldErrors = {
      ...state.fieldErrors,
      [field]: undefined,
    };
  }

  async function submit() {
    if (pendingSubmission) {
      return await pendingSubmission;
    }

    const parsed = noteFormSchema.safeParse(state.values);

    if (!parsed.success) {
      const fieldErrors = getFirstFieldErrors(parsed.error.flatten().fieldErrors);

      state.fieldErrors = fieldErrors;
      state.feedbackMessage = null;

      return {
        ok: false as const,
        code: "VALIDATION_ERROR" as const,
        feedbackMessage: null,
        fieldErrors,
      };
    }

    state.fieldErrors = {};
    state.feedbackMessage = null;
    state.isSubmitting = true;

    pendingSubmission = (async () => {
      try {
        const note =
          mode === "edit" && currentNote
            ? await options.updateNote({
                where: {
                  id: currentNote.id,
                },
                data: parsed.data,
              })
            : await options.createNote({
                data: parsed.data,
              });

        state.feedbackMessage = null;

        return {
          ok: true as const,
          note,
          feedbackMessage:
            mode === "edit" ? NOTE_UPDATED_MESSAGE : NOTE_CREATED_MESSAGE,
        };
      } catch (error) {
        const code = getErrorCode(error);

        if (code === "UNAUTHORIZED") {
          const loginRedirect = buildLoginRedirect(redirectPath);

          await options.navigateToLogin(loginRedirect);

          state.feedbackMessage = SESSION_EXPIRED_MESSAGE;

          return {
            ok: false as const,
            code: "UNAUTHORIZED" as const,
            redirectTo: loginRedirect,
            feedbackMessage: SESSION_EXPIRED_MESSAGE,
          };
        }

        if (code === "NOT_FOUND") {
          await refreshNotes(refetchNotes);

          state.feedbackMessage = NOTE_MISSING_MESSAGE;

          return {
            ok: false as const,
            code: "NOT_FOUND" as const,
            feedbackMessage: NOTE_MISSING_MESSAGE,
          };
        }

        state.feedbackMessage = NOTE_SAVE_RETRY_MESSAGE;

        return {
          ok: false as const,
          code: "INTERNAL_ERROR" as const,
          feedbackMessage: NOTE_SAVE_RETRY_MESSAGE,
        };
      } finally {
        state.isSubmitting = false;
        pendingSubmission = null;
      }
    })();

    return await pendingSubmission;
  }

  return {
    state,
    setField,
    reset,
    submit,
  };
}

export async function submitDeleteNoteAction(
  options: DeleteNoteActionOptions,
): Promise<DeleteSuccessResult | DeleteFailureResult> {
  try {
    await options.deleteNote({
      where: {
        id: options.noteId,
      },
    });

    return {
      ok: true,
      feedbackMessage: NOTE_DELETED_MESSAGE,
    };
  } catch (error) {
    const code = getErrorCode(error);

    if (code === "UNAUTHORIZED") {
      const loginRedirect = buildLoginRedirect(options.redirectPath ?? "/app/notes");

      await options.navigateToLogin(loginRedirect);

      return {
        ok: false as const,
        code: "UNAUTHORIZED",
        redirectTo: loginRedirect,
        feedbackMessage: SESSION_EXPIRED_MESSAGE,
      };
    }

    if (code === "NOT_FOUND") {
      await refreshNotes(options.refetchNotes);

      return {
        ok: false as const,
        code: "NOT_FOUND",
        feedbackMessage: NOTE_MISSING_MESSAGE,
      };
    }

    return {
      ok: false as const,
      code: "INTERNAL_ERROR",
      feedbackMessage: NOTE_DELETE_RETRY_MESSAGE,
    };
  }
}

import { beforeEach, describe, expect, it, vi } from "vitest";

type StarterNote = {
  id: string;
  title: string;
  content: string | null;
  created_at: Date;
  updated_at: Date;
};

const redirectPath = "/app/notes";
const createdAt = new Date("2026-03-25T08:00:00.000Z");
const updatedAt = new Date("2026-03-26T09:30:00.000Z");

const existingNote: StarterNote = {
  id: "note_existing",
  title: "Draft note",
  content: "Existing body",
  created_at: createdAt,
  updated_at: updatedAt,
};

async function loadNotesUi() {
  return await import("../../../app/utils/notes-ui");
}

describe("notes page helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("derives loading, empty, recoverable error, and ready list states", async () => {
    const { resolveNotesCollectionState } = await loadNotesUi();

    expect(
      resolveNotesCollectionState({
        isPending: true,
        error: null,
        notes: undefined,
      }),
    ).toEqual({
      kind: "loading",
      title: "Loading notes",
      description: "Fetching the latest notes for this account.",
    });

    expect(
      resolveNotesCollectionState({
        isPending: false,
        error: null,
        notes: [],
      }),
    ).toEqual({
      kind: "empty",
      title: "No notes yet",
      description: "Create the first note to see the starter CRUD flow.",
    });

    expect(
      resolveNotesCollectionState({
        isPending: false,
        error: new Error("Connection reset"),
        notes: [],
      }),
    ).toEqual({
      kind: "error",
      title: "Unable to load notes",
      description: "Connection reset",
      retryLabel: "Try again",
    });

    expect(
      resolveNotesCollectionState({
        isPending: false,
        error: null,
        notes: [existingNote],
      }),
    ).toEqual({
      kind: "ready",
      notes: [existingNote],
    });
  });

  it("creates and edits notes through the modal submission controller", async () => {
    const { createNoteFormController } = await loadNotesUi();

    const createNote = vi.fn().mockResolvedValue({
      ...existingNote,
      id: "note_created",
      title: "Fresh note",
      content: "",
    });
    const updateNote = vi.fn().mockResolvedValue({
      ...existingNote,
      title: "Updated note",
      content: "Existing body",
    });
    const refetchNotes = vi.fn();
    const navigateToLogin = vi.fn();

    const createController = createNoteFormController({
      mode: "create",
      redirectPath,
      createNote,
      updateNote,
      refetchNotes,
      navigateToLogin,
    });

    createController.setField("title", "Fresh note");

    expect(await createController.submit()).toEqual({
      ok: true,
      note: {
        ...existingNote,
        id: "note_created",
        title: "Fresh note",
        content: "",
      },
      feedbackMessage: "Note created.",
    });
    expect(createNote).toHaveBeenCalledWith({
      data: {
        title: "Fresh note",
        content: "",
      },
    });

    const editController = createNoteFormController({
      mode: "edit",
      note: existingNote,
      redirectPath,
      createNote,
      updateNote,
      refetchNotes,
      navigateToLogin,
    });

    editController.setField("title", "Updated note");

    expect(await editController.submit()).toEqual({
      ok: true,
      note: {
        ...existingNote,
        title: "Updated note",
        content: "Existing body",
      },
      feedbackMessage: "Note updated.",
    });
    expect(updateNote).toHaveBeenCalledWith({
      where: {
        id: "note_existing",
      },
      data: {
        title: "Updated note",
        content: "Existing body",
      },
    });
  });

  it("keeps validation errors visible and prevents duplicate submissions while pending", async () => {
    const { createNoteFormController } = await loadNotesUi();

    const createNote = vi.fn();
    const controller = createNoteFormController({
      mode: "create",
      redirectPath,
      createNote,
      updateNote: vi.fn(),
      refetchNotes: vi.fn(),
      navigateToLogin: vi.fn(),
    });

    expect(await controller.submit()).toEqual({
      ok: false,
      code: "VALIDATION_ERROR",
      feedbackMessage: null,
      fieldErrors: {
        title: "Title is required.",
      },
    });
    expect(controller.state.fieldErrors).toEqual({
      title: "Title is required.",
    });
    expect(createNote).not.toHaveBeenCalled();

    let resolveMutation: ((value: StarterNote) => void) | undefined;
    createNote.mockImplementation(
      () =>
        new Promise<StarterNote>((resolve) => {
          resolveMutation = resolve;
        }),
    );

    controller.setField("title", "Queued note");

    const firstSubmission = controller.submit();
    const secondSubmission = controller.submit();

    expect(controller.state.isSubmitting).toBe(true);
    expect(createNote).toHaveBeenCalledTimes(1);

    resolveMutation?.({
      ...existingNote,
      id: "note_pending",
      title: "Queued note",
      content: "",
    });

    await expect(firstSubmission).resolves.toEqual({
      ok: true,
      note: {
        ...existingNote,
        id: "note_pending",
        title: "Queued note",
        content: "",
      },
      feedbackMessage: "Note created.",
    });
    await expect(secondSubmission).resolves.toEqual({
      ok: true,
      note: {
        ...existingNote,
        id: "note_pending",
        title: "Queued note",
        content: "",
      },
      feedbackMessage: "Note created.",
    });
    expect(controller.state.isSubmitting).toBe(false);
  });

  it("keeps the modal open with retry feedback for generic mutation errors", async () => {
    const { createNoteFormController } = await loadNotesUi();

    const controller = createNoteFormController({
      mode: "create",
      redirectPath,
      createNote: vi.fn().mockRejectedValue(new Error("Database unavailable")),
      updateNote: vi.fn(),
      refetchNotes: vi.fn(),
      navigateToLogin: vi.fn(),
    });

    controller.setField("title", "Retry me");

    expect(await controller.submit()).toEqual({
      ok: false,
      code: "INTERNAL_ERROR",
      feedbackMessage: "We couldn't save the note. Try again.",
    });
    expect(controller.state.feedbackMessage).toBe(
      "We couldn't save the note. Try again.",
    );
    expect(controller.state.isSubmitting).toBe(false);
  });

  it("redirects to login when the session expires during submit", async () => {
    const { createNoteFormController } = await loadNotesUi();

    const navigateToLogin = vi.fn();
    const controller = createNoteFormController({
      mode: "create",
      redirectPath,
      createNote: vi.fn().mockRejectedValue({
        code: "UNAUTHORIZED",
        message: "Authentication is required.",
      }),
      updateNote: vi.fn(),
      refetchNotes: vi.fn(),
      navigateToLogin,
    });

    controller.setField("title", "Session expired");

    expect(await controller.submit()).toEqual({
      ok: false,
      code: "UNAUTHORIZED",
      redirectTo: "/auth/login?redirect=%2Fapp%2Fnotes",
      feedbackMessage: "Your session expired. Sign in again.",
    });
    expect(navigateToLogin).toHaveBeenCalledWith(
      "/auth/login?redirect=%2Fapp%2Fnotes",
    );
  });

  it("surfaces NOT_FOUND during edit and refreshes the list", async () => {
    const { createNoteFormController } = await loadNotesUi();

    const refetchNotes = vi.fn();
    const controller = createNoteFormController({
      mode: "edit",
      note: existingNote,
      redirectPath,
      createNote: vi.fn(),
      updateNote: vi.fn().mockRejectedValue({
        code: "NOT_FOUND",
        message: "Note not found.",
      }),
      refetchNotes,
      navigateToLogin: vi.fn(),
    });

    controller.setField("title", "Missing note");

    expect(await controller.submit()).toEqual({
      ok: false,
      code: "NOT_FOUND",
      feedbackMessage: "This note no longer exists. Refreshing the list.",
    });
    expect(refetchNotes).toHaveBeenCalledTimes(1);
    expect(controller.state.feedbackMessage).toBe(
      "This note no longer exists. Refreshing the list.",
    );
  });

  it("deletes notes, refreshes the list for NOT_FOUND, and redirects expired sessions", async () => {
    const { submitDeleteNoteAction } = await loadNotesUi();

    expect(
      await submitDeleteNoteAction({
        noteId: existingNote.id,
        redirectPath,
        deleteNote: vi.fn().mockResolvedValue(existingNote),
        refetchNotes: vi.fn(),
        navigateToLogin: vi.fn(),
      }),
    ).toEqual({
      ok: true,
      feedbackMessage: "Note deleted.",
    });

    const refetchNotes = vi.fn();

    expect(
      await submitDeleteNoteAction({
        noteId: existingNote.id,
        redirectPath,
        deleteNote: vi.fn().mockRejectedValue({
          code: "NOT_FOUND",
          message: "Note not found.",
        }),
        refetchNotes,
        navigateToLogin: vi.fn(),
      }),
    ).toEqual({
      ok: false,
      code: "NOT_FOUND",
      feedbackMessage: "This note no longer exists. Refreshing the list.",
    });
    expect(refetchNotes).toHaveBeenCalledTimes(1);

    const navigateToLogin = vi.fn();

    expect(
      await submitDeleteNoteAction({
        noteId: existingNote.id,
        redirectPath,
        deleteNote: vi.fn().mockRejectedValue({
          code: "UNAUTHORIZED",
          message: "Authentication is required.",
        }),
        refetchNotes: vi.fn(),
        navigateToLogin,
      }),
    ).toEqual({
      ok: false,
      code: "UNAUTHORIZED",
      redirectTo: "/auth/login?redirect=%2Fapp%2Fnotes",
      feedbackMessage: "Your session expired. Sign in again.",
    });
    expect(navigateToLogin).toHaveBeenCalledWith(
      "/auth/login?redirect=%2Fapp%2Fnotes",
    );
  });

  it("exposes a dedicated note modal overlay helper", async () => {
    vi.doMock("#components", () => ({
      LazyNotesNoteFormModal: {
        name: "LazyNotesNoteFormModal",
      },
    }));

    const { useNoteFormModalOverlay } = await import(
      "../../../app/composables/modals"
    );

    const opened = { open: vi.fn() };
    const overlay = {
      create: vi.fn().mockReturnValue(opened),
    };

    expect(useNoteFormModalOverlay(overlay as never)).toBe(opened);
    expect(overlay.create).toHaveBeenCalledTimes(1);
  });
});

import { NoteCreateOneSchema } from "../../../prisma/generated/zod/schemas/createOneNote.schema";
import { NoteDeleteOneSchema } from "../../../prisma/generated/zod/schemas/deleteOneNote.schema";
import { NoteFindManySchema } from "../../../prisma/generated/zod/schemas/findManyNote.schema";
import { NoteUpdateOneSchema } from "../../../prisma/generated/zod/schemas/updateOneNote.schema";
import { NoteUncheckedCreateInputObjectSchema } from "../../../prisma/generated/zod/schemas/objects/NoteUncheckedCreateInput.schema";
import { NoteUncheckedUpdateInputObjectSchema } from "../../../prisma/generated/zod/schemas/objects/NoteUncheckedUpdateInput.schema";
import { authBase } from "../base";
import { getArgsSchema, getSchema } from "../schema";

const noteCreateSchema = getArgsSchema(NoteCreateOneSchema).extend({
  data: getSchema(NoteUncheckedCreateInputObjectSchema).omit({
    id: true,
    user_id: true,
    created_at: true,
  }),
});

const noteUpdateSchema = getArgsSchema(NoteUpdateOneSchema).extend({
  data: getSchema(NoteUncheckedUpdateInputObjectSchema).omit({
    id: true,
    user_id: true,
    created_at: true,
    updated_at: true,
  }),
});

const noteErrors = {
  NOT_FOUND: {
    message: "Note not found.",
  },
} as const;

export const listNotes = authBase
  .input(getArgsSchema(NoteFindManySchema).default({}))
  .handler(async ({ input, context }) => {
    return await context.prisma.note.findMany({
      ...input,
      where: {
        AND: [{ user_id: context.user.id }, input.where ?? {}],
      },
      orderBy: input.orderBy ?? {
        updated_at: "desc",
      },
    });
  });

export const createNote = authBase
  .input(noteCreateSchema)
  .handler(async ({ input, context }) => {
    return await context.prisma.note.create({
      data: {
        ...input.data,
        user_id: context.user.id,
      },
    });
  });

export const updateNote = authBase
  .errors(noteErrors)
  .input(noteUpdateSchema)
  .handler(async ({ input, context, errors }) => {
    const existingNote = await context.prisma.note.findFirst({
      where: {
        id: input.where.id,
        user_id: context.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingNote) {
      throw errors.NOT_FOUND();
    }

    return await context.prisma.note.update({
      where: {
        id: existingNote.id,
      },
      data: input.data,
    });
  });

export const deleteNote = authBase
  .errors(noteErrors)
  .input(getArgsSchema(NoteDeleteOneSchema))
  .handler(async ({ input, context, errors }) => {
    const existingNote = await context.prisma.note.findFirst({
      where: {
        id: input.where.id,
        user_id: context.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingNote) {
      throw errors.NOT_FOUND();
    }

    return await context.prisma.note.delete({
      where: {
        id: existingNote.id,
      },
    });
  });

export default {
  list: listNotes,
  create: createNote,
  update: updateNote,
  delete: deleteNote,
};

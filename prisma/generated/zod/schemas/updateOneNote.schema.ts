import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteSelectObjectSchema as NoteSelectObjectSchema } from './objects/NoteSelect.schema';
import { NoteIncludeObjectSchema as NoteIncludeObjectSchema } from './objects/NoteInclude.schema';
import { NoteUpdateInputObjectSchema as NoteUpdateInputObjectSchema } from './objects/NoteUpdateInput.schema';
import { NoteUncheckedUpdateInputObjectSchema as NoteUncheckedUpdateInputObjectSchema } from './objects/NoteUncheckedUpdateInput.schema';
import { NoteWhereUniqueInputObjectSchema as NoteWhereUniqueInputObjectSchema } from './objects/NoteWhereUniqueInput.schema';

export const NoteUpdateOneSchema: z.ZodType<Prisma.NoteUpdateArgs> = z.object({ select: NoteSelectObjectSchema.optional(), include: NoteIncludeObjectSchema.optional(), data: z.union([NoteUpdateInputObjectSchema, NoteUncheckedUpdateInputObjectSchema]), where: NoteWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.NoteUpdateArgs>;

export const NoteUpdateOneZodSchema = z.object({ select: NoteSelectObjectSchema.optional(), include: NoteIncludeObjectSchema.optional(), data: z.union([NoteUpdateInputObjectSchema, NoteUncheckedUpdateInputObjectSchema]), where: NoteWhereUniqueInputObjectSchema }).strict();
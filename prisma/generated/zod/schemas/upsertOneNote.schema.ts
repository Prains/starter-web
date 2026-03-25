import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteSelectObjectSchema as NoteSelectObjectSchema } from './objects/NoteSelect.schema';
import { NoteIncludeObjectSchema as NoteIncludeObjectSchema } from './objects/NoteInclude.schema';
import { NoteWhereUniqueInputObjectSchema as NoteWhereUniqueInputObjectSchema } from './objects/NoteWhereUniqueInput.schema';
import { NoteCreateInputObjectSchema as NoteCreateInputObjectSchema } from './objects/NoteCreateInput.schema';
import { NoteUncheckedCreateInputObjectSchema as NoteUncheckedCreateInputObjectSchema } from './objects/NoteUncheckedCreateInput.schema';
import { NoteUpdateInputObjectSchema as NoteUpdateInputObjectSchema } from './objects/NoteUpdateInput.schema';
import { NoteUncheckedUpdateInputObjectSchema as NoteUncheckedUpdateInputObjectSchema } from './objects/NoteUncheckedUpdateInput.schema';

export const NoteUpsertOneSchema: z.ZodType<Prisma.NoteUpsertArgs> = z.object({ select: NoteSelectObjectSchema.optional(), include: NoteIncludeObjectSchema.optional(), where: NoteWhereUniqueInputObjectSchema, create: z.union([ NoteCreateInputObjectSchema, NoteUncheckedCreateInputObjectSchema ]), update: z.union([ NoteUpdateInputObjectSchema, NoteUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.NoteUpsertArgs>;

export const NoteUpsertOneZodSchema = z.object({ select: NoteSelectObjectSchema.optional(), include: NoteIncludeObjectSchema.optional(), where: NoteWhereUniqueInputObjectSchema, create: z.union([ NoteCreateInputObjectSchema, NoteUncheckedCreateInputObjectSchema ]), update: z.union([ NoteUpdateInputObjectSchema, NoteUncheckedUpdateInputObjectSchema ]) }).strict();
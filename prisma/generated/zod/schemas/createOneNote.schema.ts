import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteSelectObjectSchema as NoteSelectObjectSchema } from './objects/NoteSelect.schema';
import { NoteIncludeObjectSchema as NoteIncludeObjectSchema } from './objects/NoteInclude.schema';
import { NoteCreateInputObjectSchema as NoteCreateInputObjectSchema } from './objects/NoteCreateInput.schema';
import { NoteUncheckedCreateInputObjectSchema as NoteUncheckedCreateInputObjectSchema } from './objects/NoteUncheckedCreateInput.schema';

export const NoteCreateOneSchema: z.ZodType<Prisma.NoteCreateArgs> = z.object({ select: NoteSelectObjectSchema.optional(), include: NoteIncludeObjectSchema.optional(), data: z.union([NoteCreateInputObjectSchema, NoteUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.NoteCreateArgs>;

export const NoteCreateOneZodSchema = z.object({ select: NoteSelectObjectSchema.optional(), include: NoteIncludeObjectSchema.optional(), data: z.union([NoteCreateInputObjectSchema, NoteUncheckedCreateInputObjectSchema]) }).strict();
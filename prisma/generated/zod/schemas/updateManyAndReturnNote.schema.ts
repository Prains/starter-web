import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteSelectObjectSchema as NoteSelectObjectSchema } from './objects/NoteSelect.schema';
import { NoteUpdateManyMutationInputObjectSchema as NoteUpdateManyMutationInputObjectSchema } from './objects/NoteUpdateManyMutationInput.schema';
import { NoteWhereInputObjectSchema as NoteWhereInputObjectSchema } from './objects/NoteWhereInput.schema';

export const NoteUpdateManyAndReturnSchema: z.ZodType<Prisma.NoteUpdateManyAndReturnArgs> = z.object({ select: NoteSelectObjectSchema.optional(), data: NoteUpdateManyMutationInputObjectSchema, where: NoteWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NoteUpdateManyAndReturnArgs>;

export const NoteUpdateManyAndReturnZodSchema = z.object({ select: NoteSelectObjectSchema.optional(), data: NoteUpdateManyMutationInputObjectSchema, where: NoteWhereInputObjectSchema.optional() }).strict();
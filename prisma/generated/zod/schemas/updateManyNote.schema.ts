import type { Prisma } from '../../client/client';
import * as z from 'zod';
import { NoteUpdateManyMutationInputObjectSchema as NoteUpdateManyMutationInputObjectSchema } from './objects/NoteUpdateManyMutationInput.schema';
import { NoteWhereInputObjectSchema as NoteWhereInputObjectSchema } from './objects/NoteWhereInput.schema';

export const NoteUpdateManySchema: z.ZodType<Prisma.NoteUpdateManyArgs> = z.object({ data: NoteUpdateManyMutationInputObjectSchema, where: NoteWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.NoteUpdateManyArgs>;

export const NoteUpdateManyZodSchema = z.object({ data: NoteUpdateManyMutationInputObjectSchema, where: NoteWhereInputObjectSchema.optional() }).strict();
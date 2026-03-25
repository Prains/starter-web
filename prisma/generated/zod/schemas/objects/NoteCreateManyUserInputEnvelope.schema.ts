import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { NoteCreateManyUserInputObjectSchema as NoteCreateManyUserInputObjectSchema } from './NoteCreateManyUserInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => NoteCreateManyUserInputObjectSchema), z.lazy(() => NoteCreateManyUserInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const NoteCreateManyUserInputEnvelopeObjectSchema: z.ZodType<Prisma.NoteCreateManyUserInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.NoteCreateManyUserInputEnvelope>;
export const NoteCreateManyUserInputEnvelopeObjectZodSchema = makeSchema();

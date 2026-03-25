import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { NoteCreateWithoutUserInputObjectSchema as NoteCreateWithoutUserInputObjectSchema } from './NoteCreateWithoutUserInput.schema';
import { NoteUncheckedCreateWithoutUserInputObjectSchema as NoteUncheckedCreateWithoutUserInputObjectSchema } from './NoteUncheckedCreateWithoutUserInput.schema';
import { NoteCreateOrConnectWithoutUserInputObjectSchema as NoteCreateOrConnectWithoutUserInputObjectSchema } from './NoteCreateOrConnectWithoutUserInput.schema';
import { NoteCreateManyUserInputEnvelopeObjectSchema as NoteCreateManyUserInputEnvelopeObjectSchema } from './NoteCreateManyUserInputEnvelope.schema';
import { NoteWhereUniqueInputObjectSchema as NoteWhereUniqueInputObjectSchema } from './NoteWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => NoteCreateWithoutUserInputObjectSchema), z.lazy(() => NoteCreateWithoutUserInputObjectSchema).array(), z.lazy(() => NoteUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => NoteUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => NoteCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => NoteCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => NoteCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => NoteWhereUniqueInputObjectSchema), z.lazy(() => NoteWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const NoteUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.NoteUncheckedCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteUncheckedCreateNestedManyWithoutUserInput>;
export const NoteUncheckedCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();

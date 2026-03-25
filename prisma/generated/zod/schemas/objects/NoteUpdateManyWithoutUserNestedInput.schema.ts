import * as z from 'zod';
import type { Prisma } from '../../../client/client';
import { NoteCreateWithoutUserInputObjectSchema as NoteCreateWithoutUserInputObjectSchema } from './NoteCreateWithoutUserInput.schema';
import { NoteUncheckedCreateWithoutUserInputObjectSchema as NoteUncheckedCreateWithoutUserInputObjectSchema } from './NoteUncheckedCreateWithoutUserInput.schema';
import { NoteCreateOrConnectWithoutUserInputObjectSchema as NoteCreateOrConnectWithoutUserInputObjectSchema } from './NoteCreateOrConnectWithoutUserInput.schema';
import { NoteUpsertWithWhereUniqueWithoutUserInputObjectSchema as NoteUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './NoteUpsertWithWhereUniqueWithoutUserInput.schema';
import { NoteCreateManyUserInputEnvelopeObjectSchema as NoteCreateManyUserInputEnvelopeObjectSchema } from './NoteCreateManyUserInputEnvelope.schema';
import { NoteWhereUniqueInputObjectSchema as NoteWhereUniqueInputObjectSchema } from './NoteWhereUniqueInput.schema';
import { NoteUpdateWithWhereUniqueWithoutUserInputObjectSchema as NoteUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './NoteUpdateWithWhereUniqueWithoutUserInput.schema';
import { NoteUpdateManyWithWhereWithoutUserInputObjectSchema as NoteUpdateManyWithWhereWithoutUserInputObjectSchema } from './NoteUpdateManyWithWhereWithoutUserInput.schema';
import { NoteScalarWhereInputObjectSchema as NoteScalarWhereInputObjectSchema } from './NoteScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => NoteCreateWithoutUserInputObjectSchema), z.lazy(() => NoteCreateWithoutUserInputObjectSchema).array(), z.lazy(() => NoteUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => NoteUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => NoteCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => NoteCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => NoteUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => NoteUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => NoteCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => NoteWhereUniqueInputObjectSchema), z.lazy(() => NoteWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => NoteWhereUniqueInputObjectSchema), z.lazy(() => NoteWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => NoteWhereUniqueInputObjectSchema), z.lazy(() => NoteWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => NoteWhereUniqueInputObjectSchema), z.lazy(() => NoteWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => NoteUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => NoteUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => NoteUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => NoteUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => NoteScalarWhereInputObjectSchema), z.lazy(() => NoteScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const NoteUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.NoteUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.NoteUpdateManyWithoutUserNestedInput>;
export const NoteUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();

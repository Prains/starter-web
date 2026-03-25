import * as z from 'zod';
export const NoteDeleteManyResultSchema = z.object({
  count: z.number()
});
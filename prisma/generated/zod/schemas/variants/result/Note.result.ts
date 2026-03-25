import * as z from 'zod';
// prettier-ignore
export const NoteResultSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    title: z.string(),
    content: z.string().nullable(),
    created_at: z.date(),
    updated_at: z.date(),
    user: z.unknown()
}).strict();

export type NoteResultType = z.infer<typeof NoteResultSchema>;

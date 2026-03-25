import { z } from "zod";

export const noteFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(160),
  content: z
    .string()
    .trim()
    .max(10_000)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : "")),
});

export type NoteForm = z.output<typeof noteFormSchema>;

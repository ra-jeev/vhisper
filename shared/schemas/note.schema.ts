import { createInsertSchema, createSelectSchema, create } from "drizzle-zod";
import { z } from "zod";
import { notes } from "~~/server/database/schema";

export const noteSchema = createInsertSchema(notes, {
  text: (schema) =>
    schema.text
      .min(3, "Note must be at least 3 characters long")
      .max(5000, "Note cannot exceed 5000 characters"),
  audioUrls: z.string().array().optional(),
}).pick({
  text: true,
  audioUrls: true,
});

export const noteSelectSchema = createSelectSchema(notes, {
  audioUrls: z.string().array().optional(),
});

export const notePatchSchema = noteSchema.extend({
  text: noteSchema.shape.text.optional(),
});

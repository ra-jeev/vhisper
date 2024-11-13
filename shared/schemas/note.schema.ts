import { createInsertSchema } from "drizzle-zod";
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

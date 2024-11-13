import type { z } from "zod";
import type { signInSchema, signUpSchema } from "#shared/schemas/auth.schema";
import type { noteSchema } from "#shared/schemas/note.schema";

export type SignInSchemaType = z.output<typeof signInSchema>;
export type SignUpSchemaType = z.output<typeof signUpSchema>;
export type NoteSchemaType = z.output<typeof noteSchema>;

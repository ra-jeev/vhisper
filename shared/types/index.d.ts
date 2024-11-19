import type { z } from "zod";
import type { signInSchema, signUpSchema } from "#shared/schemas/auth.schema";
import type { noteSchema, noteSelectSchema } from "#shared/schemas/note.schema";

export type SignInSchemaType = z.output<typeof signInSchema>;
export type SignUpSchemaType = z.output<typeof signUpSchema>;
export type NoteSchemaType = z.output<typeof noteSchema>;

export type Recording = {
  url: string;
  blob?: Blob;
  id: string;
};

export type PostProcessing = {
  enabled: boolean;
  prompt: string;
};

export type Settings = {
  postProcessing: PostProcessing;
};

export type Note = z.output<typeof noteSelectSchema>;

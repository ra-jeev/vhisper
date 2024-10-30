import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users, notes } from '~~/server/database/schema';

const userValidationRules = {
  username: {
    min: 3,
    max: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  password: {
    min: 8,
    max: 128,
  },
  name: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
} as const;

export const signUpSchema = createInsertSchema(users, {
  name: (schema) =>
    schema.name
      .min(
        userValidationRules.name.min,
        'Name must be at least 2 characters long'
      )
      .max(userValidationRules.name.max, 'Name cannot exceed 50 characters')
      .regex(
        userValidationRules.name.pattern,
        'Name can only contain letters and spaces'
      ),
  username: (schema) =>
    schema.username
      .min(
        userValidationRules.username.min,
        'Username must be at least 3 characters long'
      )
      .max(
        userValidationRules.username.max,
        'Username cannot exceed 20 characters'
      )
      .regex(
        userValidationRules.username.pattern,
        'Username can only contain letters, numbers, and underscores'
      ),
  password: (schema) =>
    schema.password
      .min(
        userValidationRules.password.min,
        'Password must be at least 8 characters long'
      )
      .max(
        userValidationRules.password.max,
        'Password cannot exceed 128 characters'
      ),
}).pick({
  name: true,
  username: true,
  password: true,
});

export const signInSchema = signUpSchema.omit({ name: true });

export type SignInSchemaType = z.output<typeof signInSchema>;
export type SignUpSchemaType = z.output<typeof signUpSchema>;

export const notesSchema = createInsertSchema(notes, {
  title: (schema) =>
    schema.title
      .min(3, 'Title must be at least 3 characters long')
      .max(50, 'Title cannot exceed 50 characters'),
  content: (schema) =>
    schema.content
      .min(3, 'Content must be at least 3 characters long')
      .max(5000, 'Content cannot exceed 5000 characters'),
  audioUrls: z
    .object({
      url: z.string().url('Audio URL must be a valid URL'),
      duration: z.number().positive('Duration must be a positive number'),
      recordedAt: z.number().positive('Recorded at must be a positive number'),
    })
    .array()
    .optional(),
}).pick({
  title: true,
  content: true,
  audioUrls: true,
});

export type NotesSchemaType = z.output<typeof notesSchema>;

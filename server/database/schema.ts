import crypto from 'node:crypto';
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomBytes(12).toString('hex')),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const insertUserSchema = createInsertSchema(users);
import { insertUserSchema } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  const { name, username, password } = await readValidatedBody(
    event,
    insertUserSchema.parse
  );

  const hashedPassword = await hashPassword(password);

  try {
    const res = await useDrizzle()
      .insert(tables.users)
      .values({
        name,
        username,
        password: hashedPassword,
      })
      .returning({
        id: tables.users.id,
      })
      .get();

    await setUserSession(event, { user: { id: res.id, username, name } });
    return setResponseStatus(event, 201);
  } catch (error) {
    console.error('Error signing up:', error);

    if (
      error instanceof Error &&
      error.message.includes('D1_ERROR: UNIQUE constraint failed')
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username unavailable. Please try a different one.',
        data: {
          issues: [
            {
              message: 'Username unavailable. Please try a different one.',
              path: ['username'],
            },
          ],
        },
      });
    }

    throw createError({
      statusCode: 422,
      statusMessage:
        'Signup failed. Please check your information and try again.',
    });
  }
});

import { signInSchema } from '~~/types';

const invalidCredentialsError = createError({
  statusCode: 401,
  statusMessage: 'Invalid username or password.',
});

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(
    event,
    signInSchema.parse
  );

  const dbUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.username, username))
    .get();

  if (!dbUser) {
    throw invalidCredentialsError;
  }

  if (!(await verifyPassword(dbUser.password, password))) {
    throw invalidCredentialsError;
  }

  await setUserSession(event, {
    user: { id: dbUser.id, username, name: dbUser.name },
  });

  return {
    status: 200,
    message: 'Sign in successful',
  };
});

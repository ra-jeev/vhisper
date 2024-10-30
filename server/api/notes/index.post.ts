import { notesSchema } from '~~/types';

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { title, content, audioUrls } = await readValidatedBody(
    event,
    notesSchema.parse
  );

  await useDrizzle().insert(tables.notes).values({
    userId: user.id,
    title,
    content,
    audioUrls,
  });

  return setResponseStatus(event, 201);
});

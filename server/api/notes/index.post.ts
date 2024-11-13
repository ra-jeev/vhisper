import { noteSchema } from "#shared/schemas/note.schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { text, audioUrls } = await readValidatedBody(event, noteSchema.parse);

  await useDrizzle().insert(tables.notes).values({
    userId: user.id,
    text,

    audioUrls,
  });

  return setResponseStatus(event, 201);
});

import { noteSchema } from "#shared/schemas/note.schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { text, audioUrls } = await readValidatedBody(event, noteSchema.parse);

  try {
    await useDrizzle()
      .insert(tables.notes)
      .values({
        userId: user.id,
        text,
        audioUrls: audioUrls ? audioUrls.map((url) => `/audio/${url}`) : null,
      });

    return setResponseStatus(event, 201);
  } catch (err) {
    console.error("Error creating note:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to create note. Please try again.",
    });
  }
});

import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = await getValidatedRouterParams(
    event,
    z.object({
      id: z.string(),
    }).parse,
  );

  try {
    const note = await useDrizzle()
      .select()
      .from(tables.notes)
      .where(and(eq(tables.notes.id, id), eq(tables.notes.userId, user.id)))
      .limit(1);

    if (!note || note.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Note not found.",
      });
    }

    const audioUrls = note[0].audioUrls;
    if (audioUrls && audioUrls.length > 0) {
      const objects = audioUrls.map((url) => url.replace("/audio/", ""));

      try {
        await hubBlob().del(objects);
      } catch (err) {
        console.error("Error deleting audio files:", err);
      }
    }

    const result = await useDrizzle()
      .delete(tables.notes)
      .where(and(eq(tables.notes.id, id), eq(tables.notes.userId, user.id)));

    if (!result.success) {
      throw createError({
        statusCode: 404,
        message: "Note not found.",
      });
    }

    return sendNoContent(event);
  } catch (err) {
    console.error("Error deleting note:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to delete note. Please try again.",
    });
  }
});

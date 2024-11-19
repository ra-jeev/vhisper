import { z } from "zod";
import { notePatchSchema } from "#shared/schemas/note.schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { id } = await getValidatedRouterParams(
    event,
    z.object({
      id: z.string(),
    }).parse,
  );

  const { text, audioUrls } = await readValidatedBody(
    event,
    notePatchSchema.parse,
  );

  if (!text && !audioUrls) {
    throw createError({
      statusCode: 400,
      message: "No updates provided",
    });
  }

  try {
    const existingNote = await useDrizzle()
      .select()
      .from(tables.notes)
      .where(and(eq(tables.notes.id, id), eq(tables.notes.userId, user.id)))
      .limit(1);

    if (!existingNote || existingNote.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Note not found.",
      });
    }

    const existingAudioUrls = existingNote[0].audioUrls || [];

    const updates: { text?: string; audioUrls?: string[] | null } = { text };
    if (audioUrls) {
      const urlsToDelete = existingAudioUrls.filter((existingUrl) => {
        return !audioUrls.includes(existingUrl);
      });

      if (urlsToDelete.length) {
        const objects = urlsToDelete.map((url) => url.replace("/audio/", ""));

        try {
          await hubBlob().del(objects);
        } catch (err) {
          console.error("Error deleting audio files:", err);
        }
      }

      updates.audioUrls =
        audioUrls.length > 0
          ? audioUrls.map((url) =>
              url.startsWith("/audio/") ? url : `/audio/${url}`,
            )
          : null;
    }

    const result = await useDrizzle()
      .update(tables.notes)
      .set({
        ...updates,
      })
      .where(and(eq(tables.notes.id, id), eq(tables.notes.userId, user.id)));

    if (!result.success) {
      throw createError({
        statusCode: 404,
        message: "Note not found.",
      });
    }

    return sendNoContent(event);
  } catch (err) {
    console.error("Error updating note:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to update note. Please try again.",
    });
  }
});

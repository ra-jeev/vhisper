export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  try {
    const notes = await useDrizzle()
      .select()
      .from(tables.notes)
      .where(eq(tables.notes.userId, user.id))
      .orderBy(desc(tables.notes.updatedAt));

    return notes;
  } catch (err) {
    console.error("Error retrieving note:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to get notes. Please try again.",
    });
  }
});

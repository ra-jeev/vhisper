export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { pathname } = getRouterParams(event);

  try {
    const metaData = await hubBlob().head(pathname);

    if (metaData.customMetadata.userId === user.id) {
      return hubBlob().serve(event, pathname);
    }
  } catch (error) {
    console.error("failed to get the metadata", error);
  }

  throw createError({
    statusCode: 401,
    message: "Unauthorized!",
  });
});

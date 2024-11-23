export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  return hubBlob().handleUpload(event, {
    formKey: "files",
    multiple: true,
    ensure: {
      maxSize: "8MB",
      types: ["audio"],
    },
    put: {
      addRandomSuffix: true,
      prefix: "recordings",
      customMetadata: {
        userId: user.id,
      },
    },
  });
});

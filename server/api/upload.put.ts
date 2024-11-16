export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  return hubBlob().handleUpload(event, {
    formKey: "files",
    multiple: true,
    ensure: {
      maxSize: "2MB",
      types: ["audio/webm"],
    },
    put: {
      addRandomSuffix: true,
      prefix: "recordings",
      contentType: "audio/webm",
      customMetadata: {
        userId: user.id,
      },
    },
  });
});

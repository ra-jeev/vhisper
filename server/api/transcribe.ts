export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);

  if (!formData?.length) {
    throw createError({
      statusCode: 400,
      message: 'No multipart data found.',
    });
  }

  const fileData = formData[0];
  const input = {
    audio: [...new Uint8Array(fileData.data)],
  };

  try {
    const response = await hubAI().run('@cf/openai/whisper', input);

    console.dir(response, { depth: null });

    return response.text;
  } catch (error) {
    console.error('Error transcribing:', error);

    throw createError({
      statusCode: 500,
      message: 'Error transcribing.',
    });
  }
});

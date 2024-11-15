export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const form = await readFormData(event);
  const blob = form.get("audio") as Blob;
  if (!blob) {
    throw createError({
      statusCode: 400,
      message: "Missing audio blob to transcribe",
    });
  }

  try {
    const response = await hubAI().run("@cf/openai/whisper", {
      audio: [...new Uint8Array(await blob.arrayBuffer())],
    });

    let processedText = response.text;

    const postProcessingPrompt = form.get("prompt") as string;
    if (postProcessingPrompt && processedText) {
      const postProcessResult = await hubAI().run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          temperature: 0.3,
          prompt: `${postProcessingPrompt}.\n\nText:\n\n${response.text}\n\nResponse:`,
        },
      );

      processedText =
        (postProcessResult as { response?: string }).response || processedText;
    }

    return processedText;
  } catch (err) {
    console.error("Error transcribing audio:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to transcribe audio. Please try again.",
    });
  }
});

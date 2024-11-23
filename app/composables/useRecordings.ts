const audioUrlsToRecordings = (audioUrls?: string[] | null) => {
  return audioUrls
    ? audioUrls.map((url) => {
        return { url, id: url };
      })
    : [];
};

export const useRecordings = (audioUrls?: string[] | null) => {
  const recordings = ref<Recording[]>(audioUrlsToRecordings(audioUrls));

  const cleanupResource = (recording: Recording) => {
    if (recording.blob) {
      URL.revokeObjectURL(recording.url);
    }
  };

  const cleanupResources = () => {
    recordings.value.forEach((recording) => {
      cleanupResource(recording);
    });
  };

  const addRecording = (recording: Recording) => {
    recordings.value.unshift(recording);
  };

  const removeRecording = (recording: Recording) => {
    recordings.value = recordings.value.filter((r) => r.id !== recording.id);
    cleanupResource(recording);
  };

  const resetRecordings = () => {
    cleanupResources();

    recordings.value = audioUrlsToRecordings(audioUrls);
  };

  onUnmounted(cleanupResources);

  return {
    recordings,
    addRecording,
    removeRecording,
    resetRecordings,
  };
};

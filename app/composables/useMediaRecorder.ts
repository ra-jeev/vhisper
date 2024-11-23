interface MediaRecorderState {
  isRecording: boolean;
  recordingDuration: number;
  audioData: Uint8Array | null;
  updateTrigger: number;
}

const getSupportedMimeType = () => {
  const types = [
    "audio/mp4",
    "audio/mp4;codecs=mp4a",
    "audio/mpeg",
    "audio/webm;codecs=opus",
    "audio/webm",
  ];

  return (
    types.find((type) => MediaRecorder.isTypeSupported(type)) || "audio/webm"
  );
};

export function useMediaRecorder() {
  const state = ref<MediaRecorderState>({
    isRecording: false,
    recordingDuration: 0,
    audioData: null,
    updateTrigger: 0,
  });

  let mediaRecorder: MediaRecorder | null = null;
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let animationFrame: number | null = null;
  let audioChunks: Blob[] | undefined = undefined;

  const updateAudioData = () => {
    if (!analyser || !state.value.isRecording || !state.value.audioData) {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      return;
    }

    analyser.getByteTimeDomainData(state.value.audioData);
    state.value.updateTrigger += 1;
    animationFrame = requestAnimationFrame(updateAudioData);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const options = {
        mimeType: getSupportedMimeType(),
      };

      mediaRecorder = new MediaRecorder(stream, options);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        audioChunks?.push(e.data);
        state.value.recordingDuration += 1;
      };

      state.value.audioData = new Uint8Array(analyser.frequencyBinCount);
      state.value.isRecording = true;
      state.value.recordingDuration = 0;
      state.value.updateTrigger = 0;
      mediaRecorder.start(1000);

      updateAudioData();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      throw err;
    }
  };

  const stopRecording = async () => {
    return await new Promise<Blob>((resolve) => {
      if (mediaRecorder && state.value.isRecording) {
        const mimeType = mediaRecorder.mimeType;
        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunks, { type: mimeType });
          audioChunks = undefined;

          state.value.recordingDuration = 0;
          state.value.updateTrigger = 0;
          state.value.audioData = null;

          resolve(blob);
        };

        state.value.isRecording = false;
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());

        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }

        audioContext?.close();
        audioContext = null;
      }
    });
  };

  onUnmounted(() => {
    stopRecording();
  });

  return {
    state: readonly(state),
    startRecording,
    stopRecording,
  };
}

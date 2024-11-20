<template>
  <UCard
    :ui="{
      body: {
        base: 'max-h-36 md:max-h-none md:flex-grow overflow-y-auto',
      },
    }"
  >
    <template #header>
      <h3
        class="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300"
      >
        Recordings
      </h3>

      <UTooltip
        :text="state.isRecording ? 'Stop Recording' : 'Start Recording'"
      >
        <UButton
          :icon="
            state.isRecording
              ? 'i-heroicons-stop-circle'
              : 'i-heroicons-microphone'
          "
          :color="state.isRecording ? 'red' : 'primary'"
          :loading="isTranscribing"
          @click="toggleRecording"
        />
      </UTooltip>
    </template>

    <AudioVisualizer
      v-if="state.isRecording"
      class="w-full h-14 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2"
      :audio-data="state.audioData"
      :data-update-trigger="state.updateTrigger"
    />

    <div
      v-else-if="isTranscribing"
      class="flex items-center justify-center h-14 gap-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 text-gray-500 dark:text-gray-400"
    >
      <UIcon
        name="i-heroicons-arrow-path-20-solid"
        class="w-6 h-6 animate-spin"
      />
      Transcribing...
    </div>

    <RecordingsList :recordings="recordings" @delete="deleteRecording" />

    <div
      v-if="!recordings.length && !state.isRecording && !isTranscribing"
      class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400"
    >
      No recordings...
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{ audioUrls?: string[] | null }>();
const emit = defineEmits<{ transcription: [text: string] }>();

const { state, startRecording, stopRecording } = useMediaRecorder();
const toggleRecording = () => {
  if (state.value.isRecording) {
    handleRecordingStop();
  } else {
    handleRecordingStart();
  }
};

const handleRecordingStart = async () => {
  try {
    await startRecording();
  } catch (err) {
    console.error("Error accessing microphone:", err);
    useToast().add({
      title: "Error",
      description: "Could not access microphone. Please check permissions.",
      color: "red",
    });
  }
};

const recordings = ref<Recording[]>(
  props.audioUrls
    ? props.audioUrls.map((url) => {
        return { url, id: url };
      })
    : [],
);

const deleteRecording = (recording: Recording) => {
  recordings.value = recordings.value.filter((r) => r.id !== recording.id);
};

const handleRecordingStop = async () => {
  let blob: Blob | undefined;

  try {
    blob = await stopRecording();
  } catch (err) {
    console.error("Error stopping recording:", err);
    useToast().add({
      title: "Error",
      description: "Failed to record audio. Please try again.",
      color: "red",
    });
  }

  if (blob) {
    try {
      const transcription = await transcribeAudio(blob);

      if (transcription) {
        emit("transcription", transcription);

        recordings.value.unshift({
          url: URL.createObjectURL(blob),
          blob,
          id: `${Date.now()}`,
        });
      }
    } catch (err) {
      console.error("Error transcribing audio:", err);
      useToast().add({
        title: "Error",
        description: "Failed to transcribe audio. Please try again.",
        color: "red",
      });
    }
  }
};

const isTranscribing = ref(false);
const { settings } = useSettings();
const transcribeAudio = async (blob: Blob) => {
  try {
    isTranscribing.value = true;
    const formData = new FormData();
    formData.append("audio", blob);

    const { postProcessing } = settings.value;
    if (postProcessing.enabled && postProcessing.prompt) {
      formData.append("prompt", postProcessing.prompt);
    }

    return await $fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });
  } finally {
    isTranscribing.value = false;
  }
};

const uploadRecordings = async () => {
  if (!recordings.value.length) return;

  let recordingsToUpload = 0;
  const finalPathnames: string[] = [];

  const formData = new FormData();
  recordings.value.forEach((recording) => {
    if (recording.blob) {
      formData.append("files", recording.blob, recording.id + ".webm");
      recordingsToUpload++;
    } else {
      finalPathnames.push(recording.url);
    }
  });

  if (!recordingsToUpload) {
    return finalPathnames;
  }

  try {
    const result = await $fetch("/api/upload", {
      method: "PUT",
      body: formData,
    });

    const uploadedObjs = result.map((obj) => obj.pathname);
    finalPathnames.push(...uploadedObjs);
  } catch (error) {
    console.error("Failed to upload audio recordings", error);
  }

  return finalPathnames;
};

const resetRecordings = () => {
  recordings.value = [];
};

const isBusy = computed(() => state.value.isRecording || isTranscribing.value);

defineExpose({ uploadRecordings, resetRecordings, isBusy });
</script>

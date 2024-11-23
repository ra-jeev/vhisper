<template>
  <UCard
    :ui="{
      body: 'max-h-36 md:max-h-none md:flex-1 overflow-y-auto',
    }"
  >
    <template #header>
      <h3 class="font-medium text-gray-600 dark:text-gray-300">Recordings</h3>

      <div class="flex items-center gap-x-2">
        <template v-if="state.isRecording">
          <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span class="mr-2 text-sm">
            {{ formatDuration(state.recordingDuration) }}
          </span>
        </template>

        <!-- <UTooltip
        :text="state.isRecording ? 'Stop Recording' : 'Start Recording'"
      > -->
        <UButton
          :icon="state.isRecording ? 'i-lucide-circle-stop' : 'i-lucide-mic'"
          :color="state.isRecording ? 'error' : 'primary'"
          :loading="isTranscribing"
          @click="toggleRecording"
        />
        <!-- </UTooltip> -->
      </div>
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
      <UIcon name="i-lucide-refresh-cw" size="size-6" class="animate-spin" />
      Transcribing...
    </div>

    <RecordingsList :recordings="recordings" @delete="deleteRecording" />

    <div
      v-if="!recordings.length && !state.isRecording && !isTranscribing"
      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
    >
      <p>No recordings...!</p>
      <p class="text-sm mt-1">Tap the mic icon to create one.</p>
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
      color: "error",
    });
  }
};

const audioUrlsToRecordings = (audioUrls?: string[] | null) => {
  return audioUrls
    ? audioUrls.map((url) => {
        return { url, id: url };
      })
    : [];
};

const recordings = ref<Recording[]>(audioUrlsToRecordings(props.audioUrls));

const cleanupRecording = (recording: Recording) => {
  if (recording.blob) {
    URL.revokeObjectURL(recording.url);
  }
};

const deleteRecording = (recording: Recording) => {
  recordings.value = recordings.value.filter((r) => r.id !== recording.id);
  cleanupRecording(recording);
};

const cleanupAllRecordings = () => {
  recordings.value.forEach((recording) => {
    cleanupRecording(recording);
  });
};

onUnmounted(cleanupAllRecordings);

const handleRecordingStop = async () => {
  let blob: Blob | undefined;

  try {
    blob = await stopRecording();
  } catch (err) {
    console.error("Error stopping recording:", err);
    useToast().add({
      title: "Error",
      description: "Failed to record audio. Please try again.",
      color: "error",
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
        color: "error",
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
      formData.append(
        "files",
        recording.blob,
        `${recording.id}.${recording.blob.type.split("/")[1]}`,
      );
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
  cleanupAllRecordings();
  recordings.value = audioUrlsToRecordings(props.audioUrls);
};

const isBusy = computed(() => state.value.isRecording || isTranscribing.value);

defineExpose({ uploadRecordings, resetRecordings, isBusy });

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

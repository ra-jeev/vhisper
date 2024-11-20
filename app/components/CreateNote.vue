<template>
  <div class="flex flex-col gap-y-5">
    <div
      class="flex flex-col h-full md:flex-row gap-y-4 md:gap-x-6 overflow-hidden p-px"
    >
      <UCard
        :ui="{
          base: 'h-full flex flex-col flex-1',
          body: { base: 'flex-grow' },
          header: { base: 'md:h-[72px]' },
        }"
      >
        <template #header>
          <h3
            class="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300"
          >
            Note transcript
          </h3>
        </template>
        <UTextarea
          v-model="note"
          placeholder="Type your note or use voice recording..."
          size="lg"
          autofocus
          :disabled="loading || noteRecorder?.isBusy"
          :rows="10"
        />
      </UCard>

      <NoteRecorder
        ref="recorder"
        class="md:h-full md:flex md:flex-col md:w-96 shrink-0 order-first md:order-none"
        @transcription="handleNewTranscription"
      />
    </div>

    <UDivider />

    <div class="flex items-center justify-end gap-x-4">
      <UButton
        icon="i-heroicons-trash"
        color="gray"
        size="md"
        variant="ghost"
        :disabled="loading"
        @click="clearNote"
      >
        Reset Note
      </UButton>
      <UButton
        icon="i-heroicons-cloud-arrow-up"
        size="md"
        :disabled="!note.trim() && !noteRecorder?.isBusy"
        :loading="loading"
        @click="saveNote"
      >
        Save Note
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NoteRecorder } from "#components";

const note = ref("");
const handleNewTranscription = (text: string) => {
  note.value += note.value ? "\n\n" : "";
  note.value += text ?? "";
};

// Adding for Zed inference, remove once supported natively
type NoteRecorderType = InstanceType<typeof NoteRecorder>;
const noteRecorder = useTemplateRef<NoteRecorderType>("recorder");
const clearNote = () => {
  note.value = "";
  noteRecorder.value?.resetRecordings();
};

const emit = defineEmits(["note-created"]);
const loading = ref(false);
const saveNote = async () => {
  if (!note.value.trim()) return;

  loading.value = true;

  const startTime = Date.now();
  const audioUrls = await noteRecorder.value?.uploadRecordings();
  const noteData = {
    text: note.value.trim(),
    audioUrls,
  };

  console.log(
    "sending note to server: ",
    noteData,
    "uploadTime:",
    Date.now() - startTime,
  );

  try {
    await $fetch("/api/notes", {
      method: "POST",
      body: noteData,
    });

    useToast().add({
      title: "Success",
      description: "Note saved successfully",
      color: "green",
    });

    clearNote();
    emit("note-created");
  } catch (err) {
    console.error("Error saving note:", err);
    useToast().add({
      title: "Error",
      description: "Failed to save note",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
};
</script>

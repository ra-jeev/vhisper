<template>
  <UModal
    v-model:open="isOpen"
    fullscreen
    :title="isEditing ? 'Edit Note' : 'Create Note'"
    :ui="{
      body: 'flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 overflow-hidden',
    }"
  >
    <UButton
      v-if="isEditing"
      color="neutral"
      variant="ghost"
      icon="i-lucide-edit"
      size="xs"
    />

    <template #body>
      <UCard class="flex-1 flex flex-col" :ui="{ body: 'flex-1' }">
        <template #header>
          <h3 class="h-8 font-medium text-gray-600 dark:text-gray-300">
            Note transcript
          </h3>
        </template>

        <UTextarea
          v-model="noteText"
          placeholder="Type your note here, or use voice recording..."
          size="lg"
          :disabled="isSaving || noteRecorder?.isBusy"
          :ui="{ root: 'w-full h-full', base: ['h-full resize-none'] }"
        />
      </UCard>

      <NoteRecorder
        ref="recorder"
        class="md:h-full md:flex md:flex-col md:w-96 shrink-0 order-first md:order-none"
        :audioUrls="note?.audioUrls"
        @transcription="handleTranscription"
      />
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-undo-2"
        color="neutral"
        variant="outline"
        :disabled="isSaving"
        @click="resetNote"
      >
        Reset
      </UButton>

      <UButton
        icon="i-lucide-cloud-upload"
        :disabled="!noteText.trim() || noteRecorder?.isBusy || isSaving"
        :loading="isSaving"
        @click="saveNote"
      >
        {{ isEditing ? "Save Changes" : "Save Note" }}
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { NoteRecorder } from "#components";

const props = defineProps<{
  isEditing?: boolean;
  note?: Note;
}>();

type NoteRecorderType = InstanceType<typeof NoteRecorder>;
const noteRecorder = useTemplateRef<NoteRecorderType>("recorder");
const resetNote = () => {
  noteText.value = props.note?.text ?? "";
  noteRecorder.value?.resetRecordings();
};

const noteText = ref(props.note?.text ?? "");
const handleTranscription = (text: string) => {
  noteText.value += noteText.value ? "\n\n" : "";
  noteText.value += text ?? "";
};

const isOpen = ref(false);
const modal = useModal();
const emit = defineEmits(["created", "updated"]);
const isSaving = ref(false);
const saveNote = async () => {
  const text = noteText.value.trim();
  if (!text) return;

  isSaving.value = true;

  const audioUrls = await noteRecorder.value?.uploadRecordings();
  if (props.note) {
    await handleNoteUpdate(props.note, text, audioUrls);
  } else {
    await handleNoteCreate(text, audioUrls);
  }

  isSaving.value = false;
};

const handleNoteCreate = async (text: string, audioUrls?: string[]) => {
  try {
    await $fetch("/api/notes", {
      method: "POST",
      body: { text, audioUrls },
    });

    useToast().add({
      title: "Save success",
      description: "Note saved successfully.",
      color: "success",
    });

    emit("created");
    modal.close();
  } catch (err) {
    console.error("Error saving note:", err);
    useToast().add({
      title: "Save error",
      description: "Failed to save the note.",
      color: "error",
    });
  }
};

const hasSameUrls = (a: string[], b: string[]) => {
  return a.length === b.length && a.every((val) => b.includes(val));
};

const handleNoteUpdate = async (
  originalNote: Note,
  text: string,
  audioUrls?: string[],
) => {
  try {
    const updates: { text?: string; audioUrls?: string[] } = {};

    if (text !== originalNote.text) {
      updates.text = text;
    }

    if (audioUrls) {
      if (
        !originalNote.audioUrls ||
        !hasSameUrls(audioUrls, originalNote.audioUrls)
      ) {
        updates.audioUrls = audioUrls;
      }
    } else if (originalNote.audioUrls) {
      updates.audioUrls = []; // To delete existing recordings
    }

    if (Object.keys(updates).length) {
      await $fetch(`/api/notes/${originalNote.id}`, {
        method: "PATCH",
        body: updates,
      });

      useToast().add({
        title: "Update success",
        description: "Note updated successfully.",
        color: "success",
      });

      isOpen.value = false;
      emit("updated");
    } else {
      useToast().add({
        title: "No update found",
        description: "No update detected in the note",
        color: "warning",
      });
    }
  } catch (error) {
    console.error("Failed to update note:", error);
    useToast().add({
      title: "Update error",
      description: "Failed to update the note.",
      color: "error",
    });
  }
};
</script>

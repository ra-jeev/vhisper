<template>
  <UModal v-model="isEditing" fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        body: {
          base: 'flex-grow overflow-hidden',
        },
      }"
      @submit.prevent="handleEdit"
    >
      <template #header>
        <h2 class="text-xl md:text-2xl font-semibold leading-6">Edit Note</h2>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          @click="isEditing = false"
        />
      </template>

      <div
        class="flex flex-col h-full md:flex-row gap-y-4 md:gap-x-6 overflow-hidden"
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
            v-model="editedText"
            placeholder="Type your note or use voice recording..."
            size="lg"
            :disabled="isUpdating || noteRecorder?.isBusy"
            :rows="10"
          />
        </UCard>

        <NoteRecorder
          ref="recorder"
          class="md:h-full md:flex md:flex-col md:w-96 shrink-0 order-first md:order-none"
          :audioUrls="note.audioUrls"
          @transcription="handleNewTranscription"
        />
      </div>

      <template #footer>
        <UButton
          icon="i-heroicons-x-mark"
          color="gray"
          size="md"
          variant="ghost"
          :disabled="isUpdating"
          @click="isEditing = false"
        >
          Cancel
        </UButton>

        <UButton
          icon="i-heroicons-cloud-arrow-up"
          size="md"
          type="submit"
          :disabled="!editedText.trim() && !noteRecorder?.isBusy"
          :loading="isUpdating"
        >
          Save Changes
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { NoteRecorder } from "#components";

const props = defineProps<{ note: Note }>();
const emit = defineEmits(["updated"]);

const isEditing = defineModel({ type: Boolean, default: false });
const editedText = ref(props.note.text);
const isUpdating = ref(false);

const handleNewTranscription = (text: string) => {
  editedText.value += editedText.value ? "\n\n" : "";
  editedText.value += text ?? "";
};

type NoteRecorderType = InstanceType<typeof NoteRecorder>;
const noteRecorder = useTemplateRef<NoteRecorderType>("recorder");
async function handleEdit() {
  try {
    isUpdating.value = true;

    const updates: { text?: string; audioUrls?: string[] } = {};

    editedText.value = editedText.value.trim();
    if (editedText.value !== props.note.text) {
      updates.text = editedText.value;
    }

    const finalAudioUrls = await noteRecorder.value?.uploadRecordings();
    if (finalAudioUrls) {
      if (
        !props.note.audioUrls ||
        !hasSameUrls(finalAudioUrls, props.note.audioUrls)
      ) {
        updates.audioUrls = finalAudioUrls;
      }
    } else if (props.note.audioUrls) {
      updates.audioUrls = []; // To delete existing recordings
    }

    if (Object.keys(updates).length) {
      const response = await $fetch(`/api/notes/${props.note.id}`, {
        method: "PATCH",
        body: updates,
      });

      useToast().add({
        title: "Success",
        description: "Note successfully updated",
        color: "green",
      });

      emit("updated", response);
    }

    isEditing.value = false;
  } catch (error) {
    console.error("Failed to update note:", error);
    useToast().add({
      title: "Error",
      description: "Failed to update note",
      color: "red",
    });
  } finally {
    isUpdating.value = false;
  }
}

const hasSameUrls = (a: string[], b: string[]) => {
  return a.length === b.length && a.every((val) => b.includes(val));
};
</script>

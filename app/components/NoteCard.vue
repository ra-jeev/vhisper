<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start">
      <div class="flex-grow">
        <p
          ref="text"
          :class="['whitespace-pre-wrap', !showFullText && 'line-clamp-3']"
        >
          {{ note.text }}
        </p>
        <UButton
          v-if="shouldShowExpandBtn"
          variant="link"
          :padded="false"
          @click="showFullText = !showFullText"
        >
          {{ showFullText ? "Show less" : "Show more" }}
        </UButton>
      </div>

      <div class="flex gap-x-2 ml-4">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-pencil-square"
          size="xs"
          @click="editNote = true"
        />

        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-trash"
          size="xs"
          @click="confirmDeletion = true"
        />
      </div>
    </div>

    <div
      v-if="note.audioUrls && note.audioUrls.length > 0"
      class="mt-4 flex gap-x-2 overflow-x-auto"
    >
      <audio
        v-for="url in note.audioUrls"
        :key="url"
        :src="url"
        controls
        class="w-60 shrink-0 h-10"
      />
    </div>

    <p
      class="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-x-2 mt-6"
    >
      <UIcon name="i-heroicons-clock" class="w-4 h-4" />
      <span>
        {{
          note.updatedAt && note.updatedAt !== note.createdAt
            ? `Updated ${formatTimeAgo(new Date(note.updatedAt + "Z"))}`
            : `Created ${formatTimeAgo(new Date(note.createdAt + "Z"))}`
        }}
      </span>
    </p>

    <DeleteNoteModal
      v-model="confirmDeletion"
      :note-id="note.id"
      :has-audio="note.audioUrls ? note.audioUrls.length > 0 : false"
      @deleted="$emit('note-deleted')"
    />

    <EditNoteModal
      v-model="editNote"
      :note="note"
      @updated="$emit('note-updated')"
    />
  </UCard>
</template>

<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core";

defineEmits(["note-deleted", "note-updated"]);
const props = defineProps<{ note: Note }>();

const showFullText = ref(false);
const confirmDeletion = ref(false);
const editNote = ref(false);

const shouldShowExpandBtn = ref(false);
const noteText = useTemplateRef<HTMLParagraphElement>("text");
const checkTextExpansion = async () => {
  await nextTick();
  if (noteText.value) {
    shouldShowExpandBtn.value =
      noteText.value.scrollHeight > noteText.value.clientHeight;
  }
};

onMounted(checkTextExpansion);

watch(() => props.note.text, checkTextExpansion);
</script>

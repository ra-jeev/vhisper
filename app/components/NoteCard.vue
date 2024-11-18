<template>
  <UCard class="hover:shadow-lg transition-shadow">
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
      {{ formatTimeAgo(new Date(note.createdAt + "Z")) }}
    </p>
  </UCard>
</template>

<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core";

defineProps<{ note: Note }>();

const showFullText = ref(false);

const noteText = useTemplateRef<HTMLParagraphElement>("text");
const shouldShowExpandBtn = ref(false);
onMounted(() => {
  if (
    noteText.value &&
    noteText.value.scrollHeight > noteText.value.clientHeight
  ) {
    shouldShowExpandBtn.value = true;
  }
});
</script>

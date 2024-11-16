<template>
  <UCard>
    <div class="space-y-2">
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

      <p class="text-sm text-gray-500 dark:text-gray-400">
        Created: {{ formatDate(note.createdAt) }}
      </p>
    </div>

    <div
      v-if="note.audioUrls && note.audioUrls.length > 0"
      class="mt-6 flex gap-x-2 overflow-x-auto"
    >
      <audio
        v-for="url in note.audioUrls"
        :key="url"
        :src="url"
        controls
        class="w-60 shrink-0 h-10"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{ note: Note }>();

const showFullText = ref(false);

const formatDate = (time: string) => {
  const date = new Date(time);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

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

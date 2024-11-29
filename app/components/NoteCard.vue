<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <div class="flex justify-between items-start gap-x-4">
      <div class="flex-1 space-y-1">
        <p
          ref="text"
          :class="['whitespace-pre-wrap', !showFullText && 'line-clamp-3']"
        >
          {{ note.text }}
        </p>
        <UButton
          v-if="shouldShowExpandBtn"
          class="p-0"
          variant="link"
          @click="showFullText = !showFullText"
        >
          {{ showFullText ? "Show less" : "Show more" }}
        </UButton>
      </div>

      <div class="flex gap-x-2">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-edit"
          size="xs"
          @click="$emit('edit')"
        />

        <UButton
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          size="xs"
          @click="$emit('delete')"
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
      <UIcon name="i-lucide-clock" size="size-4" />
      <span>
        {{
          note.updatedAt && note.updatedAt !== note.createdAt
            ? `Updated ${updated}`
            : `Created ${created}`
        }}
      </span>
    </p>
  </UCard>
</template>

<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";

defineEmits(["delete", "edit"]);
const props = defineProps<{ note: Note }>();

const createdAt = computed(() => props.note.createdAt + "Z");
const updatedAt = computed(() => props.note.updatedAt + "Z");

const created = useTimeAgo(createdAt);
const updated = useTimeAgo(updatedAt);

const showFullText = ref(false);

const shouldShowExpandBtn = ref(false);
const noteText = useTemplateRef<HTMLParagraphElement>("text");
const checkTextExpansion = () => {
  nextTick(() => {
    if (noteText.value) {
      shouldShowExpandBtn.value =
        noteText.value.scrollHeight > noteText.value.clientHeight;
    }
  });
};

onMounted(checkTextExpansion);

watch(() => props.note.text, checkTextExpansion);
</script>

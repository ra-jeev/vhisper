<template>
  <div class="space-y-2">
    <div
      v-for="recording in recordings"
      :key="recording.id"
      class="flex items-center gap-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <audio :src="recording.url" controls class="w-full h-10" />

      <!-- <UTooltip text="Remove recording"> -->
      <UButton
        icon="i-lucide-trash-2"
        color="error"
        variant="ghost"
        size="sm"
        @click="$emit('delete', recording)"
      />
      <!-- </UTooltip> -->
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ recordings: Recording[] }>();

defineEmits<{
  delete: [recording: Recording];
}>();
</script>

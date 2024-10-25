<template>
  <div class="flex items-center gap-x-2 text-red-500">
    <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
    <span> Recording... {{ formatDuration(recordingDuration) }} </span>

    <AudioVisualizer
      class="w-40 h-12"
      :audio-data="audioData"
      :data-update-trigger="updateTrigger"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  recordingDuration: number;
  audioData: Uint8Array | null;
  updateTrigger: number;
}>();

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

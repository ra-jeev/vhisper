<template>
  <div :class="{ 'flex h-full': !notes?.length }">
    <div v-if="notes?.length" class="space-y-4 sm:space-y-6">
      <NoteCard v-for="note in notes" :key="note.id" :note="note" />
    </div>
    <div
      v-else
      class="flex-1 self-center text-center text-gray-500 dark:text-gray-400 space-y-2"
    >
      <h2 class="text-2xl md:text-3xl">No notes created</h2>
      <p>Get started by creating your first note</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: notes } = await useFetch("/api/notes");
</script>

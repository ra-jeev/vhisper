<template>
  <div :class="{ 'flex h-full': !notes?.length }">
    <div ref="dummy-el" />
    <div v-if="notes?.length" class="space-y-4 sm:space-y-6">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @note-deleted="refresh"
        @note-updated="onNoteUpdated"
      />
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
const { data: notes, refresh } = await useFetch("/api/notes");

definePageMeta({
  middleware: "auth",
});

const dummyEl = useTemplateRef<HTMLDivElement>("dummy-el");
const onNoteUpdated = async () => {
  await refresh();

  nextTick(() =>
    dummyEl.value?.scrollIntoView({
      behavior: "smooth",
    }),
  );
};
</script>

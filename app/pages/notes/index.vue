<template>
  <div :class="{ 'flex h-full': !notes?.length }">
    <div ref="dummy-el" />
    <div v-if="notes?.length" class="space-y-4 sm:space-y-6">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @delete="deleteNote(note)"
        @edit="editNote(note)"
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
import { LazyNoteEditorModal, LazyNoteDeleteModal } from "#components";

const { data: notes, refresh } = await useFetch("/api/notes");

definePageMeta({
  middleware: "auth",
});

const dummyEl = useTemplateRef<HTMLDivElement>("dummy-el");
const onNoteEdited = async () => {
  await refresh();

  nextTick(() =>
    dummyEl.value?.scrollIntoView({
      behavior: "smooth",
    }),
  );
};

const modal = useModal();
const editNote = async (note: Note) => {
  modal.open(LazyNoteEditorModal, {
    isEditing: true,
    note,
    onEdit: onNoteEdited,
  });
};

const deleteNote = (note: Note) => {
  modal.open(LazyNoteDeleteModal, {
    noteId: note.id,
    hasAudio: Boolean(note.audioUrls?.length),
    onDelete: refresh,
  });
};

watch(modal.isOpen, (newState) => {
  if (!newState) {
    modal.reset();
  }
});
</script>

<template>
  <UModal
    title="Delete Note"
    :close="{
      disabled: isDeleting,
    }"
    :prevent-close="isDeleting"
  >
    <template #body>
      <p>
        Are you sure you want to delete this note? This action cannot be undone.
      </p>

      <p v-if="hasAudio" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        All associated audio recordings will also be deleted.
      </p>
    </template>

    <template #footer>
      <UButton
        color="neutral"
        variant="outline"
        :disabled="isDeleting"
        @click="modal.close()"
      >
        Cancel
      </UButton>

      <UButton
        color="error"
        :disabled="isDeleting"
        :loading="isDeleting"
        @click="handleDelete"
      >
        Delete
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  noteId: string;
  hasAudio: boolean;
  onDelete?: () => void;
}>();

const modal = useModal();
const isDeleting = ref(false);
async function handleDelete() {
  try {
    isDeleting.value = true;
    await $fetch(`/api/notes/${props.noteId}`, {
      method: "DELETE",
    });

    useToast().add({
      title: "Note Deleted",
      description: "The note was deleted successfully.",
      color: "success",
    });

    modal.close();
    if (props.onDelete) {
      props.onDelete();
    }
  } catch (error) {
    console.error("Failed to delete note:", error);
    useToast().add({
      title: "Delete Error",
      description: "Failed to delete the note.",
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Delete Note"
    :close="{
      disabled: isDeleting,
    }"
    :prevent-close="isDeleting"
  >
    <UButton color="error" variant="ghost" icon="i-lucide-trash-2" size="xs" />

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
        @click="isOpen = false"
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
const props = defineProps<{ noteId: string; hasAudio: boolean }>();
const emit = defineEmits(["deleted"]);
const isOpen = ref(false);

const isDeleting = ref(false);
async function handleDelete() {
  try {
    isDeleting.value = true;
    await $fetch(`/api/notes/${props.noteId}`, {
      method: "DELETE",
    });

    useToast().add({
      title: "Success",
      description: "Note deleted successfully",
      color: "success",
    });

    emit("deleted");
    isOpen.value = false;
  } catch (error) {
    console.error("Failed to delete note:", error);
    useToast().add({
      title: "Error",
      description: "Failed to delete note",
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
}
</script>

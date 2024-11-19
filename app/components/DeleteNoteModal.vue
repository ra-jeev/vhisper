<template>
  <UModal v-model="showDeleteConfirm" :prevent-close="isDeleting">
    <UCard>
      <template #header>
        <h3 class="flex items-center text-lg font-semibold">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="text-red-500 mr-2"
          />
          Delete Note
        </h3>
      </template>

      <p>
        Are you sure you want to delete this note? This action cannot be undone.
      </p>

      <p v-if="hasAudio" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        All associated audio recordings will also be deleted.
      </p>

      <template #footer>
        <UButton
          color="gray"
          variant="ghost"
          :disabled="isDeleting"
          @click="showDeleteConfirm = false"
        >
          Cancel
        </UButton>

        <UButton
          color="red"
          :disabled="isDeleting"
          :loading="isDeleting"
          @click="handleDelete"
        >
          Delete
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ noteId: string; hasAudio: boolean }>();
const emit = defineEmits(["deleted"]);
const showDeleteConfirm = defineModel({ type: Boolean, default: false });

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
      color: "green",
    });

    emit("deleted");
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error("Failed to delete note:", error);
    useToast().add({
      title: "Error",
      description: "Failed to delete note",
      color: "red",
    });
  } finally {
    isDeleting.value = false;
  }
}
</script>

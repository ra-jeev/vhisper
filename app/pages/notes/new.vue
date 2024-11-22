<template>
  <div />
</template>

<script setup lang="ts">
import { LazyNoteEditorModal } from "#components";

const modal = useModal();
onMounted(() => {
  modal.open(LazyNoteEditorModal);
});

const router = useRouter();
watch(modal.isOpen, (newVal) => {
  if (!newVal) {
    modal.reset();
    if (window.history.length > 2) {
      router.back();
    } else {
      navigateTo("/notes");
    }
  }
});

definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <UModal v-model="isModalOpen" fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        body: {
          base: 'flex-grow overflow-hidden',
        },
      }"
    >
      <template #header>
        <h2 class="text-xl md:text-2xl font-semibold leading-6">Create note</h2>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          @click="closeModal"
        />
      </template>

      <CreateNote
        class="w-full max-w-7xl h-full mx-auto"
        @note-created="closeModal"
      />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isModalOpen = ref(true);

const router = useRouter();
const closeModal = () => {
  isModalOpen.value = false;

  if (window.history.length > 2) {
    router.back();
  } else {
    navigateTo("/note");
  }
};
</script>

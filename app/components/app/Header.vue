<template>
  <header
    class="flex justify-between items-center h-14 shrink-0 px-4 sm:px-6 border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800"
  >
    <div class="flex items-center gap-x-3">
      <UButton
        icon="i-heroicons-bars-3-16-solid"
        color="gray"
        variant="ghost"
        class="md:hidden"
        @click="$emit('showDrawer')"
      />

      <h1 class="text-xl md:text-2xl font-semibold">{{ title }}</h1>
    </div>

    <slot name="actions" />
  </header>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();

defineEmits(["showDrawer"]);
</script>

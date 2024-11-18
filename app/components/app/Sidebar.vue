<template>
  <div
    class="h-screen flex-col w-full shrink-0 border-r border-gray-200 dark:border-gray-800"
  >
    <div class="flex items-center justify-between px-4 h-14">
      <AppLogo />
      <UButton
        icon="i-heroicons-x-mark-20-solid"
        color="gray"
        variant="ghost"
        class="md:hidden"
        @click="$emit('hideDrawer')"
      />
    </div>

    <UVerticalNavigation class="p-4" :links="links" />

    <div class="flex-1" />

    <div class="px-4 pb-8">
      <UButton
        block
        color="gray"
        icon="i-heroicons-arrow-right-start-on-rectangle"
        @click="clear"
      >
        Sign out
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  links: { label: string; icon: string; to: string; click?: () => void }[];
}>();

defineEmits(["hideDrawer"]);

const { clear } = useUserSession();
</script>

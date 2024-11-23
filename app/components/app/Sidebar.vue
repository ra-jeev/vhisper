<template>
  <div
    class="h-dvh flex-col w-full shrink-0 border-r border-gray-200 dark:border-gray-800"
  >
    <div class="flex items-center justify-between px-4 h-14">
      <AppLogo />
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        class="md:hidden"
        @click="$emit('hideSlideover')"
      />
    </div>

    <UNavigationMenu
      class="p-4"
      color="neutral"
      orientation="vertical"
      :items="links"
    />

    <div class="flex-1" />

    <div class="px-4 pb-5">
      <UButton
        block
        color="neutral"
        icon="i-lucide-log-out"
        variant="outline"
        @click="clear"
      >
        Sign out
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  links: { label: string; icon: string; to: string; onSelect?: () => void }[];
}>();

defineEmits(["hideSlideover"]);

const { clear } = useUserSession();
</script>

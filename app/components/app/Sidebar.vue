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

    <div class="text-center space-y-4 pb-8">
      <p>Made with ❤️ by Rajeev</p>
      <div class="flex items-center justify-center gap-x-4">
        <UButton
          to="https://x.com/ra_jeeves"
          icon="i-simple-icons-x"
          aria-label="twitter/x"
          color="gray"
          target="_blank"
          variant="ghost"
        />
        <UButton
          to="https://bsky.app/profile/rajeev.dev"
          icon="i-simple-icons-bluesky"
          aria-label="BlueSky App"
          color="gray"
          target="_blank"
          variant="ghost"
        />
        <UButton
          icon="i-simple-icons-github"
          color="gray"
          variant="ghost"
          to="https://github.com/ra-jeev/vhisper"
          target="_blank"
        />
        <AppColorMode />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  links: { label: string; icon: string; to: string; click?: () => void }[];
}>();

defineEmits(["hideDrawer"]);
</script>

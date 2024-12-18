<template>
  <div class="flex h-dvh">
    <AppSidebar :links="links" class="hidden md:flex md:w-64" />

    <div class="flex-1 h-full min-w-0 bg-gray-50 dark:bg-gray-950">
      <AppHeader>
        <template #title>
          <USlideover
            v-model:open="isSlideoverOpen"
            class="max-w-xs"
            side="left"
          >
            <UButton
              class="md:hidden"
              color="neutral"
              icon="i-lucide-menu"
              variant="ghost"
            />

            <template #content>
              <AppSidebar
                :links="links"
                class="flex"
                @hide-slideover="isSlideoverOpen = false"
              />
            </template>
          </USlideover>

          <h2 class="text-lg md:text-xl font-semibold">{{ title }}</h2>
        </template>
        <template #actions>
          <AppColorMode />
          <UButton
            v-if="route.path === '/notes'"
            icon="i-lucide-plus"
            @click="navigateTo('/notes/new')"
          >
            New Note
          </UButton>
        </template>
      </AppHeader>

      <main class="p-4 sm:p-6 h-[calc(100dvh-3.5rem)] overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const isSlideoverOpen = ref(false);
const hideSlideover = () => (isSlideoverOpen.value = false);
const links = [
  {
    label: "Notes",
    icon: "i-lucide-file-text",
    to: "/notes",
    onSelect: hideSlideover,
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/settings",
    onSelect: hideSlideover,
  },
];

const route = useRoute();
const title = computed(() => {
  const activeLink = links.find((l) => l.to === route.path);
  if (activeLink) {
    return activeLink.label;
  }

  return "";
});

const { loggedIn } = useUserSession();
watchEffect(() => {
  if (!loggedIn.value) {
    navigateTo("/");
  }
});
</script>

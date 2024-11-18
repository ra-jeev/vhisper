<template>
  <div class="flex h-screen">
    <USlideover
      v-model="isDrawerOpen"
      class="md:hidden"
      side="left"
      :ui="{ width: 'max-w-xs' }"
    >
      <AppSidebar
        :links="links"
        class="flex"
        @hide-drawer="isDrawerOpen = false"
      />
    </USlideover>

    <AppSidebar :links="links" class="hidden md:flex md:w-64" />

    <div class="flex-1 h-full min-w-0 bg-gray-50 dark:bg-gray-950">
      <AppHeader>
        <template #title>
          <UButton
            icon="i-heroicons-bars-3-16-solid"
            color="gray"
            variant="ghost"
            class="md:hidden"
            @click="isDrawerOpen = true"
          />

          <h1 class="text-xl md:text-2xl font-semibold">{{ title }}</h1>
        </template>
        <template #actions>
          <AppColorMode />
          <UButton
            v-if="route.path === '/notes'"
            icon="i-heroicons-plus"
            @click="navigateTo('/notes/new')"
          >
            New Note
          </UButton>
        </template>
      </AppHeader>

      <main class="p-4 sm:p-6 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const isDrawerOpen = ref(false);
const links = [
  {
    label: "Notes",
    icon: "i-heroicons-document-text",
    to: "/notes",
    click: () => (isDrawerOpen.value = false),
  },
  {
    label: "Settings",
    icon: "i-heroicons-cog",
    to: "/settings",
    click: () => (isDrawerOpen.value = false),
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

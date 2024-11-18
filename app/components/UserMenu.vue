<template>
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar :src="user?.avatarUrl" :alt="user?.name" />

    <template #account="{ item }">
      <div class="text-left">
        <p>Signed in as</p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-5 w-5 text-gray-400 dark:text-gray-500"
      />
      <span class="truncate">{{ item.label }}</span>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession();
const items = [
  [
    {
      label: user.value?.username ?? "Unknown",
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Notes",
      icon: "i-heroicons-document-text",
      click: () => navigateTo("/notes"),
    },
    {
      label: "Settings",
      icon: "i-heroicons-cog",
      click: () => navigateTo("/settings"),
    },
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-right-start-on-rectangle",
      click: clear,
    },
  ],
];
</script>

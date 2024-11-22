<!-- icon="i-lucide-circle-user-round" -->

<template>
  <UDropdownMenu
    :items="items"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8,
    }"
    :ui="{
      content: 'w-48',
    }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      :avatar="{ alt: user?.name, size: 'md' }"
      class="p-0 cursor-pointer"
    />

    <template #account="{ item }">
      <div class="text-left">
        <p>Signed in as</p>
        <p class="truncate font-medium">
          {{ item.label }}
        </p>
      </div>
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession();
const items = [
  [
    {
      label: user.value?.username ?? "Unknown",
      slot: "account",
      disabled: true,
      class: "data-disabled:cursor-text select-text",
    },
  ],
  [
    {
      label: "Notes",
      icon: "i-lucide-file-text",
      to: "/notes",
    },
    {
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/settings",
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-lucide-log-out",
      onSelect: clear,
    },
  ],
];
</script>

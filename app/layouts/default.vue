<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <nav class="w-64 bg-gray-50 dark:bg-gray-900">
      <UVerticalNavigation
        :links="[
          { label: 'Notes', icon: 'i-heroicons-document-text', to: '/notes' },
          { label: 'Settings', icon: 'i-heroicons-cog', to: '/settings' },
          // other menu items
        ]"
      />
    </nav>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <NuxtPage />
    </main>
  </div>
</template>

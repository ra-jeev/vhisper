<template>
  <div>
    <AppHeader class="bg-white/75 dark:bg-gray-900/75 backdrop-blur">
      <template #actions>
        <AppColorMode />

        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/ra-jeev/vhisper"
          target="_blank"
        />

        <AuthState v-slot="{ loggedIn }">
          <UserMenu v-if="loggedIn" />
          <UButton v-else icon="i-lucide-log-in" to="/sign-in">
            Sign in
          </UButton>
        </AuthState>
      </template>
    </AppHeader>

    <main>
      <NuxtPage />
    </main>

    <AppFooter />
  </div>
</template>

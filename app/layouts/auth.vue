<template>
  <main class="flex flex-col min-h-dvh items-center justify-center gap-y-10">
    <AppLogo text-size="text-2xl md:text-3xl" icon-size="w-10 h-10" />

    <slot />
  </main>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession();

watchEffect(() => {
  if (loggedIn.value) {
    navigateTo("/notes", { replace: true });
  }
});
</script>

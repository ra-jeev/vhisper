<template>
  <footer class="border-t -mt-px border-gray-200 dark:border-gray-800">
    <UContainer>
      <div class="flex flex-col items-center gap-y-4 py-6">
        <p>Made with ❤️ by Rajeev</p>
        <div class="flex gap-x-4 justify-center">
          <UButton
            v-for="social in socials"
            :key="social.label"
            :to="social.to"
            :icon="social.icon"
            :aria-label="social.label"
            color="gray"
            target="_blank"
            variant="ghost"
          />
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
const socials = [
  {
    label: "twitter/x",
    icon: "i-simple-icons-x",
    to: "https://x.com/ra_jeeves",
  },
  {
    label: "BlueSky App",
    icon: "i-simple-icons-bluesky",
    to: "https://bsky.app/profile/rajeev.dev",
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    to: "https://github.com/ra-jeev",
  },
];
</script>

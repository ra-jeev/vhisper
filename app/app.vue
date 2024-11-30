<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const title = "Vhisper - Voice Notes with AI Transcriptions";
useSeoMeta({
  title,
  ogTitle: title,
  description:
    "Write notes using your voice, and automatically transcribe the recordings, and optionally refine/post-process the transcriptions with AI.",
  ogImage: "https://vhisper.nuxt.dev/home.png",
  twitterCard: "summary_large_image",
});
</script>

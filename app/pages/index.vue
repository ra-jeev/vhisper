<template>
  <div>
    <div class="bg-gradient-to-b from-sky-500/10">
      <div
        class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 md:py-32"
      >
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
          Voice Notes with <br />
          <span class="text-[var(--ui-primary)]">AI Superpowers </span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-16">
          Record, transcribe, and enhance your notes with AI assistance
        </p>
        <AuthState v-slot="{ loggedIn }">
          <UButton
            size="lg"
            :trailing-icon="loggedIn ? 'i-lucide-arrow-right' : 'i-lucide-plus'"
            :to="loggedIn ? '/notes' : '/sign-up'"
          >
            {{ loggedIn ? "View Your Notes" : "Create Your First Note" }}
          </UButton>
        </AuthState>
      </div>
    </div>

    <UContainer>
      <section id="features" class="py-16">
        <h2 class="text-2xl md:text-4xl font-bold mb-12 text-center">
          Features
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <UCard v-for="(feature, index) in features" :key="`feature-${index}`">
            <div class="flex items-center gap-4">
              <UIcon
                :name="feature.icon"
                class="text-[var(--ui-primary)] size-8"
              />
              <h3 class="text-xl font-semibold">{{ feature.title }}</h3>
            </div>

            <p class="text-gray-500 dark:text-gray-400 mt-6">
              {{ feature.description }}
            </p>
          </UCard>
        </div>
      </section>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "home",
});

const features = [
  {
    icon: "i-lucide-mic",
    title: "Voice Recording",
    description:
      "Record multiple voice clips within a single note. Perfect for lectures, meetings, or quick thoughts.",
  },
  {
    icon: "i-lucide-file-text",
    title: "AI Transcription",
    description:
      "Automatic speech-to-text conversion with high accuracy. Edit and refine transcriptions as needed.",
  },
  {
    icon: "i-lucide-sparkles",
    title: "AI Enhancement",
    description:
      "Optional post-processing to improve transcription clarity, fix grammar, and enhance your notes.",
  },
];
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h2 class="text-base md:text-lg font-semibold leading-6">
          Post Processing
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure post-processing of recording transcriptions with AI models.
          Changes are saved locally.
        </p>
      </div>
      <UButton
        color="neutral"
        icon="i-lucide-undo-2"
        variant="outline"
        @click="resetSettings"
      >
        Reset to Default
      </UButton>
    </template>

    <div class="space-y-6">
      <UFormField
        label="Post process transcriptions"
        description="Enables automatic post-processing of transcriptions using the configured prompt."
      >
        <template #hint>
          <USwitch v-model="localSettings.postProcessing.enabled" />
        </template>
      </UFormField>

      <UFormField
        label="Post processing prompt"
        description="This prompt will be used to process your recording transcriptions."
        :ui="{ container: 'mt-2' }"
      >
        <UTextarea
          v-model="localSettings.postProcessing.prompt"
          class="w-full"
          placeholder="Enter your prompt here..."
          :disabled="!localSettings.postProcessing.enabled"
          :rows="5"
        />
      </UFormField>
    </div>

    <template #footer>
      <UButton
        icon="i-lucide-save"
        :disabled="!hasChanges"
        @click="saveSettings"
      >
        Save Changes
      </UButton>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const { settings, updateSettings, resetSettings } = useSettings();

const localSettings = ref<Settings>({
  postProcessing: {
    enabled: settings.value.postProcessing.enabled,
    prompt: settings.value.postProcessing.prompt,
  },
});

watch(settings, (newSettings) => {
  localSettings.value = {
    postProcessing: {
      enabled: newSettings.postProcessing.enabled,
      prompt: newSettings.postProcessing.prompt,
    },
  };
});

const hasChanges = computed(
  () =>
    localSettings.value.postProcessing.enabled !==
      settings.value.postProcessing.enabled ||
    localSettings.value.postProcessing.prompt !==
      settings.value.postProcessing.prompt,
);

const saveSettings = () => {
  updateSettings(localSettings.value);
  useToast().add({
    title: "Success",
    description: "Settings updated successfully.",
    color: "success",
  });
};

definePageMeta({
  middleware: "auth",
});
</script>

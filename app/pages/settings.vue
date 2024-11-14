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
        icon="i-heroicons-arrow-path"
        color="gray"
        @click="resetSettings"
      >
        Reset to Default
      </UButton>
    </template>

    <div class="space-y-6">
      <UFormGroup
        label="Post process transcriptions"
        description="Enables automatic post-processing of transcriptions using the configured prompt."
        :ui="{ container: 'mt-2' }"
      >
        <template #hint>
          <UToggle v-model="localSettings.postProcessing.enabled" />
        </template>
      </UFormGroup>

      <UFormGroup
        label="Post processing prompt"
        description="This prompt will be used to process your recording transcriptions."
        :ui="{ container: 'mt-2' }"
      >
        <UTextarea
          v-model="localSettings.postProcessing.prompt"
          :disabled="!localSettings.postProcessing.enabled"
          :rows="5"
          placeholder="Enter your prompt here..."
          class="w-full"
        />
      </UFormGroup>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-x-4">
        <UButton
          icon="i-heroicons-arrow-down-tray"
          :disabled="!hasChanges"
          @click="saveSettings"
        >
          Save Changes
        </UButton>
      </div>
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
    description: "Settings udpdated successfully.",
    color: "green",
  });
};
</script>

<template>
  <ULink raw class="flex items-center gap-x-3" to="/">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="text-[var(--ui-primary)]"
      :class="iconSize"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M12 6v12M9 9v6m9-4v2M6 11v2m9-6v10M6 3H3v3m15-3h3v3M6 21H3v-3m15 3h3v-3"
      />
    </svg>
    <span class="font-bold" :class="textSize">Vhisper</span>
  </ULink>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    iconSize?: string;
    textSize?: string;
  }>(),
  {
    iconSize: "w-8 h-8",
    textSize: "text-xl md:text-2xl",
  },
);
</script>

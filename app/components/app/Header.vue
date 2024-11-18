<template>
  <header
    class="shrink-0 border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800"
  >
    <UContainer class="flex justify-between items-center h-14">
      <div class="flex items-center gap-x-3">
        <slot name="title">
          <AppLogo />
        </slot>
      </div>

      <div class="flex items-center gap-x-3">
        <slot name="actions" />
      </div>
    </UContainer>
  </header>
</template>

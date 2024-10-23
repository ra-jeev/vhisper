export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@nuxt/eslint', 'nuxt-auth-utils', '@nuxt/ui'],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: 'Hello from the Edge 👋',
    },
  },

  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

  hub: {},

  eslint: {
    config: {
      stylistic: false,
    },
  },
});

export default defineNuxtConfig({
  modules: ["@nuxthub/core", "@nuxt/eslint", "nuxt-auth-utils", "@nuxt/ui"],

  devtools: { enabled: true },

  future: { compatibilityVersion: 4 },
  compatibilityDate: "2024-07-30",

  hub: {
    ai: true,
    database: true,
    cache: true,
    blob: true,
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      bodyAttrs: {
        class: "bg-white dark:bg-gray-900",
      },
    },
  },
});

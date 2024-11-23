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
    },
  },

  css: ["~/assets/css/main.css"],

  // Uncomment if you use Safari in dev
  // Create the key and crt in the root dir using:
  // 1. openssl genrsa 2048 > server.key
  // 2. chmod 400 server.key
  // 3. openssl req -new -x509 -nodes -sha256 -days 365 -key server.key -out server.crt
  // More info: https://github.com/atinux/nuxt-auth-utils/issues/78#issuecomment-2059231741
  // devServer: {
  //   https: {
  //     key: "./server.key",
  //     cert: "./server.crt",
  //   },
  // },
});

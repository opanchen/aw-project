// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  srcDir: 'src/',

  app: {
    head: {
      title: 'Adaptive Workspace',
    },
  },

  // Disable SSR for SPA mode
  ssr: false,

  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/ui', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],
})

<script setup lang="ts">
import ModeSwitcher from '~/shared/ui/ModeSwitcher.vue'

const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <UContainer>
      <header class="border-b border-gray-200 dark:border-gray-800 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Adaptive Workspace</h1>
          </div>

          <ModeSwitcher />

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Color mode toggle -->
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              color="neutral"
              variant="ghost"
              @click="toggleColorMode"
            />
          </div>
        </div>
      </header>
    </UContainer>

    <!-- Main Content -->
    <UContainer>
      <UMain class="py-8">
        <slot />
      </UMain>
    </UContainer>
  </div>
</template>

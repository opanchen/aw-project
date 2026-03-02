<script setup lang="ts">
import type { Task } from '@repo/domain'
import FocusTimer from './FocusTimer.vue'

defineProps<{
  task: Task
  elapsedTime: number
  isPaused: boolean
  isFocusTask: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-6 py-10">
    <div
      v-if="isFocusTask"
      class="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-yellow-500"
    >
      <UIcon name="i-heroicons-star-16-solid" class="size-4" />
      <span>Focus of the day</span>
    </div>

    <h2 class="max-w-sm text-center text-2xl font-semibold text-gray-900 dark:text-white">
      {{ task.title }}
    </h2>

    <FocusTimer :ms="elapsedTime" />

    <UBadge
      v-if="isPaused"
      label="PAUSED"
      color="neutral"
      variant="solid"
      class="uppercase tracking-widest"
    />
  </div>
</template>

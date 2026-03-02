<script setup lang="ts">
import { formatDuration } from '~/shared/utils/time'

defineProps<{ ms: number }>()
</script>

<template>
  <span
    class="font-mono text-6xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white"
  >
    {{ formatDuration(ms) }}
  </span>
</template>

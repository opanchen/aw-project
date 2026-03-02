<script setup lang="ts">
import type { Task } from '@repo/domain'
import { PRIORITY_OPTIONS } from '~/shared/constants'

type Props = {
  variant: 'backlog' | 'plan'
  task: Task
}

defineProps<Props>()

const dayStore = useDayStore()
const taskStore = useTaskStore()

const isMaxReached = computed(() => (dayStore.currentDay?.taskIds.length ?? 0) >= 5)

const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'low':
      return 'warning'
    case 'medium':
      return 'success'
    case 'high':
      return 'error'
    default:
      return 'neutral'
  }
}
</script>

<template>
  <div
    class="flex items-center justify-between gap-3 rounded-lg border bg-gray-50 p-2 dark:bg-gray-800"
  >
    <div class="flex items-center gap-2">
      <UButton
        v-if="variant === 'plan'"
        variant="link"
        :icon="
          taskStore?.focusTask?.id === task.id ? 'i-heroicons-star-16-solid' : 'i-heroicons-star'
        "
        :aria-label="taskStore?.focusTask?.id === task.id ? 'Focused task' : 'Set as focused task'"
        :color="taskStore?.focusTask?.id === task.id ? 'warning' : 'neutral'"
        class="cursor-pointer"
        @click="dayStore.setFocusTask(task.id)"
      />

      <UIcon
        v-if="variant === 'backlog'"
        :name="'i-heroicons-star'"
        class="text-gray-400 dark:text-gray-500 size-5"
      />

      <p>{{ task.title }}</p>
    </div>

    <div class="flex items-center gap-2">
      <UBadge
        :label="PRIORITY_OPTIONS.find(o => o.value === task.priority)?.label || task.priority"
        variant="soft"
        :color="getPriorityColor(task.priority)"
        class="min-w-6"
      />

      <UTooltip
        :text="variant === 'backlog' && isMaxReached ? 'Maximum 5 tasks per day' : ''"
        :content="{ side: 'left' }"
      >
        <UButton
          :icon="variant === 'plan' ? 'i-heroicons-x-mark' : 'i-heroicons-arrow-right'"
          :aria-label="variant === 'plan' ? 'Remove from day plan' : 'Add to day plan'"
          :disabled="variant === 'backlog' && isMaxReached"
          color="neutral"
          variant="ghost"
          size="sm"
          class="cursor-pointer"
          @click="
            variant === 'plan'
              ? dayStore.removeTaskFromDay(task.id)
              : dayStore.addTaskToDay(task.id)
          "
        />
      </UTooltip>
    </div>
  </div>
</template>

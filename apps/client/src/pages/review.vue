<script setup lang="ts">
import { formatDuration } from '~/shared/utils/time'

const dayStore = useDayStore()
const taskStore = useTaskStore()
const focusStore = useFocusStore()

// --- Guard ---
onMounted(() => {
  if (!dayStore.currentDay || dayStore.currentDay.status === 'planning') {
    navigateTo('/')
  }
})

// --- Derived state ---
const isReadOnly = computed(() => dayStore.currentDay?.status === 'closed')

const completedTasks = computed(() => taskStore.plannedTasks.filter(t => t.status === 'completed'))

const pendingTasks = computed(() => taskStore.plannedTasks.filter(t => t.status === 'pending'))

// Sum of all today's sessions for a specific task
const getTaskFocusTime = (taskId: string): number =>
  focusStore.todaySessions
    .filter(s => s.taskId === taskId && s.endTime)
    .reduce((acc, s) => acc + (s.endTime! - s.startTime), 0)

// --- Carry over / Drop ---
const decisions = ref<Record<string, 'carry-over' | 'drop'>>({})

const setDecision = (taskId: string, decision: 'carry-over' | 'drop') => {
  if (decisions.value[taskId] === decision) {
    // Clicking the active button deselects it
    const { [taskId]: _, ...rest } = decisions.value
    decisions.value = rest
  } else {
    decisions.value = { ...decisions.value, [taskId]: decision }
  }
}

const canCloseDay = computed(
  // every() returns true for empty array — no pending tasks means we can close immediately
  () => !isReadOnly.value && pendingTasks.value.every(t => t.id in decisions.value)
)

// --- Reflection & Close Day ---
const reflection = ref('')

const handleCloseDay = () => {
  for (const [taskId, decision] of Object.entries(decisions.value)) {
    if (decision === 'drop') {
      taskStore.archiveTask(taskId)
    }
    // Both carry-over and drop: remove from day so task returns to backlog (if still pending)
    dayStore.removeTaskFromDay(taskId)
  }

  dayStore.closeDay(reflection.value || undefined)
  navigateTo('/')
}

const handleNewDay = () => {
  const today = new Date().toISOString().split('T')[0]
  dayStore.createDay(today)
  navigateTo('/')
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 py-4">
    <!-- Stats block -->
    <UCard class="w-full max-w-lg">
      <div class="flex items-center justify-between py-2">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Today's Summary</h2>
        <UBadge v-if="isReadOnly" label="Closed" color="neutral" variant="soft" />
      </div>

      <div class="flex items-center gap-8 py-4 text-sm text-gray-600 dark:text-gray-400">
        <span>
          ✅
          <span class="font-semibold text-gray-900 dark:text-white">{{
            completedTasks.length
          }}</span>
          / {{ taskStore.plannedTasks.length }} completed
        </span>
        <span>
          ⏱ Focus:
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ formatDuration(focusStore.totalFocusTime) }}
          </span>
        </span>
      </div>
    </UCard>

    <!-- Task list -->
    <UCard class="w-full max-w-lg">
      <!-- Completed tasks -->
      <div v-if="completedTasks.length" class="mb-4">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Completed</p>
        <ul class="space-y-2">
          <li
            v-for="task in completedTasks"
            :key="task.id"
            class="flex items-center justify-between gap-4"
          >
            <span class="flex min-w-0 items-center gap-2">
              <UIcon
                name="i-heroicons-check-circle-16-solid"
                class="size-4 shrink-0 text-green-500"
              />
              <span class="truncate text-gray-900 dark:text-white">{{ task.title }}</span>
            </span>
            <span v-if="getTaskFocusTime(task.id)" class="shrink-0 font-mono text-sm text-gray-400">
              {{ formatDuration(getTaskFocusTime(task.id)) }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Pending tasks -->
      <div v-if="pendingTasks.length">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Pending</p>
        <ul class="space-y-3">
          <li
            v-for="task in pendingTasks"
            :key="task.id"
            class="flex items-center justify-between gap-4"
          >
            <span class="min-w-0 truncate text-gray-500 dark:text-gray-400">{{ task.title }}</span>

            <!-- Interactive: carry-over / drop toggle -->
            <div v-if="!isReadOnly" class="flex shrink-0 gap-1.5">
              <UButton
                label="Carry over"
                size="xs"
                :color="decisions[task.id] === 'carry-over' ? 'primary' : 'neutral'"
                :variant="decisions[task.id] === 'carry-over' ? 'solid' : 'outline'"
                @click="setDecision(task.id, 'carry-over')"
              />
              <UButton
                label="Drop"
                size="xs"
                :color="decisions[task.id] === 'drop' ? 'error' : 'neutral'"
                :variant="decisions[task.id] === 'drop' ? 'solid' : 'outline'"
                @click="setDecision(task.id, 'drop')"
              />
            </div>

            <!-- Read-only: just show status badge -->
            <UBadge v-else label="pending" color="neutral" variant="soft" />
          </li>
        </ul>
      </div>

      <!-- Empty state: all tasks completed -->
      <p
        v-if="!completedTasks.length && !pendingTasks.length"
        class="py-4 text-center text-sm text-gray-400"
      >
        No tasks for this day.
      </p>
    </UCard>

    <!-- Reflection + Close Day -->
    <UCard v-if="!isReadOnly" class="w-full max-w-lg">
      <div class="space-y-4">
        <UTextarea v-model="reflection" placeholder="How did the day go? (optional)" :rows="3" />

        <div class="flex justify-end">
          <UButton
            label="Close Day →"
            color="primary"
            :disabled="!canCloseDay"
            @click="handleCloseDay"
          />
        </div>
      </div>
    </UCard>

    <!-- Closed day: start a new session -->
    <UCard v-if="isReadOnly" class="w-full max-w-lg">
      <div class="flex flex-col items-center gap-3 py-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Ready for another round?</p>
        <UButton label="Plan New Day →" color="primary" @click="handleNewDay" />
      </div>
    </UCard>
  </div>
</template>

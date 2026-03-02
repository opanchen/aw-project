<script setup lang="ts">
import ActiveTaskCard from '~/features/focus-session/ui/ActiveTaskCard.vue'
import DoneModal from '~/features/focus-session/ui/DoneModal.vue'
import SwitchTaskModal from '~/features/focus-session/ui/SwitchTaskModal.vue'
import useFocusTimer from '~/shared/composables/useFocusTimer'
import useModeNavigation from '~/shared/composables/useModeNavigation'
import { formatDuration } from '~/shared/utils/time'
import type { Task } from '@repo/domain'

const dayStore = useDayStore()
const taskStore = useTaskStore()
const focusStore = useFocusStore()
const { goTo } = useModeNavigation()

const { elapsedTime, isRunning, isPaused, start, pause, resume, stop, reset } = useFocusTimer()

// --- State ---
const activeTask = ref<Task | null>(null)

const isFocusTask = computed(
  () => !!activeTask.value && dayStore.currentDay?.focusTaskId === activeTask.value.id
)

const completedCount = computed(
  () => taskStore.plannedTasks.filter(t => t.status === 'completed').length
)

const pendingTasksForSwitch = computed(() =>
  taskStore.plannedTasks.filter(t => t.status === 'pending' && t.id !== activeTask.value?.id)
)

// --- Done Flow ---
const isDoneModalOpen = ref(false)
const doneTaskTitle = ref('')

const handleDoneClick = () => {
  doneTaskTitle.value = activeTask.value?.title ?? ''
  // pause() instead of stop(): task is not confirmed done yet.
  // If the modal is dismissed, resume() restores the timer safely.
  if (isRunning.value) pause()
  isDoneModalOpen.value = true
}

const handleDoneConfirm = (_note: string) => {
  // Timer is paused: stop() clears isPaused without calling endSession again
  stop()
  taskStore.completeTask(activeTask.value!.id)
  isDoneModalOpen.value = false
  reset()

  const next = taskStore.plannedTasks.find(t => t.status === 'pending')
  if (next) {
    activeTask.value = next
    start(next.id, dayStore.currentDay!.id)
  } else {
    goTo('review')
  }
}

const handleDoneCancel = () => {
  isDoneModalOpen.value = false
  if (isPaused.value) resume()
}

// --- Switch Task ---
const isSwitchModalOpen = ref(false)

const handleSwitch = (task: Task) => {
  stop()
  activeTask.value = task
  reset()
  start(task.id, dayStore.currentDay!.id)
  isSwitchModalOpen.value = false
}

// --- Init ---
onMounted(() => {
  if (!dayStore.currentDay || dayStore.currentDay.status !== 'active') {
    navigateTo('/')
    return
  }

  // Orphan session cleanup: active session left over from a page reload
  if (focusStore.activeSession) {
    focusStore.endSession()
  }

  const taskId =
    dayStore.currentDay.focusTaskId ?? // 1. designated focus task
    taskStore.plannedTasks.find(t => t.status === 'pending')?.id // 2. first pending

  activeTask.value = taskId ? taskStore.getTaskById(taskId) : null

  if (activeTask.value) {
    start(activeTask.value.id, dayStore.currentDay.id)
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-8 py-4">
    <!-- All tasks done — no activeTask -->
    <UCard v-if="!activeTask" class="w-full max-w-lg">
      <div class="flex flex-col items-center gap-4 py-10">
        <p class="text-gray-500 dark:text-gray-400">All tasks completed!</p>
        <UButton label="Go to Review →" color="primary" @click="goTo('review')" />
      </div>
    </UCard>

    <template v-else>
      <!-- Central task card -->
      <UCard class="w-full max-w-lg">
        <ActiveTaskCard
          :task="activeTask"
          :elapsed-time="elapsedTime"
          :is-paused="isPaused"
          :is-focus-task="isFocusTask"
        />

        <!-- Controls -->
        <div class="flex items-center justify-center gap-3 pb-6">
          <UButton
            v-if="isRunning"
            icon="i-heroicons-pause"
            label="Pause"
            color="neutral"
            variant="soft"
            @click="pause()"
          />
          <UButton
            v-else-if="isPaused"
            icon="i-heroicons-play"
            label="Resume"
            color="neutral"
            variant="soft"
            @click="resume()"
          />

          <UButton icon="i-heroicons-check" label="Done" color="primary" @click="handleDoneClick" />

          <UButton
            v-if="pendingTasksForSwitch.length"
            icon="i-heroicons-arrows-right-left"
            label="Switch"
            color="neutral"
            variant="ghost"
            @click="isSwitchModalOpen = true"
          />
        </div>
      </UCard>

      <!-- Mini-status -->
      <div class="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
        <span>✅ {{ completedCount }} / {{ taskStore.plannedTasks.length }}</span>
        <span>Focus time: {{ formatDuration(focusStore.totalFocusTime) }}</span>
      </div>
    </template>

    <DoneModal
      :open="isDoneModalOpen"
      :task-title="doneTaskTitle"
      :elapsed-time="elapsedTime"
      @update:open="isDoneModalOpen = $event"
      @confirm="handleDoneConfirm"
      @cancel="handleDoneCancel"
    />

    <SwitchTaskModal
      :open="isSwitchModalOpen"
      :tasks="pendingTasksForSwitch"
      @update:open="isSwitchModalOpen = $event"
      @switch="handleSwitch"
      @cancel="isSwitchModalOpen = false"
    />
  </div>
</template>

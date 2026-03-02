<script setup lang="ts">
import useModeNavigation from '~/shared/composables/useModeNavigation'
import TaskItem from '~/features/plan/ui/TaskItem.vue'
import CreateTaskForm from '~/features/plan/ui/CreateTaskForm.vue'

const dayStore = useDayStore()
const taskStore = useTaskStore()
const { canGoTo, goTo } = useModeNavigation()

// Entry Flow: runs on every visit to '/', determines which screen to show.
// Uses currentDay (not todayDay) so that "Plan New Day" creates a fresh planning
// session for the same calendar date without being redirected to the old closed day.
onMounted(() => {
  const today = new Date().toISOString().split('T')[0]

  // currentDay exists and is for today → route based on its status
  if (dayStore.currentDay?.date === today) {
    const { status } = dayStore.currentDay
    if (status === 'active') navigateTo('/focus')
    else if (status === 'closed') navigateTo('/review')
    // status === 'planning' → stay on Plan Mode
    return
  }

  // No current day, or it belongs to a previous date → start fresh
  dayStore.createDay(today)
})
</script>

<template>
  <div class="space-y-6 flex flex-col">
    <!-- Day plan -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-md font-semibold text-gray-900 dark:text-white">Plan for today</h2>

          <UTooltip
            :text="
              taskStore.plannedTasks.length === 5
                ? 'Maximum of 5 tasks can be planned for a day'
                : 'You can add up to 5 tasks to your daily plan'
            "
            :content="{ side: 'top' }"
          >
            <span>{{ taskStore.plannedTasks.length }}/5</span>
          </UTooltip>
        </div>
      </template>

      <div class="py-8 text-gray-500 dark:text-gray-400">
        <p v-if="!taskStore.plannedTasks.length" class="text-center">No tasks planned for today.</p>

        <div v-else>
          <ul class="space-y-2">
            <li v-for="task in taskStore.plannedTasks" :key="task.id" class="">
              <TaskItem variant="plan" :task="task" />
            </li>
          </ul>

          <div class="mt-4 flex items-center gap-1">
            <UIcon name="i-heroicons-star-16-solid" class="text-yellow-500 dark:text-yellow-400" />

            <p>
              = focus of the day (click on
              <UIcon name="i-heroicons-star" /> to set)
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Backlog -->
    <UCard>
      <template #header>
        <h2 class="text-md font-semibold text-gray-900 dark:text-white">Backlog tasks</h2>
      </template>

      <div class="py-8 text-gray-500 dark:text-gray-400">
        <p v-if="!taskStore.backlogTasks.length" class="text-center">No tasks in backlog.</p>
        <ul v-else class="space-y-2">
          <li v-for="task in taskStore.backlogTasks" :key="task.id" class="">
            <TaskItem variant="backlog" :task="task" />
          </li>
        </ul>
      </div>

      <template #footer>
        <div class="p-4">
          <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-2">
            Add a new task to backlog
          </h3>

          <CreateTaskForm />
        </div>
      </template>
    </UCard>

    <!--  CTA  -->
    <UButton
      label="Start Focus"
      size="xl"
      class="mx-auto cursor-pointer"
      color="primary"
      :disabled="!canGoTo('focus')"
      @click="goTo('focus')"
    />
  </div>
</template>

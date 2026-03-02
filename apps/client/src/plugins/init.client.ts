import { useDayStore } from '~/stores/day.store'
import { useTaskStore } from '~/stores/task.store'
import { useFocusStore } from '~/stores/focus.store'

/**
 * Client-side plugin to initialize app state from localStorage
 */
export default defineNuxtPlugin(() => {
  const dayStore = useDayStore()
  const taskStore = useTaskStore()
  const focusStore = useFocusStore()

  // Load persisted data on client mount
  dayStore.loadFromLocalStorage()
  taskStore.loadFromLocalStorage()
  focusStore.loadFromLocalStorage()
})

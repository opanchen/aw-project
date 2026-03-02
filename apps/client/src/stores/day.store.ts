import type { Day } from '@repo/domain'

export const useDayStore = defineStore('day', () => {
  // STATE:
  const days = ref<Day[]>([])
  const currentDayId = ref<string | null>(null)

  // GETTERS:
  const currentDay = computed(() => {
    return days.value.find(day => day.id === currentDayId.value) || null
  })

  const todayDay = computed(() => {
    const today = new Date().toISOString().split('T')[0] // Get YYYY-MM-DD
    return days.value.find(day => day.date === today) || null
  })

  // ACTIONS:
  const createDay = (date: string) => {
    const newDay: Day = {
      id: crypto.randomUUID(),
      date,
      status: 'planning',
      taskIds: [],
    }

    days.value.push(newDay)
    currentDayId.value = newDay.id

    saveToLocalStorage()
  }

  const addTaskToDay = (taskId: string) => {
    if (!currentDay.value) return

    if (currentDay.value.taskIds.length >= 5) {
      throw new Error('Cannot add more than 5 tasks to a day')
    }

    currentDay.value.taskIds.push(taskId)

    saveToLocalStorage()
  }

  const removeTaskFromDay = (taskId: string) => {
    if (!currentDay.value) return

    currentDay.value.taskIds = currentDay.value.taskIds.filter(id => id !== taskId)

    // If the removed task was the focus task, clear it
    if (currentDay.value.focusTaskId === taskId) {
      currentDay.value.focusTaskId = undefined
    }

    saveToLocalStorage()
  }

  const setFocusTask = (taskId: string) => {
    if (!currentDay.value) return

    if (!currentDay.value.taskIds.includes(taskId)) {
      throw new Error("Focus task must be one of the day's tasks")
    }

    currentDay.value.focusTaskId = taskId

    saveToLocalStorage()
  }

  const reorderTasks = (taskIds: string[]) => {
    if (!currentDay.value) return

    if (
      taskIds.length !== currentDay.value.taskIds.length ||
      !taskIds.every(id => currentDay.value!.taskIds.includes(id))
    ) {
      throw new Error("Reordered task IDs must match the day's tasks")
    }

    currentDay.value.taskIds = taskIds

    saveToLocalStorage()
  }

  const startDay = () => {
    if (!currentDay.value) return

    currentDay.value.status = 'active'

    saveToLocalStorage()
  }

  const closeDay = (reflection?: string) => {
    if (!currentDay.value) return

    currentDay.value.status = 'closed'
    if (reflection) {
      currentDay.value.reflection = reflection
    }

    saveToLocalStorage()
  }

  const isNewDay = () => {
    const today = new Date().toISOString().split('T')[0]
    return !days.value.some(day => day.date === today)
  }

  const saveToLocalStorage = () => {
    if (typeof window === 'undefined') return

    const data = {
      days: days.value,
      currentDayId: currentDayId.value,
    }

    localStorage.setItem('adaptive-days', JSON.stringify(data))
  }

  const loadFromLocalStorage = () => {
    if (typeof window === 'undefined') return

    const dataStr = localStorage.getItem('adaptive-days')
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr)
        days.value = data.days || []
        currentDayId.value = data.currentDayId || null
      } catch (error) {
        console.error('Failed to load day store from localStorage:', error)
      }
    }
  }

  return {
    days,
    currentDayId,
    currentDay,
    todayDay,
    createDay,
    addTaskToDay,
    removeTaskFromDay,
    setFocusTask,
    reorderTasks,
    startDay,
    closeDay,
    isNewDay,
    loadFromLocalStorage,
  }
})

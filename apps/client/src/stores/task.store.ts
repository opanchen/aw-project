import type { Task } from '@repo/domain'

export const useTaskStore = defineStore('task', () => {
  const dayStore = useDayStore()

  // STATE:
  const tasks = ref<Task[]>([])

  // GETTERS:
  const pendingTasks = computed(() => {
    return tasks.value.filter(task => task.status === 'pending')
  })

  const plannedTasks = computed(() => {
    if (!dayStore.currentDay) return []
    return dayStore.currentDay.taskIds
      .map(id => tasks.value.find(t => t.id === id))
      .filter(Boolean) as Task[]
  })

  const focusTask = computed(() => {
    if (!dayStore.currentDay || !dayStore.currentDay.focusTaskId) return null
    return tasks.value.find(t => t.id === dayStore.currentDay!.focusTaskId) || null
  })

  const backlogTasks = computed(() => {
    const plannedIds = dayStore.currentDay ? dayStore.currentDay.taskIds : []
    return tasks.value.filter(task => !plannedIds.includes(task.id) && task.status === 'pending')
  })

  // ACTIONS:
  const addTask = (title: string, priority?: Task['priority']) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      priority,
      status: 'pending',
      createdAt: Date.now(),
    }

    tasks.value.push(newTask)
    saveToLocalStorage()
    return newTask
  }

  const completeTask = (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = 'completed'
      task.completedAt = Date.now()
      saveToLocalStorage()
    }
  }

  const archiveTask = (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = 'archived'
      saveToLocalStorage()
    }
  }

  const getTaskById = (id: string) => {
    return tasks.value.find(t => t.id === id) || null
  }

  const saveToLocalStorage = () => {
    if (typeof window === 'undefined') return

    const data = {
      tasks: tasks.value,
    }
    localStorage.setItem('adaptive-tasks', JSON.stringify(data))
  }

  const loadFromLocalStorage = () => {
    if (typeof window === 'undefined') return

    const dataStr = localStorage.getItem('adaptive-tasks')
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr)
        tasks.value = data.tasks || []
      } catch (e) {
        console.error('Failed to parse task store from localStorage', e)
      }
    }
  }

  return {
    tasks,
    pendingTasks,
    plannedTasks,
    focusTask,
    backlogTasks,
    addTask,
    completeTask,
    archiveTask,
    getTaskById,
    loadFromLocalStorage,
  }
})

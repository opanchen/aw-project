import type { FocusSession } from '@repo/domain'

export const useFocusStore = defineStore('focus', () => {
  // STATE:
  const sessions = ref<FocusSession[]>([])
  const activeSessionId = ref<string | null>(null)

  // GETTERS:
  const activeSession = computed(() => {
    return sessions.value.find(s => s.id === activeSessionId.value) || null
  })

  const todaySessions = computed(() => {
    const today = new Date().toISOString().split('T')[0] // Get YYYY-MM-DD
    return sessions.value.filter(s => {
      const sessionDate = new Date(s.startTime).toISOString().split('T')[0]
      return sessionDate === today
    })
  })

  const totalFocusTime = computed(() => {
    return todaySessions.value.reduce((total, session) => {
      if (session.endTime) {
        return total + (session.endTime - session.startTime)
      }
      return total
    }, 0)
  })

  // ACTIONS:
  const startSession = (taskId: string, dayId: string) => {
    if (activeSessionId.value) {
      throw new Error('A focus session is already active. Please end it before starting a new one.')
    }

    const session: FocusSession = {
      id: crypto.randomUUID(),
      taskId,
      dayId,
      startTime: Date.now(),
    }

    activeSessionId.value = session.id
    sessions.value.push(session)

    saveToLocalStorage()
  }

  const endSession = (notes?: string) => {
    if (!activeSessionId.value) {
      throw new Error('No active focus session to end.')
    }

    const session = sessions.value.find(s => s.id === activeSessionId.value)

    if (!session) {
      throw new Error('Active session not found.')
    }

    session.endTime = Date.now()
    if (notes) {
      session.notes = notes
    }

    activeSessionId.value = null
    saveToLocalStorage()
  }

  const pauseSession = () => {
    if (!activeSessionId.value) {
      throw new Error('No active focus session to pause.')
    }

    const session = sessions.value.find(s => s.id === activeSessionId.value)

    if (!session) {
      throw new Error('Active session not found.')
    }

    session.endTime = Date.now()
    activeSessionId.value = null

    saveToLocalStorage()
  }

  const getSessionByTaskId = (taskId: string) => {
    return sessions.value.filter(s => s.taskId === taskId)
  }

  const saveToLocalStorage = () => {
    if (typeof window === 'undefined') return

    const data = {
      sessions: sessions.value,
      activeSessionId: activeSessionId.value,
    }

    localStorage.setItem('adaptive-focus-sessions', JSON.stringify(data))
  }

  const loadFromLocalStorage = () => {
    if (typeof window === 'undefined') return

    const dataStr = localStorage.getItem('adaptive-focus-sessions')

    if (dataStr) {
      try {
        const data = JSON.parse(dataStr)
        sessions.value = data.sessions || []
        activeSessionId.value = data.activeSessionId || null
      } catch (e) {
        console.error('Failed to parse focus store from localStorage', e)
      }
    }
  }

  return {
    sessions,
    activeSessionId,
    activeSession,
    todaySessions,
    totalFocusTime,
    startSession,
    endSession,
    pauseSession,
    getSessionByTaskId,
    loadFromLocalStorage,
  }
})

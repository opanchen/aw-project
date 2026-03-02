// UI:       [========= start ====== pause ===== resume ====== done =========]
// Domain:   [--- FocusSession #1 ---]          [--- FocusSession #2 ---]

export default function useFocusTimer() {
  const focusStore = useFocusStore()

  const elapsedTime = ref(0)
  const isRunning = ref(false)
  const isPaused = ref(false)

  let intervalId: ReturnType<typeof setInterval> | null = null
  let sessionStartTimestamp = 0
  let accumulatedBeforePause = 0
  let currentTaskId: string | null = null
  let currentDayId: string | null = null

  const startInterval = () => {
    intervalId = setInterval(() => {
      elapsedTime.value = accumulatedBeforePause + (Date.now() - sessionStartTimestamp)
    }, 1000)
  }

  const clearTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const start = (taskId: string, dayId: string) => {
    if (isRunning.value) {
      throw new Error('Focus timer is already running.')
    }

    currentTaskId = taskId
    currentDayId = dayId
    accumulatedBeforePause = 0
    elapsedTime.value = 0
    sessionStartTimestamp = Date.now()

    focusStore.startSession(taskId, dayId)

    isRunning.value = true
    isPaused.value = false

    startInterval()
  }

  const pause = () => {
    if (!isRunning.value) {
      throw new Error('Focus timer is not running.')
    }

    clearTimer()
    accumulatedBeforePause = elapsedTime.value
    focusStore.pauseSession()

    isRunning.value = false
    isPaused.value = true
  }

  const resume = () => {
    if (!isPaused.value) {
      throw new Error('Focus timer is not paused.')
    }

    sessionStartTimestamp = Date.now()
    focusStore.startSession(currentTaskId!, currentDayId!)

    isRunning.value = true
    isPaused.value = false

    startInterval()
  }

  const stop = (notes?: string) => {
    if (!isRunning.value && !isPaused.value) {
      throw new Error('Focus timer is not active.')
    }

    clearTimer()

    if (isRunning.value) {
      focusStore.endSession(notes)
    }

    isRunning.value = false
    isPaused.value = false
    // elapsedTime NOT reset — available for Done Flow UI
  }

  const reset = () => {
    elapsedTime.value = 0
    accumulatedBeforePause = 0
    currentTaskId = null
    currentDayId = null
  }

  onUnmounted(() => {
    clearTimer()
  })

  return {
    elapsedTime: readonly(elapsedTime),
    isRunning: readonly(isRunning),
    isPaused: readonly(isPaused),
    start,
    pause,
    resume,
    stop,
    reset,
  }
}

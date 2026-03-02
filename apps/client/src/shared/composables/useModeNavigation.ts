import type { AppMode } from '@repo/domain'

export default function useModeNavigation() {
  const dayStore = useDayStore()
  const focusStore = useFocusStore()
  const route = useRoute()

  const currentMode = computed<AppMode>(() => {
    if (route.path === '/review') return 'review'
    if (route.path === '/focus') return 'focus'
    return 'plan'
  })

  const canGoTo = (mode: AppMode) => {
    if (mode === currentMode.value) return false // Already in the target mode

    if (currentMode.value === 'plan') {
      if (mode === 'focus')
        return !!dayStore.currentDay?.taskIds?.length && dayStore.currentDay?.status === 'planning'
      if (mode === 'review') return false // Can't go to review from planning
    }

    if (currentMode.value === 'focus') {
      if (mode === 'plan') return true // Can always go back to planning from focus
      if (mode === 'review') return true // Can go to review from focus (end session)
    }

    if (currentMode.value === 'review') {
      if (mode === 'plan') return false // Day is closed or still active
      if (mode === 'focus') return dayStore.currentDay?.status === 'active' // Only if day not yet closed
    }

    return false // Default to disallowing navigation for any unhandled cases
  }

  const goTo = (mode: AppMode) => {
    if (!canGoTo(mode)) {
      console.warn(`Cannot navigate to ${mode} mode from ${currentMode.value} mode.`)
      return
    }

    // Side effects of mode change:
    if (currentMode.value === 'plan' && mode === 'focus') {
      // 1. Set focus-task if not set (start first task by default)
      if (!dayStore.currentDay?.focusTaskId) {
        const firstTaskId = dayStore.currentDay?.taskIds?.[0]
        if (firstTaskId) {
          dayStore.setFocusTask(firstTaskId)
        } else {
          console.warn('No tasks available to set as focus task when transitioning to focus mode.')
        }
      }
      // 2. Change day status to active
      dayStore.startDay()

      // 3. Navigate to focus route
      navigateTo('/focus')
      return
    }

    if (currentMode.value === 'focus' && mode === 'review') {
      // // 1. End the day if it's still active
      // if (dayStore.currentDay?.status === 'active') {
      //   dayStore.closeDay()
      // }

      // 1. End the focus session if it's still active
      if (focusStore.activeSessionId) {
        focusStore.endSession()
      }

      // 2. Navigate to review route
      navigateTo('/review')
      return
    }

    if (currentMode.value === 'focus' && mode === 'plan') {
      // 1. Pause the focus session if it's still active
      if (focusStore.activeSessionId) {
        focusStore.pauseSession()
      }

      // 2. Navigate to plan route
      navigateTo('/') // TODO: Change to '/plan' when we have a dedicated planning page
      return
    }

    if (currentMode.value === 'review' && mode === 'focus') {
      // 1. Create focus session if day is closed (reopen day)
      navigateTo('/focus')
      return
    }

    console.error(
      `Unhandled navigation from ${currentMode.value} to ${mode}. Please implement the necessary side effects.`
    )
  }

  return {
    currentMode,
    canGoTo,
    goTo,
  }
}

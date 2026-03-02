<script setup lang="ts">
import useModeNavigation from '~/shared/composables/useModeNavigation'
import type { AppMode } from '@repo/domain'

const { goTo, canGoTo, currentMode } = useModeNavigation()
const dayStore = useDayStore()

const modes = computed(() => {
  const m = currentMode.value
  return [
    {
      label: 'Plan',
      value: 'plan' as AppMode,
      active: m === 'plan',
      disabled: !canGoTo('plan'),
      tooltip: m === 'review' ? 'Cannot return to planning' : '',
    },
    {
      label: 'Focus',
      value: 'focus' as AppMode,
      active: m === 'focus',
      disabled: !canGoTo('focus'),
      tooltip:
        !canGoTo('focus') && m !== 'focus'
          ? m === 'plan'
            ? !dayStore.currentDay?.taskIds?.length
              ? 'Add at least one task first'
              : 'Day has already started'
            : 'Day is closed'
          : '',
    },
    {
      label: 'Review',
      value: 'review' as AppMode,
      active: m === 'review',
      disabled: !canGoTo('review'),
      tooltip: !canGoTo('review') && m !== 'review' ? 'Start a focus session first' : '',
    },
  ]
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <UTooltip
      v-for="mode in modes"
      :key="mode.value"
      :text="mode.tooltip"
      :content="{ side: 'bottom' }"
    >
      <UButton
        size="sm"
        variant="subtle"
        :color="mode.active ? 'success' : 'neutral'"
        :disabled="mode.disabled"
        class="capitalize"
        @click="goTo(mode.value)"
      >
        {{ mode.label }}
      </UButton>
    </UTooltip>
  </div>
</template>

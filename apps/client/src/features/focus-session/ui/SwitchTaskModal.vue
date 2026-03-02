<script setup lang="ts">
import type { Task } from '@repo/domain'

const props = defineProps<{
  open: boolean
  tasks: Task[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  switch: [task: Task]
  cancel: []
}>()

// Keep internal open state in sync with prop so UModal can close itself
const internalOpen = ref(props.open)
watch(
  () => props.open,
  val => {
    internalOpen.value = val
  }
)

// Fires on user-initiated closes (Escape, backdrop)
const handleModalClose = (val: boolean) => {
  internalOpen.value = val
  if (!val) {
    emit('cancel')
    emit('update:open', false)
  }
}

const handleSwitch = (task: Task) => {
  emit('switch', task)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <UModal v-model:open="internalOpen" @update:open="handleModalClose">
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">Switch Task</h3>
        </template>

        <div class="space-y-2">
          <p class="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Current session will be ended.
          </p>
          <ul class="space-y-1">
            <li v-for="task in tasks" :key="task.id">
              <UButton
                :label="task.title"
                variant="ghost"
                color="neutral"
                class="w-full justify-start"
                @click="handleSwitch(task)"
              />
            </li>
          </ul>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="handleCancel" />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

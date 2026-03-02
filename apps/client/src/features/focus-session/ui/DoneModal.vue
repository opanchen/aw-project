<script setup lang="ts">
import { formatDuration } from '~/shared/utils/time'

const props = defineProps<{
  open: boolean
  taskTitle: string
  elapsedTime: number
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: [note: string]
  cancel: []
}>()

const note = ref('')

// Reset note each time the modal opens
watch(
  () => props.open,
  val => {
    if (val) note.value = ''
  }
)

// Fires on user-initiated closes (Escape, backdrop) — not on programmatic v-model change
const handleModalClose = (val: boolean) => {
  if (!val) emit('cancel')
  emit('update:open', val)
}

const handleConfirm = () => {
  emit('confirm', note.value)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <UModal :open="open" @update:open="handleModalClose">
    <template #content>
      <UCard>
        <template #header>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">✅ Task complete!</h3>
        </template>

        <div class="space-y-4">
          <p class="font-medium text-gray-700 dark:text-gray-300">"{{ taskTitle }}"</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Time: {{ formatDuration(elapsedTime) }}
          </p>
          <UTextarea v-model="note" placeholder="Add a note (optional)" :rows="3" />
        </div>

        <template #footer>
          <div class="flex items-center justify-end gap-2">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="handleCancel" />
            <UButton label="Next →" color="primary" @click="handleConfirm" />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

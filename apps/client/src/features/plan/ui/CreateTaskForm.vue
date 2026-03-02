<script setup lang="ts">
import { type InferType, object, string } from 'yup'
import type { FormSubmitEvent } from '#ui/types'
import { PRIORITY_OPTIONS } from '~/shared/constants'

const taskStore = useTaskStore()

const schema = object({
  title: string().min(3, 'Must be at least 3 characters').required('Task title is required'),
  priority: string()
    .oneOf(['low', 'medium', 'high'], 'Invalid priority')
    .required('Priority is required'),
})

type Schema = InferType<typeof schema>

const state = reactive<Schema>({
  title: '',
  priority: 'medium',
})

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  taskStore.addTask(event.data.title, event.data.priority)
  state.title = ''
  state.priority = 'medium'
}
</script>

<template>
  <UForm
    :state="state"
    :schema="schema"
    :validate-on="[]"
    class="flex items-start gap-4"
    @submit="onSubmit"
  >
    <UFormField name="title" orientation="horizontal" label="Add task" class="w-72">
      <UInput v-model="state.title" placeholder="Title" class="w-48" />
    </UFormField>

    <UFormField name="priority" orientation="horizontal" label="Priority" class="w-72">
      <USelect v-model="state.priority" value-key="value" :items="PRIORITY_OPTIONS" class="w-48" />
    </UFormField>

    <UButton label="Add" type="submit" variant="outline" color="neutral" class="ml-auto" />
  </UForm>
</template>

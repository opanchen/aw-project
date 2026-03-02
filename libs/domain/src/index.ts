// Types
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'completed' | 'archived'
export type DayStatus = 'planning' | 'active' | 'closed'
export type AppMode = 'plan' | 'focus' | 'review'

// Entities
export interface Task {
  id: string // UUID
  title: string // Short title for the task
  priority?: TaskPriority
  status: TaskStatus
  createdAt: number // Timestamp
  completedAt?: number // Timestamp
}

export interface Day {
  id: string // UUID
  date: string // ISO date (YYYY-MM-DD)
  status: DayStatus
  taskIds: string[] // List of ordered task IDs (max 5)
  focusTaskId?: string // Main focus task for the day (one of taskIds)
  reflection?: string // Optional reflection for the day
}

export interface FocusSession {
  id: string // UUID
  taskId: string // FK → Task
  dayId: string // FK → Day
  startTime: number // Timestamp
  endTime?: number // Timestamp (undefined if session is ongoing)
  notes?: string // Optional notes for the session
}

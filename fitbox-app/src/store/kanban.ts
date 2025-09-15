import { create } from 'zustand';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  position: number;
  projectId: string;
  assigneeId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  updatedAt: Date;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

interface KanbanState {
  columns: Column[];
  activeTask: Task | null;
  isLoading: boolean;
  error: string | null;
  optimisticUpdates: Set<string>;
}

interface KanbanActions {
  setColumns: (columns: Column[]) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  moveTask: (taskId: string, status: TaskStatus, position: number) => void;
  setActiveTask: (task: Task | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addOptimisticUpdate: (taskId: string) => void;
  removeOptimisticUpdate: (taskId: string) => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  reorderTasks: () => void;
}

const COLUMN_CONFIG: { id: TaskStatus; title: string }[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'IN_REVIEW', title: 'In Review' },
  { id: 'DONE', title: 'Done' },
];

export const useKanbanStore = create<KanbanState & KanbanActions>((set, get) => ({
  // State
  columns: COLUMN_CONFIG.map(config => ({ ...config, tasks: [] })),
  activeTask: null,
  isLoading: false,
  error: null,
  optimisticUpdates: new Set(),

  // Actions
  setColumns: (columns) => set({ columns }),

  setTasks: (tasks) => {
    const columns = COLUMN_CONFIG.map(config => ({
      ...config,
      tasks: tasks
        .filter(task => task.status === config.id)
        .sort((a, b) => a.position - b.position),
    }));
    set({ columns });
  },

  addTask: (task) => {
    const { columns } = get();
    const newColumns = columns.map(column => {
      if (column.id === task.status) {
        return {
          ...column,
          tasks: [...column.tasks, task].sort((a, b) => a.position - b.position),
        };
      }
      return column;
    });
    set({ columns: newColumns });
  },

  updateTask: (taskId, updates) => {
    const { columns } = get();
    const newColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
    set({ columns: newColumns });
  },

  removeTask: (taskId) => {
    const { columns } = get();
    const newColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId),
    }));
    set({ columns: newColumns });
  },

  moveTask: (taskId, status, position) => {
    const { columns } = get();
    let movedTask: Task | null = null;

    // Remove task from current column
    const columnsWithoutTask = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => {
        if (task.id === taskId) {
          movedTask = {
            ...task,
            status,
            position,
            updatedAt: new Date() // Add updatedAt to trigger re-renders
          };
          return false;
        }
        return true;
      }),
    }));

    if (!movedTask) return;

    // Add task to new column
    const newColumns = columnsWithoutTask.map(column => {
      if (column.id === status) {
        const tasksWithNew = [...column.tasks, movedTask!];
        return {
          ...column,
          tasks: tasksWithNew.sort((a, b) => a.position - b.position),
        };
      }
      return column;
    });

    set({ columns: newColumns });
  },

  setActiveTask: (activeTask) => set({ activeTask }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  addOptimisticUpdate: (taskId) => {
    const { optimisticUpdates } = get();
    set({ optimisticUpdates: new Set(optimisticUpdates).add(taskId) });
  },

  removeOptimisticUpdate: (taskId) => {
    const { optimisticUpdates } = get();
    const newSet = new Set(optimisticUpdates);
    newSet.delete(taskId);
    set({ optimisticUpdates: newSet });
  },

  handleDragStart: (event) => {
    const { columns } = get();
    const taskId = event.active.id as string;

    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        set({ activeTask: task });
        break;
      }
    }
  },

  handleDragEnd: (event) => {
    const { active, over } = event;

    if (!over) {
      set({ activeTask: null });
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a column
    const targetColumn = COLUMN_CONFIG.find(col => col.id === overId);
    if (targetColumn) {
      const { columns } = get();
      const sourceColumn = columns.find(col =>
        col.tasks.some(task => task.id === taskId)
      );

      if (sourceColumn && sourceColumn.id !== targetColumn.id) {
        // Calculate new position (append to end of target column)
        const targetTasks = columns.find(col => col.id === targetColumn.id)?.tasks || [];
        const newPosition = targetTasks.length > 0
          ? Math.max(...targetTasks.map(t => t.position)) + 1
          : 0;

        get().moveTask(taskId, targetColumn.id, newPosition);
      }
    }

    set({ activeTask: null });
  },

  reorderTasks: () => {
    const { columns } = get();
    const newColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.map((task, index) => ({
        ...task,
        position: index,
      })),
    }));
    set({ columns: newColumns });
  },
}));
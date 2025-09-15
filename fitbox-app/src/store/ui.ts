import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  // Modal states
  isTaskModalOpen: boolean;
  selectedTaskId: string | null;
  isUserSelectorOpen: boolean;
  isCreateTaskModalOpen: boolean;
  isNewTaskModalOpen: boolean;
  isEditTaskModalOpen: boolean;

  // Loading states
  isGlobalLoading: boolean;
  loadingTasks: Set<string>;

  // Toast notifications
  toasts: Toast[];

  // UI preferences
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';

  // Filters
  showMyTasksOnly: boolean;
}

interface UIActions {
  // Modal actions
  openTaskModal: (taskId?: string) => void;
  closeTaskModal: () => void;
  setSelectedTaskId: (taskId: string | null) => void;
  openUserSelector: () => void;
  closeUserSelector: () => void;
  openCreateTaskModal: () => void;
  closeCreateTaskModal: () => void;
  openNewTaskModal: () => void;
  closeNewTaskModal: () => void;
  openEditTaskModal: (taskId?: string) => void;
  closeEditTaskModal: () => void;

  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  addLoadingTask: (taskId: string) => void;
  removeLoadingTask: (taskId: string) => void;

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // UI preference actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Filter actions
  toggleMyTasksFilter: () => void;
  setShowMyTasksOnly: (show: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  // State
  isTaskModalOpen: false,
  selectedTaskId: null,
  isUserSelectorOpen: false,
  isCreateTaskModalOpen: false,
  isNewTaskModalOpen: false,
  isEditTaskModalOpen: false,
  isGlobalLoading: false,
  loadingTasks: new Set(),
  toasts: [],
  sidebarCollapsed: false,
  theme: 'system',
  showMyTasksOnly: false,

  // Modal actions
  openTaskModal: (taskId) =>
    set({
      isTaskModalOpen: true,
      selectedTaskId: taskId || null,
    }),

  closeTaskModal: () =>
    set({
      isTaskModalOpen: false,
      selectedTaskId: null,
    }),

  setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),

  openUserSelector: () => set({ isUserSelectorOpen: true }),

  closeUserSelector: () => set({ isUserSelectorOpen: false }),

  openCreateTaskModal: () => set({ isCreateTaskModalOpen: true }),

  closeCreateTaskModal: () => set({ isCreateTaskModalOpen: false }),

  openNewTaskModal: () => set({ isNewTaskModalOpen: true }),

  closeNewTaskModal: () => set({ isNewTaskModalOpen: false }),

  openEditTaskModal: (taskId) =>
    set({
      isEditTaskModalOpen: true,
      selectedTaskId: taskId || null,
    }),

  closeEditTaskModal: () => set({ isEditTaskModalOpen: false }),

  // Loading actions
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),

  addLoadingTask: (taskId) => {
    const { loadingTasks } = get();
    set({ loadingTasks: new Set(loadingTasks).add(taskId) });
  },

  removeLoadingTask: (taskId) => {
    const { loadingTasks } = get();
    const newSet = new Set(loadingTasks);
    newSet.delete(taskId);
    set({ loadingTasks: newSet });
  },

  // Toast actions
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  // UI preference actions
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  setTheme: (theme) => set({ theme }),

  // Filter actions
  toggleMyTasksFilter: () =>
    set((state) => ({ showMyTasksOnly: !state.showMyTasksOnly })),

  setShowMyTasksOnly: (showMyTasksOnly) => set({ showMyTasksOnly }),
}));
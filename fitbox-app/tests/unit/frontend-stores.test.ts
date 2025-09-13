import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store/auth';
import { useKanbanStore, type TaskStatus } from '@/store/kanban';
import { useUIStore } from '@/store/ui';

describe('Frontend Stores (T037-T041 Implementation)', () => {
  describe('Auth Store (T038)', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.logout();
      });
    });

    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set user and update authentication state', () => {
      const { result } = renderHook(() => useAuthStore());
      const testUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'avatar.jpg'
      };

      act(() => {
        result.current.setUser(testUser);
      });

      expect(result.current.user).toEqual(testUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should clear user on logout', () => {
      const { result } = renderHook(() => useAuthStore());
      const testUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User'
      };

      act(() => {
        result.current.setUser(testUser);
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle loading states', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });
      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle error states', () => {
      const { result } = renderHook(() => useAuthStore());
      const errorMessage = 'Authentication failed';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Kanban Store (T039)', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useKanbanStore());
      act(() => {
        result.current.setColumns([
          { id: 'TODO', title: 'To Do', tasks: [] },
          { id: 'IN_PROGRESS', title: 'In Progress', tasks: [] },
          { id: 'IN_REVIEW', title: 'In Review', tasks: [] },
          { id: 'DONE', title: 'Done', tasks: [] },
        ]);
      });
    });

    it('should initialize with empty kanban board', () => {
      const { result } = renderHook(() => useKanbanStore());

      expect(result.current.columns).toHaveLength(4);
      expect(result.current.columns[0].id).toBe('TODO');
      expect(result.current.columns[0].title).toBe('To Do');
      expect(result.current.columns[0].tasks).toEqual([]);
    });

    it('should add task to correct column', () => {
      const { result } = renderHook(() => useKanbanStore());
      const testTask = {
        id: 'task-1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO' as TaskStatus,
        position: 0,
        projectId: 'project-1',
        priority: 'MEDIUM' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      act(() => {
        result.current.addTask(testTask);
      });

      const todoColumn = result.current.columns.find(col => col.id === 'TODO');
      expect(todoColumn?.tasks).toHaveLength(1);
      expect(todoColumn?.tasks[0]).toEqual(testTask);
    });

    it('should move task between columns', () => {
      const { result } = renderHook(() => useKanbanStore());
      const testTask = {
        id: 'task-1',
        title: 'Test Task',
        status: 'TODO' as TaskStatus,
        position: 0,
        projectId: 'project-1',
        priority: 'MEDIUM' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      act(() => {
        result.current.addTask(testTask);
        result.current.moveTask('task-1', 'IN_PROGRESS', 0);
      });

      const todoColumn = result.current.columns.find(col => col.id === 'TODO');
      const inProgressColumn = result.current.columns.find(col => col.id === 'IN_PROGRESS');

      expect(todoColumn?.tasks).toHaveLength(0);
      expect(inProgressColumn?.tasks).toHaveLength(1);
      expect(inProgressColumn?.tasks[0].status).toBe('IN_PROGRESS');
    });

    it('should update task properties', () => {
      const { result } = renderHook(() => useKanbanStore());
      const testTask = {
        id: 'task-1',
        title: 'Test Task',
        status: 'TODO' as TaskStatus,
        position: 0,
        projectId: 'project-1',
        priority: 'MEDIUM' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      act(() => {
        result.current.addTask(testTask);
        result.current.updateTask('task-1', { title: 'Updated Task' });
      });

      const todoColumn = result.current.columns.find(col => col.id === 'TODO');
      expect(todoColumn?.tasks[0].title).toBe('Updated Task');
    });

    it('should handle optimistic updates', () => {
      const { result } = renderHook(() => useKanbanStore());

      act(() => {
        result.current.addOptimisticUpdate('task-1');
      });
      expect(result.current.optimisticUpdates.has('task-1')).toBe(true);

      act(() => {
        result.current.removeOptimisticUpdate('task-1');
      });
      expect(result.current.optimisticUpdates.has('task-1')).toBe(false);
    });

    it('should set active task during drag operations', () => {
      const { result } = renderHook(() => useKanbanStore());
      const testTask = {
        id: 'task-1',
        title: 'Test Task',
        status: 'TODO' as TaskStatus,
        position: 0,
        projectId: 'project-1',
        priority: 'MEDIUM' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      act(() => {
        result.current.setActiveTask(testTask);
      });
      expect(result.current.activeTask).toEqual(testTask);

      act(() => {
        result.current.setActiveTask(null);
      });
      expect(result.current.activeTask).toBeNull();
    });
  });

  describe('UI Store (T040)', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.closeTaskModal();
        result.current.closeUserSelector();
        result.current.closeCreateTaskModal();
        result.current.clearToasts();
        result.current.setGlobalLoading(false);
      });
    });

    it('should initialize with default UI state', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.isTaskModalOpen).toBe(false);
      expect(result.current.selectedTaskId).toBeNull();
      expect(result.current.isUserSelectorOpen).toBe(false);
      expect(result.current.isCreateTaskModalOpen).toBe(false);
      expect(result.current.isGlobalLoading).toBe(false);
      expect(result.current.toasts).toEqual([]);
      expect(result.current.sidebarCollapsed).toBe(false);
      expect(result.current.theme).toBe('system');
    });

    it('should manage modal states', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openTaskModal('task-123');
      });
      expect(result.current.isTaskModalOpen).toBe(true);
      expect(result.current.selectedTaskId).toBe('task-123');

      act(() => {
        result.current.closeTaskModal();
      });
      expect(result.current.isTaskModalOpen).toBe(false);
      expect(result.current.selectedTaskId).toBeNull();

      act(() => {
        result.current.openUserSelector();
      });
      expect(result.current.isUserSelectorOpen).toBe(true);

      act(() => {
        result.current.closeUserSelector();
      });
      expect(result.current.isUserSelectorOpen).toBe(false);
    });

    it('should manage loading states', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setGlobalLoading(true);
      });
      expect(result.current.isGlobalLoading).toBe(true);

      act(() => {
        result.current.addLoadingTask('task-1');
      });
      expect(result.current.loadingTasks.has('task-1')).toBe(true);

      act(() => {
        result.current.removeLoadingTask('task-1');
      });
      expect(result.current.loadingTasks.has('task-1')).toBe(false);
    });

    it('should manage toast notifications', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addToast({
          type: 'success',
          title: 'Success!',
          message: 'Operation completed',
          duration: 3000
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Success!');
      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[0].id).toBeTruthy();

      const toastId = result.current.toasts[0].id;
      act(() => {
        result.current.removeToast(toastId);
      });
      expect(result.current.toasts).toHaveLength(0);
    });

    it('should manage sidebar and theme preferences', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.sidebarCollapsed).toBe(true);

      act(() => {
        result.current.toggleSidebar();
      });
      expect(result.current.sidebarCollapsed).toBe(false);

      act(() => {
        result.current.setTheme('dark');
      });
      expect(result.current.theme).toBe('dark');
    });
  });
});
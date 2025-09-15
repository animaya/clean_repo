'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import { useAuthStore } from '@/store/auth';
import { useKanbanStore } from '@/store/kanban';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { TaskModal } from '@/components/TaskModal';
import { NewTaskModal } from '@/components/NewTaskModal';
import { EditTaskModal } from '@/components/EditTaskModal';
import { useUIStore } from '@/store/ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner, LoadingPage } from '@/components/LoadingSpinner';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProjectKanbanPage({ params }: PageProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { setTasks, setLoading, setError } = useKanbanStore();
  const { isTaskModalOpen, isNewTaskModalOpen, isEditTaskModalOpen, openNewTaskModal, showMyTasksOnly, toggleMyTasksFilter } = useUIStore();

  const { data: project, isLoading: projectLoading, error: projectError } = trpc.projects.getById.useQuery({
    id: params.id,
  });

  const { data: tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = trpc.tasks.getByProject.useQuery({
    projectId: params.id,
  });

  const utils = trpc.useUtils();
  const logoutMutation = trpc.auth.logout.useMutation();
  const updateTaskPositionMutation = trpc.tasks.updatePosition.useMutation({
    onMutate: async (variables) => {
      console.log(`🔄 onMutate: Optimistically updating task ${variables.taskId} to status ${variables.newStatus}`);

      // Cancel any outgoing refetches
      await utils.tasks.getByProject.cancel({ projectId: params.id });

      // Snapshot the previous value
      const previousTasks = utils.tasks.getByProject.getData({ projectId: params.id });

      // Optimistically update to the new value with both status and position
      if (previousTasks) {
        const optimisticTasks = previousTasks.map(task =>
          task.id === variables.taskId
            ? { ...task, status: variables.newStatus, position: variables.newPosition, updatedAt: new Date() }
            : task
        );
        utils.tasks.getByProject.setData({ projectId: params.id }, optimisticTasks);
        console.log(`✨ Optimistic update applied for task ${variables.taskId}`);
      }

      return { previousTasks };
    },
    onSuccess: (data, variables) => {
      console.log(`✅ onSuccess: Task ${variables.taskId} successfully updated to ${data.status}`);
      // Update with server response to ensure consistency and force status update
      const currentTasks = utils.tasks.getByProject.getData({ projectId: params.id });
      if (currentTasks) {
        const updatedTasks = currentTasks.map(task =>
          task.id === data.id
            ? {
                ...task,
                status: data.status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
                position: data.position,
                updatedAt: new Date(data.updatedAt)
              }
            : task
        );
        utils.tasks.getByProject.setData({ projectId: params.id }, updatedTasks);

        // Force immediate state sync to Kanban store
        const transformedTasks = updatedTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          status: task.status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
          position: task.position,
          projectId: task.projectId,
          assigneeId: task.assignedUserId || undefined,
          priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH',
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          assignee: task.assignedUser ? {
            id: task.assignedUser.id,
            name: task.assignedUser.name,
            email: task.assignedUser.email,
            avatar: task.assignedUser.avatar || undefined,
          } : undefined,
        }));
        setTasks(transformedTasks);
      }
    },
    onError: (err, variables, context) => {
      console.error('❌ Task position update failed:', err, variables);

      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        utils.tasks.getByProject.setData({ projectId: params.id }, context.previousTasks);
      }
      setError('Failed to update task position. Changes have been reverted.');
    },
    onSettled: () => {
      console.log(`🔄 onSettled: Invalidating and refetching tasks for project ${params.id}`);
      // Always refetch after error or success to ensure consistency
      utils.tasks.getByProject.invalidate({ projectId: params.id });
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (tasks) {
      console.log(`📊 Transforming ${tasks.length} tasks from tRPC data:`, tasks.map(t => ({ id: t.id, title: t.title, status: t.status, updatedAt: t.updatedAt })));

      // Transform the tasks to match the kanban store format
      const transformedTasks = tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        status: task.status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
        position: task.position,
        projectId: task.projectId,
        assigneeId: task.assignedUserId || undefined,
        priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH',
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        assignee: task.assignedUser ? {
          id: task.assignedUser.id,
          name: task.assignedUser.name,
          email: task.assignedUser.email,
          avatar: task.assignedUser.avatar || undefined,
        } : undefined,
      }));

      console.log(`🎯 Setting transformed tasks in Kanban store`);
      setTasks(transformedTasks);
    }
  }, [tasks, setTasks]);

  useEffect(() => {
    setLoading(projectLoading || tasksLoading);
  }, [projectLoading, tasksLoading, setLoading]);

  useEffect(() => {
    if (projectError || tasksError) {
      setError(projectError?.message || tasksError?.message || 'Failed to load data');
    } else {
      setError(null);
    }
  }, [projectError, tasksError, setError]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
      router.push('/');
    }
  };

  const handleTaskPositionUpdate = async (taskId: string, newStatus: string, newPosition: number) => {
    console.log(`🚀 handleTaskPositionUpdate called with:`, { taskId, newStatus, newPosition });
    updateTaskPositionMutation.mutate({
      taskId,
      newStatus: newStatus as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
      newPosition,
    });
  };

  if (!isAuthenticated || !user) {
    return <LoadingPage text="Checking authentication..." />;
  }

  if (projectLoading || tasksLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/projects"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Back to Projects
                </Link>
                <div className="w-px h-6 bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Loading...</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="py-20">
          <LoadingSpinner size="lg" text="Loading project..." className="h-32" />
        </div>
      </main>
    );
  }

  if (projectError || tasksError || !project) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/projects"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Back to Projects
                </Link>
                <div className="w-px h-6 bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">Error</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">
              {projectError?.message || tasksError?.message || 'Project not found'}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/projects"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ← Back to Projects
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
                {project.description && (
                  <p className="text-sm text-gray-600">{project.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={openNewTaskModal}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </button>

              {/* My Tasks Filter Toggle */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMyTasksOnly}
                    onChange={toggleMyTasksFilter}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    showMyTasksOnly ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      showMyTasksOnly ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </div>
                  <span className="ml-2 text-sm text-gray-600">My Tasks</span>
                </label>
              </div>

              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isLoading}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {logoutMutation.isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <KanbanBoard
            projectId={params.id}
            currentUserId={user.id}
            onTaskPositionUpdate={handleTaskPositionUpdate}
          />
        </ErrorBoundary>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <ErrorBoundary>
          <TaskModal />
        </ErrorBoundary>
      )}

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <ErrorBoundary>
          <NewTaskModal projectId={params.id} />
        </ErrorBoundary>
      )}

      {/* Edit Task Modal */}
      {isEditTaskModalOpen && (
        <ErrorBoundary>
          <EditTaskModal />
        </ErrorBoundary>
      )}
    </main>
  );
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/app/_trpc/client';
import { useAuthStore } from '@/store/auth';
import { useKanbanStore } from '@/store/kanban';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { TaskModal } from '@/components/TaskModal';
import { useUIStore } from '@/store/ui';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProjectKanbanPage({ params }: PageProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { setTasks, setLoading, setError } = useKanbanStore();
  const { isTaskModalOpen } = useUIStore();

  const { data: project, isLoading: projectLoading, error: projectError } = trpc.projects.getById.useQuery({
    id: params.id,
  });

  const { data: tasks, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = trpc.tasks.getByProject.useQuery({
    projectId: params.id,
  });

  const logoutMutation = trpc.auth.logout.useMutation();
  const updateTaskPositionMutation = trpc.tasks.updatePosition.useMutation();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (tasks) {
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
    try {
      await updateTaskPositionMutation.mutateAsync({
        taskId,
        newStatus: newStatus as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
        newPosition,
      });
      // Refetch tasks to ensure consistency
      refetchTasks();
    } catch (error) {
      console.error('Failed to update task position:', error);
      setError('Failed to update task position');
      // Refetch to revert optimistic update
      refetchTasks();
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </main>
    );
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
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading project...</p>
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
        <KanbanBoard
          projectId={params.id}
          onTaskPositionUpdate={handleTaskPositionUpdate}
        />
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && <TaskModal />}
    </main>
  );
}
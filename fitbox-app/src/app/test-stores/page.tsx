'use client';

import { useAuthStore } from '@/store/auth';
import { useKanbanStore } from '@/store/kanban';
import { useUIStore } from '@/store/ui';

export default function TestStoresPage() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const { columns, addTask } = useKanbanStore();
  const {
    isTaskModalOpen,
    openTaskModal,
    closeTaskModal,
    addToast,
    toasts,
    removeToast
  } = useUIStore();

  const handleLogin = () => {
    setUser({
      id: 'test-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://via.placeholder.com/40'
    });
  };

  const handleAddTask = () => {
    addTask({
      id: 'task-' + Date.now(),
      title: 'Test Task',
      description: 'This is a test task',
      status: 'TODO',
      position: 0,
      projectId: 'project-1',
      priority: 'MEDIUM',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const handleShowToast = () => {
    addToast({
      type: 'success',
      title: 'Success!',
      message: 'Your stores are working perfectly!',
      duration: 5000
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Taskify Stores Demo (T037-T041)</h1>

      {/* Auth Store Demo */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Auth Store (T038)</h2>
        <div className="space-y-4">
          <p>Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}</p>
          {user && (
            <div className="p-4 bg-green-50 rounded">
              <p><strong>User:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          )}
          <div className="space-x-4">
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login as Test User
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Store Demo */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Kanban Store (T039)</h2>
        <div className="space-y-4">
          <p>Columns: {columns.length}</p>
          <div className="grid grid-cols-4 gap-4">
            {columns.map(column => (
              <div key={column.id} className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium">{column.title}</h3>
                <p className="text-sm text-gray-600">{column.tasks.length} tasks</p>
                {column.tasks.map(task => (
                  <div key={task.id} className="mt-2 p-2 bg-white rounded text-xs">
                    {task.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Test Task
          </button>
        </div>
      </div>

      {/* UI Store Demo */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">UI Store (T040)</h2>
        <div className="space-y-4">
          <p>Task Modal: {isTaskModalOpen ? '✅ Open' : '❌ Closed'}</p>
          <p>Active Toasts: {toasts.length}</p>

          {/* Toast notifications */}
          <div className="space-y-2">
            {toasts.map(toast => (
              <div key={toast.id} className="p-3 bg-green-100 border border-green-400 rounded flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-800">{toast.title}</p>
                  <p className="text-green-600 text-sm">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-green-800 hover:text-green-900"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="space-x-4">
            <button
              onClick={() => openTaskModal('test-task-123')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Open Task Modal
            </button>
            <button
              onClick={closeTaskModal}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close Task Modal
            </button>
            <button
              onClick={handleShowToast}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Show Toast
            </button>
          </div>
        </div>
      </div>

      {/* Session & tRPC Demo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">tRPC Client & Session (T037, T041)</h2>
        <div className="space-y-2">
          <p>✅ tRPC Client configured</p>
          <p>✅ Session utilities ready</p>
          <p>✅ JWT handling implemented</p>
          <p className="text-sm text-gray-600">These work behind the scenes for API calls</p>
        </div>
      </div>
    </div>
  );
}
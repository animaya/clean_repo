'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useUIStore } from '@/store/ui';
import { LoadingSpinner } from './LoadingSpinner';

export function EditTaskModal() {
  const { selectedTaskId, isEditTaskModalOpen, closeEditTaskModal } = useUIStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'>('TODO');
  const [assignedUserId, setAssignedUserId] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { data: users } = trpc.users.getAll.useQuery();
  const utils = trpc.useUtils();

  const { data: task, isLoading: taskLoading } = trpc.tasks.getById.useQuery(
    { id: selectedTaskId! },
    { enabled: !!selectedTaskId && isEditTaskModalOpen }
  );

  const updateTaskMutation = trpc.tasks.update.useMutation({
    onSuccess: () => {
      closeEditTaskModal();

      // Invalidate relevant queries to refresh the UI
      utils.tasks.getByProject.invalidate({ projectId: task?.projectId });
      utils.tasks.getById.invalidate({ id: selectedTaskId! });
    },
    onError: (error) => {
      setErrors({ general: error.message });
    },
  });

  // Populate form when task data loads
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE');
      setAssignedUserId(task.assignedUserId || '');
      setErrors({});
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTaskId) return;

    // Reset errors
    setErrors({});

    // Validate
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }
    if (description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update task
    updateTaskMutation.mutate({
      id: selectedTaskId,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      assignedUserId: assignedUserId || undefined,
    });
  };

  const handleClose = () => {
    if (!updateTaskMutation.isLoading) {
      closeEditTaskModal();
    }
  };

  if (!isEditTaskModalOpen || !selectedTaskId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
          <button
            onClick={handleClose}
            disabled={updateTaskMutation.isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading State */}
        {taskLoading ? (
          <div className="p-8">
            <LoadingSpinner size="lg" text="Loading task..." className="h-32" />
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter task title..."
                maxLength={200}
                disabled={updateTaskMutation.isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{title.length}/200 characters</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter task description..."
                maxLength={1000}
                disabled={updateTaskMutation.isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{description.length}/1000 characters</p>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={updateTaskMutation.isLoading}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label htmlFor="edit-assignee" className="block text-sm font-medium text-gray-700 mb-1">
                Assign To
              </label>
              <select
                id="edit-assignee"
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={updateTaskMutation.isLoading}
              >
                <option value="">Unassigned</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={updateTaskMutation.isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateTaskMutation.isLoading || !title.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {updateTaskMutation.isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Task'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
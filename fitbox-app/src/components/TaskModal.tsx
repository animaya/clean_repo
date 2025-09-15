'use client';

import { useEffect, useState, useRef } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useUIStore } from '@/store/ui';
import { useAuthStore } from '@/store/auth';
import { CommentList } from './CommentList';

export function TaskModal() {
  const { selectedTaskId, closeTaskModal, addToast } = useUIStore();
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: task, isLoading, error, refetch } = trpc.tasks.getById.useQuery(
    { id: selectedTaskId! },
    { enabled: !!selectedTaskId }
  );

  const createCommentMutation = trpc.comments.create.useMutation();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeTaskModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeTaskModal]);

  // Focus on comment input when modal opens
  useEffect(() => {
    if (selectedTaskId && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [selectedTaskId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !selectedTaskId || !user) return;

    setIsSubmitting(true);
    try {
      await createCommentMutation.mutateAsync({
        taskId: selectedTaskId,
        content: newComment.trim(),
      });

      setNewComment('');
      refetch(); // Refresh task data to get updated comments

      addToast({
        type: 'success',
        title: 'Comment added',
        message: 'Your comment has been added successfully.',
      });
    } catch (error) {
      console.error('Failed to create comment:', error);
      addToast({
        type: 'error',
        title: 'Failed to add comment',
        message: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeTaskModal();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-100';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100';
      case 'LOW':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'text-gray-600 bg-gray-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'IN_REVIEW':
        return 'text-yellow-600 bg-yellow-100';
      case 'DONE':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'To Do';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'IN_REVIEW':
        return 'In Review';
      case 'DONE':
        return 'Done';
      default:
        return status;
    }
  };

  if (!selectedTaskId) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div data-testid="task-modal" className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
          <button
            data-testid="close-modal"
            onClick={closeTaskModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600">Loading task...</p>
            </div>
          ) : error || !task ? (
            <div className="p-6 text-center">
              <p className="text-red-600">Failed to load task details</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Task Info */}
              <div>
                <h3 data-testid="task-title" className="text-lg font-medium text-gray-900 mb-3">{task.title}</h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                </div>

                {task.description && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                    <p data-testid="task-description" className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
                  </div>
                )}

                {/* Assignee */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">Assigned to:</span>
                    {task.assignedUser ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {task.assignedUser.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{task.assignedUser.name}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </div>
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Comments ({task.comments?.length || 0})
                </h4>

                {/* Comment List */}
                <div className="space-y-4 mb-6">
                  {task.comments && task.comments.length > 0 ? (
                    <CommentList comments={task.comments} onCommentUpdate={refetch} />
                  ) : (
                    <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                  )}
                </div>

                {/* Add Comment Form */}
                {user ? (
                  <form onSubmit={handleSubmitComment} className="space-y-3">
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                        Add a comment
                      </label>
                      <textarea
                        ref={textareaRef}
                        id="comment"
                        data-testid="comment-input"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment here..."
                        disabled={isSubmitting}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        data-testid="comment-submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Adding...' : 'Add Comment'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-500 text-center py-4">Please log in to add comments.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
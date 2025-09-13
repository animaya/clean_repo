'use client';

import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';

interface Comment {
  id: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

interface CommentListProps {
  comments: Comment[];
  onCommentUpdate: () => void;
}

export function CommentList({ comments, onCommentUpdate }: CommentListProps) {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const updateCommentMutation = trpc.comments.update.useMutation();
  const deleteCommentMutation = trpc.comments.delete.useMutation();

  const handleEditStart = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleEditSave = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateCommentMutation.mutateAsync({
        commentId,
        content: editContent.trim(),
      });

      setEditingCommentId(null);
      setEditContent('');
      onCommentUpdate();

      addToast({
        type: 'success',
        title: 'Comment updated',
        message: 'Your comment has been updated successfully.',
      });
    } catch (error) {
      console.error('Failed to update comment:', error);
      addToast({
        type: 'error',
        title: 'Failed to update comment',
        message: 'Please try again.',
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteCommentMutation.mutateAsync({ commentId });
      onCommentUpdate();

      addToast({
        type: 'success',
        title: 'Comment deleted',
        message: 'Your comment has been deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      addToast({
        type: 'error',
        title: 'Failed to delete comment',
        message: 'Please try again.',
      });
    }
  };

  const getUserColor = (userName: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
    ];

    const index = userName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return d.toLocaleDateString();
  };

  const isOwner = (comment: Comment) => {
    return user?.id === comment.user.id;
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getUserColor(comment.user.name)}`}>
                {comment.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h5 className="font-medium text-gray-900">{comment.user.name}</h5>
                <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
              </div>
            </div>

            {/* Action Buttons (only for comment owner) */}
            {isOwner(comment) && (
              <div className="flex items-center space-x-2">
                {editingCommentId !== comment.id ? (
                  <>
                    <button
                      onClick={() => handleEditStart(comment)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit comment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deleteCommentMutation.isLoading}
                      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete comment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditSave(comment.id)}
                      disabled={!editContent.trim() || updateCommentMutation.isLoading}
                      className="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                      title="Save changes"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Cancel editing"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="ml-11">
            {editingCommentId === comment.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                autoFocus
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            )}

            {/* Show edited indicator */}
            {new Date(comment.updatedAt).getTime() > new Date(comment.createdAt).getTime() + 1000 && editingCommentId !== comment.id && (
              <p className="text-xs text-gray-400 mt-1 italic">Edited</p>
            )}
          </div>
        </div>
      ))}

      {/* Loading States */}
      {updateCommentMutation.isLoading && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500">Updating comment...</span>
        </div>
      )}

      {deleteCommentMutation.isLoading && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500">Deleting comment...</span>
        </div>
      )}
    </div>
  );
}
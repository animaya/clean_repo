'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/store/kanban';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isOptimistic?: boolean;
  isDragging?: boolean;
}

export function TaskCard({ task, onClick, isOptimistic = false, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'border-l-red-500 bg-red-50';
      case 'MEDIUM':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'LOW':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssigneeColor = (assignee?: Task['assignee']) => {
    if (!assignee) return 'bg-gray-400';

    // Generate a consistent color based on the user's name
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
    ];

    const index = assignee.name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const cardClass = `
    group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md
    transition-all duration-200 cursor-pointer border-l-4 p-4
    ${getPriorityColor(task.priority)}
    ${isOptimistic ? 'opacity-50' : ''}
    ${sortableIsDragging || isDragging ? 'shadow-lg scale-105 rotate-3' : ''}
    ${isDragging ? 'z-50' : ''}
  `;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cardClass}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 mr-2">
          {task.title}
        </h4>

        {/* Priority Badge */}
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between">
        {/* Assignee */}
        <div className="flex items-center">
          {task.assignee ? (
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${getAssigneeColor(task.assignee)}`}>
                {task.assignee.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-600 hidden sm:block">
                {task.assignee.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400 hidden sm:block">
                Unassigned
              </span>
            </div>
          )}
        </div>

        {/* Created Date */}
        <span className="text-xs text-gray-400">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Optimistic Update Indicator */}
      {isOptimistic && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-200 pointer-events-none"></div>
    </div>
  );
}
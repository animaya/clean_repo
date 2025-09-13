'use client';

import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useKanbanStore, Task } from '@/store/kanban';
import { TaskCard } from './TaskCard';
import { useUIStore } from '@/store/ui';

interface KanbanBoardProps {
  projectId: string;
  onTaskPositionUpdate?: (taskId: string, newStatus: string, newPosition: number) => void;
}

export function KanbanBoard({ onTaskPositionUpdate }: KanbanBoardProps) {
  const {
    columns,
    activeTask,
    handleDragStart,
    handleDragEnd,
    moveTask,
    addOptimisticUpdate,
    removeOptimisticUpdate,
    optimisticUpdates,
  } = useKanbanStore();

  const { setSelectedTaskId, openTaskModal } = useUIStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndWithCallback = async (event: any) => {
    const { active, over } = event;

    if (!over || !active) {
      handleDragEnd(event);
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    // Find the target column
    const targetColumn = columns.find(col => col.id === overId);
    if (!targetColumn) {
      handleDragEnd(event);
      return;
    }

    // Find the source column
    const sourceColumn = columns.find(col =>
      col.tasks.some(task => task.id === taskId)
    );

    if (!sourceColumn || sourceColumn.id === targetColumn.id) {
      handleDragEnd(event);
      return;
    }

    // Calculate new position
    const newPosition = targetColumn.tasks.length > 0
      ? Math.max(...targetColumn.tasks.map(t => t.position)) + 1
      : 0;

    // Add optimistic update
    addOptimisticUpdate(taskId);

    // Update local state immediately
    moveTask(taskId, targetColumn.id, newPosition);

    // Call the callback to update the server
    if (onTaskPositionUpdate) {
      try {
        await onTaskPositionUpdate(taskId, targetColumn.id, newPosition);
      } catch (error) {
        console.error('Failed to update task position:', error);
      } finally {
        removeOptimisticUpdate(taskId);
      }
    } else {
      removeOptimisticUpdate(taskId);
    }

    handleDragEnd(event);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    openTaskModal();
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'TODO':
        return 'border-gray-300 bg-gray-50';
      case 'IN_PROGRESS':
        return 'border-blue-300 bg-blue-50';
      case 'IN_REVIEW':
        return 'border-yellow-300 bg-yellow-50';
      case 'DONE':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getColumnHeaderColor = (columnId: string) => {
    switch (columnId) {
      case 'TODO':
        return 'text-gray-700 bg-gray-100';
      case 'IN_PROGRESS':
        return 'text-blue-700 bg-blue-100';
      case 'IN_REVIEW':
        return 'text-yellow-700 bg-yellow-100';
      case 'DONE':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndWithCallback}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {columns.map((column) => (
          <div
            key={column.id}
            id={column.id}
            className={`flex flex-col rounded-lg border-2 ${getColumnColor(column.id)} min-h-96`}
          >
            {/* Column Header */}
            <div className={`px-4 py-3 rounded-t-lg ${getColumnHeaderColor(column.id)}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                  {column.tasks.length}
                </span>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                  isOptimistic={optimisticUpdates.has(task.id)}
                />
              ))}

              {/* Empty State */}
              {column.tasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 opacity-50">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-xs">Drop tasks here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 transform">
            <TaskCard
              task={activeTask}
              onClick={() => {}}
              isOptimistic={false}
              isDragging={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
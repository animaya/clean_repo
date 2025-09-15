'use client';

import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useKanbanStore, Task } from '@/store/kanban';
import { TaskCard } from './TaskCard';
import { useUIStore } from '@/store/ui';
import { trpc } from '@/app/_trpc/client';

interface KanbanBoardProps {
  projectId: string;
  currentUserId?: string;
  onTaskPositionUpdate?: (taskId: string, newStatus: string, newPosition: number) => Promise<void>;
}

export function KanbanBoard({ projectId, currentUserId, onTaskPositionUpdate }: KanbanBoardProps) {
  const {
    columns,
    activeTask,
    handleDragStart,
    handleDragEnd,
    moveTask,
    addOptimisticUpdate,
    removeOptimisticUpdate,
    optimisticUpdates,
    removeTask,
  } = useKanbanStore();

  const { setSelectedTaskId, openTaskModal, openNewTaskModal, openEditTaskModal, showMyTasksOnly } = useUIStore();
  const utils = trpc.useUtils();

  const deleteTaskMutation = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      // Invalidate queries to refresh the UI
      utils.tasks.getByProject.invalidate({ projectId });
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
      // You could add a toast notification here
    },
  });

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

    // Find the source column and task
    const sourceColumn = columns.find(col =>
      col.tasks.some(task => task.id === taskId)
    );
    const sourceTask = sourceColumn?.tasks.find(task => task.id === taskId);

    if (!sourceColumn || !sourceTask) {
      handleDragEnd(event);
      return;
    }

    // If moving to the same column, no status change needed
    if (sourceColumn.id === targetColumn.id) {
      handleDragEnd(event);
      return;
    }

    // Calculate new position
    const newPosition = targetColumn.tasks.length > 0
      ? Math.max(...targetColumn.tasks.map(t => t.position)) + 1
      : 0;

    console.log(`🎯 Moving task ${taskId} from ${sourceColumn.id} to ${targetColumn.id} with position ${newPosition}`);

    // Add optimistic update
    addOptimisticUpdate(taskId);

    // Update local state immediately with new status
    moveTask(taskId, targetColumn.id, newPosition);

    // Call the callback to update the server (this should update both status and position)
    if (onTaskPositionUpdate) {
      console.log(`📡 Calling onTaskPositionUpdate for task ${taskId}`);
      try {
        await onTaskPositionUpdate(taskId, targetColumn.id, newPosition);
        console.log(`✅ Successfully updated task ${taskId} status to ${targetColumn.id}`);
      } catch (error) {
        console.error('❌ Failed to update task position and status:', error);
        // Revert the optimistic update on error
        moveTask(taskId, sourceColumn.id, sourceTask.position);
      } finally {
        removeOptimisticUpdate(taskId);
      }
    } else {
      console.log(`❌ No onTaskPositionUpdate callback provided`);
      removeOptimisticUpdate(taskId);
    }

    handleDragEnd(event);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    openTaskModal();
  };

  const handleTaskEdit = (task: Task) => {
    setSelectedTaskId(task.id);
    openEditTaskModal(task.id);
  };

  const handleTaskDelete = async (task: Task) => {
    try {
      // Optimistically remove from local state
      removeTask(task.id);

      // Delete from server
      await deleteTaskMutation.mutateAsync({ id: task.id });
    } catch (error) {
      console.error('Failed to delete task:', error);
      // If server delete fails, we should restore the task in the UI
      // For now, the query invalidation in the mutation will refetch and restore if needed
    }
  };

  // Filter tasks based on current user if "My Tasks" is enabled
  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: showMyTasksOnly && currentUserId
      ? column.tasks.filter(task => task.assigneeId === currentUserId)
      : column.tasks
  }));

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

  // DroppableColumn component
  function DroppableColumn({ column, children }: { column: any, children: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({
      id: column.id,
    });

    const style = {
      opacity: isOver ? 0.8 : undefined,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        data-testid={`column-${column.id}`}
        className={`flex flex-col rounded-lg border-2 ${getColumnColor(column.id)} min-h-96 ${
          isOver ? 'ring-2 ring-blue-400 ring-opacity-75' : ''
        }`}
      >
        {children}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndWithCallback}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {filteredColumns.map((column) => (
          <DroppableColumn key={column.id} column={column}>
            {/* Column Header */}
            <div className={`px-4 py-3 rounded-t-lg ${getColumnHeaderColor(column.id)}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                    {column.tasks.length}
                  </span>
                  <button
                    onClick={() => openNewTaskModal()}
                    className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                    title={`Add task to ${column.title}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                  onEdit={() => handleTaskEdit(task)}
                  onDelete={() => handleTaskDelete(task)}
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
          </DroppableColumn>
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
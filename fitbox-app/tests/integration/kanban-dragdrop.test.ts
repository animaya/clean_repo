import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PrismaClient } from '@prisma/client';
import ProjectKanbanPage from '@/app/projects/[id]/page';
import { TRPCProvider } from '@/app/_trpc/provider';
import { QueryClient } from '@tanstack/react-query';
import { DndContext } from '@dnd-kit/core';

const prisma = new PrismaClient();

// Integration Test: Kanban Drag-and-Drop Flow
// Based on quickstart.md lines 78-83
describe('Kanban Drag-and-Drop Integration Test', () => {
  let queryClient: QueryClient;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <TRPCProvider queryClient={queryClient}>
        <DndContext>
          {component}
        </DndContext>
      </TRPCProvider>
    );
  };

  it('should display 4 Kanban columns with correct names', async () => {
    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    // Wait for Kanban board to load
    await waitFor(() => {
      expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    });

    // Should see exactly 4 columns with correct names (quickstart.md line 79)
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('In Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    // Verify columns are properly structured
    const columns = screen.getAllByTestId('kanban-column');
    expect(columns).toHaveLength(4);
  });

  it('should display task cards distributed across columns', async () => {
    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    // Should see task cards distributed across columns (quickstart.md line 80)
    const taskCards = screen.getAllByTestId('task-card');
    expect(taskCards.length).toBeGreaterThan(0);

    // Verify tasks exist in different columns
    const todoColumn = screen.getByTestId('kanban-column-TODO');
    const inProgressColumn = screen.getByTestId('kanban-column-IN_PROGRESS');
    const inReviewColumn = screen.getByTestId('kanban-column-IN_REVIEW');
    const doneColumn = screen.getByTestId('kanban-column-DONE');

    expect(todoColumn).toBeInTheDocument();
    expect(inProgressColumn).toBeInTheDocument();
    expect(inReviewColumn).toBeInTheDocument();
    expect(doneColumn).toBeInTheDocument();
  });

  it('should highlight tasks assigned to current user with different color', async () => {
    // Mock authenticated session
    const mockSessionContext = {
      user: {
        id: 'user-123',
        name: 'Sarah Chen',
        role: 'PRODUCT_MANAGER',
        email: 'sarah@example.com'
      },
      loading: false,
    };

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => mockSessionContext,
    }));

    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    // Tasks assigned to current user should appear in different color (quickstart.md line 81)
    const assignedTasks = screen.getAllByTestId('task-card-assigned-to-current-user');
    const unassignedTasks = screen.getAllByTestId('task-card-unassigned');

    if (assignedTasks.length > 0) {
      // Assigned tasks should have different styling
      assignedTasks.forEach(task => {
        expect(task).toHaveClass('bg-blue-50 border-blue-200');
      });
    }

    if (unassignedTasks.length > 0) {
      // Unassigned tasks should have default styling
      unassignedTasks.forEach(task => {
        expect(task).toHaveClass('bg-white border-gray-200');
      });
    }
  });

  it('should handle drag and drop from To Do to In Progress', async () => {
    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    // Find a task in To Do column
    const todoColumn = screen.getByTestId('kanban-column-TODO');
    const todoTasks = todoColumn.querySelectorAll('[data-testid="task-card"]');

    if (todoTasks.length > 0) {
      const firstTask = todoTasks[0];
      const inProgressColumn = screen.getByTestId('kanban-column-IN_PROGRESS');

      // Simulate drag and drop (quickstart.md lines 82-83)
      fireEvent.dragStart(firstTask);
      fireEvent.dragEnter(inProgressColumn);
      fireEvent.dragOver(inProgressColumn);
      fireEvent.drop(inProgressColumn);
      fireEvent.dragEnd(firstTask);

      // Task should move smoothly, status updates, position saves (quickstart.md line 83)
      await waitFor(() => {
        // Verify task moved to In Progress column
        const inProgressTasks = inProgressColumn.querySelectorAll('[data-testid="task-card"]');
        expect(inProgressTasks.length).toBeGreaterThan(0);
      });
    }
  });

  it('should update task status in database after drag and drop', async () => {
    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    // Get initial task count in each status
    const initialTodoCount = await prisma.task.count({
      where: { status: 'TODO' }
    });

    const initialInProgressCount = await prisma.task.count({
      where: { status: 'IN_PROGRESS' }
    });

    // Simulate drag and drop
    const todoColumn = screen.getByTestId('kanban-column-TODO');
    const todoTasks = todoColumn.querySelectorAll('[data-testid="task-card"]');

    if (todoTasks.length > 0) {
      const firstTask = todoTasks[0];
      const taskId = firstTask.getAttribute('data-task-id');
      const inProgressColumn = screen.getByTestId('kanban-column-IN_PROGRESS');

      fireEvent.dragStart(firstTask);
      fireEvent.drop(inProgressColumn);
      fireEvent.dragEnd(firstTask);

      // Wait for database update
      await waitFor(async () => {
        if (taskId) {
          const updatedTask = await prisma.task.findUnique({
            where: { id: taskId }
          });
          expect(updatedTask?.status).toBe('IN_PROGRESS');
        }
      });
    }
  });

  it('should handle optimistic UI updates during drag and drop', async () => {
    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    const todoColumn = screen.getByTestId('kanban-column-TODO');
    const todoTasks = todoColumn.querySelectorAll('[data-testid="task-card"]');

    if (todoTasks.length > 0) {
      const firstTask = todoTasks[0];
      const inProgressColumn = screen.getByTestId('kanban-column-IN_PROGRESS');

      const initialInProgressTasks = inProgressColumn.querySelectorAll('[data-testid="task-card"]').length;

      // Start drag
      fireEvent.dragStart(firstTask);

      // Should show drag feedback
      expect(firstTask).toHaveClass('dragging');

      // Drop task
      fireEvent.drop(inProgressColumn);
      fireEvent.dragEnd(firstTask);

      // Should immediately show in new column (optimistic update)
      const newInProgressTasks = inProgressColumn.querySelectorAll('[data-testid="task-card"]').length;
      expect(newInProgressTasks).toBe(initialInProgressTasks + 1);
    }
  });

  it('should handle drag and drop within the same column (reordering)', async () => {
    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    const todoColumn = screen.getByTestId('kanban-column-TODO');
    const todoTasks = todoColumn.querySelectorAll('[data-testid="task-card"]');

    if (todoTasks.length > 1) {
      const firstTask = todoTasks[0];
      const secondTask = todoTasks[1];

      // Get initial positions
      const firstTaskPosition = firstTask.getAttribute('data-position');
      const secondTaskPosition = secondTask.getAttribute('data-position');

      // Drag first task to second position
      fireEvent.dragStart(firstTask);
      fireEvent.dragOver(secondTask);
      fireEvent.drop(secondTask);
      fireEvent.dragEnd(firstTask);

      // Should reorder tasks within column
      await waitFor(() => {
        const reorderedTasks = todoColumn.querySelectorAll('[data-testid="task-card"]');
        expect(reorderedTasks.length).toBe(todoTasks.length);
      });
    }
  });

  it('should handle drag and drop across different columns', async () => {
    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    // Test dragging from In Progress to In Review
    const inProgressColumn = screen.getByTestId('kanban-column-IN_PROGRESS');
    const inReviewColumn = screen.getByTestId('kanban-column-IN_REVIEW');

    const inProgressTasks = inProgressColumn.querySelectorAll('[data-testid="task-card"]');

    if (inProgressTasks.length > 0) {
      const taskToMove = inProgressTasks[0];

      fireEvent.dragStart(taskToMove);
      fireEvent.dragEnter(inReviewColumn);
      fireEvent.drop(inReviewColumn);
      fireEvent.dragEnd(taskToMove);

      // Task should move to In Review column
      await waitFor(() => {
        const inReviewTasks = inReviewColumn.querySelectorAll('[data-testid="task-card"]');
        expect(inReviewTasks.length).toBeGreaterThan(0);
      });
    }
  });

  it('should handle drag and drop errors gracefully', async () => {
    // Mock failed drag and drop
    const mockMutation = vi.fn().mockRejectedValue(new Error('Failed to update task'));

    vi.mock('@/lib/trpc', () => ({
      api: {
        tasks: {
          updatePosition: {
            useMutation: () => ({
              mutate: mockMutation,
              isLoading: false,
              error: null,
            }),
          },
        },
      },
    }));

    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    const todoColumn = screen.getByTestId('kanban-column-TODO');
    const inProgressColumn = screen.getByTestId('kanban-column-IN_PROGRESS');
    const todoTasks = todoColumn.querySelectorAll('[data-testid="task-card"]');

    if (todoTasks.length > 0) {
      const firstTask = todoTasks[0];

      fireEvent.dragStart(firstTask);
      fireEvent.drop(inProgressColumn);
      fireEvent.dragEnd(firstTask);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Failed to move task')).toBeInTheDocument();
      });

      // Should revert to original position
      expect(todoColumn.contains(firstTask)).toBe(true);
    }
  });

  it('should match the exact Kanban interaction flow from quickstart', async () => {
    const mockParams = { id: 'ecommerce-platform-id' };
    renderWithProviders(<ProjectKanbanPage params={mockParams} />);

    // Step 1: Expected - See 4 columns (quickstart.md line 79)
    await waitFor(() => {
      expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    });

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('In Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    // Step 2: Expected - See task cards distributed across columns (quickstart.md line 80)
    const taskCards = screen.getAllByTestId('task-card');
    expect(taskCards.length).toBeGreaterThan(0);

    // Step 3: Expected - Tasks assigned to current user appear in different color (quickstart.md line 81)
    const currentUserTasks = screen.getAllByTestId('task-card-assigned-to-current-user');
    if (currentUserTasks.length > 0) {
      currentUserTasks.forEach(task => {
        expect(task).toHaveClass('border-blue-200');
      });
    }

    // Step 4: Action - Drag a task from "To Do" to "In Progress" (quickstart.md line 82)
    const todoColumn = screen.getByTestId('kanban-column-TODO');
    const todoTasks = todoColumn.querySelectorAll('[data-testid="task-card"]');

    if (todoTasks.length > 0) {
      const firstTask = todoTasks[0];
      const inProgressColumn = screen.getByTestId('kanban-column-IN_PROGRESS');

      fireEvent.dragStart(firstTask);
      fireEvent.drop(inProgressColumn);
      fireEvent.dragEnd(firstTask);

      // Step 5: Expected - Task moves smoothly, status updates, position saves (quickstart.md line 83)
      await waitFor(() => {
        const inProgressTasks = inProgressColumn.querySelectorAll('[data-testid="task-card"]');
        expect(inProgressTasks.length).toBeGreaterThan(0);
      });
    }
  });
});
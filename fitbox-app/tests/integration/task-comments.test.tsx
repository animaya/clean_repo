import React from 'react';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PrismaClient } from '@prisma/client';
import TaskModal from '@/components/TaskModal';
import { TRPCProvider } from '@/app/_trpc/provider';
import { QueryClient } from '@tanstack/react-query';

const prisma = new PrismaClient();

// Integration Test: Task Details & Comments Flow
// Based on quickstart.md lines 85-108
describe('Task Details & Comments Integration Test', () => {
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
        {component}
      </TRPCProvider>
    );
  };

  const mockTask = {
    id: 'task-123',
    title: 'Implement User Authentication',
    description: 'Add JWT-based authentication system',
    status: 'IN_PROGRESS' as const,
    position: 1,
    projectId: 'project-123',
    assignedUserId: 'user-123',
    assignedUser: {
      id: 'user-123',
      name: 'Alex Rodriguez',
      role: 'ENGINEER' as const,
      email: 'alex@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [
      {
        id: 'comment-1',
        content: 'This task looks good to start',
        taskId: 'task-123',
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-123',
          name: 'Alex Rodriguez',
          role: 'ENGINEER' as const,
          email: 'alex@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        id: 'comment-2',
        content: 'I will work on this tomorrow',
        taskId: 'task-123',
        userId: 'user-456',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-456',
          name: 'Sarah Chen',
          role: 'PRODUCT_MANAGER' as const,
          email: 'sarah@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ],
  };

  it('should open task modal when task card is clicked', async () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Task modal should open (quickstart.md line 87)
    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });

    expect(screen.getByText('Task Details')).toBeInTheDocument();
  });

  it('should display task title and description in modal', async () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });

    // Should display task title and description (quickstart.md line 88)
    expect(screen.getByText('Implement User Authentication')).toBeInTheDocument();
    expect(screen.getByText('Add JWT-based authentication system')).toBeInTheDocument();
  });

  it('should display current status and assigned user', async () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });

    // Should display current status and assigned user (quickstart.md line 89)
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Alex Rodriguez')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
  });

  it('should display comment section at bottom of modal', async () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });

    // Should have comment section at bottom (quickstart.md line 90)
    expect(screen.getByTestId('comments-section')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByTestId('comment-input')).toBeInTheDocument();
  });

  it('should display existing comments with user names', async () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('comments-section')).toBeInTheDocument();
    });

    // Should display existing comments
    expect(screen.getByText('This task looks good to start')).toBeInTheDocument();
    expect(screen.getByText('I will work on this tomorrow')).toBeInTheDocument();

    // Should show user names for each comment
    const alexComments = screen.getAllByText('Alex Rodriguez');
    const sarahComments = screen.getAllByText('Sarah Chen');

    expect(alexComments.length).toBeGreaterThan(0);
    expect(sarahComments.length).toBeGreaterThan(0);
  });

  it('should allow adding new comment', async () => {
    // Mock current user
    const mockCurrentUser = {
      id: 'user-789',
      name: 'Jordan Kim',
      role: 'ENGINEER' as const,
      email: 'jordan@example.com',
    };

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: mockCurrentUser,
        loading: false,
      }),
    }));

    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('comment-input')).toBeInTheDocument();
    });

    // Add comment "Testing the comment system" (quickstart.md line 91)
    const commentInput = screen.getByTestId('comment-input');
    const submitButton = screen.getByTestId('comment-submit');

    fireEvent.change(commentInput, { target: { value: 'Testing the comment system' } });
    fireEvent.click(submitButton);

    // Comment should appear immediately with user's name (quickstart.md line 92)
    await waitFor(() => {
      expect(screen.getByText('Testing the comment system')).toBeInTheDocument();
      expect(screen.getByText('Jordan Kim')).toBeInTheDocument();
    });
  });

  it('should create comment in database when submitted', async () => {
    const mockCurrentUser = {
      id: 'user-789',
      name: 'Jordan Kim',
      role: 'ENGINEER' as const,
      email: 'jordan@example.com',
    };

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: mockCurrentUser,
        loading: false,
      }),
    }));

    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('comment-input')).toBeInTheDocument();
    });

    const commentsBefore = await prisma.comment.count();

    const commentInput = screen.getByTestId('comment-input');
    const submitButton = screen.getByTestId('comment-submit');

    fireEvent.change(commentInput, { target: { value: 'Database test comment' } });
    fireEvent.click(submitButton);

    // Should create comment in database
    await waitFor(async () => {
      const commentsAfter = await prisma.comment.count();
      expect(commentsAfter).toBe(commentsBefore + 1);
    });
  });

  it('should allow editing own comments', async () => {
    // Mock current user as Alex Rodriguez (who owns comment-1)
    const mockCurrentUser = {
      id: 'user-123',
      name: 'Alex Rodriguez',
      role: 'ENGINEER' as const,
      email: 'alex@example.com',
    };

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: mockCurrentUser,
        loading: false,
      }),
    }));

    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('This task looks good to start')).toBeInTheDocument();
    });

    // Should have edit icon for own comment (quickstart.md line 93)
    const editButton = screen.getByTestId('comment-edit-comment-1');
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    // Should enter edit mode (quickstart.md line 94)
    await waitFor(() => {
      expect(screen.getByTestId('comment-edit-input')).toBeInTheDocument();
    });

    const editInput = screen.getByTestId('comment-edit-input');
    const saveButton = screen.getByTestId('comment-save-button');

    // Modify the comment text
    fireEvent.change(editInput, { target: { value: 'This task looks great to start!' } });
    fireEvent.click(saveButton);

    // Should save the changes
    await waitFor(() => {
      expect(screen.getByText('This task looks great to start!')).toBeInTheDocument();
      expect(screen.queryByTestId('comment-edit-input')).not.toBeInTheDocument();
    });
  });

  it('should not show edit/delete options for other users comments', async () => {
    // Mock current user as Jordan Kim (different from comment owners)
    const mockCurrentUser = {
      id: 'user-789',
      name: 'Jordan Kim',
      role: 'ENGINEER' as const,
      email: 'jordan@example.com',
    };

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: mockCurrentUser,
        loading: false,
      }),
    }));

    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('This task looks good to start')).toBeInTheDocument();
    });

    // Other users' comments should have no edit/delete options (quickstart.md line 95)
    expect(screen.queryByTestId('comment-edit-comment-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('comment-delete-comment-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('comment-edit-comment-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('comment-delete-comment-2')).not.toBeInTheDocument();
  });

  it('should handle task assignment dropdown', async () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });

    // Should have "Assign User" dropdown (quickstart.md line 98)
    const assignUserDropdown = screen.getByTestId('assign-user-dropdown');
    expect(assignUserDropdown).toBeInTheDocument();

    fireEvent.click(assignUserDropdown);

    // Should see all 5 users in dropdown (quickstart.md line 99)
    await waitFor(() => {
      expect(screen.getByText('Select User')).toBeInTheDocument();
    });

    const userOptions = screen.getAllByTestId('user-option');
    expect(userOptions).toHaveLength(5);
  });

  it('should update task assignment when user is selected', async () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('assign-user-dropdown')).toBeInTheDocument();
    });

    const assignUserDropdown = screen.getByTestId('assign-user-dropdown');
    fireEvent.click(assignUserDropdown);

    await waitFor(() => {
      expect(screen.getByTestId('user-option-sarah-chen')).toBeInTheDocument();
    });

    // Select different user (quickstart.md line 100)
    const sarahOption = screen.getByTestId('user-option-sarah-chen');
    fireEvent.click(sarahOption);

    // Task assignment should update, assignee name displays (quickstart.md line 101)
    await waitFor(() => {
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
    });
  });

  it('should handle status changes in task modal', async () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-status-dropdown')).toBeInTheDocument();
    });

    // Change status dropdown from "In Progress" to "In Review" (quickstart.md line 106)
    const statusDropdown = screen.getByTestId('task-status-dropdown');
    fireEvent.click(statusDropdown);

    await waitFor(() => {
      expect(screen.getByText('In Review')).toBeInTheDocument();
    });

    const inReviewOption = screen.getByText('In Review');
    fireEvent.click(inReviewOption);

    // Status should update immediately (quickstart.md line 107)
    await waitFor(() => {
      expect(screen.getByDisplayValue('In Review')).toBeInTheDocument();
    });
  });

  it('should handle modal close and return to board', async () => {
    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });

    // Close modal (quickstart.md line 108)
    const closeButton = screen.getByTestId('modal-close-button');
    fireEvent.click(closeButton);

    // Should call onClose callback to return to board
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should match the exact task details and comments flow from quickstart', async () => {
    const mockCurrentUser = {
      id: 'user-789',
      name: 'Jordan Kim',
      role: 'ENGINEER' as const,
      email: 'jordan@example.com',
    };

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: mockCurrentUser,
        loading: false,
      }),
    }));

    const mockOnClose = vi.fn();

    renderWithProviders(
      <TaskModal
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Step 1: Action - Click on any task card (simulated by modal opening)
    // Step 2: Expected - Task modal opens with details (quickstart.md lines 87-90)
    await waitFor(() => {
      expect(screen.getByTestId('task-modal')).toBeInTheDocument();
    });

    expect(screen.getByText('Implement User Authentication')).toBeInTheDocument();
    expect(screen.getByText('Add JWT-based authentication system')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Alex Rodriguez')).toBeInTheDocument();
    expect(screen.getByTestId('comments-section')).toBeInTheDocument();

    // Step 3: Action - Add comment "Testing the comment system" (quickstart.md line 91)
    const commentInput = screen.getByTestId('comment-input');
    const submitButton = screen.getByTestId('comment-submit');

    fireEvent.change(commentInput, { target: { value: 'Testing the comment system' } });
    fireEvent.click(submitButton);

    // Step 4: Expected - Comment appears immediately with user's name (quickstart.md line 92)
    await waitFor(() => {
      expect(screen.getByText('Testing the comment system')).toBeInTheDocument();
      expect(screen.getByText('Jordan Kim')).toBeInTheDocument();
    });

    // Step 5: Action - Edit comment functionality would be tested for own comments
    // Step 6: Expected - Other users' comments have no edit/delete options (quickstart.md line 95)
    expect(screen.queryByTestId('comment-edit-comment-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('comment-edit-comment-2')).not.toBeInTheDocument();
  });
});
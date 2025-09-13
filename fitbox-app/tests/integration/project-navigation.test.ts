import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PrismaClient } from '@prisma/client';
import ProjectsPage from '@/app/projects/page';
import { TRPCProvider } from '@/app/_trpc/provider';
import { QueryClient } from '@tanstack/react-query';

const prisma = new PrismaClient();

// Integration Test: Project Navigation Flow
// Based on quickstart.md lines 70-76
describe('Project Navigation Integration Test', () => {
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

  it('should display exactly 3 project cards', async () => {
    renderWithProviders(<ProjectsPage />);

    // Wait for project cards to load
    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    // Should see exactly 3 project cards
    const projectCards = screen.getAllByTestId('project-card');
    expect(projectCards).toHaveLength(3);
  });

  it('should display the correct project names from seed data', async () => {
    renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    // Expected project names from quickstart.md lines 71-74
    expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('Mobile App Redesign')).toBeInTheDocument();
    expect(screen.getByText('API Documentation')).toBeInTheDocument();
  });

  it('should display project descriptions', async () => {
    renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    });

    // Each project should have a description
    const projectCards = screen.getAllByTestId('project-card');
    projectCards.forEach(card => {
      const description = card.querySelector('[data-testid="project-description"]');
      expect(description).toBeInTheDocument();
      expect(description?.textContent).toBeTruthy();
    });
  });

  it('should navigate to Kanban board when E-commerce Platform is clicked', async () => {
    const mockPush = vi.fn();

    // Mock Next.js router
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
        pathname: '/projects',
      }),
    }));

    renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    });

    // Click on E-commerce Platform project card
    const ecommerceCard = screen.getByTestId('project-card-ecommerce-platform');
    fireEvent.click(ecommerceCard);

    // Should navigate to Kanban board view
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects/ecommerce-platform-id');
    });
  });

  it('should navigate to correct project page for any project clicked', async () => {
    const mockPush = vi.fn();

    // Mock Next.js router
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
        pathname: '/projects',
      }),
    }));

    renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Mobile App Redesign')).toBeInTheDocument();
    });

    // Click on Mobile App Redesign project
    const mobileAppCard = screen.getByTestId('project-card-mobile-app-redesign');
    fireEvent.click(mobileAppCard);

    // Should navigate to specific project's Kanban board
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects/mobile-app-redesign-id');
    });
  });

  it('should show project metadata (created date, task count)', async () => {
    renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('API Documentation')).toBeInTheDocument();
    });

    // Each project card should show metadata
    const projectCards = screen.getAllByTestId('project-card');

    projectCards.forEach(card => {
      // Should show created date
      const createdDate = card.querySelector('[data-testid="project-created-date"]');
      expect(createdDate).toBeInTheDocument();

      // Should show task count
      const taskCount = card.querySelector('[data-testid="project-task-count"]');
      expect(taskCount).toBeInTheDocument();
    });
  });

  it('should handle loading states during project loading', async () => {
    renderWithProviders(<ProjectsPage />);

    // Should show loading state initially
    expect(screen.getByTestId('projects-loading')).toBeInTheDocument();

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.queryByTestId('projects-loading')).not.toBeInTheDocument();
    });

    // Projects should be displayed
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('should require authenticated session to view projects', async () => {
    // Mock session context with no user
    const mockSessionContext = {
      user: null,
      loading: false,
    };

    // Mock session provider
    vi.mock('@/store/auth', () => ({
      useAuthStore: () => mockSessionContext,
    }));

    renderWithProviders(<ProjectsPage />);

    // Should redirect to user selection if no session
    await waitFor(() => {
      expect(screen.getByText('Please select a user first')).toBeInTheDocument();
    });

    // Should show link to go back to user selection
    expect(screen.getByText('Select User')).toBeInTheDocument();
  });

  it('should display current user in header/navigation', async () => {
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

    // Mock session provider
    vi.mock('@/store/auth', () => ({
      useAuthStore: () => mockSessionContext,
    }));

    renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    // Should display current user name
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
  });

  it('should handle errors during project loading gracefully', async () => {
    // Mock tRPC to return error
    const errorQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          queryFn: () => Promise.reject(new Error('Failed to load projects'))
        },
      },
    });

    render(
      <TRPCProvider queryClient={errorQueryClient}>
        <ProjectsPage />
      </TRPCProvider>
    );

    // Should show error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load projects')).toBeInTheDocument();
    });

    // Should have retry button
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should show empty state when no projects exist', async () => {
    // Mock empty projects response
    const emptyQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          queryFn: () => Promise.resolve([])
        },
      },
    });

    render(
      <TRPCProvider queryClient={emptyQueryClient}>
        <ProjectsPage />
      </TRPCProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No projects found')).toBeInTheDocument();
    });

    expect(screen.getByText('Contact your administrator to create projects')).toBeInTheDocument();
  });

  it('should match the exact project navigation flow from quickstart', async () => {
    const mockPush = vi.fn();

    // Mock Next.js router
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
        pathname: '/projects',
      }),
    }));

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

    renderWithProviders(<ProjectsPage />);

    // Step 1: Expected - See 3 project cards (from quickstart.md lines 71-74)
    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    const projectCards = screen.getAllByTestId('project-card');
    expect(projectCards).toHaveLength(3);

    expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('Mobile App Redesign')).toBeInTheDocument();
    expect(screen.getByText('API Documentation')).toBeInTheDocument();

    // Step 2: Action - Click on "E-commerce Platform" (quickstart.md line 75)
    const ecommerceCard = screen.getByTestId('project-card-ecommerce-platform');
    fireEvent.click(ecommerceCard);

    // Step 3: Expected - Navigate to Kanban board view (quickstart.md line 76)
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects/ecommerce-platform-id');
    });
  });

  it('should handle project card hover states for better UX', async () => {
    renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    });

    const ecommerceCard = screen.getByTestId('project-card-ecommerce-platform');

    // Hover over project card
    fireEvent.mouseEnter(ecommerceCard);

    // Should have hover styling
    expect(ecommerceCard).toHaveClass('hover:shadow-lg');

    // Mouse leave
    fireEvent.mouseLeave(ecommerceCard);
  });
});
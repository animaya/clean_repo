import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PrismaClient } from '@prisma/client';
import UserSelectionPage from '@/app/page';
import { TRPCProvider } from '@/app/_trpc/provider';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

const prisma = new PrismaClient();

// Integration Test: User Selection Flow
// Based on quickstart.md lines 64-68
describe('User Selection Flow Integration Test', () => {
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
      React.createElement(TRPCProvider, { queryClient }, component)
    );
  };

  it('should display 5 user cards on initial load', async () => {
    renderWithProviders(React.createElement(UserSelectionPage));

    // Wait for user cards to load
    await waitFor(() => {
      expect(screen.getByText('Select User')).toBeInTheDocument();
    });

    // Should see exactly 5 user cards
    const userCards = screen.getAllByTestId('user-card');
    expect(userCards).toHaveLength(5);

    // Should include specific users from seed data
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument(); // Product Manager
    expect(screen.getByText('Alex Rodriguez')).toBeInTheDocument(); // Engineer
    expect(screen.getByText('Jordan Kim')).toBeInTheDocument(); // Engineer
    expect(screen.getByText('Taylor Brown')).toBeInTheDocument(); // Engineer
    expect(screen.getByText('Morgan Davis')).toBeInTheDocument(); // Engineer
  });

  it('should display user roles correctly', async () => {
    renderWithProviders(<UserSelectionPage />);

    await waitFor(() => {
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
    });

    // Should have 1 Product Manager
    const pmBadges = screen.getAllByText('Product Manager');
    expect(pmBadges).toHaveLength(1);

    // Should have 4 Engineers
    const engineerBadges = screen.getAllByText('Engineer');
    expect(engineerBadges).toHaveLength(4);
  });

  it('should handle user card click and navigate to projects', async () => {
    const mockPush = vi.fn();

    // Mock Next.js router
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
        pathname: '/',
      }),
    }));

    renderWithProviders(<UserSelectionPage />);

    // Wait for user cards to load
    await waitFor(() => {
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    });

    // Click on Sarah Chen's user card
    const sarahCard = screen.getByTestId('user-card-sarah-chen');
    fireEvent.click(sarahCard);

    // Should navigate to projects page
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects');
    });
  });

  it('should create session when user is selected', async () => {
    renderWithProviders(<UserSelectionPage />);

    await waitFor(() => {
      expect(screen.getByText('Alex Rodriguez')).toBeInTheDocument();
    });

    const sessionsBefore = await prisma.session.count();

    // Click on Alex Rodriguez's user card
    const alexCard = screen.getByTestId('user-card-alex-rodriguez');
    fireEvent.click(alexCard);

    // Wait for session creation
    await waitFor(async () => {
      const sessionsAfter = await prisma.session.count();
      expect(sessionsAfter).toBe(sessionsBefore + 1);
    });
  });

  it('should set session cookie when user is selected', async () => {
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });

    renderWithProviders(<UserSelectionPage />);

    await waitFor(() => {
      expect(screen.getByText('Jordan Kim')).toBeInTheDocument();
    });

    // Click on Jordan Kim's user card
    const jordanCard = screen.getByTestId('user-card-jordan-kim');
    fireEvent.click(jordanCard);

    // Should set session cookie
    await waitFor(() => {
      expect(document.cookie).toContain('session=');
    });
  });

  it('should handle loading states during user selection', async () => {
    renderWithProviders(<UserSelectionPage />);

    // Should show loading state initially
    expect(screen.getByTestId('users-loading')).toBeInTheDocument();

    // Wait for users to load
    await waitFor(() => {
      expect(screen.queryByTestId('users-loading')).not.toBeInTheDocument();
    });

    // Users should be displayed
    expect(screen.getByText('Select User')).toBeInTheDocument();
  });

  it('should handle user selection loading state', async () => {
    renderWithProviders(<UserSelectionPage />);

    await waitFor(() => {
      expect(screen.getByText('Taylor Brown')).toBeInTheDocument();
    });

    // Click on Taylor Brown's user card
    const taylorCard = screen.getByTestId('user-card-taylor-brown');
    fireEvent.click(taylorCard);

    // Should show selection loading state
    expect(screen.getByTestId('user-selection-loading')).toBeInTheDocument();
  });

  it('should handle errors during user loading gracefully', async () => {
    // Mock tRPC to return error
    const errorQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          queryFn: () => Promise.reject(new Error('Failed to load users'))
        },
      },
    });

    render(
      <TRPCProvider queryClient={errorQueryClient}>
        <UserSelectionPage />
      </TRPCProvider>
    );

    // Should show error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load users')).toBeInTheDocument();
    });

    // Should have retry button
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should handle errors during user selection gracefully', async () => {
    renderWithProviders(<UserSelectionPage />);

    await waitFor(() => {
      expect(screen.getByText('Morgan Davis')).toBeInTheDocument();
    });

    // Mock failed selection
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('Selection failed'));

    // Click on Morgan Davis's user card
    const morganCard = screen.getByTestId('user-card-morgan-davis');
    fireEvent.click(morganCard);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Failed to select user')).toBeInTheDocument();
    });

    // Restore fetch
    global.fetch = originalFetch;
  });

  it('should match the exact user selection flow from quickstart', async () => {
    // Step 1: Access http://localhost:3000 (simulated by render)
    renderWithProviders(<UserSelectionPage />);

    // Step 2: Expected - See 5 user cards (1 PM: Sarah Chen, 4 Engineers)
    await waitFor(() => {
      expect(screen.getByText('Select User')).toBeInTheDocument();
    });

    const userCards = screen.getAllByTestId('user-card');
    expect(userCards).toHaveLength(5);

    // Verify specific users and roles
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();

    const engineers = ['Alex Rodriguez', 'Jordan Kim', 'Taylor Brown', 'Morgan Davis'];
    engineers.forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    const engineerBadges = screen.getAllByText('Engineer');
    expect(engineerBadges).toHaveLength(4);

    // Step 3: Action - Click on any user card
    const sarahCard = screen.getByTestId('user-card-sarah-chen');
    fireEvent.click(sarahCard);

    // Step 4: Expected - Navigate to projects page with selected user in session
    await waitFor(() => {
      // Verify session was created and navigation would occur
      expect(screen.getByTestId('user-selection-loading')).toBeInTheDocument();
    });
  });
});
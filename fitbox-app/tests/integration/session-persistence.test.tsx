import React from 'react';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PrismaClient } from '@prisma/client';
import { TRPCProvider } from '@/app/_trpc/provider';
import { QueryClient } from '@tanstack/react-query';
import UserSelectionPage from '@/app/page';
import ProjectsPage from '@/app/projects/page';

const prisma = new PrismaClient();

// Integration Test: Session Persistence Flow
// Based on quickstart.md lines 111-117
describe('Session Persistence Integration Test', () => {
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

    // Clear any existing sessions and cookies
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    localStorage.clear();
    sessionStorage.clear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <TRPCProvider queryClient={queryClient}>
        {component}
      </TRPCProvider>
    );
  };

  it('should maintain session when navigating back to projects', async () => {
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

    // Set session cookie
    document.cookie = 'session=valid-jwt-token; path=/';

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => mockSessionContext,
    }));

    const mockPush = vi.fn();
    const mockBack = vi.fn();

    // Mock Next.js router
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
        back: mockBack,
        pathname: '/projects',
      }),
    }));

    renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    // Navigate back to projects (breadcrumb or back button) - quickstart.md line 112
    const backButton = screen.getByTestId('back-to-projects');
    fireEvent.click(backButton);

    // Same user should still be selected, no re-selection required (quickstart.md line 113)
    await waitFor(() => {
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
    });

    // Should not redirect to user selection
    expect(mockPush).not.toHaveBeenCalledWith('/');
  });

  it('should persist session after browser refresh', async () => {
    // Set up initial session
    const sessionToken = 'valid-jwt-token-123';
    document.cookie = `session=${sessionToken}; path=/`;

    // Create session in database
    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      },
    });

    // Mock user data that would be returned by session validation
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

    // Refresh browser page (simulated by re-render) - quickstart.md line 114
    // Expected: Still logged in as same user (2-hour session) - quickstart.md line 115

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    });

    // Should not show user selection screen
    expect(screen.queryByText('Select User')).not.toBeInTheDocument();
  });

  it('should redirect to projects when opening new tab with existing session', async () => {
    const sessionToken = 'valid-jwt-token-456';
    document.cookie = `session=${sessionToken}; path=/`;

    // Create valid session in database
    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: 'user-456',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    const mockPush = vi.fn();

    // Mock Next.js router
    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
        pathname: '/',
      }),
    }));

    // Mock session validation
    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: {
          id: 'user-456',
          name: 'Alex Rodriguez',
          role: 'ENGINEER',
          email: 'alex@example.com'
        },
        loading: false,
      }),
    }));

    renderWithProviders(<UserSelectionPage />);

    // Open new tab to same URL - quickstart.md line 116
    // Expected: Redirected to projects (session maintained) - quickstart.md line 117

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects');
    });
  });

  it('should handle expired session gracefully', async () => {
    const expiredToken = 'expired-jwt-token';
    document.cookie = `session=${expiredToken}; path=/`;

    // Create expired session in database
    await prisma.session.create({
      data: {
        token: expiredToken,
        userId: 'user-789',
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago (expired)
      },
    });

    // Mock expired session state
    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: null,
        loading: false,
      }),
    }));

    renderWithProviders(<ProjectsPage />);

    // Should redirect to user selection when session is expired
    await waitFor(() => {
      expect(screen.getByText('Please select a user first')).toBeInTheDocument();
    });

    expect(screen.getByText('Select User')).toBeInTheDocument();
  });

  it('should validate session token on each request', async () => {
    const validToken = 'valid-session-token';
    document.cookie = `session=${validToken}; path=/`;

    // Create valid session
    await prisma.session.create({
      data: {
        token: validToken,
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    let sessionValidationCalled = false;

    // Mock tRPC session validation
    vi.mock('@/lib/trpc', () => ({
      api: {
        auth: {
          getCurrentUser: {
            useQuery: () => {
              sessionValidationCalled = true;
              return {
                data: {
                  id: 'user-123',
                  name: 'Sarah Chen',
                  role: 'PRODUCT_MANAGER',
                  email: 'sarah@example.com'
                },
                isLoading: false,
                error: null,
              };
            },
          },
        },
      },
    }));

    renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(sessionValidationCalled).toBe(true);
    });
  });

  it('should handle invalid session token gracefully', async () => {
    document.cookie = 'session=invalid-token; path=/';

    // No session in database (invalid token)

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: null,
        loading: false,
      }),
    }));

    renderWithProviders(<ProjectsPage />);

    // Should handle invalid token and redirect to user selection
    await waitFor(() => {
      expect(screen.getByText('Please select a user first')).toBeInTheDocument();
    });
  });

  it('should clean up expired sessions from database', async () => {
    // Create multiple sessions with different expiration times
    const expiredSession1 = await prisma.session.create({
      data: {
        token: 'expired-token-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
    });

    const expiredSession2 = await prisma.session.create({
      data: {
        token: 'expired-token-2',
        userId: 'user-2',
        expiresAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    });

    const validSession = await prisma.session.create({
      data: {
        token: 'valid-token',
        userId: 'user-3',
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      },
    });

    const initialSessionCount = await prisma.session.count();

    // Mock cleanup process (would normally be done by background job or middleware)
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    const finalSessionCount = await prisma.session.count();

    // Should have removed expired sessions but kept valid one
    expect(finalSessionCount).toBe(1);
    expect(finalSessionCount).toBeLessThan(initialSessionCount);

    // Verify valid session still exists
    const remainingSession = await prisma.session.findUnique({
      where: { token: 'valid-token' },
    });

    expect(remainingSession).toBeTruthy();
  });

  it('should handle concurrent session validation requests', async () => {
    const sessionToken = 'concurrent-test-token';
    document.cookie = `session=${sessionToken}; path=/`;

    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: 'user-concurrent',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    const mockUser = {
      id: 'user-concurrent',
      name: 'Concurrent User',
      role: 'ENGINEER',
      email: 'concurrent@example.com'
    };

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: mockUser,
        loading: false,
      }),
    }));

    // Render multiple components that would validate session concurrently
    const { rerender } = renderWithProviders(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    // Simulate multiple concurrent renders/validations
    rerender(
      <TRPCProvider queryClient={queryClient}>
        <ProjectsPage />
      </TRPCProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Concurrent User')).toBeInTheDocument();
    });

    // Should handle concurrent requests without errors
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('should match the exact session persistence flow from quickstart', async () => {
    // Initial setup - user has been selected and has active session
    const sessionToken = 'quickstart-session-token';
    document.cookie = `session=${sessionToken}; path=/`;

    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: 'user-quickstart',
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    });

    const mockUser = {
      id: 'user-quickstart',
      name: 'Sarah Chen',
      role: 'PRODUCT_MANAGER',
      email: 'sarah@example.com'
    };

    const mockPush = vi.fn();
    const mockBack = vi.fn();

    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
        back: mockBack,
        pathname: '/projects',
      }),
    }));

    vi.mock('@/store/auth', () => ({
      useAuthStore: () => ({
        user: mockUser,
        loading: false,
      }),
    }));

    renderWithProviders(<ProjectsPage />);

    // Step 1: Action - Navigate back to projects (quickstart.md line 112)
    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    const backButton = screen.getByTestId('back-to-projects');
    fireEvent.click(backButton);

    // Step 2: Expected - Same user still selected, no re-selection required (quickstart.md line 113)
    await waitFor(() => {
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
    });

    // Step 3: Action - Refresh browser page (simulated by re-render)
    const { rerender } = render(
      <TRPCProvider queryClient={queryClient}>
        <ProjectsPage />
      </TRPCProvider>
    );

    // Step 4: Expected - Still logged in as same user (2-hour session) (quickstart.md line 115)
    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    });

    // Step 5: Action - Open new tab to same URL (simulated by new render with session)
    rerender(
      <TRPCProvider queryClient={queryClient}>
        <UserSelectionPage />
      </TRPCProvider>
    );

    // Step 6: Expected - Redirected to projects (session maintained) (quickstart.md line 117)
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects');
    });
  });
});
// Test setup file
import { beforeAll, afterAll, vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js modules that don't exist yet
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    pathname: '/',
  }),
}));

// Mock React components that don't exist yet
vi.mock('@/app/page', () => ({
  default: () => React.createElement('div', null, 'User Selection Page'),
}));

vi.mock('@/app/projects/page', () => ({
  default: () => React.createElement('div', null, 'Projects Page'),
}));

vi.mock('@/app/projects/[id]/page', () => ({
  default: ({ params }: { params: { id: string } }) =>
    React.createElement('div', null, `Project Kanban Page: ${params.id}`),
}));

vi.mock('@/components/TaskModal', () => ({
  default: ({ task, isOpen, onClose }: any) =>
    isOpen ? React.createElement('div', { 'data-testid': 'task-modal' }, `Task Modal: ${task.title}`) : null,
}));

vi.mock('@/app/_trpc/provider', () => ({
  TRPCProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}));

vi.mock('@/store/auth', () => ({
  useAuthStore: () => ({
    user: null,
    loading: false,
  }),
}));

beforeAll(async () => {
  // Global test setup
  console.log('Setting up tests...');
});

afterAll(async () => {
  // Global test cleanup
  console.log('Cleaning up tests...');
});
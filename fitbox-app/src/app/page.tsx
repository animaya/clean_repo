'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from './_trpc/client';
import { useAuthStore } from '@/store/auth';

export default function UserSelectionPage() {
  const router = useRouter();
  const { setUser, setLoading, setError } = useAuthStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, isLoading: usersLoading, error: usersError } = trpc.users.getAll.useQuery();

  // Debug log to see the actual data structure
  console.log('Users data:', users);
  console.log('Users type:', typeof users);
  console.log('Users is array:', Array.isArray(users));
  console.log('Users?.json:', users?.json);
  console.log('Users?.json type:', typeof users?.json);
  console.log('Users?.json is array:', Array.isArray(users?.json));

  const selectUserMutation = trpc.auth.selectUser.useMutation();

  const handleUserSelect = async (userId: string) => {
    console.log('handleUserSelect called with userId:', userId);
    console.log('typeof userId:', typeof userId);

    if (!userId) {
      console.error('userId is falsy:', userId);
      setError('Invalid user ID');
      return;
    }

    setSelectedUserId(userId);
    setLoading(true);
    setError(null);

    try {
      console.log('About to call mutation with:', { userId });
      const result = await selectUserMutation.mutateAsync({ userId });
      setUser(result.user);
      router.push('/projects');
    } catch (error) {
      console.error('Failed to select user:', error);
      setError('Failed to sign in. Please try again.');
      setSelectedUserId(null);
    } finally {
      setLoading(false);
    }
  };

  if (usersLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </main>
    );
  }

  if (usersError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">Failed to load users. Please try again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Taskify</h1>
          <p className="text-gray-600">Select a user to continue</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-3">
            {Array.isArray(users) && users.length > 0 ? users.map((user) => (
              <button
                key={user.id}
                data-testid="user-card"
                onClick={() => handleUserSelect(user.id)}
                disabled={selectUserMutation.isLoading || selectedUserId === user.id}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedUserId === user.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  {selectedUserId === user.id && (
                    <div className="ml-auto">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              </button>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {users ? 'Data loaded but not in expected format' : 'No users available'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Type: {typeof users} | users Is Array: {String(Array.isArray(users))} | Length: {Array.isArray(users) ? users.length : 'N/A'}
                </p>
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer">Raw data</summary>
                  <pre className="text-xs mt-2 p-2 bg-gray-100 rounded text-left overflow-auto max-h-32">
                    {JSON.stringify(users, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>

          {selectUserMutation.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {selectUserMutation.error.message || 'Failed to sign in. Please try again.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This is a demo application. No authentication required.
          </p>
        </div>
      </div>
    </main>
  );
}
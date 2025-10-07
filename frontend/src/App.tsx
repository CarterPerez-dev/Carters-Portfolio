// ===========================
// Main App Component
// ©AngelaMos | 2025
// ===========================

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/api/query';
import { useAuthStore } from '@/lib/store/auth.store';
import { router } from './router';

const AuthInitializer = (): null => {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    void checkAuthStatus();
  }, [checkAuthStatus]);

  return null;
};

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid #fff',
            fontFamily: 'IBM Plex Mono, monospace',
            imageRendering: 'pixelated',
          },
        }}
        closeButton
        duration={3500}
      />
      {import.meta.env.DEV ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}

export default App;

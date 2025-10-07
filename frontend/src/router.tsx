// ===========================
// Router Configuration
// ©AngelaMos | 2025
// ===========================

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Layout, RootLayout } from '@/lib/components/layout';
import { ProtectedRoute } from '@/lib/components/admin';
import { LoadingFallback } from '@/lib/components/common/LoadingFallback';

const Root = lazy(() =>
  import('@/pages/root').then((m) => ({ default: m.Root })),
);
const Experience = lazy(() =>
  import('@/pages/experience').then((m) => ({ default: m.Experience })),
);
const Blog = lazy(() =>
  import('@/pages/blogs').then((m) => ({ default: m.Blog })),
);
const BlogPost = lazy(() =>
  import('@/pages/blogs').then((m) => ({ default: m.BlogPost })),
);
const Contact = lazy(() =>
  import('@/pages/contact').then((m) => ({ default: m.Contact })),
);
const Projects = lazy(() =>
  import('@/pages/projects').then((m) => ({ default: m.Projects })),
);
const AdminDashboard = lazy(() =>
  import('@/pages/admin').then((m) => ({ default: m.AdminDashboard })),
);
const GitHubCallback = lazy(() =>
  import('@/pages/admin').then((m) => ({ default: m.GitHubCallback })),
);

const withSuspense = (Component: React.ComponentType): React.JSX.Element => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/root"
            replace
          />
        ),
      },
      {
        path: 'root',
        element: <Layout>{withSuspense(Root)}</Layout>,
      },
      {
        path: 'experience',
        element: <Layout>{withSuspense(Experience)}</Layout>,
      },
      {
        path: 'projects',
        element: <Layout>{withSuspense(Projects)}</Layout>,
      },
      {
        path: 'blog',
        element: <Layout>{withSuspense(Blog)}</Layout>,
      },
      {
        path: 'blog/:slug',
        element: <Layout>{withSuspense(BlogPost)}</Layout>,
      },
      {
        path: 'contact',
        element: <Layout>{withSuspense(Contact)}</Layout>,
      },
      {
        path: 'admin',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Layout>{withSuspense(AdminDashboard)}</Layout>
              </ProtectedRoute>
            ),
          },
          {
            path: 'auth/github/callback',
            element: withSuspense(GitHubCallback),
          },
        ],
      },
      {
        path: '*',
        element: (
          <Navigate
            to="/root"
            replace
          />
        ),
      },
    ],
  },
]);

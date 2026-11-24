// src/index.js
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/Header';
import Spinner from './components/Spinner';
import RouteError from './components/RouteError';
import SiteFooter from './components/SiteFooter';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { MotionConfig } from 'motion/react';

// Chaque page charge son propre chunk : le bundle initial reste léger
const Home = lazy(() => import('./pages/Home'));
const Contact = lazy(() => import('./pages/Contact'));
const Makeup = lazy(() => import('./pages/Makeup'));
const Tattoo = lazy(() => import('./pages/Tattoo'));
const Project = lazy(() => import('./pages/Project'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Layout() {
  return (
      <>
        <Header />
        {/* Nouvelle page : en haut. Retour arrière : position précédente restaurée. */}
        <ScrollRestoration />
        <Suspense fallback={<Spinner fullScreen />}>
          <Outlet />
        </Suspense>
        <SiteFooter />
      </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'makeup',
        element: <Makeup />,
      },
      {
        path: 'tattoo',
        element: <Tattoo />,
      },
      {
        path: 'project',
        element: <Project />,
      },
      {
        path: 'news/:id',
        element: <NewsDetail />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      {/* Respecte « réduire les animations » du système pour toutes les animations framer-motion */}
      <MotionConfig reducedMotion="user">
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </MotionConfig>
    </React.StrictMode>
);


// src/index.js
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './components/Header';
import Spinner from './components/Spinner';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import reportWebVitals from './reportWebVitals';

// Chaque page charge son propre chunk : le bundle initial reste léger
const Home = lazy(() => import('./pages/Home'));
const Contact = lazy(() => import('./pages/Contact'));
const Makeup = lazy(() => import('./pages/Makeup'));
const Tattoo = lazy(() => import('./pages/Tattoo'));
const Project = lazy(() => import('./pages/Project'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));

function Layout() {
  return (
      <>
        <Header />
        <Suspense fallback={<Spinner fullScreen />}>
          <Outlet />
        </Suspense>
      </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <div>Page not found</div>,
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
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </React.StrictMode>
);

reportWebVitals();

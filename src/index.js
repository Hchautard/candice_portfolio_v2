// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Makeup from './pages/Makeup';
import Tattoo from './pages/Tattoo';
import Project from './pages/Project';
import Header from './components/Header';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import reportWebVitals from './reportWebVitals';

function Layout() {
  return (
      <>
        <Header />
        <Outlet />
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
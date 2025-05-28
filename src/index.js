import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Makeup from './pages/Makeup';
import Tattoo from './pages/Tattoo';
import Header from './components/Header';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// ✅ Layout component pour inclure le Header
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
    element: <Layout />, // ✅ Layout comme élément parent
    errorElement: <div>Page not found</div>,
    children: [
      {
        index: true, // ✅ Route par défaut pour "/"
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
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Makeup from './pages/Makeup';
import Tattoo from './pages/Tattoo';
import Header from './components/Header';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <div>Page not found</div>,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/makeup',
    element: <Makeup />,
  },
  {
    path: '/tattoo',
    element: <Tattoo />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import { createBrowserRouter } from 'react-router-dom';

// layouts
import PublicLayout from '../layouts/PublicLayout/PublicLayout';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';

// public pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';

// admin pages
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Settings from '../pages/admin/Settings';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
    // public routes
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { path: '', element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'contact', element: <Contact /> },
            { path: 'login', element: <Login /> },
        ],
    },

    // admin routes
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { path: '', element: <Dashboard /> },
            { path: 'users', element: <Users /> },
            { path: 'settings', element: <Settings /> },
        ],
    },
]);

export default router;

import { createBrowserRouter } from 'react-router-dom';

// layouts
import PublicLayout from '@/layouts/PublicLayout/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout/AdminLayout';

// public pages
import Home from '@/pages/public/home/Home';
// import About from '@/pages/public/about/About';
// import Campaigns from '@/pages/public/campaigns/Campaigns';
// import CampaignDetails from '@/pages/public/campaigns/campaignDetails/CampaignDetails';

// admin pages
// import Dashboard from '../pages/admin/Dashboard';
// import Users from '../pages/admin/Users';
// import Settings from '../pages/admin/Settings';

// 404 - not found page
// import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
    // public routes
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { path: '', element: <Home /> },
            // { path: 'about', element: <About /> },
            // { path: 'campaigns', element: <Campaigns /> },
            // { path: 'campaigns/:id', element: <CampaignDetails /> },
        ],
    },

    // admin routes
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            // { path: '', element: <Dashboard /> },
            // { path: 'users', element: <Users /> },
            // { path: 'settings', element: <Settings /> },
        ],
    },

    // 404 - Not found page route
    {
        path: '*',
        // element: <NotFound />,
    },
]);

export default router;

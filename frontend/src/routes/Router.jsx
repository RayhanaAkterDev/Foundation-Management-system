import { createBrowserRouter } from 'react-router-dom';

// layouts
import PublicLayout from '@/layouts/PublicLayout/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout/AdminLayout';

// public pages
import Home from '@/pages/public/home/Home';
import HowItWorksPage from '@/pages/public/howItWorksPage/HowItWorksPage';

import Categories from '@/pages/public/categoriesPage/CategoriesPage';
import Campaigns from '@/pages/public/campaignsPage/Campaigns';
import CampaignDetails from '@/pages/public/campaignsPage/campaignDetails/CampaignDetails';

// 404
import NotFound from '../pages/NotFound';
import Donate from '@/pages/public/donationPage/Donate';
import DonateHub from '@/pages/public/donationPage/DonateHub';
import Volunteer from '@/pages/public/volunteerPage/Volunteer';
import RequestHelp from '@/pages/public/requestHelpPage/RequestHelp';
import Partner from '@/pages/public/partnersPage/Partner';

const router = createBrowserRouter([
    // =========================
    // PUBLIC ROUTES
    // =========================
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { path: '', element: <Home /> },

            { path: 'how-it-works', element: <HowItWorksPage /> },

            // CATEGORY PAGE (exploration only)
            { path: 'categories', element: <Categories /> },

            // OPTIONAL (if you want category page direct access)
            { path: 'categories/:categoryId', element: <Categories /> },

            // =========================
            // CAMPAIGNS SYSTEM
            // =========================

            // ALL campaigns
            { path: 'campaigns', element: <Campaigns /> },

            // CATEGORY FILTERED campaigns (IMPORTANT FIX)
            { path: 'campaigns/category/:categoryId', element: <Campaigns /> },

            // SINGLE campaign details
            { path: 'campaign/:id', element: <CampaignDetails /> },

            // Donate page
            { path: '/donate', element: <DonateHub /> },
            { path: '/donate/:id', element: <Donate /> },

            // Volunteer
            { path: 'volunteer', element: <Volunteer /> },

            // Request help page
            { path: 'request-help', element: <RequestHelp /> },

            // Partner page
            { path: 'partner', element: <Partner /> },

        ],
    },

    // =========================
    // ADMIN ROUTES
    // =========================
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [],
    },

    // =========================
    // 404
    // =========================
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;

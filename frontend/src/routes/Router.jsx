import { createBrowserRouter } from 'react-router-dom';

// 404
import NotFound from '../pages/NotFound';

// layouts
import PublicLayout from '@/layouts/PublicLayout/PublicLayout';

// public pages
import Home from '@/pages/public/home/Home';
import HowItWorksPage from '@/pages/public/howItWorksPage/HowItWorksPage';

import Categories from '@/pages/public/categoriesPage/CategoriesPage';
import Campaigns from '@/pages/public/campaignsPage/Campaigns';
import CampaignDetails from '@/pages/public/campaignsPage/campaignDetails/CampaignDetails';

import Donate from '@/pages/public/donationPage/Donate';
import DonateHub from '@/pages/public/donationPage/DonateHub/DonateHub';
import Volunteer from '@/pages/public/volunteerPage/Volunteer';
import RequestHelp from '@/pages/public/requestHelpPage/RequestHelp';
import Partner from '@/pages/public/partnersPage/Partner';
import Stories from '@/pages/public/storiesPage/Stories';
import About from '@/pages/public/about/About';

// Account pages
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import AccountSelection from '@/auth/AccountSelection/AccountSelection';
import Login from '@/auth/Login/Login';
import Register from '@/auth/Register/Register';
// import ForgotPassword from '@/auth/ForgotPassword/ForgotPassword';
// import VerifyEmail from '@/auth/VerifyEmail/VerifyEmail';

// Dashboard routes imports
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout';
import IndividualDashboard from '@/dashboard/individual/IndividualDashboard';
import OrganizationDashboard from '@/dashboard/organization/OrgDashboard';

// Admin dashboard routes
import AdminDashboard from '@/dashboard/admin/AdminDashboard';
import AdminUsers from '@/dashboard/admin/AdminUsers';
import AdminOrganizations from '@/dashboard/admin/AdminOrganizations';
import AdminHelpRequests from '@/dashboard/admin/AdminHelpRequests';
import AdminDonations from '@/dashboard/admin/AdminDonations';
import AdminVolunteers from '@/dashboard/admin/AdminVolunteers';
import AdminCampaigns from '@/dashboard/admin/AdminCampaigns';
import AdminReports from '@/dashboard/admin/AdminReports';
import AdminSettings from '@/dashboard/admin/AdminSettings';

const router = createBrowserRouter([
    // =========================
    // PUBLIC ROUTES
    // =========================
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { path: '', element: <Home /> },
            { path: 'account', element: <AccountSelection /> },

            { path: '/about', element: <About /> },
            { path: 'how-it-works', element: <HowItWorksPage /> },

            // CATEGORY PAGE
            { path: 'categories', element: <Categories /> },
            { path: 'categories/:categoryId', element: <Categories /> },

            // ALL campaigns
            { path: 'campaigns', element: <Campaigns /> },
            { path: 'campaigns/category/:categoryId', element: <Campaigns /> },
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

            // Story page
            { path: '/stories', element: <Stories /> },
        ],
    },

    // =========================
    // ACCOUNT ROUTES
    // =========================
    {
        path: '/account',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            // { path: 'forgot-password', element: <ForgotPassword /> },
            // { path: 'verify-email', element: <VerifyEmail /> },
        ],
    },

    // =========================
    // 404
    // =========================
    {
        path: '*',
        element: <NotFound />,
    },

    // =========================
    // DASHBOARD ROUTES
    // =========================
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
            // INDIVIDUAL
            {
                path: 'individual',
                element: <IndividualDashboard />,
            },

            // ORGANIZATION
            {
                path: 'organization',
                element: <OrganizationDashboard />,
            },

            // ADMIN
            {
                path: 'admin',
                children: [
                    {
                        index: true,
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'users',
                        element: <AdminUsers />,
                    },
                    {
                        path: 'organizations',
                        element: <AdminOrganizations />,
                    },
                    {
                        path: 'help-requests',
                        element: <AdminHelpRequests />,
                    },
                    {
                        path: 'donations',
                        element: <AdminDonations />,
                    },
                    {
                        path: 'volunteers',
                        element: <AdminVolunteers />,
                    },
                    {
                        path: 'campaigns',
                        element: <AdminCampaigns />,
                    },
                    {
                        path: 'reports',
                        element: <AdminReports />,
                    },
                    {
                        path: 'settings',
                        element: <AdminSettings />,
                    },
                ],
            },
        ],
    },
]);

export default router;

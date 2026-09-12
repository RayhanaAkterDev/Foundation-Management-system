import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

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
import AdminLogin from '@/auth/AdminLogin/AdminLogin';
import EmailVerification from '@/auth/EmailVerification/EmailVerification';

// Dashboard layout
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout';

// =========================
// ADMIN DASHBOARD
// =========================

import AdminDashboard from '@/dashboard/admin/dashboard/Dashboard';
import AdminUsers from '@/dashboard/admin/users/Users';
import AdminOrganizations from '@/dashboard/admin/organizations/Organizations';
import AdminHelpRequests from '@/dashboard/admin/helpRequests/HelpRequests';
import AdminDonations from '@/dashboard/admin/donations/Donations';
import AdminVolunteers from '@/dashboard/admin/volunteers/Volunteers';
import AdminCampaigns from '@/dashboard/admin/campaigns/Campaigns';
import AdminProfile from '@/dashboard/admin/profile/Profile';
import AdminReports from '@/dashboard/admin/reports/AdminReports';
import AdminSettings from '@/dashboard/admin/settings/Settings';

// =========================
// ORGANIZATION DASHBOARD
// =========================

import OrgDashboard from '@/dashboard/organization/OrgDashboard';
import OrganizationHelpRequests from '@/dashboard/organization/OrgHelpRequests';
import OrganizationCampaigns from '@/dashboard/organization/campaigns/OrgCampaigns';
import OrganizationVolunteers from '@/dashboard/organization/OrgVolunteers';
import OrganizationReports from '@/dashboard/organization/OrgReports';
import OrganizationProfile from '@/dashboard/organization/OrgProfile';
import OrganizationNotifications from '@/dashboard/organization/OrgNotifications';
import OrganizationSettings from '@/dashboard/organization/OrgSettings';

// =========================
// INDIVIDUAL DASHBOARD
// =========================

import IndividualDashboard from '@/dashboard/individual/IndividualDashboard';
import IndividualCampaigns from '@/dashboard/individual/IndividualCampaigns';
import IndividualNotifications from '@/dashboard/individual/IndividualNotifications';
import IndividualProfile from '@/dashboard/individual/IndividualProfile';
import IndividualSettings from '@/dashboard/individual/IndividualSettings';
import MyDonations from '@/dashboard/individual/MyDonations';
import MyHelpRequests from '@/dashboard/individual/myHelpRequests/MyHelpRequests';
import MyVolunteerActivities from '@/dashboard/individual/MyVolunteerActivities';

const router = createBrowserRouter([
    // =====================================================
    // PUBLIC ROUTES
    // =====================================================

    {
        path: '/',
        element: <PublicLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'account',
                element: <AccountSelection />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'how-it-works',
                element: <HowItWorksPage />,
            },

            // CATEGORY PAGE
            {
                path: 'categories',
                element: <Categories />,
            },
            {
                path: 'categories/:categoryId',
                element: <Categories />,
            },

            // CAMPAIGNS
            {
                path: 'campaigns',
                element: <Campaigns />,
            },
            {
                path: 'campaigns/category/:categoryId',
                element: <Campaigns />,
            },
            {
                path: 'campaign/:id',
                element: <CampaignDetails />,
            },

            // DONATE
            {
                path: 'donate',
                element: <DonateHub />,
            },
            {
                path: 'donate/:id',
                element: <Donate />,
            },

            // VOLUNTEER
            {
                path: 'volunteer',
                element: <Volunteer />,
            },

            // REQUEST HELP
            {
                path: 'request-help',
                element: <RequestHelp />,
            },

            // PARTNER
            {
                path: 'partner',
                element: <Partner />,
            },

            // STORIES
            {
                path: 'stories',
                element: <Stories />,
            },
        ],
    },

    // =====================================================
    // ACCOUNT ROUTES
    // =====================================================

    {
        path: '/account',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },

            // {
            //     path: 'forgot-password',
            //     element: <ForgotPassword />,
            // },

            // {
            //     path: 'verify-email',
            //     element: <VerifyEmail />,
            // },
        ],
    },

    // =====================================================
    // EMAIL VERIFICATION
    // =====================================================

    {
        path: '/email-verification',
        element: <EmailVerification />,
    },

    // =====================================================
    // ADMIN AUTHENTICATION
    // =====================================================

    {
        path: '/admin/login',
        element: <AdminLogin />,
    },

    // =====================================================
    // ADMIN DASHBOARD
    // =====================================================

    {
        path: '/admin/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                element: <ProtectedRoute allowedRoles={['admin']} />,
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
                        path: 'profile',
                        element: <AdminProfile />,
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

    // =====================================================
    // INDIVIDUAL DASHBOARD
    // =====================================================

    {
        path: '/individual/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                element: <ProtectedRoute allowedRoles={['individual']} />,
                children: [
                    {
                        index: true,
                        element: <IndividualDashboard />,
                    },
                    {
                        path: 'help-requests',
                        element: <MyHelpRequests />,
                    },
                    {
                        path: 'donations',
                        element: <MyDonations />,
                    },
                    {
                        path: 'volunteer',
                        element: <MyVolunteerActivities />,
                    },
                    {
                        path: 'campaigns',
                        element: <IndividualCampaigns />,
                    },
                    {
                        path: 'notifications',
                        element: <IndividualNotifications />,
                    },
                    {
                        path: 'profile',
                        element: <IndividualProfile />,
                    },
                    {
                        path: 'settings',
                        element: <IndividualSettings />,
                    },
                ],
            },
        ],
    },

    // =====================================================
    // ORGANIZATION DASHBOARD
    // =====================================================

    {
        path: '/organization/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                element: <ProtectedRoute allowedRoles={['organization']} />,
                children: [
                    {
                        index: true,
                        element: <OrgDashboard />,
                    },
                    {
                        path: 'help-requests',
                        element: <OrganizationHelpRequests />,
                    },
                    {
                        path: 'campaigns',
                        element: <OrganizationCampaigns />,
                    },
                    {
                        path: 'volunteers',
                        element: <OrganizationVolunteers />,
                    },
                    {
                        path: 'reports',
                        element: <OrganizationReports />,
                    },
                    {
                        path: 'profile',
                        element: <OrganizationProfile />,
                    },
                    {
                        path: 'notifications',
                        element: <OrganizationNotifications />,
                    },
                    {
                        path: 'settings',
                        element: <OrganizationSettings />,
                    },
                ],
            },
        ],
    },

    // =====================================================
    // 404
    // =====================================================

    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;

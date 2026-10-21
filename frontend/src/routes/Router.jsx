import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import NotFound from '../pages/NotFound';

// =========================
// LAYOUTS
// =========================

import PublicLayout from '@/layouts/PublicLayout/PublicLayout';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout';

// =========================
// PUBLIC PAGES
// =========================

import Home from '@/pages/public/home/Home';
import HowItWorksPage from '@/pages/public/howItWorksPage/HowItWorksPage';
import Categories from '@/pages/public/categoriesPage/CategoriesPage';
import Campaigns from '@/pages/public/campaignsPage/Campaigns';
import FeaturedCampaigns from '@/pages/public/campaignsPage/featuredCampaigns/FeaturedCampaigns';
import UrgentCampaigns from '@/pages/public/campaignsPage/urgentCampaigns/UrgentCampaigns';
import CampaignDetails from '@/pages/public/campaignsPage/campaignDetails/CampaignDetails';
import Donate from '@/pages/public/donationPage/Donate';
import DonateHub from '@/pages/public/donationPage/DonateHub/DonateHub';
import PaymentResult from '@/pages/public/donationPage/PaymentResult';
import Volunteer from '@/pages/public/volunteerPage/Volunteer';
import RequestHelp from '@/pages/public/requestHelpPage/RequestHelp';
import Organizations from '@/pages/public/OrganizationsPage/Organizations';
import About from '@/pages/public/about/About';
import Mission from '@/pages/public/about/mission/Mission';
import Story from '@/pages/public/about/story/Story';
import Team from '@/pages/public/about/team/Team';
import Impact from '@/pages/public/about/impact/Impact';
import Report from '@/pages/public/about/report/Report';
import TrustSafety from '@/pages/public/about/trustSafety/TrustSafety';
import Community from '@/pages/public/communityPage/Community';

// =========================
// AUTHENTICATION
// =========================

import Login from '@/auth/Login/Login';
import Register from '@/auth/Register/Register';
import AdminLogin from '@/auth/AdminLogin/AdminLogin';
import EmailVerification from '@/auth/EmailVerification/EmailVerification';
import ResetPassword from '@/auth/ResetPassword/ResetPassword';
import ForgotPassword from '@/auth/ForgotPassword/ForgotPassword';

// =========================
// ADMIN DASHBOARD
// =========================

import AdminDashboard from '@/dashboard/admin/dashboard/Dashboard';

// Admin Users
import AdminUsers from '@/dashboard/admin/users/Users';
import AdminAddUser from '@/dashboard/admin/users/AddUser';
import AdminUserDetails from '@/dashboard/admin/users/UserDetails';

// Admin Organizations
import AdminOrganizations from '@/dashboard/admin/organizations/Organizations';
import AdminAddOrganization from '@/dashboard/admin/organizations/AddOrganization';
import AdminOrganizationsDetails from '@/dashboard/admin/organizations/OrganizationDetails';

// Admin Volunteers
import AdminVolunteers from '@/dashboard/admin/volunteers/Volunteers';
import AdminVolunteerRequests from '@/dashboard/admin/volunteers/VolunteerRequests';
import AdminVolunteerDetails from '@/dashboard/admin/volunteers/VolunteerDetails';

// Admin Help Requests
import AdminHelpRequests from '@/dashboard/admin/helpRequests/HelpRequests';
import AdminHelpRequestDetails from '@/dashboard/admin/helpRequests/HelpRequestDetails';

// Other Admin Pages
import AdminDonations from '@/dashboard/admin/donations/Donations';
import AdminCampaigns from '@/dashboard/admin/campaigns/Campaigns';
import AdminCampaignDetails from '@/dashboard/admin/campaigns/CampaignDetails';
import AdminProfile from '@/dashboard/admin/profile/Profile';
import AdminSettings from '@/dashboard/admin/settings/Settings';

// =========================
// ORGANIZATION DASHBOARD
// =========================

import OrgDashboard from '@/dashboard/organization/dashboard/OrgDashboard';
import OrganizationHelpRequests from '@/dashboard/organization/helpRequests/OrgHelpRequests';
import OrganizationCampaigns from '@/dashboard/organization/campaigns/OrgCampaigns';
import OrganizationVolunteers from '@/dashboard/organization/volunteers/OrgVolunteers';
import OrganizationReports from '@/dashboard/organization/reports/OrgReports';
import OrganizationProfile from '@/dashboard/organization/profile/OrgProfile';
import OrganizationNotifications from '@/dashboard/organization/notification/OrgNotifications';
import OrganizationSettings from '@/dashboard/organization/settings/OrgSettings';

// =========================
// INDIVIDUAL DASHBOARD
// =========================

import IndividualDashboard from '@/dashboard/individual/dashboard/IndividualDashboard';
import IndividualCampaigns from '@/dashboard/individual/campaigns/IndividualCampaigns';
import IndividualNotifications from '@/dashboard/individual/notifications/IndividualNotifications';
import IndividualProfile from '@/dashboard/individual/profile/IndividualProfile';
import IndividualSettings from '@/dashboard/individual/settings/IndividualSettings';
import MyDonations from '@/dashboard/individual/myDonations/MyDonations';
import MyHelpRequests from '@/dashboard/individual/myHelpRequests/MyHelpRequests';
import MyVolunteerActivities from '@/dashboard/individual/myVolunteerActivities/MyVolunteerActivities';

// =========================
// ROUTER CONFIGURATION
// =========================

const router = createBrowserRouter([
    // ==========================================
    // PUBLIC ROUTES
    // ==========================================
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'how-it-works',
                element: <HowItWorksPage />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'about/mission',
                element: <Mission />,
            },
            {
                path: 'about/story',
                element: <Story />,
            },
            {
                path: 'about/team',
                element: <Team />,
            },
            {
                path: 'about/impact',
                element: <Impact />,
            },
            {
                path: 'about/reports',
                element: <Report />,
            },
            {
                path: 'about/trust-safety',
                element: <TrustSafety />,
            },

            // Categories
            {
                path: 'categories',
                element: <Categories />,
            },
            {
                path: 'categories/:categoryId',
                element: <Categories />,
            },

            // Campaigns
            {
                path: 'campaigns',
                element: <Campaigns />,
            },
            {
                path: 'campaigns/category/:categoryId',
                element: <Campaigns />,
            },
            {
                path: 'campaigns/featured',
                element: <FeaturedCampaigns />,
            },
            {
                path: 'campaigns/urgent',
                element: <UrgentCampaigns />,
            },
            {
                path: 'campaign/:id',
                element: <CampaignDetails />,
            },

            // Donations
            {
                path: 'donate',
                element: <DonateHub />,
            },
            {
                path: 'donate/:id',
                element: <Donate />,
            },
            {
                path: 'donation/payment-result',
                element: <PaymentResult />,
            },

            // Volunteer
            {
                path: 'volunteer',
                element: <Volunteer />,
            },

            // Request Help
            {
                path: 'request-help',
                element: <RequestHelp />,
            },

            // Organizations
            {
                path: 'organizations',
                element: <Organizations />,
            },

            // Community
            {
                path: 'community',
                element: <Community />,
            },
        ],
    },

    // ==========================================
    // AUTHENTICATION ROUTES
    // ==========================================
    {
        path: '/login',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Login />,
            },
        ],
    },
    {
        path: '/register',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Register />,
            },
        ],
    },
    {
        path: '/email-verification',
        element: <EmailVerification />,
    },
    {
        path: '/reset-password',
        element: <ResetPassword />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/admin/login',
        element: <AdminLogin />,
    },

    // ==========================================
    // ADMIN DASHBOARD ROUTES
    // ==========================================
    {
        path: '/admin/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                element: <ProtectedRoute allowedRoles={['admin']} />,
                children: [
                    // Dashboard Overview
                    {
                        index: true,
                        element: <AdminDashboard />,
                    },

                    // ==========================
                    // ADMIN USERS
                    // ==========================
                    {
                        path: 'users',
                        element: <AdminUsers />,
                    },
                    {
                        path: 'users/add',
                        element: <AdminAddUser />,
                    },
                    {
                        path: 'users/:userId',
                        element: <AdminUserDetails />,
                    },
                    {
                        path: 'users/:userId/edit',
                        element: <AdminUserDetails />,
                    },

                    // ==========================
                    // ADMIN ORGANIZATIONS
                    // ==========================
                    {
                        path: 'organizations',
                        element: <AdminOrganizations />,
                    },
                    {
                        path: 'organizations/add',
                        element: <AdminAddOrganization />,
                    },
                    {
                        path: 'organizations/:organizationId',
                        element: <AdminOrganizationsDetails />,
                    },
                    {
                        path: 'organizations/:organizationId/edit',
                        element: <AdminOrganizationsDetails />,
                    },

                    // ==========================
                    // ADMIN VOLUNTEERS
                    // ==========================
                    {
                        path: 'volunteers',
                        element: <AdminVolunteers />,
                    },
                    {
                        path: 'volunteers/requests',
                        element: <AdminVolunteerRequests />,
                    },
                    {
                        path: 'volunteers/:volunteerId',
                        element: <AdminVolunteerDetails />,
                    },

                    // ==========================
                    // ADMIN HELP REQUESTS
                    // ==========================

                    // All Help Requests
                    {
                        path: 'help-requests',
                        element: <AdminHelpRequests />,
                    },

                    // View Help Request
                    {
                        path: 'help-requests/:requestId',
                        element: <AdminHelpRequestDetails />,
                    },

                    // Edit Help Request
                    {
                        path: 'help-requests/:requestId/edit',
                        element: <AdminHelpRequestDetails />,
                    },

                    // ==========================
                    // ADMIN DONATIONS
                    // ==========================
                    {
                        path: 'donations',
                        element: <AdminDonations />,
                    },

                    // ==========================
                    // ADMIN CAMPAIGNS
                    // ==========================
                    {
                        path: 'campaigns',
                        element: <AdminCampaigns />,
                    },
                    {
                        path: 'campaigns/:id',
                        element: <AdminCampaignDetails />,
                    },

                    // ==========================
                    // ADMIN PROFILE & SETTINGS
                    // ==========================
                    {
                        path: 'profile',
                        element: <AdminProfile />,
                    },
                    {
                        path: 'settings',
                        element: <AdminSettings />,
                    },
                ],
            },
        ],
    },

    // ==========================================
    // INDIVIDUAL DASHBOARD ROUTES
    // ==========================================
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
                        path: 'donation/payment-result',
                        element: <PaymentResult />,
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

    // ==========================================
    // ORGANIZATION DASHBOARD ROUTES
    // ==========================================
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

    // ==========================================
    // 404 NOT FOUND
    // ==========================================
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;

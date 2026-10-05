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

// Account pages
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import Login from '@/auth/Login/Login';
import Register from '@/auth/Register/Register';
import AdminLogin from '@/auth/AdminLogin/AdminLogin';
import EmailVerification from '@/auth/EmailVerification/EmailVerification';
import ResetPassword from '@/auth/ResetPassword/ResetPassword';
import ForgotPassword from '@/auth/ForgotPassword/ForgotPassword';

// Dashboard layout
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout';

// =========================
// ADMIN DASHBOARD
// =========================

import AdminDashboard from '@/dashboard/admin/dashboard/Dashboard';

// admin users routes
import AdminUsers from '@/dashboard/admin/users/Users';
import AdminAddUser from '@/dashboard/admin/users/AddUser';
import AdminUserDetails from '@/dashboard/admin/users/UserDetails';

// admin organizations routes
import AdminOrganizations from '@/dashboard/admin/organizations/Organizations';
import AdminAddOrganization from '@/dashboard/admin/organizations/AddOrganization';
import AdminOrganizationsDetails from '@/dashboard/admin/organizations/OrganizationDetails';

import AdminHelpRequests from '@/dashboard/admin/helpRequests/HelpRequests';
import AdminDonations from '@/dashboard/admin/donations/Donations';
import AdminVolunteers from '@/dashboard/admin/volunteers/Volunteers';
import AdminCampaigns from '@/dashboard/admin/campaigns/Campaigns';
import AdminCampaignDetails from '@/dashboard/admin/campaigns/CampaignDetails';
import AdminProfile from '@/dashboard/admin/profile/Profile';
// import AdminReports from "@/dashboard/admin/reports/AdminReports";
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

            // DONATE
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
                path: 'organizations',
                element: <Organizations />,
            },

            // COMMUNITY
            {
                path: 'community',
                element: <Community />,
            },
        ],
    },

    // =====================================================
    // ACCOUNT ROUTES
    // =====================================================

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

    // =====================================================
    // EMAIL VERIFICATION
    // =====================================================

    {
        path: '/email-verification',
        element: <EmailVerification />,
    },

    // =====================================================
    // PASSWORD RESET
    // =====================================================

    {
        path: '/reset-password',
        element: <ResetPassword />,
    },

    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    {
        path: '/forgot-password',
        element: <ForgotPassword />,
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

                    // admin users routes
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
                    // ========================

                    // admin organizations routes
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
                    // ========================

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
                        path: 'campaigns/:id',
                        element: <AdminCampaignDetails />,
                    },
                    {
                        path: 'profile',
                        element: <AdminProfile />,
                    },
                    // {
                    //   path: "reports",
                    //   element: <AdminReports />,
                    // },
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

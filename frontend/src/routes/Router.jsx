import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import NotFound from '../pages/NotFound';

// Layouts
import PublicLayout from '@/layouts/PublicLayout/PublicLayout';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout';

// Public pages
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
import PrivacyPolicyPage from '@/pages/public/legal/PrivacyPolicyPage';
import AccessibilityPage from '@/pages/public/legal/AccessibilityPage';
import TermsPage from '@/pages/public/legal/TermsPage';
import ContactPage from '@/pages/public/contactPage/ContactPage';

// Authentication
import Login from '@/auth/Login/Login';
import Register from '@/auth/Register/Register';
import AdminLogin from '@/auth/AdminLogin/AdminLogin';
import EmailVerification from '@/auth/EmailVerification/EmailVerification';
import ResetPassword from '@/auth/ResetPassword/ResetPassword';
import ForgotPassword from '@/auth/ForgotPassword/ForgotPassword';

// Admin dashboard
import AdminDashboard from '@/dashboard/admin/dashboard/Dashboard';

// Admin users
import AdminUsers from '@/dashboard/admin/users/Users';
import AdminAddUser from '@/dashboard/admin/users/AddUser';
import AdminUserDetails from '@/dashboard/admin/users/UserDetails';

// Admin organizations
import AdminOrganizations from '@/dashboard/admin/organizations/Organizations';
import AdminAddOrganization from '@/dashboard/admin/organizations/AddOrganization';
import AdminOrganizationsDetails from '@/dashboard/admin/organizations/OrganizationDetails';

// Admin volunteers
import AdminVolunteers from '@/dashboard/admin/volunteers/Volunteers';
import AdminVolunteerRequests from '@/dashboard/admin/volunteers/VolunteerRequests';
import AdminVolunteerDetails from '@/dashboard/admin/volunteers/VolunteerDetails';

// Admin help requests
import AdminHelpRequests from '@/dashboard/admin/helpRequests/HelpRequests';
import AdminHelpRequestDetails from '@/dashboard/admin/helpRequests/HelpRequestDetails';

// Admin donations
import AdminDonations from '@/dashboard/admin/donations/Donations';
import AdminDonationDetails from '@/dashboard/admin/donations/DonationDetails';

// Admin campaigns
import AdminCampaigns from '@/dashboard/admin/campaigns/Campaigns';
import AdminAddCampaign from '@/dashboard/admin/campaigns/AddCampaign';
import AdminCampaignDetails from '@/dashboard/admin/campaigns/CampaignDetails';
import AdminEditCampaign from '@/dashboard/admin/campaigns/EditCampaign';

// Admin contact messages
import AdminContactMessages from '@/dashboard/admin/contactMessages/ContactMessages';
import AdminContactMessageDetails from '@/dashboard/admin/contactMessages/ContactMessageDetails';

// Other admin pages
import AdminProfile from '@/dashboard/admin/profile/Profile';
import AdminSecurity from '@/dashboard/admin/security/Security';
import AdminSettings from '@/dashboard/admin/settings/Settings';
import AdminNotifications from '@/dashboard/admin/notifications/Notifications';

// Organization dashboard
import OrgDashboard from '@/dashboard/organization/dashboard/OrgDashboard';
import OrganizationHelpRequests from '@/dashboard/organization/helpRequests/OrgHelpRequests';
import OrganizationCampaigns from '@/dashboard/organization/campaigns/OrgCampaigns';
import OrganizationAddCampaign from '@/dashboard/organization/campaigns/AddCampaign';
import OrganizationCampaignDetails from '@/dashboard/organization/campaigns/CampaignDetails';
import OrganizationEditCampaign from '@/dashboard/organization/campaigns/CampaignEdit';
import OrganizationVolunteers from '@/dashboard/organization/volunteers/OrgVolunteers';
import OrganizationReports from '@/dashboard/organization/reports/OrgReports';
import OrganizationProfile from '@/dashboard/organization/profile/OrgProfile';
import OrganizationNotifications from '@/dashboard/organization/notification/OrgNotifications';
import OrganizationSettings from '@/dashboard/organization/settings/OrgSettings';

// Individual dashboard
import IndividualDashboard from '@/dashboard/individual/dashboard/IndividualDashboard';
import IndividualCampaigns from '@/dashboard/individual/campaigns/IndividualCampaigns';
import IndividualCampaignDetails from '@/dashboard/individual/campaigns/components/CampaignDetails';
import IndividualNotifications from '@/dashboard/individual/notifications/IndividualNotifications';
import IndividualProfile from '@/dashboard/individual/profile/IndividualProfile';
import IndividualSettings from '@/dashboard/individual/settings/IndividualSettings';
import MyDonations from '@/dashboard/individual/myDonations/MyDonations';
import MyHelpRequests from '@/dashboard/individual/myHelpRequests/MyHelpRequests';
import HelpRequestDetails from '@/dashboard/individual/myHelpRequests/HelpRequestDetails';
import HelpRequestEdit from '@/dashboard/individual/myHelpRequests/HelpRequestEdit';
import MyVolunteerActivities from '@/dashboard/individual/myVolunteerActivities/MyVolunteerActivities';

// Shared help page
import HelpPage from '@/pages/help/HelpPage';

const router = createBrowserRouter([
    // PUBLIC ROUTES
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'how-it-works', element: <HowItWorksPage /> },

            { path: 'about', element: <About /> },
            { path: 'about/mission', element: <Mission /> },
            { path: 'about/story', element: <Story /> },
            { path: 'about/team', element: <Team /> },
            { path: 'about/impact', element: <Impact /> },
            { path: 'about/reports', element: <Report /> },
            { path: 'about/trust-safety', element: <TrustSafety /> },

            { path: 'categories', element: <Categories /> },
            { path: 'categories/:categoryId', element: <Categories /> },

            { path: 'campaigns', element: <Campaigns /> },
            { path: 'campaigns/category/:categoryId', element: <Campaigns /> },
            { path: 'campaigns/featured', element: <FeaturedCampaigns /> },
            { path: 'campaigns/urgent', element: <UrgentCampaigns /> },
            { path: 'campaign/:id', element: <CampaignDetails /> },

            { path: 'donate', element: <DonateHub /> },
            { path: 'donate/:id', element: <Donate /> },
            { path: 'donation/payment-result', element: <PaymentResult /> },

            { path: 'volunteer', element: <Volunteer /> },
            { path: 'request-help', element: <RequestHelp /> },
            { path: 'organizations', element: <Organizations /> },
            { path: 'community', element: <Community /> },
            { path: 'help', element: <HelpPage /> },

            { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
            { path: 'terms', element: <TermsPage /> },
            { path: 'accessibility', element: <AccessibilityPage /> },
            { path: 'contact', element: <ContactPage /> },
        ],
    },

    // AUTHENTICATION ROUTES
    {
        path: '/login',
        element: <AuthLayout />,
        children: [{ index: true, element: <Login /> }],
    },
    {
        path: '/register',
        element: <AuthLayout />,
        children: [{ index: true, element: <Register /> }],
    },
    { path: '/email-verification', element: <EmailVerification /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/admin/login', element: <AdminLogin /> },

    // ADMIN DASHBOARD ROUTES
    {
        path: '/admin/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                element: <ProtectedRoute allowedRoles={['admin']} />,
                children: [
                    { index: true, element: <AdminDashboard /> },

                    // Users
                    { path: 'users', element: <AdminUsers /> },
                    { path: 'users/add', element: <AdminAddUser /> },
                    { path: 'users/:userId', element: <AdminUserDetails /> },
                    {
                        path: 'users/:userId/edit',
                        element: <AdminUserDetails />,
                    },

                    // Organizations
                    { path: 'organizations', element: <AdminOrganizations /> },
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

                    // Volunteers
                    { path: 'volunteers', element: <AdminVolunteers /> },
                    {
                        path: 'volunteers/requests',
                        element: <AdminVolunteerRequests />,
                    },
                    {
                        path: 'volunteers/:volunteerId',
                        element: <AdminVolunteerDetails />,
                    },

                    // Help requests
                    { path: 'help-requests', element: <AdminHelpRequests /> },
                    {
                        path: 'help-requests/:requestId',
                        element: <AdminHelpRequestDetails />,
                    },
                    {
                        path: 'help-requests/:requestId/edit',
                        element: <AdminHelpRequestDetails />,
                    },

                    // Donations
                    { path: 'donations', element: <AdminDonations /> },
                    {
                        path: 'donations/:donationId',
                        element: <AdminDonationDetails />,
                    },

                    // Campaigns
                    { path: 'campaigns', element: <AdminCampaigns /> },
                    { path: 'campaigns/add', element: <AdminAddCampaign /> },
                    {
                        path: 'campaigns/:id',
                        element: <AdminCampaignDetails />,
                    },
                    {
                        path: 'campaigns/:id/edit',
                        element: <AdminEditCampaign />,
                    },

                    // Profile and settings
                    { path: 'profile', element: <AdminProfile /> },
                    { path: 'profile/edit', element: <AdminProfile /> },
                    { path: 'security', element: <AdminSecurity /> },
                    { path: 'settings', element: <AdminSettings /> },

                    // Contact messages
                    {
                        path: 'contact-messages',
                        element: <AdminContactMessages />,
                    },
                    {
                        path: 'contact-messages/:messageId',
                        element: <AdminContactMessageDetails />,
                    },

                    // Help and notifications
                    { path: 'help', element: <HelpPage /> },
                    { path: 'notifications', element: <AdminNotifications /> },
                ],
            },
        ],
    },

    // INDIVIDUAL DASHBOARD ROUTES
    {
        path: '/individual/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                element: <ProtectedRoute allowedRoles={['individual']} />,
                children: [
                    { index: true, element: <IndividualDashboard /> },

                    // Individual help requests
                    { path: 'help-requests', element: <MyHelpRequests /> },
                    {
                        path: 'help-requests/:requestId',
                        element: <HelpRequestDetails />,
                    },
                    {
                        path: 'help-requests/:requestId/edit',
                        element: <HelpRequestEdit />,
                    },

                    // Donations
                    { path: 'donations', element: <MyDonations /> },
                    {
                        path: 'donation/payment-result',
                        element: <PaymentResult />,
                    },

                    // Volunteer activities
                    {
                        path: 'volunteer',
                        element: <MyVolunteerActivities />,
                    },

                    // Campaigns
                    {
                        path: 'campaigns',
                        element: <IndividualCampaigns />,
                    },
                    {
                        path: 'campaigns/:id',
                        element: <IndividualCampaignDetails />,
                    },

                    // Account
                    {
                        path: 'notifications',
                        element: <IndividualNotifications />,
                    },
                    { path: 'profile', element: <IndividualProfile /> },
                    { path: 'profile/edit', element: <IndividualProfile /> },
                    { path: 'security', element: <AdminSecurity /> },
                    { path: 'settings', element: <IndividualSettings /> },
                    { path: 'help', element: <HelpPage /> },
                ],
            },
        ],
    },

    // ORGANIZATION DASHBOARD ROUTES
    {
        path: '/organization/dashboard',
        element: <DashboardLayout />,
        children: [
            {
                element: <ProtectedRoute allowedRoles={['organization']} />,
                children: [
                    { index: true, element: <OrgDashboard /> },

                    // Help requests
                    {
                        path: 'help-requests',
                        element: <OrganizationHelpRequests />,
                    },

                    // Campaigns
                    {
                        path: 'campaigns',
                        element: <OrganizationCampaigns />,
                    },
                    {
                        path: 'campaigns/add',
                        element: <OrganizationAddCampaign />,
                    },
                    {
                        path: 'campaigns/:id',
                        element: <OrganizationCampaignDetails />,
                    },
                    {
                        path: 'campaigns/:id/edit',
                        element: <OrganizationEditCampaign />,
                    },

                    // Volunteers and reports
                    {
                        path: 'volunteers',
                        element: <OrganizationVolunteers />,
                    },
                    {
                        path: 'reports',
                        element: <OrganizationReports />,
                    },

                    // Profile and settings
                    {
                        path: 'profile',
                        element: <OrganizationProfile />,
                    },
                    {
                        path: 'profile/edit',
                        element: <OrganizationProfile />,
                    },
                    { path: 'security', element: <AdminSecurity /> },
                    {
                        path: 'notifications',
                        element: <OrganizationNotifications />,
                    },
                    {
                        path: 'settings',
                        element: <OrganizationSettings />,
                    },
                    { path: 'help', element: <HelpPage /> },
                ],
            },
        ],
    },

    // NOT FOUND
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;

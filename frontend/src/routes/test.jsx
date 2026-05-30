import { createBrowserRouter } from 'react-router-dom';

// layouts
import PublicLayout from '../layouts/PublicLayout/PublicLayout';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';

// public pages
import Home from '../pages/public/Home';

// Get Started
import Donate from '../pages/public/Donate';
import Volunteer from '../pages/public/Volunteer';
import Partner from '../pages/public/Partner';
import RequestHelp from '../pages/public/RequestHelp';
import HowItWorks from '../pages/public/HowItWorks';

// Explore
import Campaigns from '../pages/public/Campaigns';
import FeaturedCampaigns from '../pages/public/FeaturedCampaigns';
import UrgentCampaigns from '../pages/public/UrgentCampaigns';
import Categories from '../pages/public/Categories';
import Stories from '../pages/public/Stories';

// Trust
import Impact from '../pages/public/Impact';
import Reports from '../pages/public/Reports';
import TrustSafety from '../pages/public/TrustSafety';

// About sub-pages
import Mission from '../pages/public/about/Mission';
import Story from '../pages/public/about/Story';
import Team from '../pages/public/about/Team';

// general
import Contact from '../pages/public/contact/Contact';
import Login from '../pages/public/Login/Login';

// 404
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            // home
            { path: '', element: <Home /> },

            // ======================
            // GET STARTED
            // ======================
            { path: 'donate', element: <Donate /> },
            { path: 'volunteer', element: <Volunteer /> },
            { path: 'partner', element: <Partner /> },
            { path: 'request-help', element: <RequestHelp /> },
            { path: 'how-it-works', element: <HowItWorks /> },

            // ======================
            // EXPLORE
            // ======================
            { path: 'campaigns', element: <Campaigns /> },
            { path: 'campaigns/featured', element: <FeaturedCampaigns /> },
            { path: 'campaigns/urgent', element: <UrgentCampaigns /> },
            { path: 'categories', element: <Categories /> },
            { path: 'stories', element: <Stories /> },

            // ======================
            // TRUST
            // ======================
            { path: 'impact', element: <Impact /> },
            { path: 'reports', element: <Reports /> },
            { path: 'trust-safety', element: <TrustSafety /> },

            // ======================
            // ABOUT
            // ======================
            { path: 'about/mission', element: <Mission /> },
            { path: 'about/story', element: <Story /> },
            { path: 'about/team', element: <Team /> },

            // general
            { path: 'contact', element: <Contact /> },
            { path: 'login', element: <Login /> },
        ],
    },

    // admin
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { path: '', element: <Home /> }, // placeholder
        ],
    },

    // 404
    {
        path: '*',
        element: <NotFound />,
    },
]);

export default router;

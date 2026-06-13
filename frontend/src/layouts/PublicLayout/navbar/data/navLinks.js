const navLinks = [
    {
        id: 'home',
        name: 'Home',
        path: '/',
        type: 'single',
    },

    {
        id: 'get-involved',
        name: 'Get Involved',
        type: 'mega',

        preview: {
            title: 'Get Involved',
            desc: 'Join hands to support people in need through donation, volunteering, and partnerships.',
            highlight: 'Become part of real-world humanitarian action',
            image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
            cta: '/donate',
        },

        groups: [
            {
                title: 'Action',
                items: [
                    {
                        id: 'donate',
                        name: 'Donate',
                        desc: 'Support verified people in need.',
                        path: '/donate',
                    },
                    {
                        id: 'volunteer',
                        name: 'Volunteer',
                        desc: 'Join field and community support.',
                        path: '/volunteer',
                    },
                    {
                        id: 'partner',
                        name: 'Partner With Us',
                        desc: 'Work with organizations & sponsors.',
                        path: '/partner',
                    },
                ],
            },

            {
                title: 'Support Requests',
                items: [
                    {
                        id: 'request-help',
                        name: 'Request Help',
                        desc: 'Submit urgent or basic needs.',
                        path: '/request-help',
                    },
                    {
                        id: 'how-it-works',
                        name: 'How It Works',
                        desc: 'Understand how support is delivered.',
                        path: '/how-it-works',
                    },
                ],
            },
        ],
    },

    {
        id: 'explore',
        name: 'Explore',
        type: 'mega',

        preview: {
            title: 'Explore Impact',
            desc: 'Discover campaigns, urgent needs, and real transformation stories.',
            highlight: 'See real humanitarian impact',
            image: 'https://images.unsplash.com/photo-1520975922284-9b456ef0d6e1?auto=format&fit=crop&w=1200&q=80',
            cta: '/campaigns',
        },

        groups: [
            {
                title: 'Campaigns',
                items: [
                    {
                        id: 'browse-campaigns',
                        name: 'All Campaigns',
                        desc: 'Browse active donation campaigns.',
                        path: '/campaigns',
                    },
                    {
                        id: 'featured',
                        name: 'Featured',
                        desc: 'Highlighted urgent campaigns.',
                        path: '/campaigns/featured',
                    },
                    {
                        id: 'urgent',
                        name: 'Urgent Needs',
                        desc: 'Critical real-time support requests.',
                        path: '/campaigns/urgent',
                    },
                ],
            },

            {
                title: 'Discover',
                items: [
                    {
                        id: 'categories',
                        name: 'Categories',
                        desc: 'Food, education, health & more.',
                        path: '/categories',
                    },
                    {
                        id: 'stories',
                        name: 'Impact Stories',
                        desc: 'Real lives changed by donations.',
                        path: '/stories',
                    },
                ],
            },
        ],
    },

    {
        id: 'about',
        name: 'About',
        type: 'mega',

        preview: {
            title: 'About Stand For People',
            desc: 'Learn about our mission, transparency, and the people behind the platform.',
            highlight: 'Built on trust & transparency',
            image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
            cta: '/about',
        },

        groups: [
            {
                title: 'Organization',
                items: [
                    {
                        id: 'overview',
                        name: 'Overview',
                        desc: 'What Stand For People is about.',
                        path: '/about',
                    },
                    {
                        id: 'mission',
                        name: 'Mission',
                        desc: 'Why we exist and our goals.',
                        path: '/about/mission',
                    },
                    {
                        id: 'story',
                        name: 'Our Story',
                        desc: 'How the platform started.',
                        path: '/about/story',
                    },
                    {
                        id: 'team',
                        name: 'Team',
                        desc: 'People behind the platform.',
                        path: '/about/team',
                    },
                ],
            },

            {
                title: 'Transparency',
                items: [
                    {
                        id: 'impact',
                        name: 'Impact',
                        desc: 'Live stats of platform support.',
                        path: '/impact',
                    },
                    {
                        id: 'reports',
                        name: 'Reports',
                        desc: 'Financial & activity transparency.',
                        path: '/reports',
                    },
                    {
                        id: 'safety',
                        name: 'Trust & Safety',
                        desc: 'Fraud prevention & verification.',
                        path: '/trust-safety',
                    },
                ],
            },
        ],
    },

    {
        id: 'account',
        name: 'Account',
        type: 'single',
        path: '/login',
    },
];

export default navLinks;
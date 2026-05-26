const navLinks = [
    {
        id: 'home',
        name: 'Home',
        path: '/',
        type: 'single',
    },

    {
        id: 'get-started',
        name: 'Get Started',
        type: 'mega',

        groups: [
            {
                title: 'Take Action',
                items: [
                    {
                        id: 'donate',
                        name: 'Donate Now',
                        desc: 'Support verified campaigns instantly.',
                        path: '/donate',
                    },
                    {
                        id: 'volunteer',
                        name: 'Become a Volunteer',
                        desc: 'Join relief and support activities.',
                        path: '/volunteer',
                    },
                    {
                        id: 'partner',
                        name: 'Partner With CareLink',
                        desc: 'Collaborate as an organization or sponsor.',
                        path: '/partner',
                    },
                ],
            },

            {
                title: 'Get Help',
                items: [
                    {
                        id: 'request-help',
                        name: 'Request Help',
                        desc: 'Submit emergency or support requests.',
                        path: '/request-help',
                    },
                    {
                        id: 'how-it-works',
                        name: 'How It Works',
                        desc: 'Understand how CareLink processes requests.',
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

        groups: [
            {
                title: 'Campaigns',
                items: [
                    {
                        id: 'browse-campaigns',
                        name: 'Browse Campaigns',
                        desc: 'Explore active campaigns and causes.',
                        path: '/campaigns',
                    },
                    {
                        id: 'featured',
                        name: 'Featured Causes',
                        desc: 'Highlighted campaigns needing attention.',
                        path: '/campaigns/featured',
                    },
                    {
                        id: 'urgent',
                        name: 'Urgent Needs',
                        desc: 'Emergency support requests and relief.',
                        path: '/campaigns/urgent',
                    },
                ],
            },

            {
                title: 'Discover',
                items: [
                    {
                        id: 'categories',
                        name: 'Browse Categories',
                        desc: 'Food, medicine, education, emergency and more.',
                        path: '/categories',
                    },
                    {
                        id: 'stories',
                        name: 'Success Stories',
                        desc: 'See how donations changed lives.',
                        path: '/stories',
                    },
                ],
            },
        ],
    },

    {
        id: 'trust',
        name: 'Trust',
        type: 'mega',

        groups: [

            {
                title: 'About CareLink',
                items: [
                    {
                        id: 'about',
                        name: 'Overview',
                        desc: 'Who we are and what CareLink stands for.',
                        path: '/about',
                    },
                    {
                        id: 'mission',
                        name: 'Our Mission',
                        desc: 'Why CareLink exists and what drives us.',
                        path: '/about/mission',
                    },
                    {
                        id: 'story',
                        name: 'Our Story',
                        desc: 'Journey behind CareLink.',
                        path: '/about/story',
                    },
                    {
                        id: 'team',
                        name: 'Our Team',
                        desc: 'Meet the people behind the platform.',
                        path: '/about/team',
                    },
                    {
                        id: 'contact',
                        name: 'Contact Us',
                        desc: 'Reach out to the CareLink team.',
                        path: '/contact',
                    },
                ],
            },

            {
                title: 'Transparency',
                items: [
                    {
                        id: 'impact',
                        name: 'Impact Statistics',
                        desc: 'Live data and platform impact metrics.',
                        path: '/impact',
                    },
                    {
                        id: 'reports',
                        name: 'Reports & Transparency',
                        desc: 'Track platform accountability and reports.',
                        path: '/reports',
                    },
                    {
                        id: 'safety',
                        name: 'Trust & Safety',
                        desc: 'Fraud prevention and verification system.',
                        path: '/trust-safety',
                    },
                ],
            },
        ],
    },
];

export default navLinks;
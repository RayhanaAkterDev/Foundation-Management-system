const navLinks = [
    {
        id: 1,
        name: 'Home',
        path: '/',
    },

    {
        id: 2,
        name: 'Campaigns',
        path: '/campaigns',
        children: [
            {
                id: 21,
                name: 'All Campaigns',
                path: '/campaigns',
            },
            {
                id: 22,
                name: 'Emergency Relief',
                path: '/campaigns/emergency-relief',
            },
            {
                id: 23,
                name: 'Medical Aid',
                path: '/campaigns/medical-aid',
            },
            {
                id: 24,
                name: 'Food Support',
                path: '/campaigns/food-support',
            },
        ],
    },

    {
        id: 3,
        name: 'Request Help',
        path: '/request-help',
    },

    {
        id: 4,
        name: 'Volunteer',
        path: '/volunteer',
        children: [
            {
                id: 41,
                name: 'Join as Volunteer',
                path: '/volunteer/join',
            },
            {
                id: 42,
                name: 'Volunteer Opportunities',
                path: '/volunteer/opportunities',
            },
        ],
    },

    {
        id: 5,
        name: 'About',
        path: '/about',
        children: [
            {
                id: 51,
                name: 'Our Mission',
                path: '/about/mission',
            },
            {
                id: 52,
                name: 'Impact Stories',
                path: '/about/impact-stories',
            },
        ],
    },

    {
        id: 6,
        name: 'Contact',
        path: '/contact',
    },
];

export default navLinks;
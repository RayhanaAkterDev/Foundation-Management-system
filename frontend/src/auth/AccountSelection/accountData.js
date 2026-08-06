import { Building2, UserRound } from 'lucide-react';

export const accountData = [
    {
        id: 'individual',
        title: 'Individual',
        icon: UserRound,
        color: 'primary',

        audience:
            'People seeking support, donating to meaningful causes, or volunteering within their communities.',

        description:
            'Access a personalized dashboard where you can request assistance, contribute to verified campaigns, volunteer for local initiatives, and stay connected with the impact you create.',

        features: [
            'Request financial, medical, or emergency assistance',
            'Donate to verified fundraising campaigns',
            'Join volunteer opportunities near you',
            'Track your requests, donations, and volunteer activities',
        ],

        buttonText: 'Continue as Individual',

        path: '/account/login?role=individual',
    },

    {
        id: 'ngo',
        title: 'NGO / Organization',
        icon: Building2,
        color: 'accent',

        audience:
            'Registered NGOs, charities, foundations, community organizations, and social impact initiatives.',

        description:
            "Manage campaigns, respond to verified requests, coordinate volunteers, and monitor your organization's impact through a centralized dashboard designed for social good.",

        features: [
            'Create and manage fundraising campaigns',
            'Review and respond to verified support requests',
            'Coordinate volunteers and community activities',
            'Monitor donations, reports, and impact analytics',
        ],

        buttonText: 'Continue as Organization',

        path: '/account/login?role=ngo',
    },
];
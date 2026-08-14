import { Building2, UserRound } from 'lucide-react';

export const accountData = [
    {
        id: 'individual',
        title: 'Individual',
        icon: UserRound,
        color: 'primary',
        description:
            'Access a personalized dashboard where you can request assistance, contribute to verified campaigns, volunteer for local initiatives, and stay connected with the impact you create.',
        buttonText: 'Continue as Individual',
        path: '/account/login?role=individual',
    },

    {
        id: 'organization',
        title: 'NGO / Organization',
        icon: Building2,
        color: 'accent',
        description:
            "Manage campaigns, respond to verified requests, coordinate volunteers, and monitor your organization's impact through a centralized dashboard designed for social good.",
        buttonText: 'Continue as Organization',
        path: '/account/login?role=organization',
    },
];
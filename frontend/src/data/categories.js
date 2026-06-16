import {
    TbAlertTriangle,
    TbSchool,
    TbHeart,
    TbMedicalCross,
    TbHomeHand,
} from 'react-icons/tb';

export const categories = [
    {
        id: 'disaster-response',
        icon: TbAlertTriangle,
        name: 'Disaster Relief',
        featured: true,
        description:
            'Emergency response when lives are disrupted within minutes.',
        story:
            'Disasters can leave families without shelter, safety, or essential resources within hours. Rapid response helps communities recover before crisis becomes long-term hardship.',
        image:
            'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop',
        color: '#ef4444',
        avgResponseTime: '1–6 hours',
    },

    {
        id: 'medical-aid',
        icon: TbMedicalCross,
        name: 'Medical Aid',
        featured: true,
        description:
            'Making essential healthcare accessible when it is out of reach.',
        story:
            'Access to treatment can determine whether a health issue becomes a crisis. Fast support helps people receive care before conditions worsen.',
        image:
            'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop',
        color: '#06b6d4',
        avgResponseTime: '1–12 hours',
    },

    {
        id: 'food-relief',
        icon: TbHeart,
        name: 'Food Assistance',
        featured: true,
        description:
            'Ensuring no family is forced to live without a meal.',
        story:
            'Food insecurity affects health, dignity, and daily life. Support helps vulnerable families access essential meals when they need them most.',
        image:
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
        color: '#f59e0b',
        avgResponseTime: '6–24 hours',
    },

    {
        id: 'education-support',
        icon: TbSchool,
        name: 'Education Support',
        featured: true,
        description:
            'Helping children continue learning despite financial barriers.',
        story:
            'Many students fall behind because basic learning resources remain out of reach. Timely support helps children stay in school and continue building their future.',
        image:
            'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
        color: '#3b82f6',
        avgResponseTime: '2–7 days',
    },

    {
        id: 'shelter-housing',
        icon: TbHomeHand,
        name: 'Shelter & Housing',
        featured: true,
        description:
            'Safe housing and emergency shelter for vulnerable families.',
        story:
            'Emergency housing protects families during difficult times and helps them rebuild stable lives.',
        image:
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
        color: '#10b981',
        avgResponseTime: '1–3 days',
    },
];
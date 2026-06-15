import {
    TbAlertTriangle,
    TbSchool,
    TbHeart,
    TbMedicalCross,
    TbUsers,
    TbHomeHand,
} from 'react-icons/tb';

const categories = [
    {
        id: 'disaster-relief',
        icon: TbAlertTriangle,
        title: 'Disaster Relief',
        description:
            'Emergency response when lives are disrupted within minutes.',
        image:
            'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop',
        story:
            'Disasters can leave families without shelter, safety, or essential resources within hours. Rapid response helps communities recover before crisis becomes long-term hardship.',
        color: '#ef4444',
        activeCases: 142,
        avgResponseTime: '1–6 hours',
    },

    {
        id: 'medical',
        icon: TbMedicalCross,
        title: 'Medical Aid',
        description:
            'Making essential healthcare accessible when it is out of reach.',
        image:
            'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop',
        story:
            'Access to treatment can determine whether a health issue becomes a crisis. Fast support helps people receive care before conditions worsen.',
        color: '#06b6d4',
        activeCases: 210,
        avgResponseTime: '1–12 hours',
    },

    {
        id: 'food',
        icon: TbHeart,
        title: 'Food Assistance',
        description:
            'Ensuring no family is forced to live without a meal.',
        image:
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
        story:
            'Food insecurity affects health, dignity, and daily life. Support helps vulnerable families access essential meals when they need them most.',
        color: '#f59e0b',
        activeCases: 520,
        avgResponseTime: '6–24 hours',
    },



    {
        id: 'education',
        icon: TbSchool,
        title: 'Education Support',
        description:
            'Helping children continue learning despite financial barriers.',
        image:
            'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
        story:
            'Many students fall behind because basic learning resources remain out of reach. Timely support helps children stay in school and continue building their future.',
        color: '#3b82f6',
        activeCases: 310,
        avgResponseTime: '2–7 days',
    },

    {
        id: 'children',
        icon: TbUsers,
        title: 'Children Support',
        description:
            'Protecting vulnerable children and supporting their development.',
        image:
            'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop',
        story:
            'Children often face the greatest long-term impact during difficult times. Early support helps create safer, healthier, and more stable futures.',
        color: '#10b981',
        activeCases: 180,
        avgResponseTime: '1–3 days',
    },
];

export default categories;

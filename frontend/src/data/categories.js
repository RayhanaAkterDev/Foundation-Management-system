import {
    TbAlertTriangle,
    TbSchool,
    TbHeart,
    TbMedicalCross,
    TbHomeHand,
    TbUsers,
    TbDroplet,
    TbPlant,
    TbShieldCheck,
    TbWheelchair,
} from 'react-icons/tb';

export const categories = [
    {
        id: 'disaster-response',
        icon: TbAlertTriangle,
        name: 'Disaster Relief',
        featured: true,
        description:
            'Rapid emergency response for communities affected by natural or human-made disasters.',
        story:
            'Disasters can destroy homes, infrastructure, and livelihoods within minutes. Immediate aid helps prevent secondary crises like hunger, disease, and displacement.',
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
            'Critical healthcare support for urgent and life-threatening conditions.',
        story:
            'Medical emergencies often become fatal due to delayed treatment or financial barriers. Fast funding ensures patients receive timely care and essential treatment.',
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
            'Providing essential food support to individuals and families facing hunger.',
        story:
            'Food insecurity forces many families to skip meals or rely on insufficient nutrition. Assistance ensures dignity and survival during financial hardship.',
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
            'Supporting children and students with access to learning resources.',
        story:
            'Many children drop out of school due to financial barriers. Education support helps bridge this gap and improves long-term opportunities.',
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
            'Safe housing and emergency shelter for displaced or vulnerable families.',
        story:
            'Stable shelter is a basic human need. Temporary or permanent housing support helps families regain stability and rebuild their lives.',
        image:
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
        color: '#10b981',
        avgResponseTime: '1–3 days',
    },

    // =========================
    // NEW REAL-WORLD CATEGORIES
    // =========================

    {
        id: 'clean-water',
        icon: TbDroplet,
        name: 'Clean Water Access',
        featured: false,
        description:
            'Providing safe drinking water and sanitation support to communities.',
        story:
            'Unsafe water leads to preventable diseases and long-term health risks. Clean water initiatives reduce illness and improve community wellbeing.',
        image:
            'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop',
        color: '#0ea5e9',
        avgResponseTime: '1–5 days',
    },

    {
        id: 'community-development',
        icon: TbUsers,
        name: 'Community Development',
        featured: false,
        description:
            'Long-term support programs to strengthen local communities.',
        story:
            'Sustainable development empowers communities through skills, infrastructure, and local initiatives that improve quality of life over time.',
        image:
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
        color: '#6366f1',
        avgResponseTime: '3–14 days',
    },

    {
        id: 'environmental-action',
        icon: TbPlant,
        name: 'Environmental Protection',
        featured: false,
        description:
            'Projects focused on sustainability, reforestation, and climate action.',
        story:
            'Environmental degradation impacts future generations. Conservation efforts help restore ecosystems and reduce climate risks.',
        image:
            'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop',
        color: '#22c55e',
        avgResponseTime: '3–10 days',
    },

    {
        id: 'elderly-care',
        icon: TbShieldCheck,
        name: 'Elderly Care',
        featured: false,
        description:
            'Support and care services for senior citizens in need.',
        story:
            'Many elderly individuals lack financial or family support. Care programs ensure dignity, healthcare, and emotional support in later life.',
        image:
            'https://images.unsplash.com/photo-1559757175-7cb036d5a2a6?q=80&w=1200&auto=format&fit=crop',
        color: '#a855f7',
        avgResponseTime: '2–5 days',
    },

    {
        id: 'disability-support',
        icon: TbWheelchair,
        name: 'Disability Support',
        featured: false,
        description:
            'Assistance and accessibility support for people with disabilities.',
        story:
            'People with disabilities often face barriers in mobility, education, and employment. Support programs help improve independence and inclusion.',
        image:
            'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop',
        color: '#f97316',
        avgResponseTime: '2–7 days',
    },
];
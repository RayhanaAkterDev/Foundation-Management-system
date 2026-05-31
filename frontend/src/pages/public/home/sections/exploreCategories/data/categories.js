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
            'When disasters strike, entire communities lose everything in moments — homes, safety, and access to basic survival needs. Families are forced into uncertainty without warning, and immediate response becomes the only barrier between crisis and collapse.',
        color: '#ef4444',
        impactHint: 'Survival-critical response',
        urgency: 'critical',
        avgResponseTime: '1–6 hours',
        activeCases: 142,
        monthlyDonors: 8200,
        outcome:
            'Emergency shelter, rescue coordination, and rapid life-saving relief delivered within hours.',
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
            'For many children, education is the only path out of generational poverty. But school fees, lack of materials, and limited access force thousands to fall behind before they ever get a chance to grow.',
        color: '#3b82f6',
        impactHint: 'Long-term life change',
        urgency: 'medium',
        avgResponseTime: '2–7 days',
        activeCases: 310,
        monthlyDonors: 5400,
        outcome:
            'Scholarships, learning materials, and access to education for underserved students.',
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
            'Hunger quietly shapes daily life for millions of families. Parents often skip meals so children can eat, while nutrition insecurity slowly affects health, dignity, and hope.',
        color: '#f59e0b',
        impactHint: 'Daily survival support',
        urgency: 'high',
        avgResponseTime: '6–24 hours',
        activeCases: 520,
        monthlyDonors: 9300,
        outcome:
            'Nutritious meals and essential food supplies delivered to vulnerable households.',
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
            'For many people, illness becomes life-threatening not because it is severe, but because treatment is delayed or unavailable. Lack of access turns treatable conditions into crises.',
        color: '#06b6d4',
        impactHint: 'Critical care access',
        urgency: 'critical',
        avgResponseTime: '1–12 hours',
        activeCases: 210,
        monthlyDonors: 6700,
        outcome:
            'Medical treatment, emergency care, and essential medicines provided to those in need.',
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
            'Children are the most affected in times of crisis, often losing access to safety, education, and emotional stability. Early support helps shape their future before instability defines it.',
        color: '#8b5cf6',
        impactHint: 'Future protection',
        urgency: 'high',
        avgResponseTime: '1–3 days',
        activeCases: 180,
        monthlyDonors: 6100,
        outcome:
            'Child protection programs, education access, and emotional care initiatives.',
    },

    {
        id: 'community',
        icon: TbHomeHand,
        title: 'Community Development',
        description:
            'Building stronger, more resilient communities over time.',
        image:
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
        story:
            'Strong communities are built through shared progress, local empowerment, and long-term investment. When communities grow together, they become more resilient to future crises.',
        color: '#10b981',
        impactHint: 'Long-term resilience',
        urgency: 'medium',
        avgResponseTime: '3–10 days',
        activeCases: 95,
        monthlyDonors: 4500,
        outcome:
            'Infrastructure, training, and sustainable development programs that strengthen communities.',
    },
];

export default categories;
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
            'Immediate emergency response for natural disasters and crises.',
        story:
            'When disasters strike, entire communities can be displaced within minutes. Families lose homes, access to food, clean water, and safety. In these moments, fast coordinated action becomes the difference between survival and long-term suffering. Relief efforts focus on restoring stability, delivering essential supplies, and helping people rebuild their lives step by step.',
        color: '#ef4444',
        impactHint: 'Critical urgency zone',
        urgency: 'critical',
        avgResponseTime: '1–6 hours',
        activeCases: 142,
        monthlyDonors: 8200,
        outcome:
            'Provides emergency shelter, rescue coordination, and rapid resource deployment.',
    },

    {
        id: 'education',
        icon: TbSchool,
        title: 'Education Support',
        description:
            'Empowering students with access to learning and academic resources.',
        story:
            'For many children, education is not just a path to knowledge but the only bridge out of poverty. Yet countless students are held back by lack of school supplies, tuition fees, and learning opportunities. Supporting education means investing in long-term change — helping children build skills, confidence, and a future they can shape themselves.',
        color: '#3b82f6',
        impactHint: 'Long-term transformation',
        urgency: 'medium',
        avgResponseTime: '2–7 days',
        activeCases: 310,
        monthlyDonors: 5400,
        outcome:
            'Supports scholarships, school supplies, and digital learning access for students.',
    },

    {
        id: 'food',
        icon: TbHeart,
        title: 'Food Assistance',
        description:
            'Providing meals and nutrition support to vulnerable families.',
        story:
            'Food insecurity affects both health and dignity. Many families struggle daily to secure even one proper meal, often sacrificing nutrition for survival. Food assistance programs ensure that no one is forced to choose between hunger and basic needs, restoring stability and hope one meal at a time.',
        color: '#f59e0b',
        impactHint: 'Daily essential support',
        urgency: 'high',
        avgResponseTime: '6–24 hours',
        activeCases: 520,
        monthlyDonors: 9300,
        outcome:
            'Delivers meals, food packages, and nutritional aid to vulnerable households.',
    },

    {
        id: 'medical',
        icon: TbMedicalCross,
        title: 'Medical Aid',
        description:
            'Supporting healthcare access, treatment, and essential medicines.',
        story:
            'Illness can quickly become overwhelming when medical care is out of reach. Many individuals delay treatment due to cost, distance, or lack of access to facilities. Medical support ensures that essential care, medication, and treatment reach those who need it most, helping patients recover with dignity and hope.',
        color: '#06b6d4',
        impactHint: 'Critical care support',
        urgency: 'critical',
        avgResponseTime: '1–12 hours',
        activeCases: 210,
        monthlyDonors: 6700,
        outcome:
            'Covers hospital bills, medicines, emergency treatments, and medical supplies.',
    },

    {
        id: 'children',
        icon: TbUsers,
        title: 'Children Support',
        description:
            'Protecting and supporting children with care, safety, and education.',
        story:
            'Children are the most vulnerable during crises, yet they also represent the greatest hope for the future. Many face challenges such as lack of education, nutrition, or safe living conditions. Supporting children means creating environments where they can grow safely, learn freely, and develop into confident individuals.',
        color: '#8b5cf6',
        impactHint: 'Future generation focus',
        urgency: 'high',
        avgResponseTime: '1–3 days',
        activeCases: 180,
        monthlyDonors: 6100,
        outcome:
            'Provides child protection, education access, and emotional support programs.',
    },

    {
        id: 'community',
        icon: TbHomeHand,
        title: 'Community Development',
        description:
            'Strengthening communities through sustainable growth and support systems.',
        story:
            'Strong communities are built through collective effort, shared resources, and long-term investment. When communities grow stronger, they become more resilient to crises and better equipped to support their own members. Development initiatives focus on sustainability, opportunity creation, and improving quality of life at every level.',
        color: '#10b981',
        impactHint: 'Sustainable long-term growth',
        urgency: 'medium',
        avgResponseTime: '3–10 days',
        activeCases: 95,
        monthlyDonors: 4500,
        outcome:
            'Supports infrastructure, training programs, and long-term community development.',
    },
];

export default categories;
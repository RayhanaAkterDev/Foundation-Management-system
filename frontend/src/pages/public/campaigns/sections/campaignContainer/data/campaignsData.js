const campaigns = [
    {
        id: 1,
        title: 'Emergency Food Support',
        category: 'Food Relief',
        urgency: 'Critical',
        location: 'Kurigram, Bangladesh',
        beneficiaries: 1200,
        areasCovered: 14,
        targetAmount: 50000,
        organizer: 'StandForPeople Foundation',
        story:
            'Recent flooding has left hundreds of families without reliable access to food. Many households have lost crops, income sources, and basic supplies. This campaign focuses on delivering emergency food packages and nutritional support to the most vulnerable communities.',
        impact: [
            'Provide food packages for 1,200 people',
            'Support affected families for 30 days',
            'Reduce immediate food insecurity',
        ],
        image:
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c',
        raised: 39000,
        supporters: 279,
        progress: 78,
        daysLeft: 4,
    },

    {
        id: 2,
        title: 'Medical Aid for Patients',
        category: 'Healthcare',
        urgency: 'High',
        location: 'Dhaka, Bangladesh',
        beneficiaries: 850,
        areasCovered: 8,
        targetAmount: 80000,
        organizer: 'HealthFirst Initiative',
        story:
            'Supporting critical treatments, life-saving procedures, and essential medicines for underprivileged patients who cannot afford medical care.',
        impact: [
            'Support 850 patients with treatment',
            'Provide emergency medical funds',
            'Ensure access to essential medicines',
        ],
        image:
            'https://images.unsplash.com/photo-1584515933487-779824d29309',
        raised: 68000,
        supporters: 180,
        progress: 85,
        daysLeft: 2,
    },

    {
        id: 3,
        title: 'Education for Every Child',
        category: 'Education',
        urgency: 'Medium',
        location: 'Rangpur, Bangladesh',
        beneficiaries: 1500,
        areasCovered: 20,
        targetAmount: 60000,
        organizer: 'BrightFuture Org',
        story:
            'Expanding access to quality education, school supplies, and learning opportunities for underprivileged children.',
        impact: [
            'Provide school supplies for 1500 children',
            'Support rural education programs',
            'Improve school attendance rates',
        ],
        image:
            'https://images.unsplash.com/photo-1509062522246-3755977927d7',
        raised: 22000,
        supporters: 89,
        progress: 55,
        daysLeft: 12,
    },

    {
        id: 4,
        title: 'Clean Water for Rural Communities',
        category: 'Water & Sanitation',
        urgency: 'High',
        location: 'Barisal, Bangladesh',
        beneficiaries: 2000,
        areasCovered: 18,
        targetAmount: 70000,
        organizer: 'PureWater Alliance',
        story:
            'Installing safe drinking water systems in underserved rural areas to prevent waterborne diseases and improve health conditions.',
        impact: [
            'Install clean water systems',
            'Serve 2000+ residents',
            'Reduce waterborne diseases',
        ],
        image:
            'https://images.unsplash.com/photo-1549880338-65ddcdfd017b',
        raised: 51000,
        supporters: 312,
        progress: 72,
        daysLeft: 6,
    },

    {
        id: 5,
        title: 'Winter Clothing Drive',
        category: 'Relief',
        urgency: 'Medium',
        location: 'Sylhet, Bangladesh',
        beneficiaries: 900,
        areasCovered: 10,
        targetAmount: 30000,
        organizer: 'WarmHands Foundation',
        story:
            'Distributing warm clothes and blankets to homeless and low-income families during harsh winter conditions.',
        impact: [
            'Provide winter clothing for 900 people',
            'Distribute blankets and essentials',
            'Reduce cold-related risks',
        ],
        image:
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        raised: 18500,
        supporters: 145,
        progress: 40,
        daysLeft: 9,
    },

    {
        id: 6,
        title: 'Disaster Relief Fund',
        category: 'Emergency',
        urgency: 'Critical',
        location: 'Cox’s Bazar, Bangladesh',
        beneficiaries: 3000,
        areasCovered: 25,
        targetAmount: 120000,
        organizer: 'RapidAid Response',
        story:
            'Rapid response support for communities affected by floods, cyclones, and natural disasters.',
        impact: [
            'Emergency shelter support',
            'Food and medical aid',
            'Rebuild affected communities',
        ],
        image:
            'https://images.unsplash.com/photo-1593113598332-cd288d649433',
        raised: 92000,
        supporters: 420,
        progress: 91,
        daysLeft: 1,
    },

    {
        id: 7,
        title: 'Maternal Health Support Program',
        category: 'Healthcare',
        urgency: 'High',
        location: 'Khulna, Bangladesh',
        beneficiaries: 600,
        areasCovered: 9,
        targetAmount: 45000,
        organizer: 'SafeMother Care',
        story:
            'Providing prenatal care, safe delivery support, and postnatal care for mothers in rural areas.',
        impact: [
            'Safe delivery support',
            'Prenatal care access',
            'Postnatal health monitoring',
        ],
        image:
            'https://images.unsplash.com/photo-1584515933487-779824d29309',
        raised: 34500,
        supporters: 198,
        progress: 63,
        daysLeft: 7,
    },

    {
        id: 8,
        title: 'School Infrastructure Development',
        category: 'Education',
        urgency: 'Medium',
        location: 'Rajshahi, Bangladesh',
        beneficiaries: 1800,
        areasCovered: 22,
        targetAmount: 90000,
        organizer: 'EduBuild Foundation',
        story:
            'Building and repairing classrooms, toilets, and learning facilities in underdeveloped schools.',
        impact: [
            'Improve school infrastructure',
            'Better learning environment',
            'Support rural education',
        ],
        image:
            'https://images.unsplash.com/photo-1509062522246-3755977927d7',
        raised: 76000,
        supporters: 340,
        progress: 80,
        daysLeft: 5,
    },

    {
        id: 9,
        title: 'Emergency Shelter for Homeless',
        category: 'Housing',
        urgency: 'High',
        location: 'Dhaka, Bangladesh',
        beneficiaries: 1100,
        areasCovered: 12,
        targetAmount: 55000,
        organizer: 'SafeHome Initiative',
        story:
            'Providing temporary shelter, food, and safety for homeless individuals during emergencies.',
        impact: [
            'Emergency housing support',
            'Food and safety assistance',
            'Temporary shelter facilities',
        ],
        image:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        raised: 29000,
        supporters: 210,
        progress: 58,
        daysLeft: 3,
    },

    {
        id: 10,
        title: 'Youth Skill Development Program',
        category: 'Employment',
        urgency: 'Medium',
        location: 'Chittagong, Bangladesh',
        beneficiaries: 2500,
        areasCovered: 15,
        targetAmount: 75000,
        organizer: 'SkillUp Bangladesh',
        story:
            'Training unemployed youth with digital and vocational skills to improve job opportunities.',
        impact: [
            'Job-ready training programs',
            'Digital skill development',
            'Employment opportunities',
        ],
        image:
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
        raised: 48000,
        supporters: 260,
        progress: 70,
        daysLeft: 10,
    },

    {
        id: 11,
        title: 'Food Bank Expansion Initiative',
        category: 'Food Relief',
        urgency: 'High',
        location: 'Narayanganj, Bangladesh',
        beneficiaries: 2200,
        areasCovered: 16,
        targetAmount: 65000,
        organizer: 'Community Food Bank',
        story:
            'Expanding local food banks to reach more families struggling with daily meals.',
        impact: [
            'Expand food distribution network',
            'Support low-income families',
            'Reduce hunger rates',
        ],
        image:
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c',
        raised: 62000,
        supporters: 390,
        progress: 82,
        daysLeft: 8,
    },

    {
        id: 12,
        title: 'Elderly Care Support Program',
        category: 'Healthcare',
        urgency: 'Medium',
        location: 'Mymensingh, Bangladesh',
        beneficiaries: 700,
        areasCovered: 11,
        targetAmount: 50000,
        organizer: 'GoldenAge Care',
        story:
            'Providing medical care, daily assistance, and emotional support for elderly citizens.',
        impact: [
            'Elderly healthcare support',
            'Daily assistance programs',
            'Emotional wellbeing care',
        ],
        image:
            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56',
        raised: 41000,
        supporters: 175,
        progress: 66,
        daysLeft: 11,
    },
];

export default campaigns;
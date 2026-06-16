export const defaultOrganizer = {
    name: 'Stand For People',
    role: 'Verified NGO',
    verified: true,
};

export const defaultStory = [
    'This campaign was created to provide immediate support to vulnerable communities facing difficult circumstances.',
    'Your donations help deliver essential resources including food, healthcare, shelter, and emergency assistance where they are needed most.',
    'Every contribution brings hope and creates long-term positive impact for individuals and families.',
    'Together we can build stronger and more resilient communities.',
];

export const defaultUpdates = [
    {
        title: 'Campaign launched successfully',
        content:
            'The campaign is now live and actively collecting donations.',
        date: '2 days ago',
        icon: 'TbCircleCheck',
    },

    {
        title: 'Initial support distributed',
        content:
            'Early donations have already started reaching beneficiaries.',
        date: 'Today',
        icon: 'TbTruckDelivery',
    },
];

export const campaigns = [
    {
        id: 101,
        slug: 'emergency-heart-surgery',
        title: 'Emergency Heart Surgery for Critical Patient',
        category: 'medical-aid',
        urgency: '',
        status: 'active',
        featured: true,
        localImpact: true,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
        shortDescription: 'Support life-saving heart surgery for a critically ill patient.',
        targetAmount: 500000,
        raised: 340000,
        progress: 68,
        supporters: 1200,
        daysLeft: 5,
        location: 'Dhaka, Bangladesh',
        organizer: defaultOrganizer,
        story: [
            'A severe heart condition left the patient fighting for survival.',
            'Doctors confirmed emergency surgery as the only viable treatment option.',
            'This campaign helps fund surgery expenses and post-operative recovery.',
        ],
        updates: [
            {
                title: 'Medical evaluation completed',
                content: 'Doctors completed all required medical assessments.',
                date: '3 days ago',
                icon: 'TbStethoscope',
            },
            {
                title: 'Surgery scheduled',
                content: 'The operation date has been finalized.',
                date: 'Today',
                icon: 'TbCircleCheck',
            },
        ],
    },

    {
        id: 102,
        slug: 'cancer-treatment-support',
        title: 'Cancer Treatment Support for Low-Income Families',
        category: 'medical-aid',
        urgency: 'urgent',
        status: 'active',
        featured: false,
        localImpact: false,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
        shortDescription: 'Provide financial assistance for cancer treatment for low-income families.',
        targetAmount: 700000,
        raised: 250000,
        progress: 36,
        supporters: 880,
        daysLeft: 10,
        location: 'Bangladesh',
        organizer: defaultOrganizer,
        story: defaultStory,
        updates: defaultUpdates,
    },

    // 👇 Apply EXACTLY same pattern to all remaining campaigns

    // id: 201
    // id: 301
    // id: 401
    // id: 402
    // id: 403
    // id: 404
    // id: 405
    // id: 406
    // id: 407
    // id: 408
    // id: 409
    // id: 410
    // id: 411
];
const scenes = [
    {
        step: '01',
        title: 'Understanding Human Needs',
        desc: `People describe their needs naturally.
Our AI understands the request, extracts important information and converts it into structured data that can be acted on quickly.`,
        bullets: [
            'Natural language requests',
            'Location detection',
            'Urgency extraction',
            'Resource identification',
        ],
        type: 'understanding',
    },

    {
        step: '02',
        title: 'Building Trust',
        desc: `Every request goes through verification workflows to reduce fraud, remove duplicates and ensure resources reach genuine cases.`,
        bullets: [
            'Duplicate detection',
            'Identity verification',
            'Human review',
            'Transparent decisions',
        ],
        type: 'trust',
        reverse: true,
    },

    {
        step: '03',
        title: 'Prioritizing What Matters',
        desc: `The platform evaluates urgency, impact and available resources to determine which requests need immediate attention.`,
        bullets: [
            'Urgency scoring',
            'Impact analysis',
            'Resource availability',
            'Fair prioritization',
        ],
        type: 'priority',
    },

    {
        step: '04',
        title: 'Connecting People To Help',
        desc: `Donors, volunteers and beneficiaries are intelligently matched so aid can be delivered efficiently and transparently.`,
        bullets: [
            'Smart matching',
            'Volunteer coordination',
            'Transparent delivery',
            'Real-world impact',
        ],
        type: 'network',
        reverse: true,
    },
];

export default scenes;
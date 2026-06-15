const scenes = [
    {
        step: '01',
        title: 'Understanding Human Needs',
        desc: `People describe what they need in their own words. AI interprets these requests and converts them into structured information for action.`,
        bullets: [
            'Natural input capture',
            'AI-based intent detection',
            'Location extraction',
            'Urgency signal recognition',
        ],
        type: 'understanding',
    },

    {
        step: '02',
        title: 'Building Trust',
        desc: `Each request is validated through system checks supported by AI signals and human review to ensure authenticity and remove duplication.`,
        bullets: [
            'Duplicate detection (AI-assisted)',
            'Identity validation',
            'Human review workflow',
            'Decision transparency',
        ],
        type: 'trust',
        reverse: true,
    },

    {
        step: '03',
        title: 'Prioritizing What Matters',
        desc: `AI evaluates urgency, impact, and context signals to determine which requests need immediate attention.`,
        bullets: [
            'AI urgency scoring',
            'Impact evaluation',
            'Resource availability check',
            'Fair ranking system',
        ],
        type: 'priority',
    },

    {
        step: '04',
        title: 'Connecting People To Help',
        desc: `People, volunteers, and donors are matched through a coordination system to deliver support efficiently.`,
        bullets: [
            'Smart matching logic',
            'Volunteer coordination',
            'Aid routing system',
            'Delivery tracking',
        ],
        type: 'network',
        reverse: true,
    },
];

export default scenes;
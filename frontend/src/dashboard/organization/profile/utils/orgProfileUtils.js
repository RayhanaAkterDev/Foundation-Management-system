
const focusAreaOptions = [
    { value: 'Medical Aid', label: 'চিকিৎসা সহায়তা' },
    { value: 'Education', label: 'শিক্ষা' },
    { value: 'Food Relief', label: 'খাদ্য সহায়তা' },
    { value: 'Shelter & Housing', label: 'আশ্রয় ও আবাসন' },
    { value: 'Disaster Response', label: 'দুর্যোগ মোকাবিলা' },
    { value: 'Clean Water', label: 'বিশুদ্ধ পানি' },
    { value: 'Women & Child Welfare', label: 'নারী ও শিশু কল্যাণ' },
    { value: 'Livelihood Support', label: 'জীবিকা সহায়তা' },
    { value: 'Environment', label: 'পরিবেশ' },
    { value: 'Elderly Care', label: 'প্রবীণ সেবা' },
    { value: 'Disability Support', label: 'প্রতিবন্ধী ব্যক্তিদের সহায়তা' },
    { value: 'Youth Development', label: 'যুব উন্নয়ন' },
];

const communityOptions = [
    { value: 'Rural Communities', label: 'গ্রামীণ জনগোষ্ঠী' },
    { value: 'Urban Slums', label: 'শহরের বস্তিবাসী' },
    { value: 'Refugees', label: 'শরণার্থী' },
    { value: 'Children', label: 'শিশু' },
    { value: 'Women', label: 'নারী' },
    { value: 'Elderly', label: 'প্রবীণ' },
    { value: 'Persons with Disabilities', label: 'প্রতিবন্ধী ব্যক্তি' },
    { value: 'Low-Income Families', label: 'স্বল্প আয়ের পরিবার' },
    { value: 'Indigenous Groups', label: 'আদিবাসী জনগোষ্ঠী' },
];

const teamSizeOptions = [
    { value: '1-10', label: '১–১০ জন' },
    { value: '11-50', label: '১১–৫০ জন' },
    { value: '51-200', label: '৫১–২০০ জন' },
    { value: '201-500', label: '২০১–৫০০ জন' },
    { value: '500+', label: '৫০০+ জন' },
];

const activityOptions = [
    {
        value: 'Direct Aid Distribution',
        label: 'সরাসরি সহায়তা বিতরণ',
        description: 'মানুষের কাছে সরাসরি প্রয়োজনীয় সহায়তা পৌঁছে দেওয়া',
    },
    {
        value: 'Volunteer Coordination',
        label: 'স্বেচ্ছাসেবক সমন্বয়',
        description: 'স্বেচ্ছাসেবকদের সংগঠিত ও কার্যক্রমে যুক্ত করা',
    },
    {
        value: 'Fundraising Campaigns',
        label: 'তহবিল সংগ্রহ',
        description: 'মানবিক উদ্যোগের জন্য অর্থ ও সহায়তা সংগ্রহ',
    },
    {
        value: 'Community Training',
        label: 'কমিউনিটি প্রশিক্ষণ',
        description: 'স্থানীয় জনগোষ্ঠীর দক্ষতা ও সক্ষমতা উন্নয়ন',
    },
    {
        value: 'Medical Outreach',
        label: 'চিকিৎসা কার্যক্রম',
        description: 'স্বাস্থ্যসেবা ও চিকিৎসা সহায়তা মানুষের কাছে পৌঁছে দেওয়া',
    },
    {
        value: 'Educational Programs',
        label: 'শিক্ষামূলক কার্যক্রম',
        description: 'শিক্ষা, প্রশিক্ষণ ও শেখার সুযোগ তৈরি করা',
    },
    {
        value: 'Advocacy & Awareness',
        label: 'সচেতনতা ও অ্যাডভোকেসি',
        description: 'গুরুত্বপূর্ণ সামাজিক বিষয়ে সচেতনতা তৈরি করা',
    },
    {
        value: 'Disaster Relief',
        label: 'দুর্যোগকালীন সহায়তা',
        description: 'দুর্যোগে ক্ষতিগ্রস্ত মানুষের জরুরি সহায়তায় কাজ করা',
    },
];

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    mission: '',
    focus_areas: [],
    communities_served: [],
    team_size: '',
    primary_activities: [],
};

const toArray = (value) => {
    if (Array.isArray(value)) {
        return value.filter(
            (item) => typeof item === 'string' && item.trim()
        );
    }

    if (typeof value !== 'string' || !value.trim()) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
            return parsed.filter(
                (item) => typeof item === 'string' && item.trim()
            );
        }
    } catch {
        // Support older comma-separated values.
    }

    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
};

const getProfilePayload = (response) => {
    const payload = response?.data ?? response;

    return payload?.profile ?? payload?.organization ?? payload;
};

const getStatusLabel = (status) => {
    const labels = {
        verified: 'Verified',
        pending: 'Pending verification',
        rejected: 'Verification rejected',
    };

    return (
        labels[String(status || '').toLowerCase()] ||
        status ||
        'Unknown'
    );
};

export {
    focusAreaOptions,
    communityOptions,
    teamSizeOptions,
    activityOptions,
    emptyForm,
    toArray,
    getProfilePayload,
    getStatusLabel,
};

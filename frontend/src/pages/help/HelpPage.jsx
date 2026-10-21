import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Building2,
    ChevronDown,
    FileQuestion,
    HandHeart,
    Heart,
    LifeBuoy,
    Search,
    ShieldCheck,
    UserRound,
    UsersRound,
    X,
} from 'lucide-react';

/* =========================================================
   HELP CENTER CONTENT — PUBLIC
========================================================= */

const PUBLIC_CONTENT = {
    title: 'আপনাকে কীভাবে সাহায্য করতে পারি?',
    description:
        'আপনার প্রশ্নের উত্তর খুঁজুন, প্ল্যাটফর্ম সম্পর্কে জানুন এবং প্রয়োজনীয় সহায়তার নির্দেশনা পান।',
    sections: [
        {
            id: 'getting-started',
            title: 'শুরু করার আগে',
            description: 'প্ল্যাটফর্ম সম্পর্কে জানুন',
            icon: BookOpen,
            keywords: [
                'getting started',
                'start',
                'shuru',
                'platform',
                'website',
                'stand for people',
                'sfp',
            ],
            questions: [
                {
                    question: 'স্ট্যান্ড ফর পিপল কী?',
                    answer: 'স্ট্যান্ড ফর পিপল একটি মানবিক সহায়তা সমন্বয় প্ল্যাটফর্ম। এটি সহায়তাপ্রার্থী ব্যক্তি, স্বেচ্ছাসেবক, সংগঠন ও দাতাদের মধ্যে সংযোগ তৈরি করে, যাতে প্রয়োজনীয় সহায়তা আরও সহজ ও সমন্বিতভাবে পৌঁছানো যায়।',
                    keywords: [
                        'what is stand for people',
                        'stand for people ki',
                        'sfp ki',
                        'eta ki',
                        'ei website ki',
                        'about platform',
                    ],
                },
                {
                    question: 'কারা স্ট্যান্ড ফর পিপল ব্যবহার করতে পারবেন?',
                    answer: 'সহায়তা প্রয়োজন এমন ব্যক্তি, স্বেচ্ছাসেবায় আগ্রহী মানুষ, দাতা এবং মানবিক কার্যক্রমে যুক্ত সংগঠনগুলো তাদের জন্য উপলব্ধ সুবিধা ব্যবহার করতে পারবেন।',
                    keywords: [
                        'who can use',
                        'who can join',
                        'eligible users',
                        'kara use korte parbe',
                        'ke use korte parbe',
                        'kar jonno',
                    ],
                },
                {
                    question: 'কীভাবে অ্যাকাউন্ট তৈরি করব?',
                    answer: 'নিবন্ধন পৃষ্ঠায় গিয়ে উপযুক্ত অ্যাকাউন্টের ধরন নির্বাচন করুন এবং প্রয়োজনীয় তথ্য দিন। নিবন্ধন সম্পন্ন হলে লগইন করে আপনার অ্যাকাউন্টের সুবিধাগুলো ব্যবহার করতে পারবেন।',
                    keywords: [
                        'create account',
                        'register',
                        'registration',
                        'sign up',
                        'signup',
                        'new account',
                        'account khulbo',
                        'account khulte chai',
                        'registration korbo',
                        'notun account',
                    ],
                },
            ],
        },
        {
            id: 'campaigns',
            title: 'ক্যাম্পেইন ও অনুদান',
            description: 'মানবিক উদ্যোগে সহযোগিতা করুন',
            icon: Heart,
            keywords: [
                'campaign',
                'campaigns',
                'donation',
                'donate',
                'onudan',
                'onudaan',
                'dan',
                'daan',
                'taka',
                'fundraising',
            ],
            questions: [
                {
                    question: 'সহায়তা করার জন্য ক্যাম্পেইন কোথায় পাব?',
                    answer: 'ক্যাম্পেইন পৃষ্ঠায় গিয়ে চলমান উদ্যোগগুলো দেখতে পারবেন। কোনো ক্যাম্পেইনে সহায়তা করার আগে তার উদ্দেশ্য, প্রয়োজনীয় অর্থ এবং অন্যান্য তথ্য ভালোভাবে পড়ে নিন।',
                    keywords: [
                        'find campaign',
                        'browse campaigns',
                        'campaign list',
                        'campaign kothay',
                        'campaign dekhbo',
                        'campaign khujbo',
                    ],
                },
                {
                    question: 'কীভাবে অনুদান দিতে পারি?',
                    answer: 'আপনার পছন্দের ক্যাম্পেইন খুলে সেখানে দেওয়া অনুদানের নির্দেশনা অনুসরণ করুন। অনুদান নিশ্চিত করার আগে অর্থের পরিমাণ ও পেমেন্টের তথ্য যাচাই করুন।',
                    keywords: [
                        'how to donate',
                        'make donation',
                        'give money',
                        'donate money',
                        'payment',
                        'onudan dibo',
                        'onudan kivabe dibo',
                        'onudan dite chai',
                        'donation korbo',
                        'taka dibo',
                        'dan korbo',
                    ],
                },
                {
                    question: 'ক্যাম্পেইনের অগ্রগতি কীভাবে দেখব?',
                    answer: 'ক্যাম্পেইনের বিস্তারিত পৃষ্ঠায় লক্ষ্যমাত্রা, সংগৃহীত অনুদান এবং অগ্রগতির তথ্য থাকতে পারে। কোন তথ্য দেখা যাবে তা সংশ্লিষ্ট ক্যাম্পেইনের রেকর্ডের ওপর নির্ভর করে।',
                    keywords: [
                        'campaign progress',
                        'funding progress',
                        'raised amount',
                        'funding goal',
                        'campaign status',
                        'campaign update',
                        'koto taka uthse',
                        'progress dekhbo',
                    ],
                },
            ],
        },
        {
            id: 'assistance',
            title: 'সহায়তার আবেদন',
            description: 'সহায়তা চাওয়া ও আবেদনের অগ্রগতি',
            icon: HandHeart,
            keywords: [
                'help',
                'assistance',
                'support',
                'request help',
                'help request',
                'application',
                'abedon',
                'sahajjo',
                'shahajjo',
                'shohayota',
                'sohayota',
                'help chai',
                'help dorkar',
            ],
            questions: [
                {
                    question: 'কীভাবে সহায়তার জন্য আবেদন করব?',
                    answer: 'সহায়তার আবেদন করার সুবিধাটি ব্যবহার করে আপনার পরিস্থিতি ও প্রয়োজনীয় তথ্য দিন। সঠিক যোগাযোগের তথ্য এবং স্পষ্ট বিবরণ দিলে আবেদন পর্যালোচনা করা সহজ হয়।',
                    keywords: [
                        'apply for help',
                        'request assistance',
                        'submit help request',
                        'help application',
                        'need help',
                        'help chai',
                        'help lagbe',
                        'sahajjo chai',
                        'abedon korbo',
                        'sohayota chai',
                    ],
                },
                {
                    question: 'আবেদন করলেই কি সহায়তা পাওয়া নিশ্চিত?',
                    answer: 'না। আবেদন জমা দেওয়ার পর তা প্রযোজ্য যাচাই ও সমন্বয় প্রক্রিয়ার আওতায় আসে। সহায়তা পাওয়া নির্ভর করে উপলব্ধ সম্পদ, যোগ্যতা এবং পরিস্থিতির ওপর।',
                    keywords: [
                        'guaranteed help',
                        'will i get help',
                        'approval',
                        'eligibility',
                        'help pabo',
                        'sahajjo pabo ki',
                        'confirm help',
                    ],
                },
                {
                    question: 'আমার আবেদনের অগ্রগতি কোথায় দেখব?',
                    answer: 'আপনার অ্যাকাউন্টে আবেদন পর্যবেক্ষণের সুবিধা থাকলে লগইন করে ড্যাশবোর্ডের Help Requests বিভাগ থেকে আবেদনের বর্তমান অবস্থা দেখতে পারবেন।',
                    keywords: [
                        'track application',
                        'application status',
                        'request status',
                        'track help request',
                        'abedon status',
                        'abedon er obostha',
                        'help request status',
                    ],
                },
            ],
        },
        {
            id: 'volunteering',
            title: 'স্বেচ্ছাসেবা',
            description: 'সময় ও দক্ষতা দিয়ে পাশে দাঁড়ান',
            icon: UsersRound,
            keywords: [
                'volunteer',
                'volunteering',
                'volunteers',
                'sechchaseba',
                'swecchaseba',
                'sechchasebok',
                'swecchasebok',
                'volunteer hobo',
            ],
            questions: [
                {
                    question: 'কীভাবে স্বেচ্ছাসেবক হতে পারি?',
                    answer: 'প্ল্যাটফর্মে উপলব্ধ স্বেচ্ছাসেবার সুযোগগুলো দেখুন এবং প্রযোজ্য আবেদন বা অংশগ্রহণ প্রক্রিয়া অনুসরণ করুন।',
                    keywords: [
                        'become volunteer',
                        'join as volunteer',
                        'volunteer registration',
                        'volunteer application',
                        'volunteer hobo',
                        'volunteer hote chai',
                        'sechchasebok hobo',
                    ],
                },
                {
                    question: 'স্বেচ্ছাসেবক হতে পূর্ব অভিজ্ঞতা প্রয়োজন?',
                    answer: 'কার্যক্রমভেদে প্রয়োজনীয় যোগ্যতা ভিন্ন হতে পারে। কিছু কার্যক্রমে নতুন স্বেচ্ছাসেবকেরাও অংশ নিতে পারবেন, আবার কিছু কাজে বিশেষ দক্ষতা বা অভিজ্ঞতা প্রয়োজন হতে পারে।',
                    keywords: [
                        'volunteer requirements',
                        'volunteer qualification',
                        'experience required',
                        'no experience',
                        'oviggota lagbe',
                        'experience lagbe',
                        'joggota lagbe',
                    ],
                },
            ],
        },
        {
            id: 'security',
            title: 'অ্যাকাউন্ট ও নিরাপত্তা',
            description: 'ব্যক্তিগত তথ্য ও অ্যাকাউন্ট সুরক্ষা',
            icon: ShieldCheck,
            keywords: [
                'account',
                'security',
                'password',
                'privacy',
                'login',
                'sign in',
                'nirapotta',
                'passward',
                'account problem',
            ],
            questions: [
                {
                    question: 'পাসওয়ার্ড ভুলে গেলে কী করব?',
                    answer: 'লগইন পৃষ্ঠায় পাসওয়ার্ড পুনরুদ্ধারের সুবিধা থাকলে সেটি ব্যবহার করুন এবং দেওয়া নির্দেশনা অনুসরণ করুন।',
                    keywords: [
                        'forgot password',
                        'forget password',
                        'reset password',
                        'recover password',
                        'password recovery',
                        'password vule gechi',
                        'password bhule gechi',
                        'password mone nai',
                        'pass vule gechi',
                        'login korte parchi na',
                    ],
                },
                {
                    question: 'অ্যাকাউন্ট নিরাপদ রাখার উপায় কী?',
                    answer: 'একটি শক্তিশালী ও আলাদা পাসওয়ার্ড ব্যবহার করুন, লগইন তথ্য কাউকে দেবেন না এবং সংবেদনশীল তথ্য দেওয়ার আগে নিশ্চিত হোন যে আপনি স্ট্যান্ড ফর পিপলের আনুষ্ঠানিক ওয়েবসাইট ব্যবহার করছেন।',
                    keywords: [
                        'secure account',
                        'account protection',
                        'account safety',
                        'strong password',
                        'account safe rakhbo',
                        'account hack',
                        'security tips',
                    ],
                },
                {
                    question: 'কোন তথ্য প্রকাশ্যে শেয়ার করা উচিত নয়?',
                    answer: 'পাসওয়ার্ড, ব্যাংকিং তথ্য, পরিচয়পত্র এবং অন্যান্য সংবেদনশীল ব্যক্তিগত তথ্য প্রকাশ্য মন্তব্য বা বার্তায় শেয়ার করবেন না।',
                    keywords: [
                        'personal information',
                        'private data',
                        'sensitive information',
                        'share information',
                        'bank information',
                        'identity card',
                        'ki share korbo na',
                        'personal info',
                    ],
                },
            ],
        },
    ],
};

/* =========================================================
   HELP CENTER CONTENT — DASHBOARD
========================================================= */

const DASHBOARD_CONTENT = {
    admin: {
        title: 'Admin Help Center',
        description:
            'Guidance for managing platform operations, reviewing records, and supporting your community.',
        sections: [
            {
                id: 'users',
                title: 'Users & accounts',
                description: 'Accounts, permissions and user information',
                icon: UsersRound,
                questions: [
                    {
                        question: 'How do I manage user accounts?',
                        answer: 'Open Users from your admin dashboard. You can search and filter accounts, review individual profiles, and use the available management actions.',
                    },
                    {
                        question: 'Where can I review user information?',
                        answer: 'Go to Users and select an account using the View action. The details page displays the information associated with that user.',
                    },
                    {
                        question: 'How do I manage account status?',
                        answer: 'Open the relevant user record and use the available status controls. Review the account information before making changes.',
                    },
                ],
            },
            {
                id: 'organizations',
                title: 'Organizations',
                description: 'Profiles, verification and management',
                icon: Building2,
                questions: [
                    {
                        question: 'How do I review an organization?',
                        answer: 'Open Organizations from the admin dashboard, locate the organization, and select View to inspect its profile and registration information.',
                    },
                    {
                        question: 'How does organization verification work?',
                        answer: 'Review the organization’s submitted details and current verification status. Use the verification action when available and confirm that the submitted information meets the platform’s requirements.',
                    },
                    {
                        question: 'Can I update organization information?',
                        answer: 'Where your administrator permissions allow it, open the organization record and choose the available Edit action.',
                    },
                ],
            },
            {
                id: 'campaigns',
                title: 'Campaigns & donations',
                description: 'Campaign records and contributions',
                icon: Heart,
                questions: [
                    {
                        question: 'Where can I manage campaigns?',
                        answer: 'Open Campaigns to search, filter, and review campaign records. Select a campaign to see its information, funding progress, and available management actions.',
                    },
                    {
                        question: 'How can I review a donation?',
                        answer: 'Go to Donations and select the View action on a donation record. The details page shows its amount, payment information, donor, and associated campaign.',
                    },
                    {
                        question: 'Where can I find transaction information?',
                        answer: 'Open the relevant donation details page. Transaction IDs and payment methods are displayed when that information is available in the record.',
                    },
                ],
            },
            {
                id: 'volunteers',
                title: 'Volunteers',
                description: 'Members, requests and invitations',
                icon: HandHeart,
                questions: [
                    {
                        question:
                            'What is the difference between volunteers, requests and invitations?',
                        answer: 'The Volunteers page lists accepted volunteer members. Requests contains applications submitted by users, while Invitations contains invitations sent by administrators.',
                    },
                    {
                        question: 'How do I review volunteer applications?',
                        answer: 'Open Volunteers, then Requests. Review the applicant’s information before choosing an available Accept or Reject action.',
                    },
                    {
                        question:
                            'Where can I view volunteer campaign activity?',
                        answer: 'Open an individual volunteer’s details page to review their membership information and associated campaign participation.',
                    },
                ],
            },
            {
                id: 'requests',
                title: 'Help requests',
                description: 'Submitted requests and review actions',
                icon: LifeBuoy,
                questions: [
                    {
                        question: 'How do I review submitted help requests?',
                        answer: 'Open Help Requests from the admin dashboard. Use the available search and filters to locate a request, then open its details page.',
                    },
                    {
                        question: 'Can I update a help request?',
                        answer: 'Where editing is permitted, open the request and use the available Edit action. Review the request details before saving changes.',
                    },
                ],
            },
        ],
    },

    individual: {
        title: 'Help & Support',
        description:
            'Find guidance for your account, donations, volunteering and requests for assistance.',
        sections: [
            {
                id: 'account',
                title: 'Account & security',
                description: 'Profile, password and account access',
                icon: UserRound,
                questions: [
                    {
                        question: 'How do I update my personal information?',
                        answer: 'Open your Profile from the dashboard and select Edit Profile. Update the available information and save your changes.',
                    },
                    {
                        question: 'How can I change my password?',
                        answer: 'Open the Security section of your account settings, if available. Follow the password update instructions and choose a strong, unique password.',
                    },
                    {
                        question: 'What should I do if I cannot sign in?',
                        answer: 'Check your email and password, then try again. If you have forgotten your password, use the available password recovery option on the login page.',
                    },
                ],
            },
            {
                id: 'donations',
                title: 'Donations',
                description: 'Contributions and donation history',
                icon: Heart,
                questions: [
                    {
                        question: 'How can I support a campaign?',
                        answer: 'Browse the available campaigns, open the campaign you want to support, and follow its donation instructions.',
                    },
                    {
                        question: 'Where can I see my donation history?',
                        answer: 'Open Donations from your dashboard to review the contribution records available for your account.',
                    },
                    {
                        question:
                            'How do I check a donation’s payment details?',
                        answer: 'Select the relevant donation from your history. Available payment and transaction information will be shown in its details.',
                    },
                ],
            },
            {
                id: 'volunteering',
                title: 'Volunteering',
                description: 'Participation and campaign activities',
                icon: HandHeart,
                questions: [
                    {
                        question: 'How can I participate as a volunteer?',
                        answer: 'Use the available volunteering features to submit an application or express interest. Your participation depends on the applicable review and approval process.',
                    },
                    {
                        question: 'Where can I review my volunteer activities?',
                        answer: 'Open the Volunteer section of your dashboard to see the activities and campaign information available to your account.',
                    },
                    {
                        question:
                            'How do I know whether my application was accepted?',
                        answer: 'Review the status shown in the relevant volunteering section of your dashboard. Status updates depend on the platform’s review process.',
                    },
                ],
            },
            {
                id: 'requests',
                title: 'Help requests',
                description: 'Requesting assistance and tracking progress',
                icon: LifeBuoy,
                questions: [
                    {
                        question: 'How do I request assistance?',
                        answer: 'Use the available Request Help feature and provide the required information about your situation. Make sure your contact details are accurate.',
                    },
                    {
                        question: 'Where can I track my help requests?',
                        answer: 'Open Help Requests in your dashboard to review submitted requests and their available status information.',
                    },
                    {
                        question: 'Can I update a submitted request?',
                        answer: 'Open your request and check whether an Edit action is available. Some changes may be restricted depending on the request’s current status.',
                    },
                ],
            },
        ],
    },

    organization: {
        title: 'Organization Help Center',
        description:
            'Guidance for managing your organization, campaigns, volunteers and assistance activities.',
        sections: [
            {
                id: 'profile',
                title: 'Organization profile',
                description: 'Identity, details and verification',
                icon: Building2,
                questions: [
                    {
                        question: 'How do I update my organization profile?',
                        answer: 'Open Profile from your organization dashboard and select the available editing option. Update your organization information and save your changes.',
                    },
                    {
                        question: 'How can I check verification status?',
                        answer: 'Review your organization profile and its verification information. Any additional requirements should be followed through the platform’s available instructions.',
                    },
                    {
                        question: 'Can I update our organization banner?',
                        answer: 'Open the organization profile editing page and look for the Organization Banner section. Upload a suitable image using the available controls.',
                    },
                ],
            },
            {
                id: 'campaigns',
                title: 'Campaign management',
                description: 'Campaigns, funding and updates',
                icon: Heart,
                questions: [
                    {
                        question: 'Where can I manage our campaigns?',
                        answer: 'Open Campaigns from the organization dashboard to view associated campaigns and access the available management actions.',
                    },
                    {
                        question: 'Where can I review campaign funding?',
                        answer: 'Open a campaign details page to review the funding information and progress currently available for that campaign.',
                    },
                    {
                        question: 'Can I edit an existing campaign?',
                        answer: 'Use the Edit action where it is available and permitted. Some information or actions may depend on the campaign’s current status.',
                    },
                ],
            },
            {
                id: 'volunteers',
                title: 'Volunteers',
                description: 'Volunteer participation and activities',
                icon: UsersRound,
                questions: [
                    {
                        question: 'How can I review volunteers?',
                        answer: 'Open Volunteers from your organization dashboard to review the volunteer records available to your organization.',
                    },
                    {
                        question: 'Where can I see campaign participation?',
                        answer: 'Open the relevant volunteer or campaign record to review the associated activity information.',
                    },
                ],
            },
            {
                id: 'requests',
                title: 'Help requests & reports',
                description: 'Assistance requests and reporting',
                icon: LifeBuoy,
                questions: [
                    {
                        question: 'Where can I review help requests?',
                        answer: 'Open Help Requests to see the assistance requests available to your organization and review their details.',
                    },
                    {
                        question: 'Where can I find reports?',
                        answer: 'Open Reports from your organization dashboard, if available, to review the reporting information provided for your account.',
                    },
                ],
            },
        ],
    },
};

/* =========================================================
   SEARCH UTILITIES
========================================================= */

const SEARCH_SYNONYMS = [
    [
        'donation',
        'donations',
        'donate',
        'onudan',
        'onudaan',
        'অনুদান',
        'দান',
        'daan',
        'dan',
    ],
    [
        'volunteer',
        'volunteers',
        'volunteering',
        'sechchaseba',
        'swecchaseba',
        'sechchasebok',
        'স্বেচ্ছাসেবা',
        'স্বেচ্ছাসেবক',
    ],
    [
        'help',
        'assistance',
        'sahajjo',
        'shahajjo',
        'sohayota',
        'shohayota',
        'সহায়তা',
        'সাহায্য',
    ],
    ['account', 'accounts', 'অ্যাকাউন্ট', 'একাউন্ট'],
    ['password', 'passward', 'পাসওয়ার্ড', 'পাসওয়ার্ড'],
    ['forgot', 'forget', 'forgotten', 'vule', 'bhule', 'ভুলে'],
    ['application', 'apply', 'abedon', 'abedan', 'আবেদন'],
    ['campaign', 'campaigns', 'ক্যাম্পেইন', 'ক্যাম্পেন'],
    ['security', 'safety', 'nirapotta', 'নিরাপত্তা', 'সুরক্ষা'],
    ['progress', 'status', 'obostha', 'অগ্রগতি', 'অবস্থা'],
    ['registration', 'register', 'signup', 'nibondhon', 'নিবন্ধন'],
    ['login', 'signin', 'লগইন'],
    ['money', 'taka', 'tk', 'টাকা', 'অর্থ'],
    ['payment', 'pay', 'পেমেন্ট'],
    ['organization', 'organizations', 'songothon', 'সংগঠন'],
    ['how', 'kivabe', 'kibhabe', 'কিভাবে', 'কীভাবে'],
    ['where', 'kothay', 'কোথায়', 'কোথায়'],
    ['want', 'chai', 'চাই'],
    ['need', 'dorkar', 'lagbe', 'দরকার', 'লাগবে', 'প্রয়োজন'],
    ['give', 'dibo', 'dite', 'দিতে', 'দিব'],
    ['create', 'khulbo', 'khulte', 'খুলব', 'খুলতে'],
];

function normalizeSearch(value) {
    return String(value ?? '')
        .toLocaleLowerCase()
        .normalize('NFKC')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/[’‘]/g, "'")
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const NORMALIZED_SYNONYMS = SEARCH_SYNONYMS.map((group) => [
    ...new Set(group.map(normalizeSearch)),
]);

function getAlternatives(word) {
    const normalized = normalizeSearch(word);

    return (
        NORMALIZED_SYNONYMS.find((group) => group.includes(normalized)) || [
            normalized,
        ]
    );
}

function calculateSearchScore(item, section, query) {
    const phrase = normalizeSearch(query);

    if (!phrase) return 0;

    const question = normalizeSearch(item.question);
    const answer = normalizeSearch(item.answer);
    const category = normalizeSearch(section.title);
    const itemKeywords = normalizeSearch((item.keywords || []).join(' '));
    const sectionKeywords = normalizeSearch((section.keywords || []).join(' '));
    const description = normalizeSearch(section.description);

    const fields = [
        question,
        answer,
        category,
        itemKeywords,
        sectionKeywords,
        description,
    ];

    const words = phrase.split(' ').filter(Boolean);

    const matched = words.every((word) =>
        getAlternatives(word).some((alternative) =>
            fields.some((field) => field.includes(alternative)),
        ),
    );

    if (!matched) return 0;

    let score = 10;

    if (question.includes(phrase)) score += 120;
    if (itemKeywords.includes(phrase)) score += 100;
    if (category.includes(phrase)) score += 45;
    if (sectionKeywords.includes(phrase)) score += 35;
    if (answer.includes(phrase)) score += 20;

    words.forEach((word) => {
        const alternatives = getAlternatives(word);

        if (alternatives.some((term) => question.includes(term))) {
            score += 25;
        }

        if (alternatives.some((term) => itemKeywords.includes(term))) {
            score += 35;
        }
    });

    return score;
}

/* =========================================================
   SHARED HELP STATE
========================================================= */

function useHelpData(content) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [openQuestion, setOpenQuestion] = useState(null);

    const activeCategory = content.sections.some(
        (section) => section.id === selectedCategory,
    )
        ? selectedCategory
        : content.sections[0]?.id;

    const currentSection = content.sections.find(
        (section) => section.id === activeCategory,
    );

    const query = normalizeSearch(searchQuery);

    const searchResults = useMemo(() => {
        if (!query) return [];

        return content.sections
            .flatMap((section, sectionIndex) =>
                section.questions.map((item, itemIndex) => ({
                    ...item,
                    categoryId: section.id,
                    categoryTitle: section.title,
                    score: calculateSearchScore(item, section, query),
                    order: sectionIndex * 100 + itemIndex,
                })),
            )
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score || a.order - b.order);
    }, [content, query]);

    const displayed = query ? searchResults : currentSection?.questions || [];

    const totalQuestions = content.sections.reduce(
        (sum, section) => sum + section.questions.length,
        0,
    );

    const clearSearch = () => {
        setSearchQuery('');
        setOpenQuestion(null);
    };

    const selectCategory = (id) => {
        setSelectedCategory(id);
        setSearchQuery('');
        setOpenQuestion(null);
    };

    const updateSearch = (value) => {
        setSearchQuery(value);
        setOpenQuestion(null);
    };

    const toggleQuestion = (key) => {
        setOpenQuestion((previous) => (previous === key ? null : key));
    };

    return {
        activeCategory,
        currentSection,
        searchQuery,
        query,
        displayed,
        totalQuestions,
        openQuestion,
        clearSearch,
        selectCategory,
        updateSearch,
        toggleQuestion,
    };
}

/* =========================================================
   PUBLIC QUESTION
========================================================= */

function PublicQuestion({ item, index, isOpen, onToggle, categoryTitle }) {
    return (
        <div className="min-w-0 border-b border-[#E4ECE7]! last:border-b-0">
            <button
                type="button"
                aria-expanded={isOpen}
                onClick={onToggle}
                className={`flex w-full min-w-0 items-start gap-3 px-4 py-5 text-left transition-colors sm:gap-4 sm:px-6 sm:py-5.5 ${
                    isOpen ? 'bg-[#F7FAF8]!' : 'hover:bg-[#FAFCFA]!'
                }`}
            >
                <span className="mt-0.5 shrink-0 text-[12px] tabular-nums text-[#93A99E]!">
                    {String(index + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1">
                    {categoryTitle && (
                        <span className="mb-1.5 block text-[11px] font-medium text-[#0F766E]!">
                            {categoryTitle}
                        </span>
                    )}

                    <span
                        className={`block break-words text-[14px] font-medium leading-7 sm:text-[15px] ${
                            isOpen ? 'text-[#0E5D50]!' : 'text-[#24463C]!'
                        }`}
                    >
                        {item.question}
                    </span>
                </span>

                <ChevronDown
                    size={17}
                    className={`mt-1 shrink-0 text-[#829C90]! transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="min-w-0 bg-[#F7FAF8]! pb-5 pl-[43px] pr-4 sm:pl-[64px] sm:pr-10">
                    <p className="max-w-[790px] break-words text-[13px] leading-[2] text-[#5A7369]! sm:text-[14px]">
                        {item.answer}
                    </p>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   PUBLIC HELP PAGE
========================================================= */

function PublicHelpPage() {
    const {
        activeCategory,
        currentSection,
        searchQuery,
        query,
        displayed,
        totalQuestions,
        openQuestion,
        clearSearch,
        selectCategory,
        updateSearch,
        toggleQuestion,
    } = useHelpData(PUBLIC_CONTENT);

    const scrollToAnswers = () => {
        document.getElementById('public-help-answers')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const selectAndScroll = (id) => {
        selectCategory(id);
        requestAnimationFrame(scrollToAnswers);
    };

    const nextCategory = () => {
        const index = PUBLIC_CONTENT.sections.findIndex(
            (section) => section.id === activeCategory,
        );

        const next =
            PUBLIC_CONTENT.sections[
                (index + 1) % PUBLIC_CONTENT.sections.length
            ];

        selectAndScroll(next.id);
    };

    return (
        <main
            lang="bn"
            className="w-full min-w-0 bg-[#F8FAF8]! font-['Noto_Sans_Bengali',sans-serif] text-[#173D33]!"
        >
            {/* HERO */}
            <section className="border-b border-[#DCE8E0]! bg-[#EDF5EF]!">
                <div className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-7 sm:py-14 lg:px-8 lg:py-16">
                    <div className="max-w-[760px] mt-20">
                        <div className="mb-4 flex items-center gap-2.5">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F766E]!" />

                            <span className="text-[11px] font-semibold text-[#0F766E]! sm:text-[12px]">
                                স্ট্যান্ড ফর পিপল / সহায়তা কেন্দ্র
                            </span>
                        </div>

                        <h1 className="text-[27px] font-semibold leading-[1.55] tracking-[-0.025em] text-[#163D32]! sm:text-[35px] lg:text-[40px]">
                            {PUBLIC_CONTENT.title}
                        </h1>

                        <p className="mt-3 max-w-[650px] text-[14px] leading-[1.95] text-[#59746A]! sm:text-[15px]">
                            {PUBLIC_CONTENT.description}
                        </p>

                        <div className="relative mt-7 w-full max-w-[690px]">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#739185]!"
                            />

                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) =>
                                    updateSearch(event.target.value)
                                }
                                placeholder="বাংলা, English বা Banglish-এ খুঁজুন..."
                                aria-label="সহায়তার উত্তর খুঁজুন"
                                className="h-[52px] w-full min-w-0 appearance-none border border-[#C9DCD0]! bg-white! pl-11 pr-11 text-[13px] text-[#173D33]! outline-none placeholder:text-[#8CA199]! focus:border-[#0F766E]! sm:h-[56px] sm:text-[14px]"
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    aria-label="অনুসন্ধান মুছুন"
                                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[#789086]!"
                                >
                                    <X size={17} />
                                </button>
                            )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5">
                            <span className="text-[11px] text-[#799087]!">
                                জনপ্রিয় বিষয়
                            </span>

                            {[
                                {
                                    label: 'অনুদান',
                                    id: 'campaigns',
                                },
                                {
                                    label: 'স্বেচ্ছাসেবা',
                                    id: 'volunteering',
                                },
                                {
                                    label: 'সহায়তার আবেদন',
                                    id: 'assistance',
                                },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => selectAndScroll(item.id)}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0F766E]! hover:text-[#115E59]!"
                                >
                                    {item.label}
                                    <ArrowUpRight size={12} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <div className="mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-7 sm:py-14 lg:px-8">
                {!query && (
                    <section>
                        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="text-[22px] font-semibold text-[#173D33]! sm:text-[25px]">
                                    কোন বিষয়ে জানতে চান?
                                </h2>

                                <p className="mt-1.5 text-[13px] leading-7 text-[#71867B]! sm:text-[14px]">
                                    আপনার প্রয়োজন অনুযায়ী একটি বিষয় নির্বাচন
                                    করুন।
                                </p>
                            </div>

                            <span className="text-[12px] text-[#7E9489]!">
                                {PUBLIC_CONTENT.sections.length}
                                টি বিভাগ
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {PUBLIC_CONTENT.sections.map((section) => {
                                const Icon = section.icon;
                                const active = activeCategory === section.id;

                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() =>
                                            selectCategory(section.id)
                                        }
                                        aria-pressed={active}
                                        className={`group flex min-h-[110px] min-w-0 items-start gap-3.5 border p-4 text-left transition-colors sm:p-5 ${
                                            active
                                                ? 'border-[#8CB8A4]! bg-[#EAF4EE]!'
                                                : 'border-[#DDE8E1]! bg-white! hover:border-[#AACABD]! hover:bg-[#F6FAF7]!'
                                        }`}
                                    >
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center border ${
                                                active
                                                    ? 'border-[#C3DFD0]! bg-white! text-[#0F766E]!'
                                                    : 'border-[#DFEDE4]! bg-[#EDF6EF]! text-[#367C68]!'
                                            }`}
                                        >
                                            <Icon size={19} strokeWidth={1.7} />
                                        </div>

                                        <div className="min-w-0 flex-1 pt-0.5">
                                            <h3 className="text-[14px] font-semibold leading-6 text-[#21473B]!">
                                                {section.title}
                                            </h3>

                                            <p className="mt-1 text-[12px] leading-[1.8] text-[#789084]!">
                                                {section.description}
                                            </p>
                                        </div>

                                        <ArrowUpRight
                                            size={14}
                                            className="mt-1 shrink-0 text-[#A3B8AD]! group-hover:text-[#0F766E]!"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* FAQ */}
                <section
                    id="public-help-answers"
                    className={`scroll-mt-24 ${query ? '' : 'mt-12 sm:mt-14'}`}
                >
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                        <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="h-[2px] w-6 bg-[#0F766E]!" />

                                <span className="text-[11px] font-semibold text-[#0F766E]!">
                                    {query ? 'অনুসন্ধান' : 'প্রশ্ন ও উত্তর'}
                                </span>
                            </div>

                            <h2 className="text-[22px] font-semibold text-[#173D33]! sm:text-[25px]">
                                {query
                                    ? 'অনুসন্ধানের ফলাফল'
                                    : currentSection?.title}
                            </h2>

                            <p className="mt-1 break-words text-[13px] leading-7 text-[#71867B]!">
                                {query
                                    ? `“${searchQuery.trim()}” এর জন্য ${displayed.length}টি ফলাফল পাওয়া গেছে`
                                    : currentSection?.description}
                            </p>
                        </div>

                        {!query && (
                            <span className="text-[12px] text-[#7E9489]!">
                                {displayed.length}টি প্রশ্ন
                            </span>
                        )}
                    </div>

                    <div className="min-w-0 overflow-hidden border border-[#DFE9E2]! bg-white!">
                        {displayed.length ? (
                            displayed.map((item, index) => {
                                const key = `${
                                    query ? item.categoryId : activeCategory
                                }-${item.question}`;

                                return (
                                    <PublicQuestion
                                        key={key}
                                        item={item}
                                        index={index}
                                        isOpen={openQuestion === key}
                                        onToggle={() => toggleQuestion(key)}
                                        categoryTitle={
                                            query ? item.categoryTitle : null
                                        }
                                    />
                                );
                            })
                        ) : (
                            <div className="flex min-h-[230px] flex-col items-center justify-center px-5 py-10 text-center">
                                <FileQuestion
                                    size={27}
                                    className="text-[#8CA99B]!"
                                />

                                <h3 className="mt-4 text-[16px] font-semibold text-[#24473B]!">
                                    কোনো উত্তর পাওয়া যায়নি
                                </h3>

                                <p className="mt-2 max-w-sm text-[13px] leading-7 text-[#71877B]!">
                                    অন্য কোনো শব্দ দিয়ে খুঁজুন অথবা বিষয়গুলো
                                    থেকে আপনার প্রয়োজনীয় বিভাগ নির্বাচন করুন।
                                </p>

                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="mt-5 border border-[#BCD5C7]! px-5 py-2.5 text-[13px] font-medium text-[#0F766E]!"
                                >
                                    অনুসন্ধান মুছুন
                                </button>
                            </div>
                        )}
                    </div>

                    {!query && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-[12px] text-[#81958B]!">
                                মোট {totalQuestions}টি প্রশ্নের উত্তর
                            </p>

                            <button
                                type="button"
                                onClick={nextCategory}
                                className="inline-flex items-center gap-2 text-[12px] font-medium text-[#0F766E]!"
                            >
                                পরবর্তী বিষয়
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    )}
                </section>

                {/* SUPPORT */}
                <section className="mt-12 border-t border-[#DFE9E2]! pt-7 sm:mt-14 sm:pt-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D5E7DB]! bg-[#EAF4EE]! text-[#0F766E]!">
                                <LifeBuoy size={19} />
                            </div>

                            <div className="min-w-0">
                                <h2 className="text-[16px] font-semibold text-[#21483B]!">
                                    এখনও সাহায্য প্রয়োজন?
                                </h2>

                                <p className="mt-1.5 max-w-[650px] text-[13px] leading-7 text-[#71877B]!">
                                    আপনার প্রশ্নের উত্তর না পেলে স্ট্যান্ড ফর
                                    পিপল সম্পর্কে আরও জানুন এবং যোগাযোগের উপায়
                                    দেখুন।
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/about"
                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start border border-[#BDD5C7]! bg-white! px-4 text-[12px] font-medium text-[#0F766E]! hover:bg-[#EDF6F0]! sm:self-center"
                        >
                            আমাদের সম্পর্কে
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

/* =========================================================
   DASHBOARD QUESTION
========================================================= */

function DashboardQuestion({ item, index, isOpen, onToggle, categoryTitle }) {
    return (
        <div
            className={`min-w-0 border-b border-[#29323E]! last:border-b-0 ${
                isOpen ? 'bg-[#171F29]!' : 'hover:bg-[#151C25]!'
            }`}
        >
            <button
                type="button"
                aria-expanded={isOpen}
                onClick={onToggle}
                className="flex w-full min-w-0 items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5 lg:px-6"
            >
                <span className="mt-0.5 shrink-0 text-[11px] tabular-nums text-[#738397]!">
                    {String(index + 1).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1">
                    {categoryTitle && (
                        <span className="mb-1.5 block text-[11px] font-medium text-[#91A5B9]!">
                            {categoryTitle}
                        </span>
                    )}

                    <span
                        className={`block break-words text-[13px] font-medium leading-[1.75] sm:text-[14px] ${
                            isOpen ? 'text-[#E6ECF3]!' : 'text-[#BECAD7]!'
                        }`}
                    >
                        {item.question}
                    </span>
                </span>

                <ChevronDown
                    size={17}
                    className={`mt-0.5 shrink-0 text-[#8D9DAF]! transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="min-w-0 pb-5 pl-[43px] pr-4 sm:pl-[63px] sm:pr-7 lg:pr-9">
                    <p className="max-w-[850px] break-words text-[13px] leading-[1.9] text-[#A3B0BF]!">
                        {item.answer}
                    </p>
                </div>
            )}
        </div>
    );
}

/* =========================================================
   DASHBOARD HELP PAGE
========================================================= */

/* =========================================================
   DASHBOARD PAGE HEADER — USERS PAGE VISUAL LANGUAGE
   If your project exports a shared PageHeader, replace this
   local component with that import.
========================================================= */

function PageHeader({ title, subtitle, action }) {
    return (
        <header className="mb-7 min-w-0 border-b border-[#303844]! pb-8 sm:mb-8 sm:pb-9">
            <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0 flex-1">
                    <h1 className="break-words font-['Fraunces',serif] text-[34px] font-normal leading-[1.2] tracking-[-0.035em] text-[#F0F1F3]! sm:text-[44px] lg:text-[54px]">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-4 max-w-[800px] text-[14px] leading-[1.8] text-[#B2BDCC]! sm:text-[15px]">
                            {subtitle}
                        </p>
                    )}
                </div>
                {action && (
                    <div className="flex min-w-0 shrink-0 items-center lg:justify-end">
                        {action}
                    </div>
                )}
            </div>
        </header>
    );
}

function DashboardHelpPage({ content }) {
    const {
        activeCategory,
        currentSection,
        searchQuery,
        query,
        displayed,
        totalQuestions,
        openQuestion,
        clearSearch,
        selectCategory,
        updateSearch,
        toggleQuestion,
    } = useHelpData(content);

    const [topicsOpen, setTopicsOpen] = useState(false);

    const CurrentIcon = currentSection?.icon;

    const changeCategory = (id) => {
        selectCategory(id);
        setTopicsOpen(false);
    };

    return (
        <main className="w-full min-w-0 max-w-full font-sans text-[#DDE5ED]!">
            <div className="w-full min-w-0 max-w-[1440px]">
                {/* PAGE HEADER — MATCHES DASHBOARD USERS PAGE */}
                <PageHeader
                    title={content.title}
                    subtitle={content.description}
                    action={
                        <div className="flex items-center gap-2 text-[12px] text-[#91A0B2]!">
                            <BookOpen size={15} strokeWidth={1.7} />
                            <span>{totalQuestions} helpful answers</span>
                        </div>
                    }
                />

                {/* SEARCH — SEPARATE FROM THE PAGE HEADER */}
                <div className="mb-7 w-full min-w-0 sm:mb-8">
                    <div className="relative w-full max-w-[680px]">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8395A8]!"
                        />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) =>
                                updateSearch(event.target.value)
                            }
                            placeholder="Search questions, topics or keywords..."
                            aria-label="Search help articles"
                            className="h-12 w-full min-w-0 appearance-none border border-[#34404E]! bg-[#151C25]! pl-11 pr-11 text-[13px] text-[#E4EBF3]! outline-none placeholder:text-[#7F90A3]! focus:border-[#61758B]! sm:h-[50px] sm:text-[14px]"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                aria-label="Clear search"
                                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-[#91A0B2]! hover:text-[#E8EEF5]!"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* CONTENT LAYOUT */}
                <div className="grid w-full min-w-0 grid-cols-1 items-start gap-4 sm:gap-5 min-[1180px]:grid-cols-[240px_minmax(0,1fr)] min-[1440px]:grid-cols-[260px_minmax(0,1fr)]">
                    {/* TOPICS */}
                    <aside className="w-full min-w-0">
                        {/* MOBILE / TABLET TOPICS */}
                        <div className="min-[1180px]:hidden">
                            <div className="overflow-hidden border border-[#303A47]! bg-[#111820]!">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTopicsOpen((previous) => !previous)
                                    }
                                    aria-expanded={topicsOpen}
                                    aria-controls="help-topic-selector"
                                    className="flex min-h-[58px] w-full min-w-0 items-center gap-3 px-4 py-3 text-left sm:px-5"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#344252]! bg-[#202B37]! text-[#B5C6D7]!">
                                        {CurrentIcon && (
                                            <CurrentIcon size={17} />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <span className="block text-[10px] font-medium uppercase tracking-[0.08em] text-[#8192A5]!">
                                            Browse help topics
                                        </span>

                                        <span className="mt-0.5 block truncate text-[13px] font-semibold text-[#DCE5EE]!">
                                            {currentSection?.title}
                                        </span>
                                    </div>

                                    <span className="hidden shrink-0 text-[11px] text-[#8192A5]! sm:block">
                                        {content.sections.length} categories
                                    </span>

                                    <ChevronDown
                                        size={17}
                                        className={`shrink-0 text-[#9AABBD]! transition-transform ${
                                            topicsOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {topicsOpen && (
                                    <nav
                                        id="help-topic-selector"
                                        aria-label="Help topics"
                                        className="grid grid-cols-1 gap-1 border-t border-[#303A47]! p-2 sm:grid-cols-2 sm:p-3"
                                    >
                                        {content.sections.map((section) => {
                                            const Icon = section.icon;

                                            const active =
                                                activeCategory === section.id;

                                            return (
                                                <button
                                                    key={section.id}
                                                    type="button"
                                                    onClick={() =>
                                                        changeCategory(
                                                            section.id,
                                                        )
                                                    }
                                                    aria-pressed={active}
                                                    className={`flex min-h-[46px] min-w-0 items-center gap-3 border px-3 text-left ${
                                                        active
                                                            ? 'border-[#425368]! bg-[#202B38]!'
                                                            : 'border-transparent! hover:bg-[#1B232D]!'
                                                    }`}
                                                >
                                                    <Icon
                                                        size={16}
                                                        className={
                                                            active
                                                                ? 'shrink-0 text-[#C4D4E4]!'
                                                                : 'shrink-0 text-[#8293A6]!'
                                                        }
                                                    />

                                                    <span
                                                        className={`min-w-0 flex-1 break-words text-[12px] font-medium leading-5 ${
                                                            active
                                                                ? 'text-[#E7EDF4]!'
                                                                : 'text-[#A2AFBE]!'
                                                        }`}
                                                    >
                                                        {section.title}
                                                    </span>

                                                    <span className="shrink-0 text-[11px] text-[#8192A5]!">
                                                        {
                                                            section.questions
                                                                .length
                                                        }
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </nav>
                                )}
                            </div>
                        </div>

                        {/* DESKTOP TOPICS */}
                        <div className="hidden overflow-hidden border border-[#29323E]! bg-[#10151C]! min-[1180px]:block">
                            <div className="border-b border-[#29323E]! bg-[#191F28]! px-4 py-4">
                                <h2 className="text-[14px] font-semibold text-[#DFE5EC]!">
                                    Help topics
                                </h2>

                                <p className="mt-1 text-[12px] text-[#91A0B1]!">
                                    Browse by category
                                </p>
                            </div>

                            <nav
                                aria-label="Help topics"
                                className="space-y-1 p-2"
                            >
                                {content.sections.map((section) => {
                                    const Icon = section.icon;

                                    const active =
                                        activeCategory === section.id;

                                    return (
                                        <button
                                            key={section.id}
                                            type="button"
                                            onClick={() =>
                                                changeCategory(section.id)
                                            }
                                            aria-pressed={active}
                                            className={`flex min-h-[48px] w-full min-w-0 items-center gap-2.5 border-l-2 px-3 text-left transition-colors ${
                                                active
                                                    ? 'border-[#A4B8CD]! bg-[#202B38]!'
                                                    : 'border-transparent! hover:bg-[#1B232D]!'
                                            }`}
                                        >
                                            <Icon
                                                size={16}
                                                className={
                                                    active
                                                        ? 'shrink-0 text-[#C4D4E4]!'
                                                        : 'shrink-0 text-[#8392A3]!'
                                                }
                                            />

                                            <span
                                                className={`min-w-0 flex-1 break-words text-[12px] font-medium leading-5 ${
                                                    active
                                                        ? 'text-[#E7EDF4]!'
                                                        : 'text-[#A2AFBE]!'
                                                }`}
                                            >
                                                {section.title}
                                            </span>

                                            <span className="shrink-0 text-[11px] tabular-nums text-[#8392A3]!">
                                                {section.questions.length}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* QUESTIONS */}
                    <section className="w-full min-w-0">
                        <div className="w-full min-w-0 overflow-hidden border border-[#29323E]! bg-[#10161F]!">
                            <div className="flex min-w-0 items-start gap-3 border-b border-[#2D3743]! bg-[#191F28]! px-4 py-4 sm:px-5 sm:py-5">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#354252]! bg-[#202B37]! text-[#B5C6D7]!">
                                    {query ? (
                                        <Search size={17} />
                                    ) : CurrentIcon ? (
                                        <CurrentIcon size={17} />
                                    ) : null}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="break-words text-[16px] font-semibold text-[#E5EBF2]! sm:text-[18px]">
                                        {query
                                            ? 'Search results'
                                            : currentSection?.title}
                                    </h2>

                                    <p className="mt-1 break-words text-[12px] leading-[1.7] text-[#96A5B6]!">
                                        {query
                                            ? `${displayed.length} matching answers for "${searchQuery.trim()}"`
                                            : currentSection?.description}
                                    </p>
                                </div>

                                {!query && (
                                    <span className="hidden shrink-0 pt-1 text-[11px] text-[#8494A6]! sm:block">
                                        {displayed.length} questions
                                    </span>
                                )}
                            </div>

                            {displayed.length ? (
                                displayed.map((item, index) => {
                                    const key = `${
                                        query ? item.categoryId : activeCategory
                                    }-${item.question}`;

                                    return (
                                        <DashboardQuestion
                                            key={key}
                                            item={item}
                                            index={index}
                                            categoryTitle={
                                                query
                                                    ? item.categoryTitle
                                                    : null
                                            }
                                            isOpen={openQuestion === key}
                                            onToggle={() => toggleQuestion(key)}
                                        />
                                    );
                                })
                            ) : (
                                <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-10 text-center">
                                    <FileQuestion
                                        size={26}
                                        className="text-[#8394A6]!"
                                    />

                                    <h3 className="mt-4 text-[15px] font-semibold text-[#E1E8F0]!">
                                        No matching answers
                                    </h3>

                                    <p className="mt-2 max-w-sm text-[13px] leading-6 text-[#97A6B7]!">
                                        Try another keyword or browse the
                                        available help topics.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="mt-5 border border-[#3A4654]! px-4 py-2.5 text-[12px] text-[#C9D5E1]! hover:bg-[#202A35]!"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* SUPPORT FOOTER */}
                <footer className="mt-7 border-t border-[#29323E]! pt-6 sm:mt-9">
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#35404E]! bg-[#19212B]! text-[#A9B9CA]!">
                                <LifeBuoy size={17} />
                            </div>

                            <div className="min-w-0">
                                <h2 className="text-[14px] font-semibold text-[#E2E8EF]!">
                                    Still need assistance?
                                </h2>

                                <p className="mt-1 max-w-[650px] text-[12px] leading-6 text-[#94A3B5]!">
                                    Couldn’t find what you need? Learn more
                                    about Stand For People and how to get in
                                    touch.
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/about"
                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start border border-[#35404E]! px-4 text-[12px] text-[#C7D2DE]! hover:bg-[#1B2530]! sm:self-center"
                        >
                            About Stand For People
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
}

/* =========================================================
   ROLE DETECTION
========================================================= */

function getUserRole() {
    try {
        const stored =
            localStorage.getItem('user') || sessionStorage.getItem('user');

        if (!stored) return null;

        const user = JSON.parse(stored);

        const role = user?.role?.name ?? user?.role;

        if (typeof role !== 'string') {
            return null;
        }

        const normalized = role.trim().toLowerCase();

        return Object.prototype.hasOwnProperty.call(
            DASHBOARD_CONTENT,
            normalized,
        )
            ? normalized
            : null;
    } catch {
        return null;
    }
}

/* =========================================================
   MAIN EXPORT
========================================================= */

export default function HelpPage() {
    const location = useLocation();

    const pathname = location.pathname.replace(/\/+$/, '') || '/';

    if (pathname === '/help') {
        return <PublicHelpPage />;
    }

    const pathRole = pathname.match(
        /^\/(admin|individual|organization)\/dashboard(?:\/|$)/,
    )?.[1];

    const role = pathRole || getUserRole();

    return (
        <DashboardHelpPage
            content={DASHBOARD_CONTENT[role] || DASHBOARD_CONTENT.individual}
        />
    );
}

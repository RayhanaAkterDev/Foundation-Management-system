import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ArrowUpRight,
    BookOpen,
    Building2,
    ChevronDown,
    CircleHelp,
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

import Input from '@/components/dashboard/DashboardInput';

/* ============================================================
   HELP CONTENT
============================================================ */

const HELP_CONTENT = {
    admin: {
        title: 'Admin Help Center',
        description:
            'Guidance for managing platform operations, reviewing records, and supporting your community.',
        sections: [
            {
                id: 'users',
                title: 'Users & accounts',
                icon: UsersRound,
                description: 'Accounts, permissions and user information',
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
                icon: Building2,
                description: 'Profiles, verification and management',
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
                icon: Heart,
                description: 'Campaign records and contributions',
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
                icon: HandHeart,
                description: 'Members, requests and invitations',
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
                icon: LifeBuoy,
                description: 'Submitted requests and review actions',
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
                icon: UserRound,
                description: 'Profile, password and account access',
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
                icon: Heart,
                description: 'Contributions and donation history',
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
                icon: HandHeart,
                description: 'Participation and campaign activities',
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
                icon: LifeBuoy,
                description: 'Requesting assistance and tracking progress',
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
                icon: Building2,
                description: 'Identity, details and verification',
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
                icon: Heart,
                description: 'Campaigns, funding and updates',
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
                icon: UsersRound,
                description: 'Volunteer participation and activities',
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
                icon: LifeBuoy,
                description: 'Assistance requests and reporting',
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

const GENERAL_CONTENT = {
    title: 'How can we help?',
    description:
        'Find answers about Stand For People, discover how to participate, and learn how to get the support you need.',
    sections: [
        {
            id: 'getting-started',
            title: 'Getting started',
            icon: BookOpen,
            description: 'Learn about the platform',
            questions: [
                {
                    question: 'What is Stand For People?',
                    answer: 'Stand For People is a humanitarian coordination platform that connects individuals, volunteers, organizations and supporters to make assistance more accessible and coordinated.',
                },
                {
                    question: 'Who can use Stand For People?',
                    answer: 'People seeking assistance, individuals interested in volunteering or donating, and organizations working on humanitarian initiatives can participate through the features available to them.',
                },
                {
                    question: 'How do I create an account?',
                    answer: 'Open the registration page, choose the appropriate account type, and provide the required information. After registration, sign in to access the features available to your account.',
                },
            ],
        },
        {
            id: 'campaigns',
            title: 'Campaigns & donations',
            icon: Heart,
            description: 'Find causes and contribute',
            questions: [
                {
                    question: 'How do I find a campaign to support?',
                    answer: 'Browse the Campaigns page to explore available causes. Open a campaign to read its purpose, funding information, and other details before contributing.',
                },
                {
                    question: 'How can I make a donation?',
                    answer: 'Open a campaign you want to support and follow its available donation process. Review the payment information carefully before completing your contribution.',
                },
                {
                    question: 'Can I review campaign progress?',
                    answer: 'Campaign details may include the funding target, amount raised, and progress information. The information shown depends on the campaign record.',
                },
            ],
        },
        {
            id: 'assistance',
            title: 'Requesting assistance',
            icon: HandHeart,
            description: 'Understand how to seek support',
            questions: [
                {
                    question: 'How can I request help?',
                    answer: 'Use the Request Help feature and provide the necessary details about your situation. Clear and accurate information helps the relevant people understand your request.',
                },
                {
                    question: 'Does submitting a request guarantee assistance?',
                    answer: 'No. Submitting a request allows it to enter the applicable review and coordination process. Assistance depends on available resources, eligibility, and the circumstances of the request.',
                },
                {
                    question: 'How can I check the progress of my request?',
                    answer: 'If request tracking is available for your account, sign in and open the Help Requests section of your dashboard.',
                },
            ],
        },
        {
            id: 'volunteering',
            title: 'Volunteering',
            icon: UsersRound,
            description: 'Contribute your time and skills',
            questions: [
                {
                    question: 'How can I become a volunteer?',
                    answer: 'Explore the available volunteering opportunities and follow the application or participation process provided by the platform.',
                },
                {
                    question: 'Do I need previous volunteering experience?',
                    answer: 'Requirements may vary depending on the activity. Some opportunities may welcome new volunteers, while others may require particular skills or experience.',
                },
            ],
        },
        {
            id: 'security',
            title: 'Account & safety',
            icon: ShieldCheck,
            description: 'Protect your information',
            questions: [
                {
                    question: 'What should I do if I forget my password?',
                    answer: 'Use the password recovery option on the login page, if available, and follow the instructions to regain access to your account.',
                },
                {
                    question: 'How can I keep my account secure?',
                    answer: 'Use a strong, unique password, avoid sharing your login details, and check that you are using the official Stand For People website before entering sensitive information.',
                },
                {
                    question:
                        'What information should I avoid sharing publicly?',
                    answer: 'Avoid publishing passwords, banking credentials, identity documents, or other sensitive personal information in public campaign comments or messages.',
                },
            ],
        },
    ],
};

/* ============================================================
   ROLE DETECTION
============================================================ */

function getUserRole() {
    try {
        const stored =
            localStorage.getItem('user') || sessionStorage.getItem('user');

        if (!stored) return null;

        const user = JSON.parse(stored);
        const role = user?.role?.name ?? user?.role;

        if (typeof role !== 'string') return null;

        const normalized = role.trim().toLowerCase();

        return Object.prototype.hasOwnProperty.call(HELP_CONTENT, normalized)
            ? normalized
            : null;
    } catch {
        return null;
    }
}

/* ============================================================
   CATEGORY NAVIGATION
============================================================ */

function CategoryNavigation({
    sections,
    selectedCategory,
    onSelect,
    isPublic,
}) {
    return (
        <aside className="min-w-0 lg:sticky lg:top-6">
            {/* DESKTOP */}
            <div className="hidden overflow-hidden border border-[#29323E] bg-[#10151C] lg:block">
                <div className="border-b border-[#29323E] bg-[#191F28] px-5 py-5">
                    <h2 className="!text-[15px] !font-semibold !text-[#DFE5EC]">
                        Help topics
                    </h2>
                    <p className="mt-1 !text-[13px] !text-[#91A0B1]">
                        Browse by category
                    </p>
                </div>

                <nav aria-label="Help topics" className="space-y-1 p-2.5">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const active = selectedCategory === section.id;

                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => onSelect(section.id)}
                                aria-pressed={active}
                                className={`group flex min-h-[54px] w-full items-center gap-3 border-l-2 px-3.5 text-left transition-colors duration-150 ${
                                    active
                                        ? isPublic
                                            ? 'border-[#6BAE9F] bg-[#182A29]'
                                            : 'border-[#A4B8CD] bg-[#202B38]'
                                        : 'border-transparent hover:bg-[#1B232D]'
                                }`}
                            >
                                <Icon
                                    size={17}
                                    strokeWidth={1.7}
                                    className={`shrink-0 ${
                                        active
                                            ? 'text-[#C4D4E4]'
                                            : 'text-[#8392A3] group-hover:text-[#B6C3D1]'
                                    }`}
                                />

                                <span
                                    className={`min-w-0 flex-1 !text-[13px] !font-medium leading-5 ${
                                        active
                                            ? '!text-[#E7EDF4]'
                                            : '!text-[#A2AFBE] group-hover:!text-[#D6DEE7]'
                                    }`}
                                >
                                    {section.title}
                                </span>

                                <span
                                    className={`shrink-0 text-[12px] tabular-nums ${
                                        active
                                            ? 'text-[#C2CEDA]'
                                            : 'text-[#718194]'
                                    }`}
                                >
                                    {section.questions.length}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* MOBILE & TABLET */}
            <div className="lg:hidden">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="!text-[14px] !font-semibold !text-[#DFE5EC]">
                        Help topics
                    </h2>
                    <span className="!text-[12px] !text-[#8392A3]">
                        {sections.length} categories
                    </span>
                </div>

                <nav
                    aria-label="Help topics"
                    className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const active = selectedCategory === section.id;

                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => onSelect(section.id)}
                                aria-pressed={active}
                                className={`inline-flex min-h-11 shrink-0 items-center gap-2.5 border px-3.5 !text-[13px] !font-medium whitespace-nowrap transition-colors ${
                                    active
                                        ? isPublic
                                            ? 'border-[#426D63] bg-[#182A29] !text-[#DCEFE9]'
                                            : 'border-[#4D5E71] bg-[#202B38] !text-[#E6EDF5]'
                                        : 'border-[#29323E] bg-[#151C25] !text-[#9BAABA] hover:bg-[#202A35]'
                                }`}
                            >
                                <Icon size={16} strokeWidth={1.7} />
                                {section.title}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}

/* ============================================================
   QUESTION ACCORDION
============================================================ */

function QuestionItem({ item, isOpen, onToggle }) {
    return (
        <div
            className={`border-b border-[#29323E] last:border-b-0 transition-colors ${
                isOpen ? 'bg-[#171F29]' : 'hover:bg-[#151C25]'
            }`}
        >
            <button
                type="button"
                aria-expanded={isOpen}
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-5 px-5 py-[21px] text-left sm:px-7 sm:py-6"
            >
                <span
                    className={`min-w-0 !text-[14px] !font-medium leading-6 sm:!text-[15px] ${
                        isOpen ? '!text-[#E6ECF3]' : '!text-[#BECAD7]'
                    }`}
                >
                    {item.question}
                </span>

                <ChevronDown
                    size={18}
                    strokeWidth={1.7}
                    className={`shrink-0 text-[#8D9DAF] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="px-5 pb-6 sm:px-7 sm:pb-7">
                    <p className="max-w-[850px] !text-[14px] leading-[1.9] !text-[#A3B0BF]">
                        {item.answer}
                    </p>
                </div>
            )}
        </div>
    );
}

/* ============================================================
   MAIN HELP PAGE
============================================================ */

export default function HelpPage() {
    const location = useLocation();

    const isPublicHelp = location.pathname.replace(/\/+$/, '') === '/help';

    const role = getUserRole();

    const content =
        !isPublicHelp && role ? HELP_CONTENT[role] : GENERAL_CONTENT;

    const [selectedCategory, setSelectedCategory] = useState(
        content.sections[0]?.id ?? '',
    );

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

    const totalQuestions = content.sections.reduce(
        (sum, section) => sum + section.questions.length,
        0,
    );

    const query = searchQuery.trim().toLowerCase();

    const searchResults = useMemo(() => {
        if (!query) return [];

        return content.sections.flatMap((section) =>
            section.questions
                .filter(
                    (item) =>
                        item.question.toLowerCase().includes(query) ||
                        item.answer.toLowerCase().includes(query) ||
                        section.title.toLowerCase().includes(query),
                )
                .map((item) => ({
                    ...item,
                    categoryId: section.id,
                    categoryTitle: section.title,
                })),
        );
    }, [content, query]);

    const displayedQuestions = query
        ? searchResults
        : (currentSection?.questions ?? []);

    const handleCategoryChange = (id) => {
        setSelectedCategory(id);
        setSearchQuery('');
        setOpenQuestion(null);
    };

    const handleSearchChange = (eventOrValue) => {
        const value =
            typeof eventOrValue === 'string'
                ? eventOrValue
                : (eventOrValue?.target?.value ?? '');

        setSearchQuery(value);
        setOpenQuestion(null);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setOpenQuestion(null);
    };

    const SectionIcon = currentSection?.icon;

    return (
        <main className="min-h-full min-w-0 font-sans">
            <div className="w-full min-w-0">
                {/* ============================================
                    PAGE HEADER
                ============================================ */}

                <header className="border-b border-[#29323E] pb-7 sm:pb-9">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                        <div className="min-w-0">
                            <div className="mb-3 flex items-center gap-2.5">
                                <CircleHelp
                                    size={15}
                                    strokeWidth={1.8}
                                    className={
                                        isPublicHelp
                                            ? 'text-[#78B6A8]'
                                            : 'text-[#96A8BA]'
                                    }
                                />

                                <span className="!text-[11px] !font-semibold uppercase tracking-[0.12em] !text-[#91A0B2]">
                                    Stand For People / Support
                                </span>
                            </div>

                            <h1 className="!text-[27px] !font-semibold tracking-[-0.035em] !text-[#E5EAF0] sm:!text-[32px]">
                                {content.title}
                            </h1>

                            <p className="mt-2.5 max-w-[760px] !text-[14px] leading-7 !text-[#9CAABB] sm:!text-[15px]">
                                {content.description}
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 !text-[12px] !text-[#8998A9]">
                            <BookOpen size={15} strokeWidth={1.7} />
                            <span>{totalQuestions} helpful answers</span>
                        </div>
                    </div>

                    {/* SHARED SEARCH INPUT */}
                    <div className="relative mt-7 w-full max-w-[770px]">
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search questions, topics or keywords..."
                            icon={Search}
                            className="w-full"
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                aria-label="Clear search"
                                className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#91A0B2] hover:text-[#E8EEF5]"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </header>

                {/* ============================================
                    MAIN CONTENT
                ============================================ */}

                <div className="mt-7 grid min-w-0 items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-7 xl:grid-cols-[290px_minmax(0,1fr)] xl:gap-9">
                    <CategoryNavigation
                        sections={content.sections}
                        selectedCategory={activeCategory}
                        onSelect={handleCategoryChange}
                        isPublic={isPublicHelp}
                    />

                    <section className="min-w-0">
                        <div className="overflow-hidden border border-[#29323E] bg-[#10161F]">
                            {/* INTEGRATED CATEGORY HEADER */}
                            <div className="border-b border-[#2D3743] bg-[#191F28] px-5 py-5 sm:px-7 sm:py-6">
                                {query ? (
                                    <div className="flex items-start gap-3.5">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#354252] bg-[#202B37] text-[#B5C6D7]">
                                            <Search
                                                size={18}
                                                strokeWidth={1.7}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="!text-[18px] !font-semibold tracking-tight !text-[#E5EBF2] sm:!text-[19px]">
                                                Search results
                                            </h2>

                                            <p className="mt-1 !text-[13px] leading-5 !text-[#96A5B6]">
                                                {searchResults.length} matching{' '}
                                                {searchResults.length === 1
                                                    ? 'answer'
                                                    : 'answers'}{' '}
                                                for “{searchQuery.trim()}”
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3.5">
                                        {SectionIcon && (
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center border ${
                                                    isPublicHelp
                                                        ? 'border-[#345449] bg-[#1C332C] text-[#9CCABC]'
                                                        : 'border-[#354252] bg-[#202B37] text-[#B5C6D7]'
                                                }`}
                                            >
                                                <SectionIcon
                                                    size={19}
                                                    strokeWidth={1.7}
                                                />
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <h2 className="!text-[18px] !font-semibold tracking-tight !text-[#E5EBF2] sm:!text-[19px]">
                                                {currentSection?.title}
                                            </h2>

                                            <p className="mt-1 !text-[13px] leading-5 !text-[#96A5B6]">
                                                {currentSection?.description}
                                            </p>
                                        </div>

                                        <span className="hidden shrink-0 pt-1 !text-[12px] !text-[#8494A6] sm:block">
                                            {displayedQuestions.length}{' '}
                                            {displayedQuestions.length === 1
                                                ? 'question'
                                                : 'questions'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* FAQ LIST */}
                            {displayedQuestions.length > 0 ? (
                                <div>
                                    {displayedQuestions.map((item) => {
                                        const key = `${
                                            query
                                                ? item.categoryId
                                                : activeCategory
                                        }-${item.question}`;

                                        return (
                                            <div key={key}>
                                                {query && (
                                                    <div className="px-5 pt-4 sm:px-7">
                                                        <span className="!text-[11px] !font-semibold uppercase tracking-[0.08em] !text-[#8FA1B3]">
                                                            {item.categoryTitle}
                                                        </span>
                                                    </div>
                                                )}

                                                <QuestionItem
                                                    item={item}
                                                    isOpen={
                                                        openQuestion === key
                                                    }
                                                    onToggle={() => {
                                                        setOpenQuestion(
                                                            (previous) =>
                                                                previous === key
                                                                    ? null
                                                                    : key,
                                                        );
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-10 text-center">
                                    <FileQuestion
                                        size={27}
                                        strokeWidth={1.5}
                                        className="text-[#8394A6]"
                                    />

                                    <h3 className="mt-4 !text-[16px] !font-semibold !text-[#E1E8F0]">
                                        No matching answers
                                    </h3>

                                    <p className="mt-2 max-w-sm !text-[13px] leading-6 !text-[#97A6B7]">
                                        Try another keyword or browse the
                                        available help topics.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="mt-5 inline-flex min-h-10 items-center border border-[#3A4654] px-4 !text-[13px] !font-medium !text-[#C9D5E1] transition-colors hover:bg-[#202A35]"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* ============================================
                    SUPPORT FOOTER
                ============================================ */}

                <footer className="mt-10 border-t border-[#29323E] pt-6 sm:mt-12 sm:pt-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#35404E] bg-[#19212B] text-[#A9B9CA]">
                                <LifeBuoy size={18} strokeWidth={1.7} />
                            </div>

                            <div className="min-w-0">
                                <h2 className="!text-[15px] !font-semibold !text-[#E2E8EF]">
                                    Still need assistance?
                                </h2>

                                <p className="mt-1.5 max-w-[650px] !text-[13px] leading-6 !text-[#94A3B5]">
                                    Couldn't find what you need? Learn more
                                    about Stand For People and the ways to get
                                    in touch.
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/about"
                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start border border-[#35404E] px-4 !text-[13px] !font-medium !text-[#C7D2DE] transition-colors hover:border-[#526171] hover:bg-[#1B2530] hover:!text-[#EEF1F5] sm:self-center"
                        >
                            About Stand For People
                            <ArrowUpRight size={15} strokeWidth={1.7} />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
}

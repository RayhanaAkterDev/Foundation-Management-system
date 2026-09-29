import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import {
    TbArrowDownRight,
    TbArrowUpRight,
    TbBuildingCommunity,
    TbHeartHandshake,
    TbUsers,
} from 'react-icons/tb';

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

const API_URL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000/api';

/* -------------------------------------------------------------------------- */
/* CORE PEOPLE                                                                */
/* -------------------------------------------------------------------------- */
/*
 * These are intentionally separate from the live community API.
 * Replace the placeholder names/images with the actual project information.
 */

const corePeople = [
    {
        id: 'supervisor',
        role: 'প্রকল্প তত্ত্বাবধায়ক',
        name: 'আপনার শিক্ষকের নাম',
        description:
            'প্রকল্পের ধারণা, দিকনির্দেশনা এবং একাডেমিক তত্ত্বাবধানে গুরুত্বপূর্ণ ভূমিকা।',
        image: null,
        imageLabel: 'শিক্ষকের ছবি',
    },
    {
        id: 'founder-one',
        role: 'প্রতিষ্ঠাতা',
        name: 'আপনার নাম',
        description:
            'Stand For People-এর ধারণা, পরিকল্পনা এবং প্ল্যাটফর্ম নির্মাণের সঙ্গে সরাসরি যুক্ত।',
        image: null,
        imageLabel: 'আপনার ছবি',
    },
    {
        id: 'founder-two',
        role: 'প্রতিষ্ঠাতা',
        name: 'আপনার পার্টনারের নাম',
        description:
            'প্ল্যাটফর্মের পরিকল্পনা, নির্মাণ এবং বিকাশের যাত্রায় সরাসরি যুক্ত।',
        image: null,
        imageLabel: 'পার্টনারের ছবি',
    },
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const getCollection = (payload, keys = []) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    for (const key of keys) {
        if (Array.isArray(payload?.[key])) {
            return payload[key];
        }
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    return [];
};

const getVolunteerName = (volunteer) =>
    volunteer?.user?.name || volunteer?.name || 'SP Volunteer';

const getOrganizationName = (organization) =>
    organization?.name || organization?.user?.name || 'SP Partner Organization';

const getInitials = (name = '') =>
    name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();

const normalizeList = (value, limit = 3) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean).slice(0, limit);
    }

    if (typeof value === 'string') {
        return value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, limit);
    }

    return [];
};

const toBengaliNumber = (number) =>
    String(number)
        .split('')
        .map((digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)] ?? digit)
        .join('');

/* -------------------------------------------------------------------------- */
/* SHARED VISUALS                                                             */
/* -------------------------------------------------------------------------- */

const ContributorAvatar = ({ name, image }) => {
    if (image) {
        return (
            <img
                src={image}
                alt={name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                onError={(event) => {
                    event.currentTarget.style.display = 'none';
                }}
            />
        );
    }

    return (
        <span className="flex h-full w-full items-center justify-center bg-primary-soft font-sans text-sm font-semibold text-primary">
            {getInitials(name) || 'SP'}
        </span>
    );
};

const CorePhoto = ({ person }) => {
    if (person.image) {
        return (
            <img
                src={person.image}
                alt={person.name}
                loading="lazy"
                className="h-full w-full object-cover"
            />
        );
    }

    return (
        <div className="flex h-full w-full items-center justify-center bg-[#e5e9df]">
            <div className="flex flex-col items-center gap-3 text-[#73877c]">
                <TbUsers size={34} strokeWidth={1} />

                <span className="text-xs">{person.imageLabel}</span>
            </div>
        </div>
    );
};

const SectionIndex = ({ number, label, dark = false }) => (
    <div className="flex items-center gap-3">
        <span
            className={`font-sans text-xs tracking-[0.16em] ${
                dark ? 'text-white!/50' : 'text-text-muted'
            }`}
        >
            {number}
        </span>

        <span
            className={`h-px w-8 ${dark ? 'bg-white/30' : 'bg-primary/40'}`}
        />

        <span
            className={`text-xs font-medium ${
                dark ? 'text-white!/75' : 'text-primary'
            }`}
        >
            {label}
        </span>
    </div>
);

/* -------------------------------------------------------------------------- */
/* TEAM PAGE                                                                  */
/* -------------------------------------------------------------------------- */

const Team = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [organizations, setOrganizations] = useState([]);

    const [communityLoading, setCommunityLoading] = useState(true);

    /* ---------------------------------------------------------------------- */
    /* LIVE COMMUNITY DATA                                                    */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        let cancelled = false;

        const loadCommunity = async () => {
            try {
                setCommunityLoading(true);

                const response = await fetch(`${API_URL}/public/community`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(
                        `Community request failed (HTTP ${response.status})`,
                    );
                }

                const payload = await response.json();

                if (cancelled) {
                    return;
                }

                const communityVolunteers = getCollection(payload, [
                    'volunteers',
                    'active_volunteers',
                ]);

                const communityOrganizations = getCollection(payload, [
                    'organizations',
                    'verified_organizations',
                    'partner_organizations',
                ]);

                setVolunteers(communityVolunteers);

                setOrganizations(communityOrganizations);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error('Community contributors loading error:', error);

                setVolunteers([]);
                setOrganizations([]);
            } finally {
                if (!cancelled) {
                    setCommunityLoading(false);
                }
            }
        };

        loadCommunity();

        return () => {
            cancelled = true;
        };
    }, []);

    /* ---------------------------------------------------------------------- */
    /* VISIBLE COMMUNITY ITEMS                                                */
    /* ---------------------------------------------------------------------- */

    const visibleVolunteers = volunteers.slice(0, 6);

    const visibleOrganizations = organizations.slice(0, 4);

    const hasCommunityData =
        visibleVolunteers.length > 0 || visibleOrganizations.length > 0;

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <main
            lang="bn"
            className="overflow-hidden bg-[#f8f7f2] font-bengali text-text-primary"
        >
            {/* =================================================================
                01 — OPENING
            ================================================================= */}

            <section className="relative overflow-hidden bg-[#f4f0e7]">
                <div className="container-width relative mt-16 sm:mt-20">
                    <div className="grid min-h-[580px] items-center gap-12 py-14 sm:min-h-[620px] sm:py-20 lg:min-h-[680px] lg:grid-cols-12 lg:gap-6 lg:py-24">
                        <div className="relative z-10 lg:col-span-8">
                            <SectionIndex number="০১" label="আমাদের পরিচয়" />

                            <h1 className="mt-8 max-w-[850px] text-[2.5rem] font-medium leading-[1.3] tracking-[-0.025em] sm:mt-9 sm:text-5xl sm:leading-[1.3] md:text-[3.8rem] lg:text-[4.65rem] lg:leading-[1.28] xl:text-[5rem]">
                                মানুষের জন্য
                                <span className="text-primary">
                                    {' '}
                                    একটি উদ্যোগ।
                                </span>
                                <br />
                                মানুষের হাতেই
                                <span className="block text-[#b17a36]">
                                    তার পথচলা।
                                </span>
                            </h1>

                            <div className="mt-8 flex flex-col gap-6 sm:mt-9 sm:flex-row sm:items-end sm:gap-12">
                                <p className="max-w-md text-[0.95rem] leading-[1.9] text-text-secondary sm:text-base sm:leading-[1.95]">
                                    একটি মানবিক প্ল্যাটফর্মের পেছনে থাকা মানুষ,
                                    তাদের সম্মিলিত প্রচেষ্টা এবং একটি
                                    ক্রমবর্ধমান কমিউনিটির গল্প।
                                </p>

                                <a
                                    href="#people"
                                    className="group inline-flex w-fit shrink-0 items-center gap-3 border-b border-primary/40 pb-2 text-sm font-medium text-primary transition-colors hover:border-primary"
                                >
                                    মানুষগুলোর সঙ্গে পরিচিত হোন
                                    <TbArrowDownRight
                                        size={19}
                                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* Decorative composition */}

                        <div className="relative hidden h-[420px] lg:col-span-4 lg:block">
                            <div className="absolute right-0 top-4 h-[300px] w-[230px] overflow-hidden bg-[#d9dfd3]">
                                <div className="flex h-full flex-col items-center justify-center gap-4 text-[#8b9c8b]">
                                    <TbHeartHandshake
                                        size={76}
                                        strokeWidth={0.8}
                                    />

                                    <span className="text-xs tracking-[0.2em]">
                                        PEOPLE FIRST
                                    </span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 flex h-[175px] w-[190px] flex-col justify-between bg-primary p-5 text-white!">
                                <TbHeartHandshake size={30} strokeWidth={1.2} />

                                <p className="max-w-[140px] text-sm leading-7">
                                    সহমর্মিতা থেকে সম্মিলিত উদ্যোগ।
                                </p>
                            </div>

                            <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-accent" />

                            <span className="absolute bottom-10 right-8 h-20 w-20 rounded-full border border-primary/20" />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d9d8cf] py-5">
                        <span className="text-[10px] font-medium tracking-[0.2em] text-text-muted">
                            STAND FOR PEOPLE
                        </span>

                        <span className="text-xs text-text-secondary">
                            মানুষ · সংযোগ · সহায়তা
                        </span>
                    </div>
                </div>
            </section>

            {/* =================================================================
                02 — CORE TEAM
            ================================================================= */}

            <section
                id="people"
                className="bg-[#f8f7f2] py-20 sm:py-24 lg:py-32"
            >
                <div className="container-width">
                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
                        <div className="lg:col-span-3">
                            <SectionIndex number="০২" label="যেখান থেকে শুরু" />

                            <p className="mt-5 max-w-[220px] text-sm leading-7 text-text-secondary">
                                একটি ধারণাকে বাস্তবে রূপ দেওয়ার পেছনে থাকে কিছু
                                মানুষের সময়, চিন্তা ও নিরলস প্রচেষ্টা।
                            </p>
                        </div>

                        <div className="lg:col-span-8 lg:col-start-5">
                            <h2 className="max-w-[760px] text-[2.15rem] font-medium leading-[1.42] tracking-[-0.02em] sm:text-4xl sm:leading-[1.45] lg:text-[3.45rem] lg:leading-[1.42]">
                                একটি ছোট দল।
                                <span className="text-primary">
                                    {' '}
                                    একটি বড় মানবিক উদ্দেশ্য।
                                </span>
                            </h2>
                        </div>
                    </div>

                    {/* Main team composition */}

                    <div className="mt-12 grid gap-12 sm:mt-16 lg:mt-20 lg:grid-cols-12 lg:gap-6">
                        {/* Supervisor */}

                        <article className="lg:col-span-7 lg:col-start-2">
                            <div className="relative">
                                <div className="aspect-[5/4] overflow-hidden bg-[#e5e9df] sm:aspect-[16/10]">
                                    <CorePhoto person={corePeople[0]} />
                                </div>

                                <span className="absolute bottom-0 right-0 hidden bg-[#f4f0e7] px-5 py-4 text-xs text-text-secondary sm:block">
                                    PROJECT SUPERVISION
                                </span>
                            </div>

                            <div className="mt-5 grid gap-4 border-t border-text-primary pt-4 sm:grid-cols-[1fr_1fr] sm:gap-8">
                                <div>
                                    <p className="text-xs font-medium text-primary">
                                        {corePeople[0].role}
                                    </p>

                                    <h3 className="mt-2 text-2xl font-medium sm:text-[1.8rem]">
                                        {corePeople[0].name}
                                    </h3>
                                </div>

                                <p className="max-w-md text-sm leading-7 text-text-secondary">
                                    {corePeople[0].description}
                                </p>
                            </div>
                        </article>

                        {/* Editorial note */}

                        <div className="hidden flex-col justify-end pb-8 lg:col-span-3 lg:col-start-10 lg:flex">
                            <span className="mb-5 h-px w-12 bg-accent" />

                            <p className="max-w-[240px] text-xl leading-[1.8]">
                                প্রতিটি ভালো উদ্যোগের শুরু হয় একটি ভাবনা থেকে।
                                তার বাস্তবায়ন আসে সম্মিলিত প্রচেষ্টায়।
                            </p>

                            <span className="mt-6 font-sans text-xs tracking-[0.15em] text-text-muted">
                                THE BEGINNING
                            </span>
                        </div>

                        {/* Founder one */}

                        <article className="lg:col-span-4 lg:col-start-2 lg:mt-20">
                            <div className="aspect-[4/5] overflow-hidden bg-[#e5e9df]">
                                <CorePhoto person={corePeople[1]} />
                            </div>

                            <div className="mt-5 border-t border-text-primary pt-4">
                                <p className="text-xs font-medium text-primary">
                                    {corePeople[1].role}
                                </p>

                                <h3 className="mt-2 text-2xl font-medium">
                                    {corePeople[1].name}
                                </h3>

                                <p className="mt-3 max-w-sm text-sm leading-7 text-text-secondary">
                                    {corePeople[1].description}
                                </p>
                            </div>
                        </article>

                        {/* Founder two */}

                        <article className="lg:col-span-4 lg:col-start-7 lg:mt-36">
                            <div className="aspect-[4/5] overflow-hidden bg-[#e5e9df]">
                                <CorePhoto person={corePeople[2]} />
                            </div>

                            <div className="mt-5 border-t border-text-primary pt-4">
                                <p className="text-xs font-medium text-primary">
                                    {corePeople[2].role}
                                </p>

                                <h3 className="mt-2 text-2xl font-medium">
                                    {corePeople[2].name}
                                </h3>

                                <p className="mt-3 max-w-sm text-sm leading-7 text-text-secondary">
                                    {corePeople[2].description}
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* =================================================================
                03 — TRANSITION TO COMMUNITY
            ================================================================= */}

            <section className="relative overflow-hidden bg-[#164f49] text-white!">
                <div className="container-width relative py-20 sm:py-24 lg:py-32">
                    <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-6">
                        <div className="lg:col-span-9 lg:col-start-2">
                            <SectionIndex
                                number="০৩"
                                label="একটি সম্মিলিত প্রচেষ্টা"
                                dark
                            />

                            <h2 className="mt-8 max-w-[900px] text-[2.05rem] font-medium leading-[1.48] tracking-[-0.015em] sm:text-4xl sm:leading-[1.5] lg:text-[3.45rem] lg:leading-[1.48]">
                                প্ল্যাটফর্মটি কয়েকজন মানুষ তৈরি করেছেন।
                                <span className="text-[#a9d2c7]">
                                    {' '}
                                    কিন্তু এর কাজ অনেক মানুষের অংশগ্রহণে এগিয়ে
                                    চলে।
                                </span>
                            </h2>
                        </div>

                        <div className="lg:col-span-4 lg:col-start-8">
                            <p className="text-sm leading-8 text-white!/70">
                                মানুষের প্রয়োজন, সহায়তার ইচ্ছা এবং সংগঠিত
                                মানবিক উদ্যোগ—SP এই আলাদা অংশগুলোকে একই
                                ব্যবস্থায় কাছাকাছি আনে।
                            </p>
                        </div>
                    </div>

                    <div className="mt-14 flex items-center justify-between border-t border-white/20 pt-5 sm:mt-16">
                        <span className="text-[10px] tracking-[0.2em] text-white!/50">
                            BEYOND THE FOUNDING TEAM
                        </span>

                        <TbArrowDownRight
                            size={22}
                            className="text-[#a9d2c7]"
                        />
                    </div>
                </div>
            </section>

            {/* =================================================================
                04 — LIVE COMMUNITY
            ================================================================= */}

            <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
                <div className="container-width">
                    {/* Intro */}

                    <div className="relative">
                        <SectionIndex number="০৪" label="বর্তমান নেটওয়ার্ক" />

                        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-10">
                            <div className="lg:col-span-8">
                                <h2 className="max-w-[900px] text-[2.25rem] font-medium leading-[1.35] tracking-[-0.02em] sm:text-4xl sm:leading-[1.4] lg:text-[3.65rem] lg:leading-[1.38]">
                                    পাশে থাকার মানুষগুলো
                                    <span className="text-primary">
                                        {' '}
                                        একসঙ্গে।
                                    </span>
                                </h2>
                            </div>

                            <div className="lg:col-span-3 lg:col-start-10 lg:flex lg:items-end">
                                <p className="max-w-[285px] text-sm leading-8 text-text-secondary">
                                    একটি সহায়তার পথ কখনো একা তৈরি হয় না।
                                    মানুষের সময়, দক্ষতা, অভিজ্ঞতা এবং
                                    প্রতিষ্ঠানের সক্ষমতা মিলেই তৈরি হয় এই
                                    নেটওয়ার্ক।
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Loading */}

                    {communityLoading && (
                        <div className="mt-16 border-t border-[#cfd8cf] pt-8 lg:mt-24">
                            <div className="grid gap-10 lg:grid-cols-2">
                                {[1, 2].map((item) => (
                                    <div key={item} className="animate-pulse">
                                        <div className="h-2.5 w-16 bg-primary-soft" />

                                        <div className="mt-6 h-6 w-44 bg-primary-soft" />

                                        <div className="mt-4 h-3 w-64 bg-primary-soft" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Live community */}

                    {!communityLoading && hasCommunityData && (
                        <div className="mt-16 lg:mt-24">
                            {/* ------------------------------------------------
                                    VOLUNTEERS
                                ------------------------------------------------ */}

                            {visibleVolunteers.length > 0 && (
                                <div className="relative">
                                    <div className="relative overflow-hidden bg-[#e8eee7] px-5 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
                                        {/* Decorative word */}

                                        <div className="pointer-events-none absolute -right-10 -top-16 select-none font-serif text-[8rem] font-medium leading-none text-[#dce5dc] sm:-right-8 sm:-top-20 sm:text-[14rem] lg:-right-10 lg:text-[18rem]">
                                            মানুষ
                                        </div>

                                        {/* Meta */}

                                        <div className="relative z-10 flex items-center justify-between">
                                            <span className="text-xs font-medium tracking-[0.08em] text-primary">
                                                আমাদের সঙ্গে
                                            </span>

                                            <span className="font-sans text-xs text-text-muted">
                                                {toBengaliNumber(
                                                    visibleVolunteers.length,
                                                )}{' '}
                                                জন
                                            </span>
                                        </div>

                                        {/* Heading */}

                                        <div className="relative z-10 mt-12 max-w-[720px] sm:mt-16 lg:mt-20">
                                            <h3 className="text-[2.25rem] font-medium leading-[1.25] tracking-[-0.02em] sm:text-5xl lg:text-[4.25rem] lg:leading-[1.2]">
                                                যাঁরা নিজেদের
                                                <br />
                                                <span className="text-primary">
                                                    সময় দিয়ে পাশে আছেন।
                                                </span>
                                            </h3>
                                        </div>

                                        {/* People */}

                                        <div className="relative z-10 mt-12 grid gap-8 sm:mt-16 lg:mt-20 lg:grid-cols-12 lg:items-end">
                                            {visibleVolunteers
                                                .slice(0, 5)
                                                .map((volunteer, index) => {
                                                    const name =
                                                        getVolunteerName(
                                                            volunteer,
                                                        );

                                                    const skills =
                                                        normalizeList(
                                                            volunteer?.skills,
                                                            2,
                                                        );

                                                    const image =
                                                        volunteer?.user
                                                            ?.avatar ||
                                                        volunteer?.user
                                                            ?.image ||
                                                        volunteer?.avatar ||
                                                        volunteer?.image ||
                                                        null;

                                                    const layoutClass =
                                                        index === 0
                                                            ? 'lg:col-span-5 lg:row-span-2'
                                                            : index === 1
                                                              ? 'lg:col-span-3 lg:col-start-6'
                                                              : index === 2
                                                                ? 'lg:col-span-4 lg:col-start-9'
                                                                : index === 3
                                                                  ? 'lg:col-span-3 lg:col-start-6'
                                                                  : 'lg:col-span-4 lg:col-start-9';

                                                    const imageAspect =
                                                        index === 0
                                                            ? 'aspect-[4/5]'
                                                            : index === 1
                                                              ? 'aspect-square'
                                                              : 'aspect-[5/4]';

                                                    return (
                                                        <article
                                                            key={
                                                                volunteer?.id ||
                                                                volunteer?.user_id ||
                                                                `${name}-${index}`
                                                            }
                                                            className={`group relative ${layoutClass}`}
                                                        >
                                                            <div
                                                                className={`relative overflow-hidden bg-[#d9e3d9] ${imageAspect}`}
                                                            >
                                                                <div className="h-full w-full">
                                                                    <ContributorAvatar
                                                                        name={
                                                                            name
                                                                        }
                                                                        image={
                                                                            image
                                                                        }
                                                                    />
                                                                </div>

                                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />

                                                                <span className="absolute left-4 top-4 font-sans text-[11px] text-white!/80">
                                                                    {toBengaliNumber(
                                                                        index +
                                                                            1,
                                                                    )}
                                                                </span>

                                                                <div className="absolute inset-x-5 bottom-5 text-white!">
                                                                    <p className="text-lg font-medium leading-tight sm:text-xl">
                                                                        {name}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-white!/75">
                                                                        স্বেচ্ছাসেবক
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {skills.length >
                                                                0 && (
                                                                <div className="mt-3 flex flex-wrap gap-x-2">
                                                                    {skills.map(
                                                                        (
                                                                            skill,
                                                                            skillIndex,
                                                                        ) => (
                                                                            <span
                                                                                key={`${skill}-${skillIndex}`}
                                                                                className="text-[11px] leading-6 text-text-secondary"
                                                                            >
                                                                                {
                                                                                    skill
                                                                                }

                                                                                {skillIndex <
                                                                                    skills.length -
                                                                                        1 && (
                                                                                    <span className="ml-2 text-primary/40">
                                                                                        /
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                        </article>
                                                    );
                                                })}
                                        </div>

                                        {/* Footer */}

                                        <div className="relative z-10 mt-12 border-t border-[#c8d3c7] pt-6 lg:mt-16">
                                            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                                                <p className="max-w-[390px] text-sm leading-7 text-text-secondary">
                                                    প্রত্যেক মানুষ নিজের
                                                    সামর্থ্য অনুযায়ী এই
                                                    যাত্রায় যুক্ত হন। কারও
                                                    সময়, কারও দক্ষতা—সব মিলেই
                                                    তৈরি হয় সহায়তার একটি বড়
                                                    পরিসর।
                                                </p>

                                                <div className="flex items-center gap-3 text-xs text-primary">
                                                    <span className="h-2 w-2 rounded-full bg-primary" />

                                                    <span>
                                                        মানুষ থেকে মানুষের পাশে
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ------------------------------------------------
                                    ORGANIZATIONS
                                ------------------------------------------------ */}

                            {visibleOrganizations.length > 0 && (
                                <div className="relative mt-20 border-t border-[#bcc8bc] pt-16 sm:mt-24 lg:mt-32 lg:pt-20">
                                    {/* Intro */}

                                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                                        <div className="lg:col-span-7">
                                            <p className="text-xs font-medium tracking-[0.08em] text-[#a66b18]">
                                                প্রাতিষ্ঠানিক অংশগ্রহণ
                                            </p>

                                            <h3 className="mt-4 max-w-[720px] text-[2.2rem] font-medium leading-[1.35] tracking-[-0.02em] sm:text-4xl lg:text-[3.3rem]">
                                                সক্ষমতা নিয়ে
                                                <span className="text-primary">
                                                    {' '}
                                                    যাঁরা সঙ্গে আছেন।
                                                </span>
                                            </h3>
                                        </div>

                                        <div className="lg:col-span-4 lg:col-start-9 lg:flex lg:items-end">
                                            <p className="max-w-[320px] text-sm leading-8 text-text-secondary">
                                                বিভিন্ন ক্ষেত্রের সহযোগী
                                                প্রতিষ্ঠান তাঁদের নিজস্ব
                                                অভিজ্ঞতা ও সক্ষমতা নিয়ে মানুষের
                                                প্রয়োজনের সঙ্গে যুক্ত হচ্ছেন।
                                            </p>
                                        </div>
                                    </div>

                                    {/* Organization list */}

                                    <div className="mt-14 lg:mt-20">
                                        {visibleOrganizations.map(
                                            (organization, index) => {
                                                const name =
                                                    getOrganizationName(
                                                        organization,
                                                    );

                                                const focusAreas =
                                                    normalizeList(
                                                        organization?.focus_areas,
                                                        3,
                                                    );

                                                const logo =
                                                    organization?.logo ||
                                                    organization?.image ||
                                                    organization?.user
                                                        ?.avatar ||
                                                    organization?.user?.image ||
                                                    null;

                                                return (
                                                    <article
                                                        key={
                                                            organization?.id ||
                                                            `${name}-${index}`
                                                        }
                                                        className="group relative border-t border-[#cfd8cf] py-7 sm:py-8"
                                                    >
                                                        <div className="grid gap-6 sm:grid-cols-[64px_1fr] sm:items-center sm:gap-8 lg:grid-cols-[72px_minmax(0,1fr)_300px]">
                                                            {/* Index */}

                                                            <span className="font-sans text-xs text-text-muted">
                                                                {toBengaliNumber(
                                                                    index + 1,
                                                                )}
                                                            </span>

                                                            {/* Organization */}

                                                            <div className="flex min-w-0 items-center gap-5">
                                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-[#e3ebe2] sm:h-16 sm:w-16">
                                                                    {logo ? (
                                                                        <img
                                                                            src={
                                                                                logo
                                                                            }
                                                                            alt={
                                                                                name
                                                                            }
                                                                            loading="lazy"
                                                                            className="h-full w-full object-cover"
                                                                            onError={(
                                                                                event,
                                                                            ) => {
                                                                                event.currentTarget.style.display =
                                                                                    'none';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <TbBuildingCommunity
                                                                            size={
                                                                                28
                                                                            }
                                                                            strokeWidth={
                                                                                1.2
                                                                            }
                                                                            className="text-primary"
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <h4 className="truncate text-lg font-medium sm:text-xl">
                                                                        {name}
                                                                    </h4>

                                                                    {organization?.organization_type && (
                                                                        <p className="mt-1 text-xs leading-6 text-text-secondary">
                                                                            {
                                                                                organization.organization_type
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Focus areas */}

                                                            <div className="sm:col-span-2 sm:pl-[72px] lg:col-span-1 lg:pl-0">
                                                                {focusAreas.length >
                                                                    0 && (
                                                                    <p className="max-w-[300px] text-xs leading-6 text-primary">
                                                                        {focusAreas.join(
                                                                            ' · ',
                                                                        )}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Hover rule */}

                                                        <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                                                    </article>
                                                );
                                            },
                                        )}

                                        <div className="border-t border-[#cfd8cf]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Empty state */}

                    {!communityLoading && !hasCommunityData && (
                        <div className="mt-16 border-t border-[#cfd8cf] pt-14 lg:mt-24 lg:pt-20">
                            <div className="grid gap-8 lg:grid-cols-12">
                                <div className="lg:col-span-4">
                                    <span className="font-sans text-xs text-primary">
                                        ০৪
                                    </span>
                                </div>

                                <div className="lg:col-span-7 lg:col-start-6">
                                    <h3 className="max-w-[650px] text-3xl font-medium leading-[1.4] sm:text-4xl sm:leading-[1.45]">
                                        এই নেটওয়ার্কটি
                                        <span className="text-primary">
                                            {' '}
                                            ধীরে ধীরে গড়ে উঠছে।
                                        </span>
                                    </h3>

                                    <p className="mt-5 max-w-[520px] text-sm leading-8 text-text-secondary">
                                        সক্রিয় স্বেচ্ছাসেবক ও সহযোগী সংগঠন
                                        যুক্ত হলে তাঁদের পরিচিতি এখানে তুলে ধরা
                                        হবে।
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* =================================================================
                05 — PARTICIPATION
            ================================================================= */}

            <section className="bg-[#f1eee5] py-20 sm:py-24 lg:py-28">
                <div className="container-width">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
                        <div className="lg:col-span-5">
                            <SectionIndex number="০৫" label="অংশগ্রহণের পথ" />

                            <h2 className="mt-6 max-w-[520px] text-[2.15rem] font-medium leading-[1.45] tracking-[-0.02em] sm:text-4xl lg:text-[3.25rem] lg:leading-[1.45]">
                                সবাই একইভাবে
                                <span className="text-primary">
                                    {' '}
                                    এই নেটওয়ার্কে যুক্ত হন না।
                                </span>
                            </h2>

                            <p className="mt-5 max-w-md text-base leading-8 text-text-secondary">
                                কেউ নিজের সময় দেন, কেউ একটি সংগঠনের সক্ষমতা
                                নিয়ে আসেন, আবার কেউ একটি বাস্তব প্রয়োজনকে
                                সামনে নিয়ে আসেন।
                            </p>
                        </div>

                        <div className="lg:col-span-6 lg:col-start-7">
                            {/* Volunteer */}

                            <Link
                                to="/volunteer"
                                className="group flex items-center gap-5 border-t border-text-primary py-7"
                            >
                                <TbUsers
                                    size={25}
                                    strokeWidth={1.4}
                                    className="shrink-0 text-primary"
                                />

                                <div className="flex-1">
                                    <p className="text-xs font-medium text-primary">
                                        স্বেচ্ছাসেবক
                                    </p>

                                    <p className="mt-1 text-lg font-medium">
                                        সময় ও দক্ষতা দিয়ে যুক্ত হোন
                                    </p>
                                </div>

                                <TbArrowUpRight
                                    size={21}
                                    className="shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                />
                            </Link>

                            {/* Organizations */}

                            <Link
                                to="/organizations"
                                className="group flex items-center gap-5 border-t border-border-strong py-7"
                            >
                                <TbBuildingCommunity
                                    size={25}
                                    strokeWidth={1.4}
                                    className="shrink-0 text-primary"
                                />

                                <div className="flex-1">
                                    <p className="text-xs font-medium text-primary">
                                        সংগঠন
                                    </p>

                                    <p className="mt-1 text-lg font-medium">
                                        একটি মানবিক উদ্যোগ নিয়ে যুক্ত হোন
                                    </p>
                                </div>

                                <TbArrowUpRight
                                    size={21}
                                    className="shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                />
                            </Link>

                            {/* Help */}

                            <Link
                                to="/request-help"
                                className="group flex items-center gap-5 border-y border-border-strong py-7"
                            >
                                <TbHeartHandshake
                                    size={25}
                                    strokeWidth={1.4}
                                    className="shrink-0 text-primary"
                                />

                                <div className="flex-1">
                                    <p className="text-xs font-medium text-primary">
                                        সহায়তার প্রয়োজন
                                    </p>

                                    <p className="mt-1 text-lg font-medium">
                                        একটি বাস্তব প্রয়োজন সামনে আনুন
                                    </p>
                                </div>

                                <TbArrowUpRight
                                    size={21}
                                    className="shrink-0 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================================
                CLOSING
            ================================================================= */}

            <section className="bg-[#fffefa]">
                <div className="container-width py-20 sm:py-24 lg:py-32">
                    <div className="grid gap-8 border-t border-text-primary pt-8 lg:grid-cols-12 lg:items-end lg:gap-6">
                        <div className="lg:col-span-8">
                            <p className="text-xs font-medium tracking-[0.15em] text-primary">
                                STAND FOR PEOPLE
                            </p>

                            <h2 className="mt-5 max-w-[780px] text-[2.05rem] font-medium leading-[1.48] tracking-[-0.02em] sm:text-4xl sm:leading-[1.5] lg:text-[3.25rem] lg:leading-[1.48]">
                                এই নেটওয়ার্কে পরবর্তী মানুষটি
                                <span className="text-primary">
                                    {' '}
                                    আপনিও হতে পারেন।
                                </span>
                            </h2>
                        </div>

                        <div className="lg:col-span-3 lg:col-start-10">
                            <Link
                                to="/volunteer"
                                className="group inline-flex items-center gap-3 border-b border-primary/50 pb-2 text-sm font-medium text-primary transition-colors hover:border-primary"
                            >
                                যুক্ত হওয়ার পথ দেখুন
                                <TbArrowUpRight
                                    size={18}
                                    className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Team;

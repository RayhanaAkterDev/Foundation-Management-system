import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
    TbBuildingCommunity,
    TbMapPin,
    TbShieldCheck,
    TbArrowUpRight,
} from 'react-icons/tb';

import { apiRequest } from '@/api/client';

const OrganizationTypes = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadOrganizations = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await apiRequest('/organizations');

                if (!isMounted) {
                    return;
                }

                setOrganizations(
                    Array.isArray(data?.organizations)
                        ? data.organizations
                        : [],
                );
            } catch (err) {
                console.error('Failed to load public organizations:', err);

                if (isMounted) {
                    setOrganizations([]);
                    setError('প্রতিষ্ঠানগুলোর তথ্য এখন দেখানো যাচ্ছে না।');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadOrganizations();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section id="organizations" className="container-width scroll-mt-24">
            <div className="relative">
                {/* =====================================================
                    SECTION INTRO
                ===================================================== */}
                <div className="mb-8 flex flex-col gap-3 sm:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-sm">
                            সংযুক্ত প্রতিষ্ঠান
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl lg:text-[2.15rem]">
                            স্ট্যান্ড ফর পিপলের সঙ্গে যুক্ত প্রতিষ্ঠানসমূহ
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                            যাচাইকৃত প্রতিষ্ঠানগুলো বিভিন্ন মানবিক উদ্যোগ ও
                            সহায়তা কার্যক্রমের মাধ্যমে মানুষের পাশে কাজ করছে।
                        </p>
                    </div>

                    {!loading && organizations.length > 0 && (
                        <div className="shrink-0 text-sm text-muted-foreground">
                            মোট{' '}
                            <span className="font-semibold text-text-primary">
                                {organizations.length}
                            </span>{' '}
                            টি যাচাইকৃত প্রতিষ্ঠান
                        </div>
                    )}
                </div>

                {/* =====================================================
                    LOADING
                ===================================================== */}
                {loading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="
                                    animate-pulse
                                    rounded-2xl
                                    border border-border
                                    bg-surface
                                    p-5
                                    sm:p-6
                                "
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="size-12 rounded-xl bg-muted" />

                                    <div className="size-8 rounded-full bg-muted" />
                                </div>

                                <div className="mt-5 h-5 w-3/4 rounded bg-muted" />

                                <div className="mt-3 h-4 w-full rounded bg-muted" />

                                <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
                            </div>
                        ))}
                    </div>
                )}

                {/* =====================================================
                    ERROR
                ===================================================== */}
                {!loading && error && (
                    <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center sm:px-8">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <TbBuildingCommunity className="text-2xl" />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-text-primary sm:text-lg">
                            প্রতিষ্ঠানগুলোর তথ্য পাওয়া যায়নি
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            {error}
                        </p>
                    </div>
                )}

                {/* =====================================================
                    EMPTY
                ===================================================== */}
                {!loading && !error && organizations.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center sm:px-8">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <TbBuildingCommunity className="text-3xl" />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-text-primary sm:text-lg">
                            এখনো কোনো যাচাইকৃত প্রতিষ্ঠান নেই
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            যাচাইকৃত প্রতিষ্ঠানগুলো এখানে প্রদর্শিত হবে।
                        </p>
                    </div>
                )}

                {/* =====================================================
                    ORGANIZATION CARDS
                ===================================================== */}
                {!loading && !error && organizations.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-5 xl:gap-6">
                        {organizations.map((organization) => (
                            <OrganizationCard
                                key={organization.id}
                                organization={organization}
                            />
                        ))}
                    </div>
                )}

                {/* =====================================================
                    REGISTER CTA
                ===================================================== */}
                {!loading && (
                    <div className="mt-10 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-6 sm:mt-12 sm:px-7 sm:py-7 lg:flex lg:items-center lg:justify-between lg:gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary sm:text-xl">
                                আপনার প্রতিষ্ঠানও যুক্ত হতে পারে
                            </h3>

                            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
                                স্ট্যান্ড ফর পিপলে প্রতিষ্ঠান হিসেবে নিবন্ধন করে
                                মানবিক উদ্যোগগুলোতে অংশ নিন।
                            </p>
                        </div>

                        <Link
                            to="/account/register"
                            className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 lg:mt-0"
                        >
                            প্রতিষ্ঠান নিবন্ধন করুন
                            <TbArrowUpRight className="text-lg" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

const OrganizationCard = ({ organization }) => {
    return (
        <article
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border border-border
                bg-surface
                p-5
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-primary/25
                hover:shadow-md
                sm:p-6
            "
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-13">
                    <TbBuildingCommunity className="text-2xl sm:text-[1.7rem]" />
                </div>

                <div
                    className="
                        flex
                        size-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-border
                        text-muted-foreground
                        transition-all
                        duration-300
                        group-hover:border-primary/20
                        group-hover:bg-primary/5
                        group-hover:text-primary
                    "
                    title="যাচাইকৃত প্রতিষ্ঠান"
                >
                    <TbShieldCheck className="text-lg" />
                </div>
            </div>

            {/* Organization name */}
            <h3 className="mt-5 line-clamp-2 text-base font-semibold leading-6 text-text-primary transition-colors group-hover:text-primary sm:text-lg">
                {organization.name}
            </h3>

            {/* Organization type */}
            {organization.organization_type && (
                <p className="mt-2 text-sm font-medium text-primary">
                    {organization.organization_type}
                </p>
            )}

            {/* Location */}
            {organization.address && (
                <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                    <TbMapPin className="mt-0.5 shrink-0 text-base text-primary" />

                    <span className="line-clamp-2">{organization.address}</span>
                </div>
            )}

            {/* Verified status */}
            <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                <TbShieldCheck className="text-base text-primary" />

                <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                    যাচাইকৃত প্রতিষ্ঠান
                </span>
            </div>
        </article>
    );
};

export default OrganizationTypes;

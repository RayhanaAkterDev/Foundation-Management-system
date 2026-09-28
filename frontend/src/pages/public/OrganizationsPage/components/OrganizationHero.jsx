import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

import {
    TbBuildingCommunity,
    TbBuilding,
    TbHeartHandshake,
    TbMapPin,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

const OrganizationHero = () => {
    return (
        <section className="section-gap container-width">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-20">
                {/* =====================================================
                    LEFT — HERO CONTENT
                ===================================================== */}
                <div className="min-w-0">
                    <SectionHeading
                        gap="md"
                        align="left"
                        badge={{
                            label: 'সংযুক্ত প্রতিষ্ঠানসমূহ',
                            icon: TbBuildingCommunity,
                            variant: 'primary',
                            size: 'md',
                        }}
                        title={
                            <>
                                মানবিক সহায়তায় কাজ করা{' '}
                                <span className="text-primary">
                                    প্রতিষ্ঠানসমূহ
                                </span>
                            </>
                        }
                        headingSize="hero"
                        description="
                            স্ট্যান্ড ফর পিপলের সঙ্গে যুক্ত যাচাইকৃত প্রতিষ্ঠানগুলোর
                            সঙ্গে পরিচিত হোন। এসব প্রতিষ্ঠান প্ল্যাটফর্মের মাধ্যমে
                            বিভিন্ন উদ্যোগ পরিচালনা, স্বেচ্ছাসেবী সমন্বয় এবং
                            মানুষের জন্য কার্যকর সহায়তা পৌঁছে দিতে কাজ করে।
                        "
                        descriptionSize="hero"
                    />

                    <div className="mt-8 flex flex-wrap gap-3 sm:mt-9 sm:gap-4">
                        <Link to="#organizations">
                            <Button size="lg">প্রতিষ্ঠানগুলো দেখুন</Button>
                        </Link>

                        <Link to="/account/register?role=organization">
                            <Button variant="outline" size="lg">
                                প্রতিষ্ঠান নিবন্ধন করুন
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* =====================================================
                    RIGHT — ORGANIZATION NETWORK VISUAL
                ===================================================== */}
                <div className="w-full">
                    <div className="relative mx-auto aspect-square w-full max-w-130 overflow-hidden rounded-[2rem] border border-border bg-linear-to-br from-primary/5 via-background to-primary/10 p-5 shadow-sm sm:p-7 lg:max-w-none lg:p-8 xl:p-10">
                        {/* Soft background circles */}
                        <div className="absolute -right-20 -top-20 size-56 rounded-full bg-primary/5 blur-3xl" />

                        <div className="absolute -bottom-20 -left-20 size-56 rounded-full bg-primary/5 blur-3xl" />

                        {/* Decorative rings */}
                        <div className="absolute left-1/2 top-1/2 size-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />

                        <div className="absolute left-1/2 top-1/2 size-[39%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15" />

                        {/* Connection lines */}
                        <svg
                            className="absolute inset-0 h-full w-full"
                            viewBox="0 0 500 500"
                            fill="none"
                            aria-hidden="true"
                        >
                            <line
                                x1="250"
                                y1="250"
                                x2="250"
                                y2="82"
                                stroke="currentColor"
                                className="text-border"
                            />

                            <line
                                x1="250"
                                y1="250"
                                x2="407"
                                y2="175"
                                stroke="currentColor"
                                className="text-border"
                            />

                            <line
                                x1="250"
                                y1="250"
                                x2="365"
                                y2="405"
                                stroke="currentColor"
                                className="text-border"
                            />

                            <line
                                x1="250"
                                y1="250"
                                x2="135"
                                y2="405"
                                stroke="currentColor"
                                className="text-border"
                            />

                            <line
                                x1="250"
                                y1="250"
                                x2="93"
                                y2="175"
                                stroke="currentColor"
                                className="text-border"
                            />
                        </svg>

                        {/* =================================================
                            CENTER
                        ================================================= */}
                        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-white shadow-xl sm:size-24 lg:size-25 xl:size-28">
                                <TbHeartHandshake className="text-4xl sm:text-[2.75rem]" />
                            </div>

                            <h3 className="mt-3 whitespace-nowrap text-sm font-semibold text-text-primary sm:text-base">
                                স্ট্যান্ড ফর পিপল
                            </h3>

                            <p className="mt-0.5 whitespace-nowrap text-[11px] text-muted-foreground sm:text-xs">
                                মানবিক সহায়তার সমন্বয়
                            </p>
                        </div>

                        {/* =================================================
                            TOP — ORGANIZATIONS
                        ================================================= */}
                        <div className="absolute left-1/2 top-[7%] -translate-x-1/2">
                            <OrganizationNode
                                icon={<TbBuildingCommunity />}
                                title="প্রতিষ্ঠান"
                            />
                        </div>

                        {/* =================================================
                            RIGHT TOP — CAMPAIGNS
                        ================================================= */}
                        <div className="absolute right-[5%] top-[27%]">
                            <OrganizationNode
                                icon={<TbBuilding />}
                                title="ক্যাম্পেইন"
                            />
                        </div>

                        {/* =================================================
                            RIGHT BOTTOM — COMMUNITIES
                        ================================================= */}
                        <div className="absolute bottom-[7%] right-[14%]">
                            <OrganizationNode
                                icon={<TbUsers />}
                                title="কমিউনিটি"
                            />
                        </div>

                        {/* =================================================
                            LEFT BOTTOM — VERIFIED
                        ================================================= */}
                        <div className="absolute bottom-[7%] left-[14%]">
                            <OrganizationNode
                                icon={<TbShieldCheck />}
                                title="যাচাইকৃত"
                            />
                        </div>

                        {/* =================================================
                            LEFT TOP — REACH
                        ================================================= */}
                        <div className="absolute left-[5%] top-[27%]">
                            <OrganizationNode
                                icon={<TbMapPin />}
                                title="স্থানীয় সহায়তা"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const OrganizationNode = ({ icon, title }) => {
    return (
        <div className="group flex flex-col items-center">
            <div
                className="
                    flex size-14 items-center justify-center
                    rounded-2xl
                    border border-border
                    bg-surface
                    text-2xl text-primary
                    shadow-sm
                    transition-all duration-300
                    group-hover:-translate-y-1
                    group-hover:shadow-md
                    sm:size-16
                    sm:text-3xl
                    lg:size-[4.25rem]
                "
            >
                {icon}
            </div>

            <span className="mt-2 whitespace-nowrap text-xs font-medium text-text-primary sm:text-sm">
                {title}
            </span>
        </div>
    );
};

export default OrganizationHero;

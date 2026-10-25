import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import CampaignCard from '@/pages/public/campaignsPage/sections/CampaignCard.jsx';
import SectionHeading from '@/components/SectionHeading.jsx';

const isEnabled = (value) => value === true || value === 1 || value === '1';

const FeaturedSection = ({ campaigns = [] }) => {
    const featured = (Array.isArray(campaigns) ? campaigns : [])
        .filter(Boolean)
        .filter((campaign) => isEnabled(campaign.is_featured))
        .slice(0, 3);

    return (
        <section className="section-gap">
            <div className="container-width space-y-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <SectionHeading
                            gap="sm"
                            align="left"
                            title="নির্বাচিত ক্যাম্পেইনসমূহ"
                            description="বাছাই করা কিছু মানবিক উদ্যোগ, যেখানে আপনার সহায়তা মানুষের জীবনে বাস্তব পরিবর্তন আনতে পারে।"
                            descriptionSize="hero"
                        />
                    </div>

                    {featured.length > 0 && (
                        <Link
                            to="/campaigns/featured"
                            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-primary/30 pb-1 text-sm font-semibold text-primary transition-colors hover:border-primary"
                        >
                            সব নির্বাচিত ক্যাম্পেইন
                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    )}
                </div>

                {featured.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featured.map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center pt-1">
                            <Link
                                to="/campaigns/featured"
                                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/25 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white!"
                            >
                                আরও নির্বাচিত ক্যাম্পেইন দেখুন
                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center border-y border-border px-5 py-12 text-center">
                        <Star
                            size={24}
                            strokeWidth={1.5}
                            className="mb-3 text-text-secondary"
                        />
                        <p className="text-base font-semibold text-text-primary">
                            নির্বাচিত ক্যাম্পেইন শিগগিরই আসছে
                        </p>
                        <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
                            এই মুহূর্তে কোনো নির্বাচিত ক্যাম্পেইন উপলব্ধ নেই।
                            নতুন উদ্যোগ যুক্ত হলে এখানে দেখতে পাবেন।
                        </p>
                        <Link
                            to="/campaigns"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                        >
                            সব ক্যাম্পেইন দেখুন
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedSection;

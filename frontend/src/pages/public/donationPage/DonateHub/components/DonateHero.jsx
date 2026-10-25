import React from 'react';
import Button from '@/components/Button';
import {
    TbAlertTriangleFilled,
    TbArrowRight,
    TbShieldCheck,
} from 'react-icons/tb';
import SectionHeading from '@/components/SectionHeading';

import { getFeaturedCampaign } from '@/data/selectors';

const DonateHero = () => {
    const campaign = getFeaturedCampaign();

    if (!campaign) return null;

    // ✅ FIXED FIELD NAMES (your real schema)
    const raised = Number(campaign?.raised ?? 0);
    const goal = Number(campaign?.targetAmount ?? 0);

    const progress =
        goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

    return (
        <section className="section-gap bg-white mt-20">
            <div className="container-width grid lg:grid-cols-2 gap-20 items-center">
                {/* LEFT */}
                <div>
                    <div className="flex items-center gap-2 text-sm text-primary mb-4 font-poppins">
                        <TbShieldCheck className="text-primary" />
                        যাচাইকৃত আবেদন • হাসপাতাল ও পরিবারকে সরাসরি সহায়তা
                    </div>

                    <SectionHeading
                        gap="lg"
                        align="left"
                        title={
                            <>
                                মানুষের পাশে দাঁড়ানো <br /> প্রয়োজন
                                <span className="text-primary"> এখনই</span>
                            </>
                        }
                        headingSize="sectionHero"
                        description={
                            <>
                                প্রতিটি ক্যাম্পেইন যাচাইকৃত এবং প্রতিটি অনুদানের
                                হিসাব সংরক্ষিত হয়। আপনার সহায়তা সরাসরি চিকিৎসা
                                ও জীবনধারণের জরুরি প্রয়োজনে পৌঁছে যায়।
                                <div className="flex gap-2 mt-4">
                                    <span className="text-primary">●</span>
                                    জরুরি চিকিৎসা সহায়তাকে সর্বোচ্চ অগ্রাধিকার
                                    দেওয়া হয়
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-primary">●</span>
                                    যাচাইয়ের পর ধাপে ধাপে অর্থ প্রদান করা হয়
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-primary">●</span>
                                    প্রতিটি ক্যাম্পেইনের পরিচয় যাচাই করা হয়
                                </div>
                            </>
                        }
                        descriptionSize="hero"
                    />

                    <div className="mt-10 flex gap-4 flex-wrap">
                        <Button to="#urgent" size="lg">
                            জরুরি আবেদনে অনুদান দিন
                        </Button>

                        <Button to="/campaigns" variant="ghost" size="lg">
                            সকল আবেদন দেখুন
                            <TbArrowRight className="ml-1" />
                        </Button>
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                    {/* IMAGE */}
                    <div className="h-56 bg-background-alt">
                        <img
                            src={campaign.image}
                            className="w-full h-full object-cover"
                            alt={campaign.title}
                        />
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                        {/* STATUS */}
                        <div className="flex items-center justify-between text-xs mb-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold">
                                <TbAlertTriangleFilled size={14} />
                                {campaign.category}
                            </span>

                            <span className="text-text-secondary">
                                যাচাইকৃত হাসপাতালের আবেদন
                            </span>
                        </div>

                        {/* TITLE */}
                        <h3 className="text-xl font-bold text-text-primary leading-snug">
                            {campaign.title}
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            {campaign.organizer?.name || 'আয়োজক'} •{' '}
                            {campaign.location}
                        </p>

                        <div className="my-5 border-t border-border" />

                        {/* PROGRESS */}
                        <div>
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-primary">
                                    ৳{raised.toLocaleString('bn-BD')} সংগ্রহ
                                    হয়েছে
                                </span>

                                <span className="text-text-secondary">
                                    লক্ষ্যমাত্রা ৳{goal.toLocaleString('bn-BD')}
                                </span>
                            </div>

                            <div className="mt-2 h-2 bg-background-alt rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="mt-2 text-xs text-text-secondary">
                                {campaign.daysLeft} দিন বাকি • জরুরি চিকিৎসা
                                সহায়তা প্রয়োজন
                            </p>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-text-secondary">
                                    ক্যাম্পেইন আইডি
                                </p>
                                <p className="text-sm font-semibold text-text-primary">
                                    {campaign.id}
                                </p>
                            </div>

                            <Button
                                to={`/campaign/${campaign.slug}`}
                                size="md"
                                className="bg-primary hover:bg-primary-hover text-white!"
                            >
                                জীবন বাঁচাতে সহায়তা করুন
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DonateHero;

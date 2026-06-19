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
                        Verified cases • Direct hospital & family support
                    </div>

                    <SectionHeading
                        gap="lg"
                        align="left"
                        title={
                            <>
                                Real people need <br /> help
                                <span className="text-primary"> right now</span>
                            </>
                        }
                        headingSize="sectionHero"
                        description={
                            <>
                                Every campaign is verified. Every donation is
                                tracked. Your support goes directly to real
                                medical and survival needs.
                                <div className="flex gap-2 mt-4">
                                    <span className="text-primary">●</span>
                                    Medical emergencies are prioritized first
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-primary">●</span>
                                    Funds are released in stages after
                                    verification
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-primary">●</span>
                                    Every campaign has identity validation
                                </div>
                            </>
                        }
                        descriptionSize="hero"
                    />

                    <div className="mt-10 flex gap-4 flex-wrap">
                        <Button to="#urgent" size="lg">
                            Donate to Urgent Cases
                        </Button>

                        <Button to="/campaigns" variant="ghost" size="lg">
                            View all cases
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
                                Verified Hospital Case
                            </span>
                        </div>

                        {/* TITLE */}
                        <h3 className="text-xl font-bold text-text-primary leading-snug">
                            {campaign.title}
                        </h3>

                        <p className="mt-1 text-sm text-text-secondary">
                            {campaign.organizer?.name || 'Organizer'} •{' '}
                            {campaign.location}
                        </p>

                        <div className="my-5 border-t border-border" />

                        {/* PROGRESS */}
                        <div>
                            <div className="flex justify-between text-sm">
                                <span className="font-semibold text-primary">
                                    ৳{raised.toLocaleString()} raised
                                </span>

                                <span className="text-text-secondary">
                                    of ৳{goal.toLocaleString()}
                                </span>
                            </div>

                            <div className="mt-2 h-2 bg-background-alt rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="mt-2 text-xs text-text-secondary">
                                {campaign.daysLeft} days left • Urgent medical
                                support needed
                            </p>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-text-secondary">
                                    Campaign ID
                                </p>
                                <p className="text-sm font-semibold text-text-primary">
                                    {campaign.id}
                                </p>
                            </div>

                            <Button
                                to={`/campaign/${campaign.slug}`}
                                size="md"
                                className="bg-primary hover:bg-primary-hover text-white"
                            >
                                Help Save Life
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DonateHero;

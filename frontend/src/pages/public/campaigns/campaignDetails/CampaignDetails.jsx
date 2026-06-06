import React from 'react';
import { useParams } from 'react-router-dom';
import campaigns from '../sections/campaignContainer/data/campaignsData';

const CampaignDetails = () => {
    const { id } = useParams();
    const campaign = campaigns.find((c) => c.id === Number(id));

    if (!campaign) {
        return (
            <div className="mt-24 text-center text-secondary">
                Campaign not found
            </div>
        );
    }

    return (
        <div className="mt-20 bg-background min-h-screen">
            <div className="container-width py-10">
                <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-12">
                    {/* LEFT */}
                    <div>
                        {/* HEADER */}
                        <div className="mb-8">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        campaign.urgency === 'Critical'
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-primary/10 text-primary'
                                    }`}
                                >
                                    {campaign.urgency}
                                </span>

                                <span className="text-sm text-secondary">
                                    {campaign.category}
                                </span>

                                <span className="text-secondary">•</span>

                                <span className="text-sm text-secondary">
                                    {campaign.location}
                                </span>
                            </div>

                            {/* 🔥 FIXED H1 COLOR */}
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                {campaign.title}
                            </h1>

                            <div className="mt-6 border-b border-border" />
                        </div>

                        {/* IMAGE */}
                        <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-[260px] md:h-[420px] object-cover rounded-2xl"
                        />

                        {/* STORY */}
                        <section className="mt-10">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                                Campaign Story
                            </h2>

                            <p className="leading-8 text-secondary max-w-3xl">
                                {campaign.story}
                            </p>
                        </section>

                        {/* IMPACT */}
                        <section className="mt-12 border-t border-border pt-10">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                                Expected Impact
                            </h2>

                            <div className="space-y-4">
                                {campaign.impact.map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                                        <p className="text-secondary">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* REACH */}
                        <section className="mt-12 border-t border-border pt-10">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                                Campaign Reach
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                {[
                                    ['Beneficiaries', campaign.beneficiaries],
                                    ['Areas Covered', campaign.areasCovered],
                                    ['Supporters', campaign.supporters],
                                ].map(([label, value], i) => (
                                    <div key={i}>
                                        <p className="text-3xl font-bold text-slate-900">
                                            {value}
                                        </p>
                                        <p className="text-sm text-secondary mt-1">
                                            {label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* UPDATES */}
                        <section className="mt-12 border-t border-border pt-10">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                                Campaign Updates
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <p className="text-sm text-secondary mb-2">
                                        2 days ago
                                    </p>
                                    <p className="text-secondary leading-7">
                                        Initial assessment completed and relief
                                        distribution planning is underway.
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-secondary mb-2">
                                        5 days ago
                                    </p>
                                    <p className="text-secondary leading-7">
                                        Campaign verified and approved by the
                                        response team.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ORGANIZER */}
                        <section className="mt-12 border-t border-border pt-10">
                            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                                Organizer
                            </h2>

                            <h3 className="font-semibold text-lg text-slate-900">
                                {campaign.organizer}
                            </h3>

                            <p className="text-secondary mt-2 leading-7">
                                Verified organization managing this campaign and
                                coordinating relief efforts.
                            </p>
                        </section>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside className="lg:sticky lg:top-24 h-fit">
                        <div className="border border-border rounded-2xl p-6 bg-white/40 backdrop-blur-sm">
                            {/* FUNDING */}
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    ${campaign.raised.toLocaleString()}
                                </h3>

                                <p className="text-secondary mt-1">
                                    raised of $
                                    {campaign.targetAmount.toLocaleString()}
                                </p>
                            </div>

                            {/* PROGRESS */}
                            <div className="mt-6">
                                <div className="h-2 bg-border rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{
                                            width: `${Math.min(campaign.progress, 100)}%`,
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between text-xs text-secondary mt-2">
                                    <span>{campaign.progress}% funded</span>
                                    <span>{campaign.daysLeft} days left</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <button className="w-full mt-6 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-medium">
                                Contribute Now
                            </button>

                            {/* TRUST */}
                            <div className="mt-6 text-sm text-secondary space-y-2">
                                <p>✓ Verified campaign</p>
                                <p>✓ Transparent tracking</p>
                                <p>✓ Secure donations</p>
                            </div>

                            {/* STATS */}
                            <div className="mt-8 pt-6 border-t border-border space-y-3">
                                {[
                                    ['Supporters', campaign.supporters],
                                    ['Beneficiaries', campaign.beneficiaries],
                                    ['Areas Covered', campaign.areasCovered],
                                    ['Days Left', campaign.daysLeft],
                                ].map(([label, value], i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between"
                                    >
                                        <span className="text-secondary">
                                            {label}
                                        </span>
                                        <span className="font-medium text-slate-900">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* ORGANIZER */}
                            <div className="mt-8 pt-6 border-t border-border">
                                <p className="text-sm text-secondary mb-2">
                                    Organized by
                                </p>
                                <p className="font-medium text-slate-900">
                                    {campaign.organizer}
                                </p>
                            </div>

                            {/* SHARE (UPGRADED UX) */}
                            <div className="mt-8 pt-6 border-t border-border">
                                <p className="text-sm text-secondary mb-3">
                                    Share Campaign
                                </p>

                                <div className="grid grid-cols-2 gap-2">
                                    <button className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-surface transition">
                                        Copy Link
                                    </button>

                                    <button className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-surface transition">
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCampaignById } from '@/api/campaigns';

const CampaignDetails = () => {
    const { id } = useParams();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCampaign = async () => {
            try {
                const data = await getCampaignById(id);
                setCampaign(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadCampaign();
    }, [id]);

    if (loading) {
        return (
            <div className="mt-24 text-center text-secondary">
                Loading campaign...
            </div>
        );
    }

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
                {/* HERO */}
                <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-start">
                    {/* LEFT */}
                    <div>
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

                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            {campaign.title}
                        </h1>

                        <p className="mt-5 text-secondary text-lg leading-8 max-w-2xl">
                            {campaign.story}
                        </p>
                    </div>

                    {/* RIGHT CARD */}
                    <div className="bg-white rounded-3xl border border-border p-6 shadow-sm sticky top-24">
                        <h3 className="text-3xl font-bold text-slate-900">
                            ${campaign.raised?.toLocaleString() || 0}
                        </h3>

                        <p className="text-secondary mt-1">
                            raised of $
                            {campaign.targetAmount?.toLocaleString() || 0}
                        </p>

                        <div className="mt-6">
                            <div className="h-2 bg-border rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{
                                        width: `${campaign.progress || 0}%`,
                                    }}
                                />
                            </div>

                            <div className="flex justify-between text-xs text-secondary mt-2">
                                <span>{campaign.progress || 0}% funded</span>
                                <span>{campaign.daysLeft || 0} days left</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-medium">
                            Contribute Now
                        </button>

                        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-lg font-semibold text-slate-900">
                                    {campaign.supporters || 0}
                                </p>
                                <p className="text-xs text-secondary">
                                    Supporters
                                </p>
                            </div>

                            <div>
                                <p className="text-lg font-semibold text-slate-900">
                                    {campaign.beneficiaries || 0}
                                </p>
                                <p className="text-xs text-secondary">
                                    Beneficiaries
                                </p>
                            </div>

                            <div>
                                <p className="text-lg font-semibold text-slate-900">
                                    {campaign.areasCovered || 0}
                                </p>
                                <p className="text-xs text-secondary">
                                    Areas Covered
                                </p>
                            </div>

                            <div>
                                <p className="text-lg font-semibold text-slate-900">
                                    {campaign.daysLeft || 0}
                                </p>
                                <p className="text-xs text-secondary">
                                    Days Left
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IMAGE */}
                <div className="mt-10">
                    <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-75 md:h-130 object-cover rounded-3xl"
                    />
                </div>

                {/* CONTENT */}
                <div className="max-w-4xl mx-auto mt-12 space-y-14">
                    {/* STORY */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">
                            About This Campaign
                        </h2>

                        <p className="text-secondary leading-8">
                            {campaign.story}
                        </p>
                    </section>

                    {/* IMPACT */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-5">
                            Expected Impact
                        </h2>

                        <div className="space-y-3">
                            {(campaign.impact || []).map((item, index) => (
                                <div
                                    key={index}
                                    className="border border-border rounded-2xl p-4 text-secondary"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ORGANIZER */}
                    <section className="border-t border-border pt-10">
                        <h2 className="text-lg font-semibold mb-2">
                            Organizer
                        </h2>

                        <p className="text-slate-900 font-medium">
                            {typeof campaign.organizer === 'object'
                                ? campaign.organizer.name
                                : campaign.organizer}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;
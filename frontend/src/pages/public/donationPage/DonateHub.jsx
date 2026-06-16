import React from 'react';
import { Link } from 'react-router-dom';

import {
    getFeaturedCampaigns,
    getUrgentCampaigns,
    getAllCampaigns,
} from '@/data/selectors';

import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

// icons
import { TbHeartHandshake, TbAlertTriangle, TbWorld } from 'react-icons/tb';

const DonateHub = () => {
    const featured = getFeaturedCampaigns();
    const urgent = getUrgentCampaigns();
    const all = getAllCampaigns();

    return (
        <div className="min-h-screen bg-surface mt-20">
            <div className="container-width py-10 space-y-16">
                {/* HERO */}
                <section className="text-center max-w-3xl mx-auto">
                    <SectionHeading
                        align="center"
                        badge={{
                            label: 'Make Impact',
                            variant: 'primary',
                            tone: 'solid',
                        }}
                        title="Where would you like your donation to go?"
                        description="Choose a cause, support urgent needs, or contribute to the general relief fund."
                        headingSize="sectionHero"
                    />

                    <div className="mt-6 flex justify-center gap-4">
                        <Link to="/campaigns">
                            <Button variant="outline">
                                Browse All Campaigns
                            </Button>
                        </Link>

                        <Link to="/donate/general">
                            <Button>General Relief Fund</Button>
                        </Link>
                    </div>
                </section>

                {/* URGENT SECTION */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <TbAlertTriangle className="text-red-500" />
                        <h2 className="text-xl font-semibold">Urgent Needs</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {urgent.slice(0, 3).map((c) => (
                            <Link
                                key={c.id}
                                to={`/donate/${c.id}`}
                                className="group rounded-2xl overflow-hidden border bg-white hover:shadow-lg transition"
                            >
                                <img
                                    src={c.image}
                                    className="h-48 w-full object-cover"
                                />

                                <div className="p-5 space-y-2">
                                    <h3 className="font-semibold group-hover:text-primary">
                                        {c.title}
                                    </h3>

                                    <p className="text-sm text-text-secondary line-clamp-2">
                                        {c.shortDescription}
                                    </p>

                                    <div className="text-sm font-medium">
                                        ৳{c.raised.toLocaleString()} raised
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* FEATURED SECTION */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <TbHeartHandshake className="text-primary" />
                        <h2 className="text-xl font-semibold">
                            Featured Campaigns
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {featured.slice(0, 3).map((c) => (
                            <Link
                                key={c.id}
                                to={`/donate/${c.id}`}
                                className="rounded-2xl border overflow-hidden hover:shadow-md transition bg-white"
                            >
                                <img
                                    src={c.image}
                                    className="h-44 w-full object-cover"
                                />

                                <div className="p-5">
                                    <h3 className="font-semibold">{c.title}</h3>

                                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                                        {c.shortDescription}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* GENERAL FUND */}
                <section className="bg-primary text-white rounded-3xl p-10 text-center relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/5 rounded-full" />

                    <div className="relative">
                        <TbWorld className="mx-auto text-4xl mb-4" />

                        <h2 className="text-2xl font-bold">
                            General Relief Fund
                        </h2>

                        <p className="mt-3 text-white/80 max-w-xl mx-auto">
                            Not sure where to donate? Your contribution will be
                            allocated to the most urgent needs automatically.
                        </p>

                        <Link to="/donate/general">
                            <Button className="mt-6 bg-white text-primary! hover:bg-white/90">
                                Donate to General Fund
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* ALL CAMPAIGNS QUICK ACCESS */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">All Campaigns</h2>

                        <Link to="/campaigns" className="text-primary text-sm">
                            View full list →
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {all.slice(0, 8).map((c) => (
                            <Link
                                key={c.id}
                                to={`/donate/${c.id}`}
                                className="border rounded-xl p-4 hover:border-primary transition bg-white"
                            >
                                <h3 className="font-medium line-clamp-1">
                                    {c.title}
                                </h3>

                                <p className="text-xs text-text-secondary mt-1">
                                    {c.location}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DonateHub;

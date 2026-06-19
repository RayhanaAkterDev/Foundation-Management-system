import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { getCampaignById } from '@/data/selectors';

import Button from '@/components/Button';
import Badge from '@/components/Badge';

import {
    TbHeartFilled,
    TbArrowLeft,
    TbCreditCard,
    TbShieldCheck,
    TbUser,
    TbWallet,
} from 'react-icons/tb';

const Donate = () => {
    const { id } = useParams();
    const campaign = getCampaignById(id);

    const [amount, setAmount] = useState(1000);

    if (!campaign) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-text-primary">
                        Campaign not found
                    </h2>
                    <Link to="/campaigns" className="text-primary mt-2 block">
                        Back to campaigns
                    </Link>
                </div>
            </div>
        );
    }

    const presets = [500, 1000, 2000, 5000];

    return (
        <div className="min-h-screen bg-background py-10 mt-20">
            <div className="container-width max-w-5xl">
                {/* BACK */}
                <Link
                    to={`/campaign/${campaign.id}`}
                    className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary mb-6 transition"
                >
                    <TbArrowLeft />
                    Back to campaign
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                    {/* LEFT SIDE */}
                    <div className="space-y-6 order-2 lg:order-1">
                        {/* HEADER + SOCIAL PROOF */}
                        <div>
                            <Badge variant="primary" tone="soft">
                                {campaign.category}
                            </Badge>

                            <h1 className="text-3xl font-bold mt-3 text-text-primary leading-tight">
                                Donate to {campaign.title}
                            </h1>

                            <p className="text-text-secondary mt-2 leading-relaxed">
                                Your contribution helps provide immediate
                                support to people in urgent need.
                            </p>

                            {/* SOCIAL PROOF / ANCHOR */}
                            <div className="mt-3 text-sm text-text-secondary">
                                <p className="text-text-secondary font-medium">
                                    {campaign.supporters} people supported this
                                    campaign
                                </p>
                                <p className="block">
                                    Most donations are around{' '}
                                    <span className="text-primary font-medium">
                                        ৳1000–2000
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* AMOUNT (conversion optimized) */}
                        <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
                            <h3 className="font-semibold mb-2 text-text-primary">
                                Choose Amount
                            </h3>

                            <p className="text-xs text-text-secondary mb-4">
                                Suggested based on recent donations
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {presets.map((val) => {
                                    const isSuggested = val === 1000;

                                    return (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val)}
                                            className={`
                                                relative py-3 rounded-xl border text-sm font-medium transition-all
                                                ${
                                                    amount === val
                                                        ? 'bg-primary text-white border-primary shadow-sm'
                                                        : isSuggested
                                                          ? 'bg-primary/5 border-primary text-primary'
                                                          : 'bg-surface-soft border-border hover:border-primary/40'
                                                }
                                            `}
                                        >
                                            ৳{val}
                                            {isSuggested && (
                                                <span className="absolute -top-2 right-2 text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">
                                                    Popular
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <input
                                type="number"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(Number(e.target.value))
                                }
                                className="
                                    mt-4 w-full
                                    p-3
                                    rounded-xl
                                    border border-border
                                    bg-surface-soft
                                    outline-none
                                    focus:border-primary
                                    transition
                                "
                                placeholder="Custom amount"
                            />

                            {/* IMPACT MAPPING */}
                            <div className="mt-4 text-sm text-text-secondary">
                                <span className="text-primary font-medium">
                                    ৳{amount}
                                </span>{' '}
                                can help provide essential support to affected
                                families
                            </div>
                        </div>

                        {/* PAYMENT */}
                        <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-text-primary">
                                <TbCreditCard />
                                Payment Method
                            </h3>

                            <label className="flex items-center gap-3 border border-border rounded-xl p-3 hover:border-primary/40 transition cursor-pointer">
                                <input type="radio" name="pay" defaultChecked />
                                <TbCreditCard className="text-primary" />
                                <span className="text-sm text-text-primary">
                                    Credit / Debit Card
                                </span>
                            </label>

                            <label className="flex items-center gap-3 border border-border rounded-xl p-3 hover:border-primary/40 transition cursor-pointer">
                                <input type="radio" name="pay" />
                                <TbWallet className="text-accent" />
                                <span className="text-sm text-text-primary">
                                    Mobile Banking (bKash / Nagad)
                                </span>
                            </label>
                        </div>

                        {/* DONATE BUTTON */}
                        <Button className="w-full text-lg py-3 rounded-xl">
                            <TbHeartFilled />
                            Donate ৳{amount}
                        </Button>

                        <p className="text-xs text-text-secondary flex items-center gap-2">
                            <TbShieldCheck className="text-primary" />
                            Secure donation • No hidden fees • Instant
                            confirmation
                        </p>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-6 order-1 lg:order-2">
                        {/* SUMMARY */}
                        <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
                            <h3 className="font-semibold mb-4 text-text-primary">
                                Campaign Summary
                            </h3>

                            <img
                                src={campaign.image}
                                className="w-full h-52 object-cover rounded-xl"
                            />

                            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                                {campaign.shortDescription}
                            </p>

                            <div className="mt-5 text-sm space-y-2">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Raised</span>
                                    <span className="text-text-primary font-medium">
                                        ৳{campaign.raised.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between text-text-secondary">
                                    <span>Goal</span>
                                    <span className="text-text-primary font-medium">
                                        ৳
                                        {campaign.targetAmount.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between text-text-secondary">
                                    <span>Supporters</span>
                                    <span className="text-text-primary font-medium">
                                        {campaign.supporters}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* IMPACT */}
                        <div className="bg-primary/5 rounded-2xl p-5 sm:p-6 border border-primary/10">
                            <h3 className="font-semibold flex items-center gap-2 text-primary">
                                <TbUser />
                                Your Impact
                            </h3>

                            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                                Even a small donation helps provide food,
                                medicine, and emergency relief to affected
                                families.
                            </p>

                            <div className="mt-4 text-sm font-medium text-primary">
                                Every contribution matters ❤️
                            </div>
                        </div>

                        {/* TRANSPARENCY */}
                        <div className="bg-surface rounded-2xl p-5 sm:p-6 border border-border">
                            <h3 className="font-semibold flex items-center gap-2 text-text-primary">
                                <TbWallet />
                                Transparency
                            </h3>

                            <ul className="text-sm text-text-secondary mt-3 space-y-2">
                                <li>• 100% verified campaigns</li>
                                <li>• Real-time updates</li>
                                <li>• Public fund tracking</li>
                                <li>• NGO verification system</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donate;

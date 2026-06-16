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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">
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
        <div className="min-h-screen bg-surface py-12 mt-20">
            <div className="container-width max-w-5xl">
                {/* BACK */}
                <Link
                    to={`/campaign/${campaign.id}`}
                    className="inline-flex items-center gap-2 text-sm text-text-secondary mb-6"
                >
                    <TbArrowLeft />
                    Back to campaign
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* LEFT: FORM */}
                    <div className="space-y-6">
                        {/* HEADER */}
                        <div>
                            <Badge variant="primary" tone="soft">
                                {campaign.category}
                            </Badge>

                            <h1 className="text-3xl font-bold mt-3">
                                Donate to {campaign.title}
                            </h1>

                            <p className="text-text-secondary mt-2">
                                Your contribution helps provide immediate
                                support to people in urgent need.
                            </p>
                        </div>

                        {/* AMOUNT SELECT */}
                        <div className="bg-white rounded-2xl p-6 border">
                            <h3 className="font-semibold mb-4">
                                Select Amount
                            </h3>

                            <div className="grid grid-cols-2 gap-3">
                                {presets.map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(val)}
                                        className={`p-3 rounded-xl border text-sm font-medium transition ${
                                            amount === val
                                                ? 'bg-primary text-white border-primary'
                                                : 'hover:border-primary'
                                        }`}
                                    >
                                        ৳{val}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="number"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(Number(e.target.value))
                                }
                                className="mt-4 w-full p-3 border rounded-xl outline-none"
                                placeholder="Custom amount"
                            />
                        </div>

                        {/* PAYMENT INFO */}
                        <div className="bg-white rounded-2xl p-6 border space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <TbCreditCard />
                                Payment Method
                            </h3>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 border p-3 rounded-xl">
                                    <input
                                        type="radio"
                                        name="pay"
                                        defaultChecked
                                    />
                                    Credit / Debit Card
                                </label>

                                <label className="flex items-center gap-2 border p-3 rounded-xl">
                                    <input type="radio" name="pay" />
                                    Mobile Banking (bKash / Nagad)
                                </label>
                            </div>
                        </div>

                        {/* DONATE BUTTON */}
                        <Button className="w-full text-lg py-3">
                            <TbHeartFilled />
                            Donate ৳{amount}
                        </Button>

                        <p className="text-xs text-text-secondary flex items-center gap-2">
                            <TbShieldCheck />
                            Secure and encrypted donation process
                        </p>
                    </div>

                    {/* RIGHT: SUMMARY CARD */}
                    <div className="space-y-6">
                        {/* CAMPAIGN SUMMARY */}
                        <div className="bg-white rounded-2xl p-6 border">
                            <h3 className="font-semibold mb-4">
                                Campaign Summary
                            </h3>

                            <img
                                src={campaign.image}
                                className="w-full h-48 object-cover rounded-xl"
                            />

                            <p className="mt-4 text-sm text-text-secondary">
                                {campaign.shortDescription}
                            </p>

                            <div className="mt-4 text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span>Raised</span>
                                    <span>
                                        ৳{campaign.raised.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Goal</span>
                                    <span>
                                        ৳
                                        {campaign.targetAmount.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Supporters</span>
                                    <span>{campaign.supporters}</span>
                                </div>
                            </div>
                        </div>

                        {/* IMPACT BOX */}
                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                            <h3 className="font-semibold flex items-center gap-2">
                                <TbUser />
                                Your Impact
                            </h3>

                            <p className="text-sm text-text-secondary mt-2">
                                Even a small donation helps provide food,
                                medicine, and emergency relief to affected
                                families.
                            </p>

                            <div className="mt-4 text-sm font-medium text-primary">
                                Every contribution matters ❤️
                            </div>
                        </div>

                        {/* TRANSPARENCY */}
                        <div className="bg-white rounded-2xl p-6 border">
                            <h3 className="font-semibold flex items-center gap-2">
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

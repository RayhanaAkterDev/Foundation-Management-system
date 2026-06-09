import { useMemo, useState } from 'react';
import Button from '@/components/Button';
import {
    TbClock,
    TbHeartHandshake,
    TbLockCheck,
    TbShieldCheckFilled,
    TbShare,
    TbUsers,
} from 'react-icons/tb';

const DonationSidebar = ({ campaign, organizer }) => {
    const percent = Math.min(
        100,
        Math.max(0, campaign?.progress || 0)
    );

    const radius = 56;
    const circumference = 2 * Math.PI * radius;

    const offset =
        circumference - (percent / 100) * circumference;

    const presetAmounts = [25, 50, 100, 250];

    const [selectedAmount, setSelectedAmount] = useState(50);
    const [customAmount, setCustomAmount] = useState('');

    const activeAmount = useMemo(() => {
        const val = Number(customAmount || selectedAmount);
        if (Number.isNaN(val) || val <= 0) return 0;
        return val;
    }, [customAmount, selectedAmount]);

    // scalable impact logic (instead of hardcoding)
    const impactText = useMemo(() => {
        if (activeAmount <= 0)
            return 'Enter an amount to see your impact';

        if (activeAmount < 25)
            return 'Provides small but meaningful support';

        if (activeAmount < 50)
            return 'Helps cover urgent relief essentials';

        if (activeAmount < 100)
            return 'Supports food, medicine, and basic needs';

        if (activeAmount < 250)
            return 'Funds multi-family emergency assistance';

        return 'Drives large-scale emergency response support';
    }, [activeAmount]);

    // smooth proportional bar instead of fake mapping
    const impactPercent = Math.min(
        100,
        (activeAmount / 250) * 100
    );

    const handlePresetClick = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    return (
        <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">

                {/* HERO */}
                <div className="relative overflow-hidden bg-primary text-white">
                    <div className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-white/10" />
                    <div className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-white/5" />

                    <div className="relative p-8">
                        <h3 className="text-xl font-semibold">
                            Make a Difference Today
                        </h3>

                        <p className="mt-2 text-sm text-white/75 leading-relaxed">
                            Your support helps deliver food, relief, and emergency aid.
                        </p>

                        {/* PROGRESS */}
                        <div className="mt-7 flex justify-center">
                            <div className="relative h-36 w-36">
                                <svg
                                    className="h-full w-full -rotate-90"
                                    viewBox="0 0 140 140"
                                >
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={radius}
                                        fill="none"
                                        stroke="rgba(255,255,255,.18)"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="70"
                                        cy="70"
                                        r={radius}
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                    />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black">
                                        {percent}%
                                    </span>
                                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                                        Funded
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* AMOUNT */}
                        <div className="mt-6 text-center">
                            <div className="text-5xl font-black tracking-tight">
                                ${campaign?.raised?.toLocaleString() || 0}
                            </div>

                            <div className="mt-2 text-sm text-white/75">
                                raised of $
                                {campaign?.targetAmount?.toLocaleString() || 0}
                            </div>
                        </div>

                        {/* META */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <TbUsers size={16} />
                                <span>{campaign?.supporters || 0} supporters</span>
                            </div>

                            <div className="h-4 w-px bg-white/20" />

                            <div className="flex items-center gap-2">
                                <TbClock size={16} />
                                <span>{campaign?.daysLeft || 0} days left</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DONATION */}
                <div className="p-8">

                    <h4 className="mb-5 text-lg font-bold">
                        Choose Amount
                    </h4>

                    {/* PRESETS */}
                    <div className="grid grid-cols-2 gap-3">
                        {presetAmounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => handlePresetClick(amount)}
                                className={`relative overflow-hidden rounded-2xl border py-5 text-center transition-all duration-200 ${
                                    activeAmount === amount
                                        ? 'border-primary bg-primary text-white shadow-md'
                                        : 'border-border hover:border-primary hover:bg-muted/40'
                                }`}
                            >
                                <div className="text-2xl font-bold">
                                    ${amount}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* CUSTOM */}
                    <div className="mt-4 flex h-14 items-center rounded-2xl border border-border bg-muted/20 px-4">
                        <span className="font-semibold text-text-secondary">
                            $
                        </span>

                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) =>
                                setCustomAmount(e.target.value)
                            }
                            placeholder="Custom amount"
                            className="ml-2 flex-1 bg-transparent outline-none"
                        />
                    </div>

                    {/* IMPACT */}
                    <div className="mt-5 rounded-xl border border-border/60 bg-muted/10 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                                ${activeAmount || 0}
                            </span>

                            <span className="text-[11px] uppercase text-text-secondary">
                                live impact
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                            {impactText}
                        </p>

                        <div className="mt-3 h-0.75 w-full rounded-full bg-border overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${impactPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* CTA */}
                    <Button
                        variant="accent"
                        size="lg"
                        className="mt-5 h-14 w-full text-base font-bold"
                    >
                        Donate ${activeAmount || selectedAmount}
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-secondary">
                        <TbLockCheck size={16} />
                        Secure encrypted payment processing
                    </div>

                    <button className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-medium text-primary hover:underline">
                        <TbShare size={16} />
                        Share Campaign
                    </button>
                </div>

                {/* TRUST */}
                <div className="border-t border-border p-8">
                    <h4 className="mb-4 text-lg font-bold">
                        Trust & Safety
                    </h4>

                    <div className="space-y-4 text-sm text-text-secondary">
                        <div className="flex items-start gap-3">
                            <TbShieldCheckFilled className="mt-0.5 text-primary" />
                            <span>Verified campaign with fraud checks.</span>
                        </div>

                        <div className="flex items-start gap-3">
                            <TbLockCheck className="mt-0.5 text-primary" />
                            <span>End-to-end encrypted payments.</span>
                        </div>

                        <div className="flex items-start gap-3">
                            <TbHeartHandshake className="mt-0.5 text-primary" />
                            <span>Funds go directly to relief operations.</span>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-border pt-5 text-xs text-text-secondary">
                        Organized by{' '}
                        <span className="font-medium text-text-primary">
                            {organizer?.name || 'Unknown'}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DonationSidebar;
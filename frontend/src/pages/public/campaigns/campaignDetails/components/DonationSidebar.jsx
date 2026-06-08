const DonationSidebar = ({ campaign, organizer }) => {
    const percent = Math.min(100, Math.max(0, campaign.progress || 0));

    return (
        <aside className="lg:sticky lg:top-24">
            <div className="bg-surface border border-border rounded-3xl p-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
                {/* HEADER */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">
                        Support This Campaign
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                        Your contribution directly helps this cause
                    </p>
                </div>

                {/* FUNDING SNAPSHOT (NEW VISUAL SYSTEM) */}
                <div className="mb-7">
                    {/* BIG PERCENT (PRIMARY FOCUS) */}
                    <div className="text-center mb-5">
                        <p className="text-4xl font-bold text-primary leading-none">
                            {percent}%
                        </p>
                        <p className="text-xs text-text-secondary mt-2">
                            funded so far
                        </p>
                    </div>

                    {/* PROGRESS METER (DIFFERENT VISUAL LANGUAGE) */}
                    <div className="relative h-3 bg-border/50 rounded-full overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-primary transition-all duration-700"
                            style={{ width: `${percent}%` }}
                        />

                        {/* subtle tick indicator */}
                        <div className="absolute inset-0 flex justify-between px-2">
                            {[25, 50, 75].map((mark) => (
                                <div
                                    key={mark}
                                    className="w-px h-full bg-surface/60"
                                />
                            ))}
                        </div>
                    </div>

                    {/* MONEY + TIME */}
                    <div className="flex justify-between mt-5 text-sm">
                        <div>
                            <p className="text-text-primary font-semibold">
                                ${campaign.raised?.toLocaleString()}
                            </p>
                            <p className="text-text-secondary text-xs">
                                raised
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-text-primary font-semibold">
                                ${campaign.targetAmount?.toLocaleString()}
                            </p>
                            <p className="text-text-secondary text-xs">goal</p>
                        </div>
                    </div>

                    <div className="flex justify-between mt-3 text-sm">
                        <p className="text-text-secondary">
                            {campaign.supporters} supporters
                        </p>

                        <p className="text-text-secondary">
                            {campaign.daysLeft} days left
                        </p>
                    </div>
                </div>

                {/* CTA (MORE EMPHASIS) */}
                <button className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-semibold transition shadow-sm">
                    Contribute Now
                </button>

                {/* SECONDARY ACTIONS */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button className="py-3 rounded-xl border border-border text-text-secondary hover:text-text-primary transition">
                        Share
                    </button>

                    <button className="py-3 rounded-xl border border-border text-text-secondary hover:text-text-primary transition">
                        Save
                    </button>
                </div>

                {/* TRUST BLOCK */}
                <div className="mt-7 pt-6 border-t border-border">
                    <p className="text-xs text-text-secondary">Organized by</p>

                    <p className="text-text-primary font-semibold mt-1">
                        {organizer.name}
                    </p>

                    {organizer.verified && (
                        <p className="text-xs text-primary mt-1">
                            ✓ Verified organization
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default DonationSidebar;

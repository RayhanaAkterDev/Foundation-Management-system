import {
    TbClipboardCheck,
    TbSearch,
    TbHeartHandshake,
    TbShieldCheck,
} from 'react-icons/tb';

const RequestInfo = () => {
    const steps = [
        {
            icon: TbClipboardCheck,
            title: 'Share',
            desc: 'Explain your situation clearly.',
        },
        {
            icon: TbSearch,
            title: 'Review',
            desc: 'AI + human verification.',
        },
        {
            icon: TbHeartHandshake,
            title: 'Match',
            desc: 'We connect you to support.',
        },
    ];

    return (
        <aside
            className="
            w-full
            lg:sticky lg:top-28
        "
        >
            <div
                className="
                bg-surface
                p-5 sm:p-6 lg:p-7
            "
            >
                <h3 className="text-base sm:text-lg font-semibold text-text-primary">
                    How it works
                </h3>

                <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
                    {steps.map((step, i) => {
                        const Icon = step.icon;

                        return (
                            <div key={i} className="flex gap-3 sm:gap-4">
                                <div
                                    className="
                                    h-9 w-9 sm:h-10 sm:w-10
                                    rounded-xl
                                    bg-background
                                    border border-border
                                    flex items-center justify-center
                                "
                                >
                                    <Icon className="text-primary text-lg" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-text-primary">
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 sm:mt-8 pt-5 border-t border-border flex gap-2 text-xs text-text-secondary">
                    <TbShieldCheck className="text-primary text-base mt-0.5" />
                    Secure & confidential processing
                </div>
            </div>
        </aside>
    );
};

export default RequestInfo;

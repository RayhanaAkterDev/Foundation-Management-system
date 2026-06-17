import { useState } from 'react';

const faqs = [
    {
        q: 'Who can partner with SP?',
        a: 'SP partners with companies, NGOs, community groups, and individuals who want to contribute to verified humanitarian causes.',
    },
    {
        q: 'Is there a minimum contribution?',
        a: 'No. Partnerships can start small and scale based on impact goals.',
    },
    {
        q: 'How is impact measured?',
        a: 'Every contribution is tracked through campaign-level reporting, field verification, and outcome summaries.',
    },
    {
        q: 'Can we choose where our support goes?',
        a: 'Yes. Partners can select causes, regions, or allow SP to allocate based on urgency.',
    },
];

const PartnerFAQ = () => {
    const [active, setActive] = useState(0);

    const current = faqs[active] ?? faqs[0];

    return (
        <section className="bg-background section-gap">
            <div className="container-width">
                {/* HEADER */}
                <div className="max-w-2xl mb-12">
                    <h2
                        className="
                        text-2xl sm:text-3xl md:text-4xl
                        font-semibold text-text
                        leading-tight tracking-tight
                    "
                    >
                        Frequently Asked Questions
                    </h2>

                    <p
                        className="
                        mt-4
                        text-sm sm:text-base
                        text-muted
                        leading-relaxed
                        max-w-xl
                    "
                    >
                        Everything you need to understand how partnerships work
                        before getting started.
                    </p>
                </div>

                {/* MOBILE */}
                <div className="md:hidden space-y-4">
                    {faqs.map((item, idx) => {
                        const isOpen = active === idx;

                        return (
                            <div
                                key={idx}
                                className="border border-border/40 rounded-xl overflow-hidden bg-white/40"
                            >
                                <button
                                    onClick={() =>
                                        setActive(isOpen ? null : idx)
                                    }
                                    className="
                                        w-full text-left
                                        px-5 py-5
                                        flex items-start justify-between gap-4
                                        focus:outline-none focus:ring-0
                                    "
                                >
                                    <span
                                        className="
                                        text-sm sm:text-base
                                        font-medium text-text
                                        leading-snug
                                    "
                                    >
                                        {item.q}
                                    </span>

                                    <span className="text-muted text-xl leading-none">
                                        {isOpen ? '−' : '+'}
                                    </span>
                                </button>

                                <div
                                    className="px-5 overflow-hidden transition-all duration-300 ease-in-out"
                                    style={{
                                        maxHeight: isOpen ? '240px' : '0px',
                                        opacity: isOpen ? 1 : 0,
                                        paddingBottom: isOpen ? '16px' : '0px',
                                    }}
                                >
                                    <p
                                        className="
                                        text-sm sm:text-base
                                        text-muted
                                        leading-relaxed
                                    "
                                    >
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* DESKTOP */}
                <div className="hidden md:grid grid-cols-12 gap-10">
                    {/* LEFT */}
                    <div className="col-span-5 space-y-3">
                        {faqs.map((item, idx) => {
                            const isActive = active === idx;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActive(idx)}
                                    className={`
                                        w-full text-left rounded-xl
                                        px-5 py-4
                                        border transition-all duration-200
                                        focus:outline-none focus:ring-0
                                        ${
                                            isActive
                                                ? 'border-border bg-white shadow-sm'
                                                : 'border-transparent hover:bg-white'
                                        }
                                    `}
                                >
                                    <p
                                        className="
                                        text-base lg:text-lg
                                        font-medium text-text
                                        leading-snug
                                    "
                                    >
                                        {item.q}
                                    </p>

                                    <p
                                        className="
                                        text-xs text-muted mt-1
                                    "
                                    >
                                        Click to view answer
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* RIGHT */}
                    <div className="col-span-7">
                        <div
                            className="
                            sticky top-24
                            rounded-2xl border border-border/40
                            bg-white
                            p-8
                            shadow-sm
                        "
                        >
                            <p className="text-xs uppercase tracking-wider text-muted">
                                Answer
                            </p>

                            <h3
                                className="
                                mt-3
                                text-xl md:text-2xl
                                font-semibold text-text
                                leading-snug tracking-tight
                            "
                            >
                                {current.q}
                            </h3>

                            <div className="mt-5 border-t border-border/30 pt-5">
                                <p
                                    className="
                                    text-sm md:text-base
                                    text-muted
                                    leading-relaxed
                                "
                                >
                                    {current.a}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerFAQ;

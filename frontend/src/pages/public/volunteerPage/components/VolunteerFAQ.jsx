import SectionHeading from '@/components/SectionHeading';
import { useState } from 'react';

const faqs = [
    {
        q: 'Do I need experience?',
        a: 'No. We guide all volunteers with proper onboarding and support.',
    },
    {
        q: 'How much time do I need?',
        a: 'Even a few hours per week can make a meaningful impact.',
    },
    {
        q: 'Is this paid?',
        a: 'No, volunteering is fully unpaid but highly impactful.',
    },
];

const VolunteerFAQ = () => {
    const [open, setOpen] = useState(null);

    return (
        <section className="section-gap bg-surface">
            <div className="container-width max-w-2xl">
                {/* Heading */}
                <SectionHeading
                    title="Frequently asked questions"
                    description="Everything you need to know before joining as a volunteer."
                    descriptionSize="sectionHero"
                />

                {/* FAQ list */}
                <div className="mt-10 sm:mt-14 md:mt-16 space-y-5 sm:space-y-7 md:space-y-8">
                    {faqs.map((f, i) => {
                        const isOpen = open === i;

                        return (
                            <div
                                key={i}
                                className="
                                    border-b border-border last:border-b-0
                                    pb-5 sm:pb-6 md:pb-7
                                "
                            >
                                {/* Question */}
                                <button
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    className="
                                        w-full
                                        flex items-start justify-between
                                        gap-4
                                        text-left
                                        py-2 sm:py-3
                                        cursor-pointer
                                    "
                                >
                                    <span
                                        className="
                                            text-base sm:text-lg md:text-xl
                                            font-medium
                                            leading-snug
                                        "
                                    >
                                        {f.q}
                                    </span>

                                    <span
                                        className="
                                            text-primary
                                            text-xl sm:text-2xl
                                            leading-none
                                            select-none
                                            transition-transform duration-300
                                            ${isOpen ? 'rotate-45' : ''}
                                        "
                                    >
                                        +
                                    </span>
                                </button>

                                {/* Answer */}
                                <div
                                    className={`
                                        overflow-hidden
                                        transition-all duration-300 ease-in-out
                                        ${isOpen ? 'max-h-96 mt-3 sm:mt-4' : 'max-h-0'}
                                    `}
                                >
                                    <p
                                        className="
                                            text-sm sm:text-base md:text-lg
                                            text-muted-foreground
                                            leading-relaxed
                                            pr-2
                                        "
                                    >
                                        {f.a}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default VolunteerFAQ;

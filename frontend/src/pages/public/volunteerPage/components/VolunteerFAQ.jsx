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
        <section className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-center text-2xl md:text-4xl font-semibold">
                Frequently asked questions
            </h2>

            <div className="space-y-4">
                {faqs.map((f, i) => (
                    <div
                        key={i}
                        className="border border-border rounded-xl p-4"
                    >
                        <button
                            onClick={() => setOpen(open === i ? null : i)}
                            className="w-full text-left font-medium"
                        >
                            {f.q}
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                open === i ? 'max-h-40 mt-2' : 'max-h-0'
                            }`}
                        >
                            <p className="text-muted-foreground text-sm">
                                {f.a}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VolunteerFAQ;

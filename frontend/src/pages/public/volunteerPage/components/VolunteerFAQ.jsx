const faqs = [
    'Who can volunteer?',
    'Do I need experience?',
    'Can I volunteer remotely?',
    'How long does approval take?',
];

const VolunteerFAQ = () => {
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-10">
                Frequently Asked Questions
            </h2>

            <div className="divide-y border-y border-border">
                {faqs.map((item) => (
                    <div key={item} className="py-6">
                        <button className="font-medium text-left w-full">
                            {item}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VolunteerFAQ;
import { useState } from 'react';

const faqs = [
    {
        q: 'কোন প্রতিষ্ঠানগুলো এখানে দেখা যায়?',
        a: 'স্ট্যান্ড ফর পিপলে নিবন্ধিত এবং যাচাইকৃত প্রতিষ্ঠানগুলো এই তালিকায় প্রদর্শিত হয়।',
    },
    {
        q: 'একটি প্রতিষ্ঠান কীভাবে স্ট্যান্ড ফর পিপলের সঙ্গে যুক্ত হয়?',
        a: 'প্রতিষ্ঠান হিসেবে নিবন্ধন করার পর প্রয়োজনীয় তথ্য যাচাই করা হয়। যাচাইকরণ সম্পন্ন হলে প্রতিষ্ঠানটি প্ল্যাটফর্মে কার্যক্রম পরিচালনা করতে পারে।',
    },
    {
        q: 'সংযুক্ত প্রতিষ্ঠানগুলো কী করতে পারে?',
        a: 'প্রতিষ্ঠানগুলো মানবিক ক্যাম্পেইন পরিচালনা, সহায়তার প্রয়োজনের সঙ্গে কাজ করা এবং স্বেচ্ছাসেবীদের সঙ্গে সমন্বয়সহ তাদের অনুমোদিত কার্যক্রম পরিচালনা করতে পারে।',
    },
    {
        q: 'আমি কি কোনো প্রতিষ্ঠানের কার্যক্রমে সহায়তা করতে পারি?',
        a: 'হ্যাঁ। প্রতিষ্ঠানের পরিচালিত সক্রিয় ক্যাম্পেইনগুলোতে দান বা অন্যান্য উপযুক্ত উপায়ে সহায়তা করা যায়।',
    },
];

const OrganizationFAQ = () => {
    const [active, setActive] = useState(0);

    const current = faqs[active] ?? faqs[0];

    return (
        <section className="section-gap bg-background">
            <div className="container-width">
                {/* HEADER */}
                <div className="mb-10 max-w-2xl sm:mb-12">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-sm">
                        সাধারণ প্রশ্ন
                    </p>

                    <h2
                        className="
                            mt-2
                            text-2xl
                            font-semibold
                            leading-tight
                            tracking-tight
                            text-text-primary
                            sm:text-3xl
                            md:text-4xl
                        "
                    >
                        প্রতিষ্ঠান সম্পর্কে জানতে চান?
                    </h2>

                    <p
                        className="
                            mt-3
                            max-w-xl
                            text-sm
                            leading-7
                            text-muted-foreground
                            sm:text-base
                        "
                    >
                        স্ট্যান্ড ফর পিপলে সংযুক্ত প্রতিষ্ঠানগুলো এবং তাদের
                        ভূমিকা সম্পর্কে সাধারণ কিছু প্রশ্নের উত্তর।
                    </p>
                </div>

                {/* MOBILE */}
                <div className="space-y-3 md:hidden">
                    {faqs.map((item, idx) => {
                        const isOpen = active === idx;

                        return (
                            <div
                                key={item.q}
                                className="
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-border
                                    bg-surface
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActive(isOpen ? null : idx)
                                    }
                                    aria-expanded={isOpen}
                                    className="
                                        flex
                                        w-full
                                        items-start
                                        justify-between
                                        gap-4
                                        px-5
                                        py-5
                                        text-left
                                    "
                                >
                                    <span
                                        className="
                                            text-sm
                                            font-medium
                                            leading-snug
                                            text-text-primary
                                            sm:text-base
                                        "
                                    >
                                        {item.q}
                                    </span>

                                    <span
                                        className="
                                            shrink-0
                                            text-xl
                                            leading-none
                                            text-muted-foreground
                                        "
                                        aria-hidden="true"
                                    >
                                        {isOpen ? '−' : '+'}
                                    </span>
                                </button>

                                <div
                                    className="
                                        overflow-hidden
                                        transition-all
                                        duration-300
                                        ease-in-out
                                    "
                                    style={{
                                        maxHeight: isOpen ? '240px' : '0px',
                                        opacity: isOpen ? 1 : 0,
                                        paddingBottom: isOpen ? '16px' : '0px',
                                    }}
                                >
                                    <p
                                        className="
                                            px-5
                                            text-sm
                                            leading-7
                                            text-muted-foreground
                                            sm:text-base
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
                <div className="hidden gap-10 md:grid md:grid-cols-12 lg:gap-14">
                    {/* QUESTIONS */}
                    <div className="col-span-5 space-y-2">
                        {faqs.map((item, idx) => {
                            const isActive = active === idx;

                            return (
                                <button
                                    type="button"
                                    key={item.q}
                                    onClick={() => setActive(idx)}
                                    aria-selected={isActive}
                                    className={`
                                        w-full
                                        rounded-xl
                                        border
                                        px-5
                                        py-4
                                        text-left
                                        transition-all
                                        duration-200
                                        ${
                                            isActive
                                                ? 'border-border bg-surface shadow-sm'
                                                : 'border-transparent hover:bg-surface/70'
                                        }
                                    `}
                                >
                                    <p
                                        className="
                                            text-base
                                            font-medium
                                            leading-snug
                                            text-text-primary
                                            lg:text-lg
                                        "
                                    >
                                        {item.q}
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-muted-foreground
                                        "
                                    >
                                        উত্তর দেখতে ক্লিক করুন
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* ANSWER */}
                    <div className="col-span-7">
                        <div
                            className="
                                sticky
                                top-24
                                rounded-2xl
                                border
                                border-border
                                bg-surface
                                p-6
                                shadow-sm
                                lg:p-8
                            "
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                                উত্তর
                            </p>

                            <h3
                                className="
                                    mt-3
                                    text-xl
                                    font-semibold
                                    leading-snug
                                    tracking-tight
                                    text-text-primary
                                    md:text-2xl
                                "
                            >
                                {current.q}
                            </h3>

                            <div className="mt-5 border-t border-border pt-5">
                                <p
                                    className="
                                        text-sm
                                        leading-7
                                        text-muted-foreground
                                        md:text-base
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

export default OrganizationFAQ;

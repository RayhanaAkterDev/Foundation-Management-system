import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Mail } from 'lucide-react';

const relatedPages = [
    { label: 'গোপনীয়তা নীতি', href: '/privacy-policy' },
    { label: 'ব্যবহারের শর্ত', href: '/terms' },
    { label: 'অ্যাক্সেসযোগ্যতা', href: '/accessibility' },
];

const sectionId = (index) => `legal-section-${index + 1}`;

export default function LegalPageLayout({
    title,
    intro,
    updatedAt,
    sections = [],
}) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return undefined;
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top,
                    );
                if (visible.length) {
                    setActiveIndex(Number(visible[0].target.dataset.index));
                }
            },
            { rootMargin: '-110px 0px -65% 0px', threshold: 0 },
        );
        const nodes = document.querySelectorAll('[data-legal-section]');
        nodes.forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, [sections]);

    const jumpTo = (index) => {
        setActiveIndex(index);
        document
            .getElementById(sectionId(index))
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <main className="mt-20 min-h-screen bg-white font-['Noto_Sans_Bengali',sans-serif] text-[#26343B]">
            <header className="border-b border-[#DDE9E6] bg-[#F3F8F6]">
                <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-[76px]">
                    <div className="mb-5 flex items-center gap-3 text-[13px] font-medium text-[#34766B]">
                        <span
                            className="h-px w-7 bg-[#34766B]"
                            aria-hidden="true"
                        />
                        স্ট্যান্ড ফর পিপল / নীতিমালা
                    </div>
                    <h1 className="max-w-4xl text-[32px] font-semibold leading-[1.4] tracking-[-0.025em] text-[#172D32] sm:text-[42px] lg:text-[48px]">
                        {title}
                    </h1>
                    <p className="mt-5 max-w-[740px] text-[16px] leading-[2] text-[#52646A] sm:text-[17px]">
                        {intro}
                    </p>
                    {updatedAt && (
                        <p className="mt-7 border-t border-[#DCE7E4] pt-4 text-[13px] text-[#65787A] sm:max-w-[740px]">
                            সর্বশেষ হালনাগাদ{' '}
                            <span className="mx-2 text-[#A2B6B2]">/</span>{' '}
                            {updatedAt}
                        </p>
                    )}
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[235px_minmax(0,1fr)] lg:gap-16 lg:px-10 lg:py-16">
                <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                    <div className="hidden lg:block">
                        <p className="mb-5 text-[12px] font-semibold tracking-[0.08em] text-[#78888B]">
                            এই পেজে যা আছে
                        </p>
                        <nav
                            aria-label="এই পেজের বিষয়সূচি"
                            className="border-l border-[#E0E8E7]"
                        >
                            {sections.map((section, index) => (
                                <button
                                    key={section.title}
                                    type="button"
                                    onClick={() => jumpTo(index)}
                                    aria-current={
                                        activeIndex === index
                                            ? 'location'
                                            : undefined
                                    }
                                    className={`-ml-px block w-full border-l-2 px-4 py-2.5 text-left text-[13px] leading-[1.75] transition-colors ${activeIndex === index ? 'border-[#0F766E] bg-[#F1F7F5] font-semibold text-[#0C655D]' : 'border-transparent text-[#68797D] hover:border-[#9BBAB3] hover:text-[#244B49]'}`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="relative lg:hidden">
                        <label
                            htmlFor="legal-section-select"
                            className="mb-2 block text-[13px] font-semibold text-[#52646A]"
                        >
                            বিষয় নির্বাচন করুন
                        </label>
                        <select
                            id="legal-section-select"
                            value={activeIndex}
                            onChange={(event) =>
                                jumpTo(Number(event.target.value))
                            }
                            className="w-full appearance-none border border-[#D5E1DE] bg-white px-4 py-3.5 pr-11 text-[14px] text-[#273D40] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
                        >
                            {sections.map((section, index) => (
                                <option key={section.title} value={index}>
                                    {section.title}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={17}
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-4 right-4 text-[#667A7A]"
                        />
                    </div>
                </aside>

                <article className="min-w-0 max-w-[760px]">
                    {sections.map((section, index) => (
                        <section
                            key={section.title}
                            id={sectionId(index)}
                            data-legal-section
                            data-index={index}
                            className="scroll-mt-28 border-b border-[#E7ECEB] py-8 first:pt-0 last:border-b-0 sm:py-10"
                        >
                            <h2 className="text-[21px] font-semibold leading-[1.55] tracking-[-0.015em] text-[#20363A] sm:text-[23px]">
                                {section.title}
                            </h2>
                            {section.content && (
                                <div className="mt-4 space-y-4 whitespace-pre-line text-[15.5px] leading-[2.15] text-[#526267] sm:text-[16px]">
                                    {section.content}
                                </div>
                            )}
                            {section.items?.length > 0 && (
                                <ul className="mt-5 space-y-3.5">
                                    {section.items.map((item, itemIndex) => (
                                        <li
                                            key={itemIndex}
                                            className="flex items-start gap-3 text-[15.5px] leading-[2] text-[#526267] sm:text-[16px]"
                                        >
                                            <span
                                                className="mt-[13px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#3D897D]"
                                                aria-hidden="true"
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}

                    <div className="mt-10 border-t border-[#DDE7E4] pt-8 sm:mt-14">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-[19px] font-semibold text-[#243B3D]">
                                    আরও সহায়তা প্রয়োজন?
                                </h2>
                                <p className="mt-2 text-[14px] leading-7 text-[#66777B]">
                                    এই নীতিমালা সম্পর্কে কোনো প্রশ্ন বা মতামত
                                    থাকলে আমাদের জানান।
                                </p>
                            </div>
                            <Link
                                to="/contact"
                                className="inline-flex shrink-0 items-center justify-center gap-2 border border-[#0F766E] bg-[#0F766E] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#115E59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
                            >
                                <Mail size={16} /> যোগাযোগ করুন{' '}
                                <ArrowUpRight size={15} />
                            </Link>
                        </div>
                        <div className="mt-9 border-t border-[#EDF0EF] pt-6">
                            <p className="mb-3 text-[12px] font-semibold text-[#82908F]">
                                অন্যান্য নীতিমালা
                            </p>
                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                                {relatedPages
                                    .filter((page) => page.label !== title)
                                    .map((page) => (
                                        <Link
                                            key={page.href}
                                            to={page.href}
                                            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#286C63] hover:underline"
                                        >
                                            {page.label}{' '}
                                            <ArrowUpRight size={13} />
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}

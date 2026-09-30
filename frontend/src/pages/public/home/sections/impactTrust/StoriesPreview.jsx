import React, { useEffect, useState } from 'react';

import { TbQuote, TbShieldCheck } from 'react-icons/tb';

import { fetchFeaturedTestimonial } from '@/api/testimonials';

const StoriesPreview = () => {
    const [testimonial, setTestimonial] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadTestimonial = async () => {
            try {
                setLoading(true);

                const response = await fetchFeaturedTestimonial();

                if (!isMounted) {
                    return;
                }

                setTestimonial(response?.testimonial || null);
            } catch {
                if (isMounted) {
                    setTestimonial(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadTestimonial();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div
                className="
                    rounded-3xl border border-border
                    bg-surface/80 p-6 sm:p-8
                    animate-pulse
                "
            >
                <div className="h-4 w-32 rounded bg-border/60" />

                <div className="mt-6 h-6 w-2/3 rounded bg-border/60" />

                <div className="mt-4 h-20 w-full rounded bg-border/60" />
            </div>
        );
    }

    if (!testimonial) {
        return null;
    }

    const isOrganization = testimonial?.user?.role === 'organization';

    return (
        <article
            className="
                group relative overflow-hidden
                rounded-3xl border border-border
                bg-surface/80 p-6 sm:p-8 lg:p-10
                transition duration-300
                hover:border-primary/30
                hover:shadow-lg
            "
        >
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-text-secondary">
                    <TbShieldCheck
                        size={17}
                        className="shrink-0 text-primary"
                    />

                    <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
                        যাচাইকৃত কমিউনিটি অভিজ্ঞতা
                    </span>
                </div>

                <span
                    className="
                        w-fit rounded-full
                        bg-primary/10
                        px-3 py-1
                        text-[11px] font-medium
                        text-primary
                    "
                >
                    {isOrganization ? 'সংগঠন' : 'ব্যক্তি'}
                </span>
            </div>

            {/* Testimonial */}
            <div className="mt-7 grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-8">
                <div
                    className="
                        flex h-12 w-12 shrink-0
                        items-center justify-center
                        rounded-2xl
                        bg-primary/10
                        text-primary
                    "
                >
                    <TbQuote size={24} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <p
                        className="
                            max-w-4xl
                            text-lg font-medium
                            leading-8 text-text-primary
                            sm:text-xl
                        "
                    >
                        “{testimonial.message}”
                    </p>

                    <div
                        className="
                            mt-7 flex flex-col gap-2
                            border-t border-border pt-5
                            sm:flex-row sm:items-center
                            sm:justify-between
                        "
                    >
                        <div>
                            <p className="text-sm font-semibold text-text-primary">
                                {testimonial?.user?.name || 'কমিউনিটি সদস্য'}
                            </p>

                            <p className="mt-1 text-xs text-text-secondary">
                                {isOrganization
                                    ? 'সংগঠন'
                                    : 'ব্যক্তিগত অ্যাকাউন্ট'}
                            </p>
                        </div>

                        <span className="text-xs text-text-secondary">
                            SP কমিউনিটি
                        </span>
                    </div>
                </div>
            </div>

            {/* Subtle accent */}
            <div
                className="
                    pointer-events-none absolute
                    -right-20 -top-20
                    h-44 w-44
                    rounded-full
                    bg-primary/5
                "
            />
        </article>
    );
};

export default StoriesPreview;

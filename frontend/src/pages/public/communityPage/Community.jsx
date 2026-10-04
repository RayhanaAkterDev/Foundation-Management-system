import React, { useEffect, useState } from 'react';

import {
    TbArrowDown,
    TbCheck,
    TbHeartHandshake,
    TbMessage,
    TbQuote,
    TbSend,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';

import { fetchTestimonials, submitTestimonial } from '@/api/testimonials';

const pageWidth =
    'mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16';

const Community = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [testimonialsLoading, setTestimonialsLoading] = useState(true);
    const [testimonialsError, setTestimonialsError] = useState('');

    const [formData, setFormData] = useState({
        message: '',
        consent: false,
    });

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadTestimonials = async () => {
            try {
                setTestimonialsLoading(true);
                setTestimonialsError('');

                const response = await fetchTestimonials();

                if (!isMounted) {
                    return;
                }

                setTestimonials(response?.testimonials || []);
            } catch (requestError) {
                if (!isMounted) {
                    return;
                }

                setTestimonialsError(
                    requestError?.message ||
                        'কমিউনিটির অভিজ্ঞতাগুলো এখন লোড করা যাচ্ছে না।',
                );
            } finally {
                if (isMounted) {
                    setTestimonialsLoading(false);
                }
            }
        };

        loadTestimonials();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const token =
            localStorage.getItem('auth_token') ||
            sessionStorage.getItem('auth_token');

        if (!token) {
            setError('অভিজ্ঞতা শেয়ার করতে আপনার SP অ্যাকাউন্টে লগইন করতে হবে।');
            return;
        }

        if (!formData.message.trim()) {
            setError('আপনার অভিজ্ঞতা লিখুন।');
            return;
        }

        if (formData.message.trim().length < 10) {
            setError('আপনার অভিজ্ঞতা অন্তত ১০ অক্ষরের হতে হবে।');
            return;
        }

        if (!formData.consent) {
            setError('প্রকাশের জন্য আপনার সম্মতি প্রয়োজন।');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            await submitTestimonial({
                message: formData.message.trim(),
                consent_to_publish: formData.consent,
            });

            setSubmitted(true);
        } catch (requestError) {
            const responseMessage =
                requestError?.message ||
                'অভিজ্ঞতা জমা দেওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।';

            setError(responseMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setSubmitted(false);
        setError('');

        setFormData({
            message: '',
            consent: false,
        });
    };

    const canSubmit =
        formData.message.trim().length >= 10 && formData.consent && !submitting;

    const testimonialCount = testimonials.length;

    return (
        <main
            lang="bn"
            className="
                overflow-hidden
                bg-[#f8f7f3]
                font-bengali
                text-text-primary
            "
        >
            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="relative mt-20 bg-[#f8f7f3]">
                <div className={pageWidth}>
                    <div
                        className="
                            relative
                            border-b
                            border-black/10
                            pb-14
                            pt-14
                            sm:pb-18
                            sm:pt-18
                            lg:min-h-[660px]
                            lg:pb-20
                            lg:pt-20
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-6
                                border-b
                                border-black/10
                                pb-4
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-[10px]
                                    font-semibold
                                    tracking-[0.16em]
                                    text-primary
                                "
                            >
                                <span
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-accent
                                    "
                                />

                                <span>এসপি কমিউনিটি</span>
                            </div>

                            <span
                                className="
                                    hidden
                                    text-[10px]
                                    tracking-[0.12em]
                                    text-text-muted
                                    sm:block
                                "
                            >
                                মানুষের অভিজ্ঞতা · মানুষের কণ্ঠ
                            </span>
                        </div>

                        <div
                            className="
                                grid
                                gap-12
                                pt-12
                                lg:grid-cols-[minmax(0,1fr)_300px]
                                lg:items-end
                                lg:gap-20
                                lg:pt-16
                            "
                        >
                            <div>
                                <span
                                    className="
                                        block
                                        text-[0.9rem]
                                        font-medium!
                                        text-primary
                                        sm:text-[1rem]
                                    "
                                >
                                    এই জায়গাটা আপনাদের।
                                </span>

                                <h1
                                    className="
                                        mt-5
                                        max-w-[930px]
                                        text-[2.8rem]
                                        font-medium!
                                        leading-[1.27]
                                        sm:text-[3.5rem]
                                        lg:text-[4.15rem]
                                        xl:text-[4.6rem]
                                    "
                                >
                                    যারা পাশে দাঁড়ান,
                                    <br />
                                    যারা সাহায্য পান,
                                    <br />
                                    <span className="text-primary">
                                        তাদের কথাতেই এসপি পূর্ণ হয়।
                                    </span>
                                </h1>
                            </div>

                            <div
                                className="
                                    max-w-[420px]
                                    lg:max-w-none
                                    lg:pb-2
                                "
                            >
                                <p
                                    className="
                                        text-[1rem]
                                        leading-[1.95]
                                        text-text-secondary
                                    "
                                >
                                    একটি মানবিক প্ল্যাটফর্মের আসল পরিচয় তার
                                    প্রযুক্তি নয়—তার সঙ্গে যুক্ত মানুষের
                                    অভিজ্ঞতা। এখানে সেই অভিজ্ঞতার জন্য জায়গা
                                    রাখা হয়েছে।
                                </p>

                                <a
                                    href="#share"
                                    className="
                                        group
                                        mt-7
                                        inline-flex
                                        items-center
                                        gap-3
                                        text-[0.9rem]
                                        font-semibold
                                        text-primary
                                    "
                                >
                                    আপনার কথাও লিখুন
                                    <span
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-primary/25
                                            transition-colors
                                            group-hover:bg-primary
                                            group-hover:text-white
                                        "
                                    >
                                        <TbArrowDown size={16} />
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div
                            className="
                                mt-14
                                flex
                                flex-col
                                gap-5
                                border-t
                                border-black/10
                                pt-5
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                lg:mt-20
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-x-7
                                    gap-y-2
                                    text-[0.78rem]
                                    text-text-secondary
                                "
                            >
                                <span>সহায়তা</span>
                                <span>স্বেচ্ছাসেবা</span>
                                <span>অংশগ্রহণ</span>
                                <span>অভিজ্ঞতা</span>
                            </div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-[0.75rem]
                                    font-medium!
                                    text-primary
                                "
                            >
                                <TbUsers size={17} />
                                <span>মানুষই এই কমিউনিটির কেন্দ্র</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                HUMAN STATEMENT
            ====================================================== */}

            <section className="bg-[#f8f7f3]">
                <div className={pageWidth}>
                    <div
                        className="
                            relative
                            py-20
                            sm:py-24
                            lg:py-32
                        "
                    >
                        <TbQuote
                            size={42}
                            strokeWidth={1}
                            className="
                                mb-7
                                text-accent
                                lg:absolute
                                lg:left-0
                                lg:top-32
                                lg:mb-0
                            "
                        />

                        <div
                            className="
                                lg:ml-[12%]
                                xl:ml-[15%]
                            "
                        >
                            <p
                                className="
                                    max-w-[1050px]
                                    text-[1.75rem]
                                    font-medium!
                                    leading-[1.65]
                                    sm:text-[2.15rem]
                                    lg:text-[2.6rem]
                                    lg:leading-[1.55]
                                "
                            >
                                “কেউ এখানে শুধু একজন দাতা নয়, শুধু একজন
                                স্বেচ্ছাসেবী নয়, কিংবা শুধু একজন সহায়তাপ্রাপ্ত
                                মানুষও নয়।
                                <span className="text-primary">
                                    {' '}
                                    প্রত্যেকেই একটি বড় মানবিক সম্পর্কের অংশ।
                                </span>
                                ”
                            </p>

                            <div
                                className="
                                    mt-9
                                    flex
                                    items-center
                                    gap-4
                                "
                            >
                                <span
                                    className="
                                        h-px
                                        w-10
                                        bg-primary
                                    "
                                />

                                <span
                                    className="
                                        text-[0.78rem]
                                        font-medium!
                                        text-text-secondary
                                    "
                                >
                                    স্ট্যান্ড ফর পিপল-এর কমিউনিটি ভাবনা
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                COMMUNITY VOICES
            ====================================================== */}

            <section className="bg-[#efece4]">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-28">
                        <div
                            className="
                                flex
                                flex-col
                                gap-7
                                md:flex-row
                                md:items-end
                                md:justify-between
                            "
                        >
                            <div>
                                <span
                                    className="
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.15em]
                                        text-primary
                                    "
                                >
                                    কমিউনিটির কণ্ঠ
                                </span>

                                <h2
                                    className="
                                        mt-5
                                        max-w-[620px]
                                        text-[2rem]
                                        font-medium!
                                        leading-[1.45]
                                        sm:text-[2.6rem]
                                        lg:text-[3rem]
                                    "
                                >
                                    মানুষের কথা,
                                    <span className="block text-primary">
                                        তাদের নিজের ভাষায়।
                                    </span>
                                </h2>
                            </div>

                            <div className="flex items-end gap-3">
                                <span
                                    className="
                                        mb-1
                                        max-w-[100px]
                                        text-[0.7rem]
                                        leading-[1.5]
                                        text-text-muted
                                    "
                                >
                                    প্রকাশিত
                                    <br />
                                    অভিজ্ঞতা
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                EXPERIENCE FORM
            ====================================================== */}

            <section id="share" className="bg-white">
                <div className={pageWidth}>
                    <div className="py-20 sm:py-24 lg:py-32">
                        <div
                            className="
        relative
        mt-14
        overflow-hidden
        border-y
        border-black/10
        bg-[#f7f8f5]
        lg:mt-16
    "
                        >
                            {testimonialsLoading ? (
                                /* =========================================================
           LOADING STATE
        ========================================================== */
                                <div
                                    className="
                flex
                min-h-[420px]
                items-center
                justify-center
                px-6
            "
                                >
                                    <div className="flex items-center gap-4">
                                        <span
                                            className="
                        h-7
                        w-7
                        animate-spin
                        rounded-full
                        border-2
                        border-primary/15
                        border-t-primary
                    "
                                        />

                                        <p
                                            className="
                        font-bengali
                        text-base
                        font-medium!
                        text-text-secondary
                    "
                                        >
                                            কমিউনিটির অভিজ্ঞতা লোড হচ্ছে...
                                        </p>
                                    </div>
                                </div>
                            ) : testimonialsError ? (
                                /* =========================================================
           ERROR STATE
        ========================================================== */
                                <div
                                    className="
                mx-auto
                flex
                min-h-[420px]
                max-w-[720px]
                flex-col
                justify-center
                px-6
                py-16
                text-center
            "
                                >
                                    <TbMessage
                                        size={34}
                                        strokeWidth={1.3}
                                        className="mx-auto text-primary"
                                    />

                                    <p
                                        className="
                    mt-6
                    font-bengali
                    text-[0.8rem]
                    font-semibold
                    text-primary
                "
                                    >
                                        সাময়িক সমস্যা
                                    </p>

                                    <h3
                                        className="
                    mt-4
                    font-bengali
                    text-[1.8rem]
                    font-semibold
                    leading-[1.45]
                    text-text-primary
                    sm:text-[2.15rem]
                "
                                    >
                                        অভিজ্ঞতাগুলো এখন দেখা যাচ্ছে না।
                                    </h3>

                                    <p
                                        className="
                    mx-auto
                    mt-4
                    max-w-[540px]
                    font-bengali
                    text-base
                    leading-[1.9]
                    text-text-secondary
                "
                                    >
                                        {testimonialsError}
                                    </p>
                                </div>
                            ) : testimonialCount > 0 ? (
                                /* =========================================================
           COMMUNITY EXPERIENCES
        ========================================================== */
                                <div className="relative">
                                    {/* BACKGROUND WORD */}
                                    <div
                                        aria-hidden="true"
                                        className="
                    pointer-events-none
                    absolute
                    -right-8
                    top-3
                    select-none
                    font-bengali
                    text-[7rem]
                    font-semibold
                    leading-none
                    text-primary/[0.035]
                    sm:text-[10rem]
                    lg:right-[3%]
                    lg:text-[15rem]
                "
                                    >
                                        কথা
                                    </div>

                                    <div
                                        className="
                    relative
                    mx-auto
                    max-w-[1240px]
                    px-5
                    py-14
                    sm:px-8
                    sm:py-18
                    lg:px-10
                    lg:py-24
                    xl:px-12
                    xl:py-28
                "
                                    >
                                        {/* SECTION LABEL */}
                                        <div
                                            className="
                        mb-14
                        flex
                        items-center
                        gap-4
                        sm:mb-18
                        lg:mb-24
                    "
                                        >
                                            <span className="h-px w-10 bg-primary" />

                                            <span
                                                className="
                            font-bengali
                            text-[0.8rem]
                            font-semibold
                            text-primary
                        "
                                            >
                                                মানুষের নিজের ভাষায়
                                            </span>
                                        </div>

                                        {/* TESTIMONIALS */}
                                        <div>
                                            {testimonials.map(
                                                (testimonial, index) => {
                                                    const isEven =
                                                        index % 2 === 0;

                                                    const banglaNumber = String(
                                                        index + 1,
                                                    )
                                                        .padStart(2, '0')
                                                        .replace(
                                                            /[0-9]/g,
                                                            (digit) => {
                                                                const digits = [
                                                                    '০',
                                                                    '১',
                                                                    '২',
                                                                    '৩',
                                                                    '৪',
                                                                    '৫',
                                                                    '৬',
                                                                    '৭',
                                                                    '৮',
                                                                    '৯',
                                                                ];

                                                                return digits[
                                                                    Number(
                                                                        digit,
                                                                    )
                                                                ];
                                                            },
                                                        );

                                                    return (
                                                        <article
                                                            key={testimonial.id}
                                                            className={`
                                    relative
                                    ${
                                        index !== 0
                                            ? `
                                                mt-20
                                                border-t
                                                border-black/10
                                                pt-20
                                                sm:mt-24
                                                sm:pt-24
                                                lg:mt-32
                                                lg:pt-32
                                            `
                                            : ''
                                    }
                                `}
                                                        >
                                                            <div
                                                                className={`
                                        grid
                                        gap-8
                                        lg:grid-cols-12
                                        lg:gap-x-8
                                        ${isEven ? '' : 'lg:text-right'}
                                    `}
                                                            >
                                                                {/* =====================================
                                        DESKTOP NUMBER
                                    ====================================== */}
                                                                <div
                                                                    className={`
                                            hidden
                                            lg:block
                                            ${
                                                isEven
                                                    ? 'lg:col-span-2'
                                                    : 'lg:order-3 lg:col-span-2'
                                            }
                                        `}
                                                                >
                                                                    <span
                                                                        className="
                                                font-bengali
                                                text-[0.82rem]
                                                font-medium!
                                                text-text-muted
                                            "
                                                                    >
                                                                        {
                                                                            banglaNumber
                                                                        }
                                                                        ।
                                                                    </span>
                                                                </div>

                                                                {/* =====================================
                                        MAIN CONTENT
                                    ====================================== */}
                                                                <div
                                                                    className={`
                                            ${
                                                isEven
                                                    ? 'lg:col-span-7 lg:col-start-3'
                                                    : 'lg:order-2 lg:col-span-7 lg:col-start-4'
                                            }
                                        `}
                                                                >
                                                                    {/* MOBILE NUMBER */}
                                                                    <div
                                                                        className="
                                                mb-6
                                                flex
                                                items-center
                                                gap-3
                                                lg:hidden
                                            "
                                                                    >
                                                                        <span
                                                                            className="
                                                    font-bengali
                                                    text-[0.8rem]
                                                    font-semibold
                                                    text-text-muted
                                                "
                                                                        >
                                                                            {
                                                                                banglaNumber
                                                                            }
                                                                            ।
                                                                        </span>

                                                                        <span
                                                                            className="
                                                    h-px
                                                    w-7
                                                    bg-black/15
                                                "
                                                                        />
                                                                    </div>

                                                                    {/* QUOTE ICON */}
                                                                    <TbQuote
                                                                        size={
                                                                            29
                                                                        }
                                                                        strokeWidth={
                                                                            1.2
                                                                        }
                                                                        className={`
                                                mb-7
                                                text-accent
                                                ${!isEven ? 'lg:ml-auto' : ''}
                                            `}
                                                                    />

                                                                    {/* MESSAGE */}
                                                                    <blockquote
                                                                        className="
                                                font-bengali
                                                text-[1.45rem]
                                                font-medium!
                                                leading-[1.85]
                                                text-text-primary
                                                sm:text-[1.7rem]
                                                sm:leading-[1.8]
                                                lg:text-[2rem]
                                                lg:leading-[1.75]
                                                xl:text-[2.15rem]
                                            "
                                                                    >
                                                                        {
                                                                            testimonial.message
                                                                        }
                                                                    </blockquote>

                                                                    {/* AUTHOR */}
                                                                    <div
                                                                        className={`
                                                mt-8
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-x-4
                                                gap-y-2
                                                ${
                                                    !isEven
                                                        ? 'lg:justify-end'
                                                        : ''
                                                }
                                            `}
                                                                    >
                                                                        <span
                                                                            className="
                                                    h-px
                                                    w-7
                                                    bg-primary/60
                                                "
                                                                        />

                                                                        <p
                                                                            className="
                                                    font-bengali
                                                    text-[0.98rem]
                                                    font-semibold
                                                    text-text-primary
                                                "
                                                                        >
                                                                            {testimonial
                                                                                .user
                                                                                ?.name ||
                                                                                'কমিউনিটির সদস্য'}
                                                                        </p>

                                                                        <span
                                                                            className="
                                                    hidden
                                                    h-1
                                                    w-1
                                                    rounded-full
                                                    bg-black/20
                                                    sm:block
                                                "
                                                                        />

                                                                        <p
                                                                            className="
                                                    font-bengali
                                                    text-[0.84rem]
                                                    font-medium!
                                                    text-text-muted
                                                "
                                                                        >
                                                                            {testimonial
                                                                                .user
                                                                                ?.role ===
                                                                            'organization'
                                                                                ? 'সংগঠন'
                                                                                : 'ব্যক্তিগত সদস্য'}
                                                                        </p>
                                                                    </div>

                                                                    {/* FEATURED — MOBILE */}
                                                                    {testimonial.is_featured && (
                                                                        <div
                                                                            className="
                                                    mt-5
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    font-bengali
                                                    text-[0.78rem]
                                                    font-semibold
                                                    text-primary
                                                    lg:hidden
                                                "
                                                                        >
                                                                            <span
                                                                                className="
                                                        flex
                                                        h-6
                                                        w-6
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-primary/10
                                                    "
                                                                            >
                                                                                <TbCheck
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                />
                                                                            </span>
                                                                            নির্বাচিত
                                                                            কমিউনিটি
                                                                            অভিজ্ঞতা
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* =====================================
                                        FEATURED — DESKTOP
                                    ====================================== */}
                                                                <div
                                                                    className={`
                                            hidden
                                            lg:flex
                                            lg:items-end
                                            ${
                                                isEven
                                                    ? 'lg:col-span-3 lg:justify-end'
                                                    : 'lg:order-1 lg:col-span-3 lg:justify-start'
                                            }
                                        `}
                                                                >
                                                                    {testimonial.is_featured && (
                                                                        <div
                                                                            className="
                                                    flex
                                                    max-w-[155px]
                                                    items-start
                                                    gap-2
                                                    border-t
                                                    border-primary/30
                                                    pt-3
                                                    text-left
                                                "
                                                                        >
                                                                            <TbCheck
                                                                                size={
                                                                                    15
                                                                                }
                                                                                strokeWidth={
                                                                                    2
                                                                                }
                                                                                className="
                                                        mt-[2px]
                                                        shrink-0
                                                        text-primary
                                                    "
                                                                            />

                                                                            <span
                                                                                className="
                                                        font-bengali
                                                        text-[0.76rem]
                                                        font-medium!
                                                        leading-[1.7]
                                                        text-primary
                                                    "
                                                                            >
                                                                                নির্বাচিত
                                                                                কমিউনিটি
                                                                                অভিজ্ঞতা
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </article>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* =========================================================
           EMPTY STATE
        ========================================================== */
                                <div
                                    className="
                relative
                mx-auto
                min-h-[500px]
                max-w-[1240px]
                overflow-hidden
                px-5
                py-20
                sm:px-8
                lg:flex
                lg:min-h-[560px]
                lg:items-center
                lg:px-10
            "
                                >
                                    {/* DECORATIVE QUOTE */}
                                    <TbQuote
                                        aria-hidden="true"
                                        strokeWidth={0.7}
                                        className="
                    pointer-events-none
                    absolute
                    -bottom-14
                    -right-10
                    h-[240px]
                    w-[240px]
                    text-primary/[0.045]
                    sm:h-[320px]
                    sm:w-[320px]
                    lg:right-[4%]
                    lg:h-[420px]
                    lg:w-[420px]
                "
                                    />

                                    <div
                                        className="
                    relative
                    z-10
                    max-w-[650px]
                "
                                    >
                                        {/* LABEL */}
                                        <div
                                            className="
                        mb-8
                        flex
                        items-center
                        gap-4
                    "
                                        >
                                            <span className="h-px w-10 bg-primary" />

                                            <span
                                                className="
                            font-bengali
                            text-[0.8rem]
                            font-semibold
                            text-primary
                        "
                                            >
                                                মানুষের নিজের ভাষায়
                                            </span>
                                        </div>

                                        {/* HEADING */}
                                        <h3
                                            className="
                        max-w-[560px]
                        font-bengali
                        text-[2rem]
                        font-semibold
                        leading-[1.45]
                        text-text-primary
                        sm:text-[2.5rem]
                        lg:text-[3rem]
                    "
                                        >
                                            প্রথম অভিজ্ঞতাটির
                                            <br className="hidden sm:block" />
                                            অপেক্ষায় এই জায়গা।
                                        </h3>

                                        {/* DESCRIPTION */}
                                        <p
                                            className="
                        mt-6
                        max-w-[530px]
                        font-bengali
                        text-base
                        font-normal
                        leading-[1.95]
                        text-text-secondary
                        sm:text-[1.05rem]
                    "
                                        >
                                            এখনো কোনো প্রকাশিত অভিজ্ঞতা নেই।
                                            মানুষের সম্মতি নিয়ে শেয়ার করা কথা,
                                            অভিজ্ঞতা ও অনুভূতিগুলো এখানে জায়গা
                                            পাবে।
                                        </p>

                                        {/* CTA */}
                                        <a
                                            href="#share"
                                            className="
                        group
                        mt-9
                        inline-flex
                        items-center
                        gap-3
                        font-bengali
                        text-[0.94rem]
                        font-semibold
                        text-primary
                    "
                                        >
                                            <span
                                                className="
                            border-b
                            border-primary/40
                            pb-1.5
                            transition-colors
                            duration-200
                            group-hover:border-primary
                        "
                                            >
                                                আপনার অভিজ্ঞতা শেয়ার করুন
                                            </span>

                                            <TbArrowDown
                                                size={17}
                                                className="
                            transition-transform
                            duration-200
                            group-hover:translate-y-1
                        "
                                            />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                            className="
                                grid
                                gap-14
                                lg:grid-cols-[0.7fr_1.3fr]
                                lg:gap-20
                                xl:grid-cols-[0.65fr_1.35fr]
                                xl:gap-28
                            "
                        >
                            <div>
                                <span
                                    className="
                                        text-[10px]
                                        font-semibold
                                        tracking-[0.15em]
                                        text-primary
                                    "
                                >
                                    আপনার অভিজ্ঞতা
                                </span>

                                <h2
                                    className="
                                        mt-5
                                        max-w-[470px]
                                        text-[2.05rem]
                                        font-medium!
                                        leading-[1.45]
                                        sm:text-[2.65rem]
                                        lg:text-[2.9rem]
                                    "
                                >
                                    আপনার কথার জন্য
                                    <span className="block text-primary">
                                        এখানে জায়গা আছে।
                                    </span>
                                </h2>

                                <p
                                    className="
                                        mt-6
                                        max-w-[440px]
                                        text-[0.95rem]
                                        leading-[1.95]
                                        text-text-secondary
                                    "
                                >
                                    সাহায্য পেয়েছেন, স্বেচ্ছাসেবী হিসেবে কাজ
                                    করেছেন, অনুদান দিয়েছেন অথবা অন্য কোনোভাবে
                                    যুক্ত হয়েছেন—আপনার বাস্তব অভিজ্ঞতা আমাদের
                                    জানাতে পারেন।
                                </p>

                                <div
                                    className="
                                        mt-9
                                        max-w-[420px]
                                        border-t
                                        border-black/10
                                        pt-6
                                    "
                                >
                                    <div className="flex items-start gap-3">
                                        <TbShieldCheck
                                            size={20}
                                            strokeWidth={1.3}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-primary
                                            "
                                        />

                                        <p
                                            className="
                                                text-[0.8rem]
                                                leading-[1.8]
                                                text-text-muted
                                            "
                                        >
                                            আপনার সম্মতি ছাড়া কোনো অভিজ্ঞতা
                                            প্রকাশ করা হবে না। প্রকাশিত
                                            অভিজ্ঞতাগুলো কমিউনিটি অংশে প্রদর্শিত
                                            হতে পারে।
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                {submitted ? (
                                    <div
                                        className="
                                            min-h-[480px]
                                            border-t
                                            border-primary
                                            py-10
                                            sm:py-12
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-primary
                                                text-white
                                            "
                                        >
                                            <TbCheck size={23} />
                                        </div>

                                        <h3
                                            className="
                                                mt-7
                                                text-[1.8rem]
                                                font-medium!
                                            "
                                        >
                                            ধন্যবাদ।
                                        </h3>

                                        <p
                                            className="
                                                mt-4
                                                max-w-[590px]
                                                text-[0.95rem]
                                                leading-[1.9]
                                                text-text-secondary
                                            "
                                        >
                                            আপনার অভিজ্ঞতা সফলভাবে জমা হয়েছে।
                                            প্রকাশের জন্য আপনার সম্মতি সংরক্ষিত
                                            হয়েছে এবং এটি SP-এর কমিউনিটি
                                            অভিজ্ঞতা হিসেবে প্রদর্শিত হতে পারে।
                                        </p>

                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="
                                                mt-7
                                                border-b
                                                border-primary
                                                pb-1.5
                                                text-[0.85rem]
                                                font-semibold
                                                text-primary
                                            "
                                        >
                                            আবার লিখুন
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit}>
                                        {/* LOGIN NOTICE */}

                                        <div
                                            className="
                                                border-t
                                                border-black/10
                                                py-6
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                    rounded-sm
                                                    bg-[#f7f6f1]
                                                    px-4
                                                    py-4
                                                "
                                            >
                                                <TbShieldCheck
                                                    size={19}
                                                    strokeWidth={1.3}
                                                    className="
                                                        mt-0.5
                                                        shrink-0
                                                        text-primary
                                                    "
                                                />

                                                <p
                                                    className="
                                                        text-[0.8rem]
                                                        leading-[1.8]
                                                        text-text-secondary
                                                    "
                                                >
                                                    অভিজ্ঞতা শেয়ার করতে আপনার SP
                                                    অ্যাকাউন্টে লগইন থাকতে হবে।
                                                    আপনার নাম ও অ্যাকাউন্টের ধরন
                                                    আপনার অ্যাকাউন্ট থেকেই নেওয়া
                                                    হবে।
                                                </p>
                                            </div>
                                        </div>

                                        {/* MESSAGE */}

                                        <div
                                            className="
                                                grid
                                                gap-4
                                                border-t
                                                border-black/10
                                                py-6
                                                sm:grid-cols-[180px_1fr]
                                                sm:gap-8
                                            "
                                        >
                                            <label
                                                htmlFor="message"
                                                className="
                                                    pt-2
                                                    text-[0.82rem]
                                                    font-semibold
                                                "
                                            >
                                                আপনার অভিজ্ঞতা
                                            </label>

                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={7}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="আপনার অভিজ্ঞতা, অনুভূতি বা মতামত লিখুন..."
                                                maxLength={2000}
                                                className="
                                                    w-full
                                                    resize-none
                                                    border-0
                                                    bg-[#f7f6f1]
                                                    px-5
                                                    py-4
                                                    text-[0.92rem]
                                                    leading-[1.9]
                                                    outline-none
                                                    transition-shadow
                                                    placeholder:text-text-muted/60
                                                    focus:shadow-[inset_0_0_0_1px_rgba(15,118,110,0.45)]
                                                "
                                            />

                                            <span
                                                className="
                                                    text-right
                                                    text-[0.68rem]
                                                    text-text-muted
                                                    sm:col-start-2
                                                "
                                            >
                                                {formData.message.length}/২০০০
                                            </span>
                                        </div>

                                        {/* CONSENT */}

                                        <div
                                            className="
                                                border-y
                                                border-black/10
                                                py-6
                                            "
                                        >
                                            <label
                                                className="
                                                    flex
                                                    cursor-pointer
                                                    items-start
                                                    gap-4
                                                    sm:ml-[212px]
                                                "
                                            >
                                                <input
                                                    type="checkbox"
                                                    name="consent"
                                                    checked={formData.consent}
                                                    onChange={handleChange}
                                                    className="
                                                        mt-1
                                                        h-4
                                                        w-4
                                                        shrink-0
                                                        accent-[#0f766e]
                                                    "
                                                />

                                                <span
                                                    className="
                                                        max-w-[620px]
                                                        text-[0.8rem]
                                                        leading-[1.8]
                                                        text-text-secondary
                                                    "
                                                >
                                                    আমি সম্মতি দিচ্ছি যে আমার
                                                    অভিজ্ঞতা ভবিষ্যতে SP-এর
                                                    কমিউনিটি অংশে প্রকাশ করা হতে
                                                    পারে।
                                                </span>
                                            </label>
                                        </div>

                                        {/* ERROR */}

                                        {error && (
                                            <div
                                                role="alert"
                                                className="
                                                    mt-5
                                                    border-l-2
                                                    border-red-500
                                                    bg-red-50
                                                    px-4
                                                    py-3
                                                    text-[0.8rem]
                                                    leading-[1.7]
                                                    text-red-700
                                                "
                                            >
                                                {error}
                                            </div>
                                        )}

                                        {/* SUBMIT */}

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-5
                                                pt-7
                                                sm:ml-[212px]
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            "
                                        >
                                            <button
                                                type="submit"
                                                disabled={!canSubmit}
                                                className="
                                                    group
                                                    inline-flex
                                                    w-fit
                                                    items-center
                                                    gap-3
                                                    bg-primary
                                                    px-6
                                                    py-3.5
                                                    text-[0.86rem]
                                                    font-semibold
                                                    text-white
                                                    transition-colors
                                                    hover:bg-primary-hover
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-35
                                                "
                                            >
                                                {submitting
                                                    ? 'জমা হচ্ছে...'
                                                    : 'অভিজ্ঞতা জমা দিন'}

                                                <TbSend
                                                    size={17}
                                                    className="
                                                        transition-transform
                                                        group-hover:translate-x-1
                                                    "
                                                />
                                            </button>

                                            <span
                                                className="
                                                    max-w-[260px]
                                                    text-[0.68rem]
                                                    leading-[1.65]
                                                    text-text-muted
                                                "
                                            >
                                                আপনার অ্যাকাউন্টের পরিচয়
                                                স্বয়ংক্রিয়ভাবে ব্যবহার করা হবে।
                                                আলাদা করে নাম বা অ্যাকাউন্টের
                                                ধরন দিতে হবে না।
                                            </span>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PRIVACY / PUBLISHING
            ====================================================== */}

            <section className="bg-[#173f3b]">
                <div className={pageWidth}>
                    <div
                        className="
                            grid
                            gap-12
                            py-16
                            sm:py-20
                            lg:grid-cols-[0.75fr_1.25fr]
                            lg:items-center
                            lg:gap-24
                            lg:py-24
                        "
                    >
                        <div>
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/20
                                    text-[#efb17d]
                                "
                            >
                                <TbShieldCheck size={21} strokeWidth={1.3} />
                            </div>

                            <span
                                className="
                                    mt-5
                                    block
                                    text-[9px]
                                    font-semibold
                                    tracking-[0.15em]
                                    text-white/40
                                "
                            >
                                প্রকাশের আগে
                            </span>
                        </div>

                        <div>
                            <h2
                                className="
                                    max-w-[730px]
                                    text-[1.9rem]
                                    font-medium!
                                    leading-[1.5]
                                    text-white
                                    sm:text-[2.4rem]
                                    lg:text-[2.7rem]
                                "
                            >
                                আপনার কথা আপনারই থাকবে।
                                <span className="text-[#efb17d]">
                                    {' '}
                                    প্রকাশের সিদ্ধান্তে আপনার সম্মতিই
                                    গুরুত্বপূর্ণ।
                                </span>
                            </h2>

                            <p
                                className="
                                    mt-5
                                    max-w-[680px]
                                    text-[0.9rem]
                                    leading-[1.95]
                                    text-white/55
                                "
                            >
                                আপনার স্পষ্ট সম্মতি ছাড়া কোনো অভিজ্ঞতা কমিউনিটি
                                অংশে প্রকাশ করা হবে না। প্রকাশিত অভিজ্ঞতাগুলো
                                SP-এর কমিউনিটির মানুষের বাস্তব অভিজ্ঞতা তুলে
                                ধরতে ব্যবহার করা হতে পারে।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CLOSING
            ====================================================== */}

            <section className="bg-[#f8f7f3]">
                <div className={pageWidth}>
                    <div
                        className="
                            flex
                            flex-col
                            gap-8
                            py-16
                            sm:py-20
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                gap-4
                            "
                        >
                            <TbHeartHandshake
                                size={28}
                                strokeWidth={1.1}
                                className="
                                    mt-1
                                    shrink-0
                                    text-primary
                                "
                            />

                            <p
                                className="
                                    max-w-[690px]
                                    text-[1.25rem]
                                    font-medium!
                                    leading-[1.7]
                                    sm:text-[1.55rem]
                                "
                            >
                                কমিউনিটি তৈরি হয় তখনই,
                                <span className="text-primary">
                                    {' '}
                                    যখন মানুষ শুধু যুক্ত হয় না—নিজের কথাও বলতে
                                    পারে।
                                </span>
                            </p>
                        </div>

                        <a
                            href="#share"
                            className="
                                shrink-0
                                border-b
                                border-primary
                                pb-2
                                text-[0.85rem]
                                font-semibold
                                text-primary
                            "
                        >
                            অভিজ্ঞতা শেয়ার করুন
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Community;

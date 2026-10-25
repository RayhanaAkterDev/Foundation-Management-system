import React, { useEffect, useState } from 'react';
import {
    TbArrowDown,
    TbArrowUpRight,
    TbCheck,
    TbHeartHandshake,
    TbMessage,
    TbQuote,
    TbSend,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb';
import { fetchTestimonials, submitTestimonial } from '@/api/testimonials';

const pageWidth = 'mx-auto w-full max-w-[1180px] px-5 sm:px-7 lg:px-10';
const toBengaliDigits = (value) =>
    String(value).replace(/[0-9]/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]);

const Community = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [testimonialsLoading, setTestimonialsLoading] = useState(true);
    const [testimonialsError, setTestimonialsError] = useState('');
    const [formData, setFormData] = useState({ message: '', consent: false });
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
                if (isMounted) setTestimonials(response?.testimonials || []);
            } catch (requestError) {
                if (isMounted) {
                    setTestimonialsError(
                        requestError?.message ||
                            'কমিউনিটির অভিজ্ঞতাগুলো এখন দেখা যাচ্ছে না।',
                    );
                }
            } finally {
                if (isMounted) setTestimonialsLoading(false);
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
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;
        const token =
            localStorage.getItem('auth_token') ||
            sessionStorage.getItem('auth_token');
        if (!token) {
            setError(
                'অভিজ্ঞতা জানাতে আপনার Stand For People অ্যাকাউন্টে প্রবেশ করতে হবে।',
            );
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
            setError(
                requestError?.message ||
                    'অভিজ্ঞতা জমা দেওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।',
            );
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setSubmitted(false);
        setError('');
        setFormData({ message: '', consent: false });
    };

    const canSubmit =
        formData.message.trim().length >= 10 && formData.consent && !submitting;

    return (
        <main
            lang="bn"
            className="min-w-0 overflow-x-clip bg-[#faf9f6] font-bengali text-[#152d2a]"
        >
            {/* INTRODUCTION */}
            <section className="relative mt-16 overflow-hidden bg-[#f0f2eb] sm:mt-20">
                <div className={pageWidth}>
                    <div className="grid gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-center lg:gap-16 lg:py-20">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2.5 text-[0.76rem] font-semibold! text-[#0f766e]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#df9a3e]" />
                                মানুষের কথা, মানুষের অভিজ্ঞতা
                            </div>
                            <h1 className="mt-5 max-w-[690px] text-[clamp(2rem,3.15vw,3.15rem)] font-semibold! leading-[1.38] tracking-[-0.015em]">
                                পাশে থাকার গল্পগুলোই
                                <span className="block text-[#0f766e]">
                                    আমাদের সবচেয়ে বড় পরিচয়।
                                </span>
                            </h1>
                            <p className="mt-5 max-w-[570px] text-[0.94rem] leading-[1.9] text-[#62736e] sm:text-[1rem]">
                                যাঁরা সাহায্য পেয়েছেন, যাঁরা পাশে দাঁড়িয়েছেন
                                কিংবা স্বেচ্ছাসেবায় যুক্ত হয়েছেন—তাঁদের বাস্তব
                                অভিজ্ঞতা নিয়েই এই কমিউনিটি।
                            </p>
                            <a
                                href="#share"
                                className="group mt-7 inline-flex min-h-11 items-center gap-3 bg-[#0f766e] px-5 py-2.5 text-[0.88rem] font-semibold! text-white! transition-colors hover:bg-[#115e59] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f766e]"
                            >
                                আপনার অভিজ্ঞতা লিখুন
                                <TbArrowDown
                                    size={17}
                                    className="transition-transform group-hover:translate-y-0.5"
                                />
                            </a>
                        </div>
                        <div className="relative min-w-0 border-l-2 border-[#d8b480] pl-5 sm:pl-7 lg:py-5">
                            <TbQuote
                                size={29}
                                strokeWidth={1.3}
                                className="mb-4 text-[#c78e46]"
                            />
                            <p className="max-w-[380px] text-[1.18rem] font-medium! leading-[1.85] sm:text-[1.3rem]">
                                “প্রত্যেক মানুষই একটি বড় মানবিক সম্পর্কের
                                অংশ—সাহায্য করা ও সাহায্য পাওয়া, দুটোই সেই
                                সম্পর্কের গল্প।”
                            </p>
                            <p className="mt-4 text-[0.78rem] font-medium! text-[#6d8078]">
                                Stand For People-এর কমিউনিটি ভাবনা
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VOICES */}
            <section className="bg-white py-14 sm:py-18 lg:py-20">
                <div className={pageWidth}>
                    <div className="flex flex-col gap-4 border-b border-[#dce5df] pb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                        <div>
                            <p className="text-[0.78rem] font-semibold! text-[#0f766e]">
                                কমিউনিটির কণ্ঠ
                            </p>
                            <h2 className="mt-3 text-[clamp(1.65rem,2.4vw,2.35rem)] font-semibold! leading-[1.48]">
                                অভিজ্ঞতাগুলো{' '}
                                <span className="text-[#0f766e]">
                                    তাঁদের নিজের ভাষায়
                                </span>
                            </h2>
                        </div>
                        {!testimonialsLoading &&
                            !testimonialsError &&
                            testimonials.length > 0 && (
                                <p className="shrink-0 text-[0.82rem] text-[#697b73]">
                                    {toBengaliDigits(testimonials.length)}টি
                                    প্রকাশিত অভিজ্ঞতা
                                </p>
                            )}
                    </div>

                    {testimonialsLoading ? (
                        <div
                            role="status"
                            aria-live="polite"
                            className="grid gap-5 py-9 md:grid-cols-2"
                        >
                            <span className="sr-only">
                                কমিউনিটির অভিজ্ঞতা আনা হচ্ছে।
                            </span>
                            {[0, 1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse border border-[#e8ede8] bg-[#f8faf7] p-6 sm:p-8"
                                >
                                    <div className="h-3 w-24 rounded bg-[#e4eae4]" />
                                    <div className="mt-7 h-3 w-full rounded bg-[#e4eae4]" />
                                    <div className="mt-3 h-3 w-5/6 rounded bg-[#e4eae4]" />
                                    <div className="mt-3 h-3 w-2/3 rounded bg-[#e4eae4]" />
                                    <div className="mt-8 h-3 w-28 rounded bg-[#e4eae4]" />
                                </div>
                            ))}
                        </div>
                    ) : testimonialsError ? (
                        <div
                            role="alert"
                            className="py-14 text-center sm:py-16"
                        >
                            <TbMessage
                                size={29}
                                strokeWidth={1.4}
                                className="mx-auto text-[#0f766e]"
                            />
                            <h3 className="mt-4 text-[1.25rem] font-semibold!">
                                অভিজ্ঞতাগুলো এখন দেখা যাচ্ছে না
                            </h3>
                            <p className="mx-auto mt-3 max-w-[480px] text-[0.9rem] leading-[1.85] text-[#66776f]">
                                {testimonialsError}
                            </p>
                        </div>
                    ) : testimonials.length > 0 ? (
                        <div className="grid gap-4 pt-7 sm:gap-5 md:grid-cols-2">
                            {testimonials.map((testimonial, index) => (
                                <article
                                    key={testimonial.id ?? index}
                                    className={`flex min-w-0 flex-col border p-6 sm:p-7 lg:p-8 ${
                                        testimonial.is_featured
                                            ? 'border-[#b7d8ca] bg-[#eef5f0]'
                                            : 'border-[#e2e9e2] bg-[#fafbf9]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <TbQuote
                                            size={27}
                                            strokeWidth={1.3}
                                            className="text-[#c68d46]"
                                        />
                                        {testimonial.is_featured && (
                                            <span className="inline-flex items-center gap-1.5 text-[0.73rem] font-semibold! text-[#0f766e]">
                                                <TbCheck size={15} /> নির্বাচিত
                                                অভিজ্ঞতা
                                            </span>
                                        )}
                                    </div>
                                    <blockquote className="mt-5 min-w-0 flex-1 whitespace-pre-wrap break-words text-[1.02rem] font-medium! leading-[1.95] text-[#213832] sm:text-[1.08rem]">
                                        {testimonial.message}
                                    </blockquote>
                                    <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#d9e3da] pt-4">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dce9df] text-[0.86rem] font-semibold! text-[#0f766e]">
                                            {(testimonial.user?.name || 'স')
                                                .trim()
                                                .charAt(0)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="break-words text-[0.86rem] font-semibold!">
                                                {testimonial.user?.name ||
                                                    'কমিউনিটির সদস্য'}
                                            </p>
                                            <p className="mt-0.5 text-[0.73rem] text-[#738078]">
                                                {testimonial.user?.role ===
                                                'organization'
                                                    ? 'সহযোগী সংগঠন'
                                                    : 'ব্যক্তিগত সদস্য'}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="relative mt-7 flex flex-col gap-6 bg-[#f2f5ef] px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
                            <div>
                                <TbMessage
                                    size={28}
                                    strokeWidth={1.3}
                                    className="text-[#0f766e]"
                                />
                                <h3 className="mt-4 text-[1.4rem] font-semibold!">
                                    প্রথম অভিজ্ঞতাটির অপেক্ষায়
                                </h3>
                                <p className="mt-2 max-w-[550px] text-[0.9rem] leading-[1.85] text-[#65766d]">
                                    এখনো কোনো প্রকাশিত অভিজ্ঞতা নেই। আপনার কথা
                                    দিয়েই এই পরিসরের শুরু হতে পারে।
                                </p>
                            </div>
                            <a
                                href="#share"
                                className="inline-flex shrink-0 items-center gap-2 text-[0.88rem] font-semibold! text-[#0f766e] hover:underline"
                            >
                                আপনার অভিজ্ঞতা জানান <TbArrowDown size={17} />
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* SHARE YOUR EXPERIENCE */}
            <section
                id="share"
                className="scroll-mt-24 bg-[#f4f1e9] py-14 sm:py-18 lg:py-20"
            >
                <div className={pageWidth}>
                    <div className="grid gap-9 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-12 xl:gap-16">
                        <div className="min-w-0">
                            <p className="text-[0.78rem] font-semibold! text-[#0f766e]">
                                আপনার অভিজ্ঞতা
                            </p>
                            <h2 className="mt-3 max-w-[430px] text-[clamp(1.7rem,2.5vw,2.4rem)] font-semibold! leading-[1.5]">
                                এবার{' '}
                                <span className="text-[#0f766e]">
                                    আপনার কথা
                                </span>{' '}
                                শোনার পালা।
                            </h2>
                            <p className="mt-4 max-w-[440px] text-[0.93rem] leading-[1.9] text-[#65756c]">
                                সাহায্য পেয়েছেন, স্বেচ্ছাসেবায় কাজ করেছেন,
                                অনুদান দিয়েছেন অথবা অন্যভাবে যুক্ত হয়েছেন—আপনার
                                বাস্তব অভিজ্ঞতা আমাদের জানান।
                            </p>
                            <div className="mt-7 flex max-w-[430px] items-start gap-3 border-t border-[#d8d8cd] pt-5">
                                <TbShieldCheck
                                    size={21}
                                    strokeWidth={1.4}
                                    className="mt-0.5 shrink-0 text-[#0f766e]"
                                />
                                <p className="text-[0.82rem] leading-[1.85] text-[#68776e]">
                                    প্রকাশের জন্য আপনার সম্মতি প্রয়োজন। সম্মতি
                                    ছাড়া আপনার অভিজ্ঞতা প্রকাশ করা হবে না।
                                </p>
                            </div>
                        </div>
                        <div className="min-w-0 bg-white p-5 shadow-[0_12px_40px_rgba(30,57,43,0.045)] sm:p-7 lg:p-8">
                            {submitted ? (
                                <div role="status" className="py-5 sm:py-8">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f2e9] text-[#0f766e]">
                                        <TbCheck size={25} />
                                    </div>
                                    <h3 className="mt-5 text-[1.6rem] font-semibold!">
                                        ধন্যবাদ!
                                    </h3>
                                    <p className="mt-3 max-w-[510px] text-[0.93rem] leading-[1.9] text-[#65756c]">
                                        আপনার অভিজ্ঞতা সফলভাবে জমা হয়েছে।
                                        প্রকাশের জন্য আপনার সম্মতি সংরক্ষিত
                                        হয়েছে এবং এটি Stand For People-এর
                                        কমিউনিটি অংশে প্রদর্শিত হতে পারে।
                                    </p>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="mt-6 inline-flex items-center gap-2 text-[0.88rem] font-semibold! text-[#0f766e] hover:underline"
                                    >
                                        আবার লিখুন <TbArrowUpRight size={17} />
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="flex items-start gap-3 bg-[#f0f6f1] px-4 py-3.5">
                                        <TbUsers
                                            size={19}
                                            className="mt-0.5 shrink-0 text-[#0f766e]"
                                        />
                                        <p className="text-[0.81rem] leading-[1.8] text-[#516c5c]">
                                            অভিজ্ঞতা জমা দিতে Stand For People
                                            অ্যাকাউন্টে প্রবেশ করা থাকতে হবে।
                                            আপনার পরিচয় অ্যাকাউন্ট থেকেই নেওয়া
                                            হবে।
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between gap-4">
                                        <label
                                            htmlFor="community-message"
                                            className="text-[0.92rem] font-semibold!"
                                        >
                                            আপনার অভিজ্ঞতা
                                        </label>
                                        <span className="text-[0.72rem] text-[#7c8980]">
                                            অন্তত ১০ অক্ষর
                                        </span>
                                    </div>
                                    <textarea
                                        id="community-message"
                                        name="message"
                                        rows={6}
                                        maxLength={2000}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="আপনার অভিজ্ঞতা, অনুভূতি বা মতামত লিখুন..."
                                        className="mt-3 block min-h-[160px] w-full resize-y border border-[#dbe3db] bg-[#fbfcfa] px-4 py-3.5 text-[0.92rem] leading-[1.85] text-[#213832] outline-none transition-colors placeholder:text-[#9aa69e] focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]/20"
                                    />
                                    <p className="mt-2 text-right text-[0.73rem] tabular-nums text-[#7a887e]">
                                        {toBengaliDigits(
                                            formData.message.length,
                                        )}{' '}
                                        / ২০০০ অক্ষর
                                    </p>
                                    <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-[#e5e9e3] pt-5">
                                        <input
                                            type="checkbox"
                                            name="consent"
                                            checked={formData.consent}
                                            onChange={handleChange}
                                            className="mt-1 h-4 w-4 shrink-0 accent-[#0f766e]"
                                        />
                                        <span className="text-[0.82rem] leading-[1.85] text-[#63746a]">
                                            আমি সম্মতি দিচ্ছি যে আমার অভিজ্ঞতা
                                            ভবিষ্যতে Stand For People-এর
                                            কমিউনিটি অংশে প্রকাশ করা হতে পারে।
                                        </span>
                                    </label>
                                    {error && (
                                        <p
                                            role="alert"
                                            className="mt-5 border-l-2 border-red-500 bg-red-50 px-4 py-3 text-[0.83rem] leading-[1.7] text-red-700"
                                        >
                                            {error}
                                        </p>
                                    )}
                                    <div className="mt-6 flex flex-col gap-3 border-t border-[#e5e9e3] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="max-w-[265px] text-[0.75rem] leading-[1.7] text-[#7b897f]">
                                            আপনার নাম ও সদস্যের ধরন আলাদাভাবে
                                            দিতে হবে না।
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={!canSubmit}
                                            className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#0f766e] px-5 py-2.5 text-[0.87rem] font-semibold! text-white! transition-colors hover:bg-[#115e59] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                                        >
                                            {submitting
                                                ? 'জমা হচ্ছে...'
                                                : 'অভিজ্ঞতা জমা দিন'}
                                            <TbSend size={17} />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CLOSING */}
            <section className="bg-[#faf9f6] py-10 sm:py-12">
                <div className={pageWidth}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <TbHeartHandshake
                                size={25}
                                strokeWidth={1.3}
                                className="mt-1 shrink-0 text-[#0f766e]"
                            />
                            <p className="max-w-[700px] text-[1.04rem] font-medium! leading-[1.75] sm:text-[1.16rem]">
                                মানুষ শুধু যুক্ত হন না—
                                <span className="text-[#0f766e]">
                                    নিজের কথাও বলেন।
                                </span>{' '}
                                এভাবেই একটি কমিউনিটি গড়ে ওঠে।
                            </p>
                        </div>
                        <a
                            href="#share"
                            className="inline-flex shrink-0 items-center gap-2 text-[0.87rem] font-semibold! text-[#0f766e] hover:underline"
                        >
                            আপনার কথাও জানান <TbArrowUpRight size={17} />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Community;

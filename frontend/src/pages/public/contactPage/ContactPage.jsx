import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowUpRight,
    CheckCircle2,
    ChevronDown,
    Mail,
    MessageSquareText,
    ShieldCheck,
    Accessibility,
    HeartHandshake,
    ClipboardList,
    Send,
} from 'lucide-react';
import { apiRequest } from '@/api/client';

const topics = [
    { value: 'general', label: 'সাধারণ প্রশ্ন' },
    { value: 'donation', label: 'অনুদান ও পেমেন্ট' },
    { value: 'campaign', label: 'ক্যাম্পেইন বা সংগঠন' },
    { value: 'volunteer', label: 'স্বেচ্ছাসেবা' },
    { value: 'account', label: 'অ্যাকাউন্ট ও নিরাপত্তা' },
    { value: 'accessibility', label: 'ওয়েবসাইট ব্যবহারে সমস্যা' },
    { value: 'suggestion', label: 'পরামর্শ বা মতামত' },
    { value: 'other', label: 'অন্যান্য' },
];

const initialForm = {
    name: '',
    email: '',
    topic: '',
    message: '',
};

const fieldClass =
    'mt-2 w-full min-w-0 border border-[#D9E3E0] bg-white px-4 py-3.5 text-[15px] text-[#263A3C] placeholder:text-[#99A7A6] outline-none transition-colors focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 disabled:cursor-not-allowed disabled:bg-[#F7F9F8]';

function getErrorMessage(error) {
    if (error?.status === 422) {
        const errors = error.errors || {};

        if (errors.name) {
            return 'আপনার নামটি সঠিকভাবে লিখুন।';
        }

        if (errors.email) {
            return 'সঠিক ইমেইল ঠিকানা লিখুন।';
        }

        if (errors.topic) {
            return 'যোগাযোগের বিষয়টি আবার নির্বাচন করুন।';
        }

        if (errors.message) {
            return 'বার্তাটি কমপক্ষে ১০ অক্ষরের এবং সর্বোচ্চ ৫০০০ অক্ষরের হতে হবে।';
        }

        return 'আপনার দেওয়া তথ্যগুলো যাচাই করে আবার চেষ্টা করুন।';
    }

    if (error?.status === 429) {
        return 'আপনি অল্প সময়ে অনেকবার বার্তা পাঠানোর চেষ্টা করেছেন। কিছুক্ষণ পর আবার চেষ্টা করুন।';
    }

    return 'বার্তা পাঠানো যায়নি। আপনার ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।';
}

export default function ContactPage() {
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const update = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (status === 'sending') {
            return;
        }

        setStatus('sending');
        setError('');

        try {
            await apiRequest('/contact-messages', {
                method: 'POST',
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    topic: form.topic,
                    message: form.message.trim(),
                }),
            });

            setForm(initialForm);
            setStatus('success');
        } catch (err) {
            setStatus('idle');
            setError(getErrorMessage(err));
        }
    };

    return (
        <main className="mt-20 min-h-screen bg-white font-['Noto_Sans_Bengali',sans-serif] text-[#263A3C]">
            {/* PAGE INTRO */}
            <header className="border-b border-[#DDE9E6] bg-[#F3F8F6]">
                <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-[76px]">
                    <p className="mb-5 flex items-center gap-3 text-[13px] font-medium text-[#34766B]">
                        <span className="h-px w-7 bg-[#34766B]" />
                        স্ট্যান্ড ফর পিপল / যোগাযোগ
                    </p>

                    <h1 className="text-[32px] font-semibold leading-[1.4] tracking-[-0.025em] text-[#172D32] sm:text-[42px] lg:text-[48px]">
                        আমাদের সঙ্গে যোগাযোগ করুন
                    </h1>

                    <p className="mt-5 max-w-[740px] text-[16px] leading-[2] text-[#52646A] sm:text-[17px]">
                        কোনো প্রশ্ন, পরামর্শ বা ওয়েবসাইট-সংক্রান্ত বিষয়ে
                        আমাদের জানাতে এই ফর্মটি ব্যবহার করুন। আপনার বার্তাটি
                        সঠিকভাবে বুঝতে বিষয় নির্বাচন করুন এবং প্রয়োজনীয় তথ্য
                        লিখুন।
                    </p>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-10 lg:py-20">
                {/* LEFT: CONTACT GUIDANCE */}
                <aside className="min-w-0">
                    <div className="flex items-center gap-3 text-[#0F766E]">
                        <MessageSquareText size={21} strokeWidth={1.7} />
                        <span className="text-[13px] font-semibold">
                            যোগাযোগের নির্দেশনা
                        </span>
                    </div>

                    <h2 className="mt-5 text-[24px] font-semibold leading-[1.5] text-[#1E3438] sm:text-[27px]">
                        কী বিষয়ে আমাদের জানাতে চান?
                    </h2>

                    <p className="mt-4 text-[15.5px] leading-[2] text-[#647579]">
                        সাধারণ প্রশ্ন, মতামত বা প্ল্যাটফর্ম ব্যবহারে কোনো
                        সমস্যার কথা আমাদের লিখুন। বার্তায় প্রাসঙ্গিক তথ্য থাকলে
                        আপনার বিষয়টি বুঝতে সুবিধা হবে।
                    </p>

                    <div className="mt-9 divide-y divide-[#E7ECEA] border-y border-[#E7ECEA]">
                        <div className="flex gap-4 py-5">
                            <HeartHandshake
                                size={21}
                                className="mt-1 shrink-0 text-[#347B71]"
                                strokeWidth={1.6}
                            />
                            <div>
                                <h3 className="text-[16px] font-semibold text-[#263B3E]">
                                    অনুদান ও ক্যাম্পেইন
                                </h3>
                                <p className="mt-1.5 text-[14px] leading-[1.9] text-[#6A797C]">
                                    অনুদান, পেমেন্ট বা কোনো ক্যাম্পেইন সম্পর্কে
                                    প্রশ্ন থাকলে জানান।
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 py-5">
                            <ShieldCheck
                                size={21}
                                className="mt-1 shrink-0 text-[#347B71]"
                                strokeWidth={1.6}
                            />
                            <div>
                                <h3 className="text-[16px] font-semibold text-[#263B3E]">
                                    অ্যাকাউন্ট ও নিরাপত্তা
                                </h3>
                                <p className="mt-1.5 text-[14px] leading-[1.9] text-[#6A797C]">
                                    লগইন, অ্যাকাউন্ট ব্যবহার বা নিরাপত্তা নিয়ে
                                    প্রশ্ন জানাতে পারেন।
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 py-5">
                            <Accessibility
                                size={21}
                                className="mt-1 shrink-0 text-[#347B71]"
                                strokeWidth={1.6}
                            />
                            <div>
                                <h3 className="text-[16px] font-semibold text-[#263B3E]">
                                    ওয়েবসাইট ও পরামর্শ
                                </h3>
                                <p className="mt-1.5 text-[14px] leading-[1.9] text-[#6A797C]">
                                    কোনো পেজে সমস্যা হলে বা নতুন কোনো পরামর্শ
                                    থাকলে আমাদের জানান।
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CONTACT VS HELP REQUEST */}
                    <div className="mt-8 border-l-2 border-[#0F766E] bg-[#F3F8F6] px-5 py-5">
                        <div className="flex items-start gap-3">
                            <ClipboardList
                                size={20}
                                className="mt-1 shrink-0 text-[#0F766E]"
                                strokeWidth={1.7}
                            />
                            <div>
                                <h3 className="text-[15px] font-semibold text-[#263B3E]">
                                    আপনার কি সরাসরি সহায়তা প্রয়োজন?
                                </h3>
                                <p className="mt-2 text-[13.5px] leading-[1.9] text-[#647579]">
                                    মানবিক সহায়তার আবেদন বা নির্দিষ্ট Help
                                    Request জমা দিতে Contact Form-এর পরিবর্তে
                                    সহায়তা অনুরোধের পেজ ব্যবহার করুন।
                                </p>
                                <Link
                                    to="/help"
                                    className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0F766E] hover:underline"
                                >
                                    সহায়তা কেন্দ্র দেখুন
                                    <ArrowUpRight size={15} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <p className="mt-7 text-[13px] leading-[1.9] text-[#758487]">
                        নিরাপত্তার জন্য বার্তায় পাসওয়ার্ড, OTP, সম্পূর্ণ কার্ড
                        নম্বর বা অন্য কোনো গোপন তথ্য দেবেন না।
                    </p>

                    <Link
                        to="/privacy"
                        className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0F766E] hover:underline"
                    >
                        গোপনীয়তা নীতি দেখুন
                        <ArrowUpRight size={15} />
                    </Link>
                </aside>

                {/* RIGHT: CONTACT FORM */}
                <section
                    className="min-w-0"
                    aria-labelledby="contact-form-title"
                >
                    <div className="border border-[#DEE8E5] bg-white px-5 py-7 sm:px-8 sm:py-9 lg:px-9">
                        {status === 'success' ? (
                            <div
                                role="status"
                                aria-live="polite"
                                className="py-12 text-center"
                            >
                                <CheckCircle2
                                    className="mx-auto text-[#0F766E]"
                                    size={38}
                                    strokeWidth={1.5}
                                />

                                <h2 className="mt-5 text-[23px] font-semibold text-[#1E3438]">
                                    আপনার বার্তা জমা হয়েছে
                                </h2>

                                <p className="mx-auto mt-3 max-w-md text-[15px] leading-8 text-[#647579]">
                                    আমাদের সঙ্গে যোগাযোগ করার জন্য ধন্যবাদ।
                                    আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে।
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatus('idle');
                                        setError('');
                                    }}
                                    className="mt-7 border border-[#0F766E] px-5 py-3 text-[14px] font-medium text-[#0F766E] hover:bg-[#F0F7F5]"
                                >
                                    আরেকটি বার্তা লিখুন
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="border-b border-[#E8EEEC] pb-6">
                                    <div className="flex items-center gap-3">
                                        <Mail
                                            size={20}
                                            strokeWidth={1.7}
                                            className="text-[#0F766E]"
                                        />
                                        <h2
                                            id="contact-form-title"
                                            className="text-[22px] font-semibold text-[#20373B] sm:text-[24px]"
                                        >
                                            আপনার বার্তা লিখুন
                                        </h2>
                                    </div>

                                    <p className="mt-3 text-[14px] leading-7 text-[#718083]">
                                        আপনার যোগাযোগের তথ্য ও বার্তা পূরণ করুন।
                                        সবগুলো ঘর আবশ্যক।
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-7 space-y-6"
                                >
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <label className="block text-[14px] font-medium text-[#33484B]">
                                            আপনার নাম
                                            <input
                                                className={fieldClass}
                                                type="text"
                                                name="name"
                                                autoComplete="name"
                                                maxLength={100}
                                                required
                                                disabled={status === 'sending'}
                                                placeholder="আপনার পুরো নাম"
                                                value={form.name}
                                                onChange={(event) =>
                                                    update(
                                                        'name',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </label>

                                        <label className="block text-[14px] font-medium text-[#33484B]">
                                            ইমেইল ঠিকানা
                                            <input
                                                className={fieldClass}
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                maxLength={254}
                                                required
                                                disabled={status === 'sending'}
                                                placeholder="example@email.com"
                                                value={form.email}
                                                onChange={(event) =>
                                                    update(
                                                        'email',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </label>
                                    </div>

                                    <label className="block text-[14px] font-medium text-[#33484B]">
                                        যোগাযোগের বিষয়
                                        <div className="relative">
                                            <select
                                                className={`${fieldClass} appearance-none pr-11`}
                                                name="topic"
                                                required
                                                disabled={status === 'sending'}
                                                value={form.topic}
                                                onChange={(event) =>
                                                    update(
                                                        'topic',
                                                        event.target.value,
                                                    )
                                                }
                                            >
                                                <option value="" disabled>
                                                    একটি বিষয় নির্বাচন করুন
                                                </option>

                                                {topics.map((topic) => (
                                                    <option
                                                        key={topic.value}
                                                        value={topic.value}
                                                    >
                                                        {topic.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <ChevronDown
                                                size={17}
                                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#718083]"
                                            />
                                        </div>
                                    </label>

                                    <label className="block text-[14px] font-medium text-[#33484B]">
                                        বিস্তারিত বার্তা
                                        <textarea
                                            className={`${fieldClass} min-h-[175px] resize-y`}
                                            name="message"
                                            rows={6}
                                            minLength={10}
                                            maxLength={5000}
                                            required
                                            disabled={status === 'sending'}
                                            placeholder="আপনার প্রশ্ন, পরামর্শ বা সমস্যাটি বিস্তারিত লিখুন..."
                                            value={form.message}
                                            onChange={(event) =>
                                                update(
                                                    'message',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <span className="mt-2 block text-right text-[12px] font-normal text-[#819092]">
                                            {form.message.length}/5000
                                        </span>
                                    </label>

                                    {error && (
                                        <p
                                            role="alert"
                                            className="border-l-2 border-[#B65B52] bg-[#FCF5F3] px-4 py-3 text-[14px] leading-7 text-[#974B43]"
                                        >
                                            {error}
                                        </p>
                                    )}

                                    <div className="border-t border-[#E8EEEC] pt-6">
                                        <p className="mb-5 text-[12.5px] leading-[1.8] text-[#819092]">
                                            আপনার দেওয়া তথ্য এই যোগাযোগের
                                            অনুরোধ পরিচালনা ও উত্তর দেওয়ার
                                            উদ্দেশ্যে ব্যবহার করা হতে পারে।
                                            বিস্তারিত জানতে আমাদের গোপনীয়তা
                                            নীতি পড়ুন।
                                        </p>

                                        <button
                                            type="submit"
                                            disabled={status === 'sending'}
                                            className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#0F766E] px-6 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#115E59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                        >
                                            {status === 'sending' ? (
                                                'পাঠানো হচ্ছে...'
                                            ) : (
                                                <>
                                                    <Send size={16} />
                                                    বার্তা পাঠান
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

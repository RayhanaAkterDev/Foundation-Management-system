import React from 'react';
import {
    ArrowRight,
    ArrowLeft,
    Check,
    X,
    Home,
    ShieldCheck,
    HeartHandshake,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status') || 'failed';
    const isSuccess = status === 'success';
    const isCancelled = status === 'cancelled';

    const content = isSuccess
        ? {
              eyebrow: 'অনুদান সম্পন্ন',
              title: 'আপনার সহায়তা পৌঁছানোর পথে।',
              message:
                  'আপনার অনুদান সফলভাবে নথিভুক্ত হয়েছে। মানুষের পাশে দাঁড়ানোর জন্য আন্তরিক ধন্যবাদ।',
              actionLabel: 'আমার অনুদান দেখুন',
              actionTo: '/individual/dashboard/donations',
              note: 'আপনার সহযোগিতা আমাদের উদ্যোগকে আরও এগিয়ে নিয়ে যায়।',
          }
        : isCancelled
          ? {
                eyebrow: 'অনুদান বাতিল হয়েছে',
                title: 'আপনার পেমেন্ট সম্পন্ন হয়নি।',
                message:
                    'আপনি পেমেন্ট প্রক্রিয়াটি বাতিল করেছেন। এই প্রচেষ্টায় কোনো অনুদান নথিভুক্ত হয়নি।',
                actionLabel: 'আবার চেষ্টা করুন',
                actionTo: '/campaigns',
                note: 'আপনি চাইলে অন্য কোনো উদ্যোগেও সহায়তা করতে পারেন।',
            }
          : {
                eyebrow: 'পেমেন্ট সম্পন্ন হয়নি',
                title: 'অনুদান প্রক্রিয়ায় সমস্যা হয়েছে।',
                message:
                    'আপনার পেমেন্টটি সম্পন্ন করা যায়নি। এই প্রচেষ্টায় কোনো অনুদান নথিভুক্ত হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
                actionLabel: 'আবার চেষ্টা করুন',
                actionTo: '/campaigns',
                note: 'সমস্যা অব্যাহত থাকলে কিছুক্ষণ পর আবার চেষ্টা করুন।',
            };

    return (
        <main
            lang="bn"
            className="flex min-h-[100dvh] flex-col bg-background font-bengali text-text-primary"
        >
            <header className="border-b border-border bg-surface">
                <div className="container-width mx-auto flex min-h-[76px] max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary"
                    >
                        <HeartHandshake size={25} strokeWidth={1.7} />{' '}
                        <span className="font-sans tracking-tight">
                            Stand For People
                        </span>
                    </Link>
                    <span className="inline-flex items-center gap-2 text-xs text-text-secondary">
                        <ShieldCheck size={17} className="text-primary" />{' '}
                        অনুদানের অবস্থা
                    </span>
                </div>
            </header>
            <section className="container-width mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-12 sm:px-6 sm:py-20">
                <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-center lg:gap-20">
                    <div>
                        <div className="mb-8 flex items-center gap-3 text-xs font-semibold text-primary">
                            <span className="h-1.5 w-1.5 bg-[#d79a43]" />{' '}
                            {content.eyebrow}
                        </div>
                        <div
                            className={`mb-7 flex h-16 w-16 items-center justify-center border-2 ${isSuccess ? 'border-primary text-primary' : 'border-[#b88b56] text-[#b88b56]'}`}
                        >
                            {isSuccess ? (
                                <Check size={35} strokeWidth={1.8} />
                            ) : (
                                <X size={34} strokeWidth={1.8} />
                            )}
                        </div>
                        <h1 className="max-w-[680px] text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.35] tracking-tight">
                            {content.title}
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-8 text-text-secondary sm:text-base">
                            {content.message}
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                to={content.actionTo}
                                className="inline-flex min-h-[50px] items-center justify-center gap-3 bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                            >
                                {content.actionLabel}
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                to="/campaigns"
                                className="inline-flex min-h-[50px] items-center justify-center gap-2 border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-primary"
                            >
                                <ArrowLeft size={17} /> উদ্যোগগুলো দেখুন
                            </Link>
                        </div>
                    </div>
                    <aside className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:py-10 lg:pl-10">
                        <p className="mb-5 text-xs font-semibold text-primary">
                            Stand For People
                        </p>
                        <h2 className="text-xl font-semibold leading-relaxed sm:text-2xl">
                            মানুষের পাশে থাকার প্রতিটি সিদ্ধান্তই মূল্যবান।
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-text-secondary">
                            {content.note}
                        </p>
                        <div className="mt-8 border-t border-border pt-6">
                            <Link
                                to="/"
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
                            >
                                হোমপেজে ফিরে যান{' '}
                                <Home
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </aside>
                </div>
            </section>
            <footer className="border-t border-border py-5">
                <div className="container-width mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 text-xs text-text-secondary sm:px-6">
                    <span>মানুষের প্রয়োজনে, মানুষের পাশে।</span>
                    <span className="font-sans">Stand For People</span>
                </div>
            </footer>
        </main>
    );
};

export default PaymentResult;

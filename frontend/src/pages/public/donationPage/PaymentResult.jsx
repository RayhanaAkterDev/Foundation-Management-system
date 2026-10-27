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

    const StatusIcon = isSuccess ? Check : X;
    return (
        <main
            lang="bn"
            className="flex min-h-screen flex-col bg-background font-bengali text-text-primary"
        >
            <header className="border-b border-border/70 bg-surface">
                <div className="container-width mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 text-primary"
                    >
                        <HeartHandshake size={27} strokeWidth={1.6} />
                        <span className="font-sans text-sm font-bold text-text-primary">
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
                <div className="w-full">
                    <div className="mb-7 flex items-center gap-3 text-xs font-semibold text-primary">
                        <span className="h-px w-9 bg-accent" /> অনুদান কার্যক্রম
                        <span className="text-text-muted">/</span>
                        <span className="text-text-secondary">
                            {content.eyebrow}
                        </span>
                    </div>
                    <div className="grid border border-border/80 bg-surface lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
                        <div className="min-w-0 px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-18">
                            <div className="mb-9 flex items-center gap-4">
                                <span
                                    className={`flex size-16 shrink-0 items-center justify-center border ${isSuccess ? 'border-primary/25 bg-primary/8 text-primary' : 'border-amber-600/25 bg-amber-500/8 text-amber-700'}`}
                                >
                                    <StatusIcon size={32} strokeWidth={1.8} />
                                </span>
                                <div>
                                    <p className="text-xs text-text-muted">
                                        পেমেন্টের বর্তমান অবস্থা
                                    </p>
                                    <p
                                        className={`mt-1 text-sm font-semibold ${isSuccess ? 'text-primary' : 'text-amber-700'}`}
                                    >
                                        {isSuccess
                                            ? 'সফল'
                                            : isCancelled
                                              ? 'বাতিল'
                                              : 'ব্যর্থ'}
                                    </p>
                                </div>
                            </div>
                            <h1 className="max-w-2xl text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.35] tracking-tight">
                                {content.title}
                            </h1>
                            <p className="mt-5 max-w-xl text-sm leading-8 text-text-secondary sm:text-base">
                                {content.message}
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <Link
                                    to={content.actionTo}
                                    className="group inline-flex min-h-13 items-center justify-center gap-3 bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                                >
                                    {content.actionLabel}
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
                                <Link
                                    to="/campaigns"
                                    className="inline-flex min-h-13 items-center justify-center gap-2 border border-border bg-background px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/60"
                                >
                                    <ArrowLeft size={17} /> উদ্যোগগুলো দেখুন
                                </Link>
                            </div>
                        </div>
                        <aside className="flex min-w-0 flex-col justify-between border-t border-border/80 bg-background-alt/50 px-5 py-9 sm:px-9 sm:py-12 lg:border-l lg:border-t-0 lg:px-10 lg:py-15">
                            <div>
                                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                                    Stand For People
                                </span>
                                <div className="mt-6 h-px w-12 bg-accent" />
                                <h2 className="mt-7 max-w-sm text-[clamp(1.4rem,2.5vw,2rem)] font-semibold leading-[1.5]">
                                    মানুষের পাশে থাকার প্রতিটি সিদ্ধান্তই
                                    মূল্যবান।
                                </h2>
                                <p className="mt-5 max-w-sm text-sm leading-8 text-text-secondary">
                                    {content.note}
                                </p>
                            </div>
                            <div className="mt-12 border-t border-border pt-6">
                                <Link
                                    to="/"
                                    className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
                                >
                                    <Home size={17} /> হোমপেজে ফিরে যান{' '}
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
            <footer className="border-t border-border/70 py-5">
                <div className="container-width mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 text-xs text-text-secondary sm:px-6">
                    <span>মানুষের প্রয়োজনে, মানুষের পাশে।</span>
                    <span className="font-sans">Stand For People</span>
                </div>
            </footer>
        </main>
    );
};

export default PaymentResult;

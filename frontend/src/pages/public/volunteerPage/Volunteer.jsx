import { useEffect, useState } from 'react';
import {
    TbArrowRight,
    TbHeartHandshake,
    TbShieldCheck,
    TbMapPin,
    TbClockHour4,
} from 'react-icons/tb';
import hero from '@/assets/volunteer/hero.png';
import { fetchPublicVolunteers } from '@/api/volunteerApi';
import VolunteerCommunityVisual from './components/VolunteerCommunityVisual';
import VolunteerForm from './components/VolunteerForm';
import Button from '@/components/Button';

const roles = [
    {
        number: '০১',
        eyebrow: 'সরাসরি মানুষের সঙ্গে',
        title: 'মাঠ পর্যায়ে স্বেচ্ছাসেবা',
        description:
            'খাদ্য, প্রয়োজনীয় সামগ্রী ও মানবিক সহায়তা মানুষের কাছে পৌঁছে দেওয়ার কাজে সরাসরি অংশ নিন।',
        meta: ['মাঠ পর্যায়ে কাজ', 'সময় অনুযায়ী অংশগ্রহণ'],
        image: 'https://images.unsplash.com/photo-1710093072228-8c3129f27357?auto=format&fit=crop&w=1400&q=85',
    },
    {
        number: '০২',
        eyebrow: 'যেখান থেকেই সম্ভব',
        title: 'দূরবর্তী সহায়তা',
        description:
            'তথ্য যাচাই, প্রয়োজনীয় যোগাযোগ এবং সহায়তার অনুরোধ সমন্বয়ের কাজে দূর থেকেই যুক্ত থাকুন।',
        meta: ['দূর থেকে কাজ', 'নমনীয় সময়'],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85',
    },
    {
        number: '০৩',
        eyebrow: 'প্রয়োজনের গুরুত্বপূর্ণ সময়ে',
        title: 'জরুরি সাড়া',
        description:
            'দুর্যোগ বা জরুরি পরিস্থিতিতে দ্রুত সাড়া দেওয়া মানবিক কার্যক্রমে দায়িত্বশীলভাবে অংশ নিন।',
        meta: ['জরুরি কার্যক্রম', 'প্রয়োজনভিত্তিক অংশগ্রহণ'],
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85',
    },
];
const steps = [
    ['০১', 'আবেদন করুন', 'নিবন্ধিত ব্যক্তিগত অ্যাকাউন্ট থেকে আবেদন পাঠান।'],
    [
        '০২',
        'আবেদন পর্যালোচনা',
        'আমাদের দল আপনার আবেদন ও প্রয়োজনীয় তথ্য যাচাই করবে।',
    ],
    ['০৩', 'কাজে যুক্ত হোন', 'অনুমোদনের পর প্রয়োজন ও সুযোগ অনুযায়ী অংশ নিন।'],
];
const faqs = [
    [
        'স্বেচ্ছাসেবক হতে কি পূর্ব অভিজ্ঞতা প্রয়োজন?',
        'না। নতুন স্বেচ্ছাসেবকদের প্রয়োজনীয় নির্দেশনা দেওয়া হবে।',
    ],
    [
        'কতটুকু সময় দিতে হবে?',
        'নিজের সময় ও সুযোগ অনুযায়ী উপযুক্ত কার্যক্রমে অংশ নিতে পারবেন।',
    ],
    [
        'স্বেচ্ছাসেবী কাজের জন্য কি অর্থ প্রদান করা হয়?',
        'না। এটি স্বেচ্ছাসেবী অংশগ্রহণ, যার উদ্দেশ্য মানুষের পাশে দাঁড়ানো।',
    ],
];

export default function Volunteer() {
    const [focusForm, setFocusForm] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [volunteers, setVolunteers] = useState([]);
    const [volunteersLoading, setVolunteersLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const response = await fetchPublicVolunteers();
                if (mounted)
                    setVolunteers(
                        Array.isArray(response?.volunteers)
                            ? response.volunteers
                            : [],
                    );
            } catch (error) {
                console.error('স্বেচ্ছাসেবকদের তথ্য আনা যায়নি:', error);
                if (mounted) setVolunteers([]);
            } finally {
                if (mounted) setVolunteersLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const goToForm = () => {
        setFocusForm(true);
        document
            .getElementById('volunteer-form')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <main
            lang="bn"
            className="overflow-x-clip bg-surface font-bengali text-text-primary"
        >
            <section className="border-b border-border pt-20">
                <div className="container-width grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:py-24 xl:gap-20">
                    <div className="min-w-0 max-w-[680px]">
                        <p className="flex items-center gap-3 text-[13px] font-medium! text-primary">
                            <span className="h-px w-8 bg-primary" />
                            স্বেচ্ছাসেবক হিসেবে যুক্ত হোন
                        </p>
                        <h1 className="mt-6 text-[clamp(2rem,4.3vw,3.65rem)] font-medium! leading-[1.4] tracking-normal">
                            আপনার সময় হতে পারে{' '}
                            <span className="text-primary">
                                কারও প্রয়োজনের সহায়তা।
                            </span>
                        </h1>
                        <p className="mt-6 max-w-xl text-[15px] leading-8 text-text-secondary sm:text-base">
                            Stand For People-এর সঙ্গে যুক্ত হয়ে নিজের সময় ও
                            দক্ষতা দিয়ে মানুষের পাশে দাঁড়ান। ছোট একটি উদ্যোগও
                            কারও জীবনে বড় পরিবর্তন আনতে পারে।
                        </p>
                        <div className="mt-8 flex flex-col gap-3 min-[460px]:flex-row min-[460px]:flex-wrap">
                            <Button
                                size="lg"
                                onClick={goToForm}
                                className="w-full min-[460px]:w-auto"
                            >
                                স্বেচ্ছাসেবক হতে আবেদন করুন
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                to="/how-it-works"
                                className="w-full min-[460px]:w-auto"
                            >
                                কীভাবে কাজ করে
                            </Button>
                        </div>
                        <p className="mt-7 flex max-w-lg items-start gap-2.5 text-[13px] leading-7 text-text-muted">
                            <TbShieldCheck
                                size={19}
                                className="mt-1 shrink-0 text-primary"
                            />
                            আবেদন যাচাইয়ের পর প্রয়োজন ও সুযোগ অনুযায়ী কাজে যুক্ত
                            হওয়ার সুযোগ পাবেন।
                        </p>
                    </div>
                    <div className="min-w-0 lg:justify-self-end lg:w-full lg:max-w-[490px]">
                        <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[16/10] lg:aspect-[4/5]">
                            <img
                                src={hero}
                                alt="মানুষের পাশে কাজ করছেন স্বেচ্ছাসেবকেরা"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white! sm:p-7">
                                <p className="max-w-xs text-[13px] leading-7 text-white!">
                                    মানুষের পাশে থাকা শুরু হয় দায়িত্ব নেওয়ার
                                    ইচ্ছা থেকে।
                                </p>
                                <TbHeartHandshake
                                    size={26}
                                    className="shrink-0"
                                />
                            </div>
                        </div>
                        <div className="ml-auto flex w-[88%] items-center justify-between border-x border-b border-border bg-background-warm px-5 py-3 text-[12px] text-text-secondary">
                            <span>সময় · দক্ষতা · দায়িত্ব</span>
                            <span className="size-2 rounded-full bg-accent" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-background">
                <div className="container-width py-16 sm:py-20 lg:py-24">
                    <div className="grid gap-4 border-b border-border pb-8 md:grid-cols-[1fr_300px] md:items-end md:gap-12">
                        <div>
                            <p className="text-[13px] font-medium! text-primary">
                                অংশগ্রহণের ক্ষেত্র
                            </p>
                            <h2 className="mt-3 text-[clamp(1.7rem,3vw,2.5rem)] font-medium! leading-[1.45]">
                                যেভাবে মানুষের পাশে{' '}
                                <span className="text-primary">
                                    কাজ করতে পারেন
                                </span>
                            </h2>
                        </div>
                        <p className="text-[14px] leading-7 text-text-secondary">
                            আপনার সময়, অবস্থান ও সক্ষমতার সঙ্গে মানানসই কাজে অংশ
                            নিন।
                        </p>
                    </div>
                    {roles.map((role, index) => (
                        <article
                            key={role.number}
                            className="grid items-center gap-7 border-b border-border py-10 sm:py-12 lg:grid-cols-2 lg:gap-14 lg:py-16 xl:gap-20"
                        >
                            <div
                                className={`relative min-w-0 ${index % 2 ? 'lg:order-2' : ''}`}
                            >
                                <div className="aspect-[16/10] overflow-hidden sm:aspect-[16/9] lg:aspect-[4/3]">
                                    <img
                                        loading="lazy"
                                        src={role.image}
                                        alt={role.title}
                                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                                    />
                                </div>
                                <span className="absolute left-0 top-0 bg-primary px-4 py-2 text-[12px] font-medium! text-white!">
                                    {role.number}
                                </span>
                            </div>
                            <div className="min-w-0 max-w-[530px] lg:py-4">
                                <p className="text-[13px] font-medium! text-primary">
                                    {role.eyebrow}
                                </p>
                                <h3 className="mt-3 text-[clamp(1.55rem,2.6vw,2.1rem)] font-medium! leading-[1.45]">
                                    {role.title}
                                </h3>
                                <p className="mt-4 text-[14px] leading-8 text-text-secondary sm:text-[15px]">
                                    {role.description}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 border-t border-border pt-5 text-[13px] text-text-muted">
                                    <span className="flex items-center gap-2">
                                        <TbMapPin
                                            size={17}
                                            className="text-primary"
                                        />
                                        {role.meta[0]}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <TbClockHour4
                                            size={17}
                                            className="text-primary"
                                        />
                                        {role.meta[1]}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={goToForm}
                                    className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium! text-primary hover:text-primary-hover"
                                >
                                    এই কাজে যুক্ত হোন <TbArrowRight size={18} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="bg-background-warm">
                <div className="container-width grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:py-24">
                    <div>
                        <p className="text-[13px] font-medium! text-primary">
                            যুক্ত হওয়ার প্রক্রিয়া
                        </p>
                        <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.4rem)] font-medium! leading-[1.45]">
                            আবেদন থেকে{' '}
                            <span className="text-primary">
                                সক্রিয় অংশগ্রহণ
                            </span>
                        </h2>
                        <p className="mt-4 max-w-sm text-[14px] leading-8 text-text-secondary">
                            মাত্র কয়েকটি ধাপ পেরিয়ে স্বেচ্ছাসেবী কাজে যুক্ত হতে
                            পারেন।
                        </p>
                    </div>
                    <div className="border-l border-primary-muted pl-6 sm:pl-9">
                        {steps.map(([number, title, description], index) => (
                            <div
                                key={number}
                                className={`relative grid gap-2 ${index < steps.length - 1 ? 'pb-9 sm:pb-11' : ''} sm:grid-cols-[40px_minmax(130px,0.8fr)_minmax(0,1.2fr)] sm:gap-5`}
                            >
                                <span className="absolute -left-[30px] top-1 size-3 rounded-full border-[3px] border-background-warm bg-primary sm:-left-[42px]" />
                                <span className="text-[13px] font-medium! text-primary">
                                    {number}
                                </span>
                                <h3 className="text-[16px] font-medium! leading-7">
                                    {title}
                                </h3>
                                <p className="text-[13px] leading-7 text-text-secondary sm:text-[14px]">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-background">
                <div className="container-width grid items-center gap-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-12 lg:py-24">
                    <div>
                        <p className="text-[13px] font-medium! text-primary">
                            স্বেচ্ছাসেবক কমিউনিটি
                        </p>
                        <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.4rem)] font-medium! leading-[1.45]">
                            যাঁরা ইতিমধ্যে{' '}
                            <span className="text-primary">
                                পাশে দাঁড়িয়েছেন
                            </span>
                        </h2>
                        <p className="mt-4 max-w-sm text-[14px] leading-8 text-text-secondary">
                            Stand For People-এর সঙ্গে যুক্ত স্বেচ্ছাসেবকদের একটি
                            অংশ।
                        </p>
                    </div>
                    <VolunteerCommunityVisual
                        volunteers={volunteers}
                        volunteersLoading={volunteersLoading}
                        onJoin={goToForm}
                    />
                </div>
            </section>

            <VolunteerForm focus={focusForm} />

            <section className="border-t border-border bg-surface">
                <div className="container-width grid gap-9 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20 lg:py-24">
                    <div>
                        <p className="text-[13px] font-medium! text-primary">
                            সাধারণ প্রশ্ন
                        </p>
                        <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.3rem)] font-medium! leading-[1.45]">
                            যুক্ত হওয়ার আগে{' '}
                            <span className="text-primary">যা জানতে পারেন</span>
                        </h2>
                    </div>
                    <div className="border-t border-border">
                        {faqs.map(([question, answer], index) => (
                            <div
                                key={question}
                                className="border-b border-border"
                            >
                                <button
                                    type="button"
                                    aria-expanded={openFaq === index}
                                    onClick={() =>
                                        setOpenFaq(
                                            openFaq === index ? null : index,
                                        )
                                    }
                                    className="flex w-full items-start justify-between gap-6 py-6 text-left"
                                >
                                    <span className="text-[15px] font-medium! leading-7 sm:text-[16px]">
                                        {question}
                                    </span>
                                    <span
                                        className="shrink-0 text-xl text-primary"
                                        aria-hidden="true"
                                    >
                                        {openFaq === index ? '−' : '+'}
                                    </span>
                                </button>
                                {openFaq === index && (
                                    <p className="max-w-xl pb-6 text-[14px] leading-8 text-text-secondary">
                                        {answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

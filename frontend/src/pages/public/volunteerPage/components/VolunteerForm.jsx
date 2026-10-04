import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Loader2,
    UserCheck,
} from 'lucide-react';

import {
    fetchVolunteerStatus,
    submitVolunteerApplication,
} from '@/api/volunteerApi';

const getStoredUser = () => {
    try {
        const raw =
            localStorage.getItem('user') || sessionStorage.getItem('user');

        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const getStoredToken = () => {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
};

const VolunteerForm = ({ focus }) => {
    const [user, setUser] = useState(getStoredUser);
    const [volunteerState, setVolunteerState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const token = getStoredToken();

            if (!token) {
                if (!cancelled) {
                    setUser(null);
                    setVolunteerState(null);
                    setLoading(false);
                }

                return;
            }

            if (!cancelled) {
                setLoading(true);
                setError('');
            }

            try {
                const storedUser = getStoredUser();
                const data = await fetchVolunteerStatus();

                if (!cancelled) {
                    setUser(storedUser);
                    setVolunteerState(data);
                }
            } catch (err) {
                console.error('Failed to load volunteer status:', err);

                if (!cancelled) {
                    if (err.status === 401) {
                        setUser(null);
                        setVolunteerState(null);
                    } else {
                        setError(
                            err.message ||
                                'আপনার স্বেচ্ছাসেবক অবস্থা জানা যাচ্ছে না।',
                        );
                    }
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        const handleAuthChange = () => {
            load();
        };

        window.addEventListener('auth-changed', handleAuthChange);

        window.addEventListener('storage', handleAuthChange);

        return () => {
            cancelled = true;

            window.removeEventListener('auth-changed', handleAuthChange);

            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    useEffect(() => {
        if (!focus) return;

        const timer = setTimeout(() => {
            document.getElementById('volunteer-form')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [focus]);

    const handleApply = async () => {
        setSubmitting(true);
        setError('');

        try {
            const data = await submitVolunteerApplication();

            setVolunteerState((current) => ({
                ...(current || {}),
                is_volunteer: false,
                volunteer: null,
                request: data?.request || {
                    status: 'pending',
                },
            }));
        } catch (err) {
            console.error('Failed to submit volunteer application:', err);

            if (err.status === 401) {
                setUser(null);
                setVolunteerState(null);

                setError('স্বেচ্ছাসেবক হওয়ার আবেদন করতে প্রথমে লগইন করুন।');
            } else if (err.status === 403) {
                setError(
                    err.message ||
                        'শুধুমাত্র যোগ্য ব্যক্তিগত অ্যাকাউন্ট থেকে স্বেচ্ছাসেবক হওয়ার আবেদন করা যাবে।',
                );
            } else {
                setError(
                    err.message ||
                        'এই মুহূর্তে আপনার আবেদন পাঠানো যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।',
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const request = volunteerState?.request;
    const volunteer = volunteerState?.volunteer;

    const requestStatus = request?.status;
    const volunteerStatus = volunteer?.status;

    const isPending = requestStatus === 'pending';

    const isActiveVolunteer =
        volunteerState?.is_volunteer === true && volunteerStatus === 'active';

    const isInactiveVolunteer =
        volunteerState?.is_volunteer === true && volunteerStatus === 'inactive';

    const isSuspendedVolunteer =
        volunteerState?.is_volunteer === true &&
        volunteerStatus === 'suspended';

    const isGuest = !getStoredToken() || !user;

    return (
        <section
            id="volunteer-form"
            className={`section-gap transition-colors duration-500 ${
                focus ? 'bg-primary/5' : ''
            }`}
        >
            <div className="container-width max-w-4xl">
                {/* =====================================================
                    HEADING
                ====================================================== */}

                <div className="mb-10 text-center sm:mb-14">
                    <span className="font-bengali text-xs font-semibold text-primary sm:text-sm">
                        স্বেচ্ছাসেবক হিসেবে যুক্ত হোন
                    </span>

                    <h2 className="mt-3 font-bengali text-3xl font-semibold leading-[1.35] text-text-primary sm:mt-4 sm:text-4xl lg:text-5xl">
                        মানুষের পাশে দাঁড়াতে আবেদন করুন
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl font-bengali text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:text-lg">
                        প্রয়োজনীয় তথ্য আপনার অ্যাকাউন্টে ইতিমধ্যেই রয়েছে। আবেদন
                        পাঠানোর পর আমাদের দল সেটি পর্যালোচনা করবে।
                    </p>
                </div>

                <div className="mx-auto max-w-2xl">
                    {/* =================================================
                        LOADING
                    ================================================== */}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-border/70 bg-background/70 px-6 py-14 text-center shadow-sm">
                            <Loader2
                                size={28}
                                className="animate-spin text-primary"
                            />

                            <p className="mt-4 font-bengali text-sm text-muted-foreground sm:text-base">
                                আপনার স্বেচ্ছাসেবক অবস্থা যাচাই করা হচ্ছে...
                            </p>
                        </div>
                    ) : isGuest ? (
                        /* =============================================
                            GUEST
                        ============================================== */

                        <div className="rounded-3xl border border-border/70 bg-background/70 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UserCheck size={26} />
                            </div>

                            <h3 className="mt-6 font-bengali text-xl font-semibold sm:text-2xl">
                                আবেদন করতে লগইন করুন
                            </h3>

                            <p className="mx-auto mt-3 max-w-md font-bengali text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                                নিবন্ধিত ব্যক্তিগত অ্যাকাউন্ট থেকে স্বেচ্ছাসেবক
                                হওয়ার আবেদন করা যাবে। আবেদন চালিয়ে যেতে আপনার
                                অ্যাকাউন্টে লগইন করুন।
                            </p>

                            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link
                                    to="/login?role=individual"
                                    state={{
                                        from: '/volunteer',
                                    }}
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-bengali text-sm font-semibold text-white! transition hover:bg-primary/90"
                                >
                                    লগইন করুন
                                </Link>

                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 font-bengali text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                                >
                                    অ্যাকাউন্ট তৈরি করুন
                                </Link>
                            </div>
                        </div>
                    ) : isActiveVolunteer ? (
                        /* =============================================
                            ACTIVE VOLUNTEER
                        ============================================== */

                        <div className="rounded-3xl border border-primary/20 bg-primary/5 px-6 py-10 text-center sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CheckCircle2 size={28} />
                            </div>

                            <h3 className="mt-6 font-bengali text-xl font-semibold sm:text-2xl">
                                আপনি ইতিমধ্যেই একজন স্বেচ্ছাসেবক
                            </h3>

                            <p className="mx-auto mt-3 max-w-md font-bengali text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                                আপনার স্বেচ্ছাসেবক প্রোফাইল বর্তমানে সক্রিয়।
                                ড্যাশবোর্ড থেকে আপনার স্বেচ্ছাসেবী কার্যক্রম
                                পরিচালনা করতে পারবেন।
                            </p>

                            <Link
                                to="/individual/dashboard/volunteer"
                                className="mt-7 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-bengali text-sm font-semibold text-white! transition hover:bg-primary/90"
                            >
                                স্বেচ্ছাসেবক ড্যাশবোর্ড খুলুন
                            </Link>
                        </div>
                    ) : isPending ? (
                        /* =============================================
                            PENDING
                        ============================================== */

                        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 px-6 py-10 text-center sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                                <Clock3 size={28} />
                            </div>

                            <h3 className="mt-6 font-bengali text-xl font-semibold sm:text-2xl">
                                আপনার আবেদন পর্যালোচনাধীন
                            </h3>

                            <p className="mx-auto mt-3 max-w-md font-bengali text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                                আপনার স্বেচ্ছাসেবক হওয়ার আবেদন ইতিমধ্যেই জমা
                                হয়েছে। আমাদের দল আবেদনটি পর্যালোচনা করে আপনার
                                স্বেচ্ছাসেবক অবস্থা হালনাগাদ করবে।
                            </p>

                            <Link
                                to="/individual/dashboard/volunteer"
                                className="mt-7 inline-flex items-center justify-center rounded-full border border-primary/20 bg-background px-7 py-3 font-bengali text-sm font-semibold text-primary transition hover:border-primary"
                            >
                                আবেদনের অবস্থা দেখুন
                            </Link>
                        </div>
                    ) : isInactiveVolunteer ? (
                        /* =============================================
                            INACTIVE
                        ============================================== */

                        <div className="rounded-3xl border border-border/70 bg-background/70 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UserCheck size={26} />
                            </div>

                            <h3 className="mt-6 font-bengali text-xl font-semibold sm:text-2xl">
                                আপনার স্বেচ্ছাসেবক প্রোফাইল বর্তমানে নিষ্ক্রিয়
                            </h3>

                            <p className="mx-auto mt-3 max-w-md font-bengali text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                                আপনার একটি স্বেচ্ছাসেবক প্রোফাইল ইতিমধ্যেই
                                রয়েছে। স্বেচ্ছাসেবক ড্যাশবোর্ড থেকে প্রোফাইলটি
                                পুনরায় সক্রিয় করার অনুরোধ করতে পারবেন।
                            </p>

                            <Link
                                to="/individual/dashboard/volunteer"
                                className="mt-7 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-bengali text-sm font-semibold text-white! transition hover:bg-primary/90"
                            >
                                স্বেচ্ছাসেবক ড্যাশবোর্ড খুলুন
                            </Link>
                        </div>
                    ) : isSuspendedVolunteer ? (
                        /* =============================================
                            SUSPENDED
                        ============================================== */

                        <div className="rounded-3xl border border-border/70 bg-background/70 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <AlertCircle size={26} />
                            </div>

                            <h3 className="mt-6 font-bengali text-xl font-semibold sm:text-2xl">
                                আপনার স্বেচ্ছাসেবক প্রোফাইল স্থগিত রয়েছে
                            </h3>

                            <p className="mx-auto mt-3 max-w-md font-bengali text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                                আপনার বর্তমান স্বেচ্ছাসেবক প্রোফাইলটি স্থগিত
                                রয়েছে। এ বিষয়ে সহায়তার প্রয়োজন হলে আমাদের
                                প্রশাসনিক দলের সঙ্গে যোগাযোগ করুন।
                            </p>

                            <Link
                                to="/individual/dashboard/volunteer"
                                className="mt-7 inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 font-bengali text-sm font-semibold transition hover:border-primary hover:text-primary"
                            >
                                স্বেচ্ছাসেবক ড্যাশবোর্ড খুলুন
                            </Link>
                        </div>
                    ) : (
                        /* =============================================
                            APPLICATION
                        ============================================== */

                        <div className="rounded-3xl border border-border/70 bg-background/70 px-6 py-10 shadow-sm sm:px-10 sm:py-12">
                            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                                <div className="max-w-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <UserCheck size={22} />
                                        </div>

                                        <div>
                                            <p className="font-bengali text-xs font-semibold text-primary">
                                                স্বেচ্ছাসেবক হওয়ার আবেদন
                                            </p>

                                            <h3 className="mt-1 font-bengali text-xl font-semibold">
                                                মানুষের পাশে দাঁড়াতে প্রস্তুত?
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="mt-5 font-bengali text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                                        আপনার নিবন্ধিত ব্যক্তিগত অ্যাকাউন্ট
                                        ব্যবহার করে আবেদনটি পাঠান। পর্যালোচনার
                                        জন্য আবেদনটি আমাদের প্রশাসনিক দলের কাছে
                                        পাঠানো হবে।
                                    </p>

                                    {user?.name && (
                                        <p className="mt-4 font-bengali text-sm font-medium! text-foreground">
                                            আবেদন করছেন:{' '}
                                            <span className="text-primary">
                                                {user.name}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleApply}
                                    disabled={submitting}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 font-bengali text-sm font-semibold text-white! transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                            আবেদন পাঠানো হচ্ছে...
                                        </>
                                    ) : (
                                        'আবেদন পাঠান'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-4 font-bengali text-sm text-red-700">
                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />

                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default VolunteerForm;

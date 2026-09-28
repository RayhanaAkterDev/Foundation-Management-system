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
                                'Unable to load your volunteer status.',
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

                setError('Please log in to submit a volunteer application.');
            } else if (err.status === 403) {
                setError(
                    err.message ||
                        'Only eligible individual accounts can apply to become a volunteer.',
                );
            } else {
                setError(
                    err.message ||
                        'Unable to submit your application right now.',
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
                <div className="mb-10 text-center sm:mb-14">
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary sm:text-sm sm:tracking-[0.3em]">
                        Join Us
                    </span>

                    <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
                        Become a volunteer
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
                        Your account already contains the information we need.
                        Submit an application and our team will review it.
                    </p>
                </div>

                <div className="mx-auto max-w-2xl">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-border/70 bg-background/70 px-6 py-14 text-center shadow-sm">
                            <Loader2
                                size={28}
                                className="animate-spin text-primary"
                            />

                            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                                Checking your volunteer status...
                            </p>
                        </div>
                    ) : isGuest ? (
                        <div className="rounded-3xl border border-border/70 bg-background/70 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UserCheck size={26} />
                            </div>

                            <h3 className="mt-6 text-xl font-semibold sm:text-2xl">
                                Log in to apply
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Volunteer applications are available to
                                registered individual accounts. Log in to
                                continue with your application.
                            </p>

                            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link
                                    to="/account/login?role=individual"
                                    state={{
                                        from: '/volunteer',
                                    }}
                                    className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                                >
                                    Log In
                                </Link>

                                <Link
                                    to="/account/register"
                                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                                >
                                    Create Account
                                </Link>
                            </div>
                        </div>
                    ) : isActiveVolunteer ? (
                        <div className="rounded-3xl border border-primary/20 bg-primary/5 px-6 py-10 text-center sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CheckCircle2 size={28} />
                            </div>

                            <h3 className="mt-6 text-xl font-semibold sm:text-2xl">
                                You are already a volunteer
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Your volunteer profile is active. You can manage
                                your volunteer activities from your dashboard.
                            </p>

                            <Link
                                to="/individual/dashboard/volunteer"
                                className="mt-7 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                            >
                                Open Volunteer Dashboard
                            </Link>
                        </div>
                    ) : isPending ? (
                        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 px-6 py-10 text-center sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                                <Clock3 size={28} />
                            </div>

                            <h3 className="mt-6 text-xl font-semibold sm:text-2xl">
                                Application under review
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Your volunteer application has already been
                                submitted. Our admin team will review it and
                                update your volunteer status.
                            </p>

                            <Link
                                to="/individual/dashboard/volunteer"
                                className="mt-7 inline-flex items-center justify-center rounded-full border border-primary/20 bg-background px-7 py-3 text-sm font-semibold text-primary transition hover:border-primary"
                            >
                                View Application Status
                            </Link>
                        </div>
                    ) : isInactiveVolunteer ? (
                        <div className="rounded-3xl border border-border/70 bg-background/70 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UserCheck size={26} />
                            </div>

                            <h3 className="mt-6 text-xl font-semibold sm:text-2xl">
                                Your volunteer profile is inactive
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                                You already have a volunteer profile. You can
                                request reactivation from your volunteer
                                dashboard.
                            </p>

                            <Link
                                to="/individual/dashboard/volunteer"
                                className="mt-7 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
                            >
                                Open Volunteer Dashboard
                            </Link>
                        </div>
                    ) : isSuspendedVolunteer ? (
                        <div className="rounded-3xl border border-border/70 bg-background/70 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <AlertCircle size={26} />
                            </div>

                            <h3 className="mt-6 text-xl font-semibold sm:text-2xl">
                                Your volunteer profile is suspended
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Your existing volunteer profile is currently
                                suspended. Please contact the admin team if you
                                need assistance.
                            </p>

                            <Link
                                to="/individual/dashboard/volunteer"
                                className="mt-7 inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                            >
                                Open Volunteer Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-border/70 bg-background/70 px-6 py-10 shadow-sm sm:px-10 sm:py-12">
                            <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                                <div className="max-w-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <UserCheck size={22} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                                                Volunteer Application
                                            </p>

                                            <h3 className="mt-1 text-xl font-semibold">
                                                Ready to make a difference?
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                                        Submit your application using your
                                        registered individual account. Your
                                        application will be sent to the admin
                                        team for review.
                                    </p>

                                    {user?.name && (
                                        <p className="mt-4 text-sm font-medium text-foreground">
                                            Applying as{' '}
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
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-4 text-sm text-red-700">
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

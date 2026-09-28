import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import Button from '@/components/Button';

import { apiRequest } from '@/api/client';

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

const RequestForm = ({ setSuccess }) => {
    const [user, setUser] = useState(getStoredUser);
    const [form, setForm] = useState({
        description: '',
        name: '',
        phone: '',
        location: '',
        urgencyHint: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    useEffect(() => {
        const syncAuth = () => {
            setUser(getStoredUser());
        };

        window.addEventListener('auth-changed', syncAuth);
        window.addEventListener('storage', syncAuth);

        return () => {
            window.removeEventListener('auth-changed', syncAuth);
            window.removeEventListener('storage', syncAuth);
        };
    }, []);

    const isLoggedIn = Boolean(getStoredToken() && user);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            return;
        }

        if (!form.description.trim()) {
            setError({
                description: 'Please describe your situation.',
            });

            return;
        }

        setError({});
        setLoading(true);

        try {
            await apiRequest('/help-requests', {
                method: 'POST',
                body: {
                    description: form.description.trim(),
                    name: form.name.trim() || undefined,
                    phone: form.phone.trim() || undefined,
                    location: form.location.trim() || undefined,
                    urgency: form.urgencyHint || undefined,
                },
            });

            setForm({
                description: '',
                name: '',
                phone: '',
                location: '',
                urgencyHint: '',
            });

            setSuccess(true);
        } catch (err) {
            console.error('Failed to submit help request:', err);

            setError({
                submit:
                    err?.message ||
                    'Unable to submit your request. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div
                className="
                    flex
                    min-h-[420px]
                    w-full
                    flex-col
                    items-center
                    justify-center
                    bg-surface
                    border-l
                    border-border
                    px-5
                    py-12
                    text-center
                    sm:min-h-[500px]
                    sm:px-8
                    lg:px-12
                "
            >
                <div
                    className="
                        flex
                        size-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-primary/10
                        text-primary
                        sm:size-16
                    "
                >
                    <span className="text-2xl sm:text-3xl">🔒</span>
                </div>

                <h2
                    className="
                        mt-5
                        text-xl
                        font-semibold
                        text-text-primary
                        sm:text-2xl
                    "
                >
                    সাহায্যের অনুরোধ পাঠাতে লগইন করুন
                </h2>

                <p
                    className="
                        mt-3
                        max-w-md
                        text-sm
                        leading-7
                        text-text-secondary
                        sm:text-base
                    "
                >
                    সাহায্যের অনুরোধ পাঠানোর জন্য একটি নিবন্ধিত অ্যাকাউন্টে লগইন
                    করতে হবে। আপনার অনুরোধ নিরাপদভাবে আপনার অ্যাকাউন্টের সঙ্গে
                    সংযুক্ত থাকবে।
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                        to="/account/login"
                        state={{
                            from: '/request-help',
                        }}
                    >
                        <Button size="lg">লগইন করুন</Button>
                    </Link>

                    <Link to="/account/register?role=individual">
                        <Button variant="outline" size="lg">
                            অ্যাকাউন্ট তৈরি করুন
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="
                w-full
                border-l
                border-border
                bg-surface
                p-5
                sm:p-7
                lg:p-10
            "
        >
            {/* HEADER */}
            <div>
                <h2
                    className="
                        text-xl
                        font-semibold
                        text-text-primary
                        sm:text-2xl
                        lg:text-3xl
                    "
                >
                    Tell us what happened
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Your request will be reviewed carefully and matched with
                    appropriate support.
                </p>
            </div>

            {/* STORY */}
            <div className="mt-6 sm:mt-8 lg:mt-10">
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Describe your situation..."
                    className="
                        w-full
                        rounded-xl
                        border
                        border-border
                        bg-background
                        p-4
                        text-sm
                        leading-7
                        focus:border-primary
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/10
                        sm:rounded-2xl
                        sm:p-5
                    "
                />

                {error.description && (
                    <p className="mt-2 text-sm text-accent">
                        {error.description}
                    </p>
                )}
            </div>

            {/* OPTIONAL DETAILS */}
            <div
                className="
                    mt-6
                    grid
                    grid-cols-1
                    gap-3
                    sm:mt-8
                    sm:grid-cols-2
                    sm:gap-4
                "
            >
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="
                        h-11
                        rounded-xl
                        border
                        border-border
                        bg-background
                        px-3
                        text-sm
                        focus:border-primary
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/10
                        sm:h-12
                        sm:px-4
                    "
                />

                <input
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="
                        h-11
                        rounded-xl
                        border
                        border-border
                        bg-background
                        px-3
                        text-sm
                        focus:border-primary
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/10
                        sm:h-12
                        sm:px-4
                    "
                />

                <input
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    className="
                        h-11
                        rounded-xl
                        border
                        border-border
                        bg-background
                        px-3
                        text-sm
                        focus:border-primary
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/10
                        sm:h-12
                        sm:px-4
                    "
                />

                <select
                    name="urgencyHint"
                    value={form.urgencyHint}
                    onChange={handleChange}
                    className="
                        h-11
                        rounded-xl
                        border
                        border-border
                        bg-background
                        px-3
                        text-sm
                        focus:border-primary
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/10
                        sm:h-12
                        sm:px-4
                    "
                >
                    <option value="">Urgency</option>
                    <option value="low">Low</option>
                    <option value="normal">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
            </div>

            {error.submit && (
                <p className="mt-4 text-sm text-accent">{error.submit}</p>
            )}

            {/* FOOTER */}
            <div
                className="
                    mt-8
                    flex
                    flex-col
                    gap-4
                    border-t
                    border-border
                    pt-5
                    sm:mt-10
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:pt-6
                "
            >
                <p className="text-xs text-text-secondary">
                    Secure & confidential review process
                </p>

                <Button disabled={loading} type="submit">
                    {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
            </div>
        </form>
    );
};

export default RequestForm;

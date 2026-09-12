import React, { useEffect, useState } from 'react';

import {
    Save,
    MapPin,
    Mail,
    Phone,
    UserRound,
    CalendarDays,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

const API_URL = 'http://127.0.0.1:8000/api';

const Field = ({ label, children, className = '' }) => (
    <div className={`min-w-0 ${className}`}>
        <label className="mb-2 block text-[13px] font-medium text-text-primary">
            {label}
        </label>
        {children}
    </div>
);

const inputCls =
    'h-11 w-full rounded-[7px] border border-[#d9e1dd] bg-[#fcfdfc] px-3.5 text-[14px] text-[#17211e] placeholder-[#8b9691] outline-none transition-all duration-200 hover:border-[#cbd6d1] focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/10';

const getToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

const formatMemberSince = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '—';
    }

    return parsedDate.toLocaleDateString('en-BD', {
        month: 'long',
        year: 'numeric',
    });
};

const IndividualProfile = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        district: '',
        address: '',
    });

    const [memberSince, setMemberSince] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');

                const token = getToken();

                if (!token) {
                    throw new Error(
                        'Your session has expired. Please log in again.',
                    );
                }

                const response = await fetch(`${API_URL}/user`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Unable to load your profile.',
                    );
                }

                const user = data.user;

                const profile =
                    user?.individual_profile || user?.individualProfile || {};

                setForm({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    date_of_birth: profile.date_of_birth || '',
                    district: profile.district || '',
                    address: profile.address || '',
                });

                setMemberSince(user?.created_at || null);
            } catch (err) {
                console.error('Individual profile error:', err);
                setError(err.message || 'Unable to load your profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));

        setError('');
        setSuccess('');
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const token = getToken();

            if (!token) {
                throw new Error(
                    'Your session has expired. Please log in again.',
                );
            }

            const currentStoredUser = JSON.parse(
                localStorage.getItem('user') ||
                    sessionStorage.getItem('user') ||
                    'null',
            );

            const currentEmail = currentStoredUser?.email || '';
            const newEmail = form.email.trim();

            const emailChanged =
                currentEmail.toLowerCase() !== newEmail.toLowerCase();

            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: newEmail,
                    phone: form.phone.trim(),
                    date_of_birth: form.date_of_birth,
                    district: form.district.trim(),
                    address: form.address.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const firstError = Object.values(data.errors)
                        .flat()
                        .find(Boolean);

                    throw new Error(
                        firstError ||
                            data.message ||
                            'Unable to update your profile.',
                    );
                }

                throw new Error(
                    data.message || 'Unable to update your profile.',
                );
            }

            const updatedUser = data.user;

            const updatedProfile =
                updatedUser?.individual_profile ||
                updatedUser?.individualProfile ||
                {};

            setForm({
                name: updatedUser?.name || '',
                email: updatedUser?.email || '',
                phone: updatedUser?.phone || '',
                date_of_birth: updatedProfile.date_of_birth || '',
                district: updatedProfile.district || '',
                address: updatedProfile.address || '',
            });

            setMemberSince(updatedUser?.created_at || memberSince);

            const storage = localStorage.getItem('auth_token')
                ? localStorage
                : sessionStorage;

            const existingUser = JSON.parse(storage.getItem('user') || 'null');

            storage.setItem(
                'user',
                JSON.stringify({
                    ...existingUser,
                    ...updatedUser,
                    individualProfile: updatedProfile,
                }),
            );

            if (emailChanged) {
                // The backend has made the account inactive
                // until the new email is verified.

                const verificationMethod =
                    updatedUser?.verification_method ||
                    currentStoredUser?.verification_method ||
                    'email';

                const userId = updatedUser?.id || currentStoredUser?.id;

                storage.removeItem('auth_token');
                storage.removeItem('user');

                if (storage === localStorage) {
                    sessionStorage.removeItem('auth_token');
                    sessionStorage.removeItem('user');
                } else {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                }

                if (verificationMethod === 'demo' && userId) {
                    window.location.href = `/email-verification?status=demo&user_id=${userId}`;
                } else {
                    window.location.href = '/email-verification?status=email';
                }

                return;
            }

            setSuccess('Your profile has been updated successfully.');
        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.message || 'Unable to update your profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="My Profile"
                    subtitle="Manage your personal information and account details."
                />

                <div className="border-y border-border bg-surface">
                    <div className="px-5 py-7 sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 animate-pulse rounded-full bg-background-alt" />

                            <div className="space-y-2">
                                <div className="h-5 w-40 animate-pulse bg-background-alt" />
                                <div className="h-3 w-32 animate-pulse bg-background-alt" />
                            </div>
                        </div>

                        <div className="mt-9 grid gap-x-8 gap-y-6 md:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="space-y-2">
                                    <div className="h-3 w-20 animate-pulse bg-background-alt" />
                                    <div className="h-11 animate-pulse bg-background-alt" />
                                </div>
                            ))}

                            <div className="space-y-2 md:col-span-2">
                                <div className="h-3 w-20 animate-pulse bg-background-alt" />
                                <div className="h-24 animate-pulse bg-background-alt" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const firstLetter = form.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Profile"
                subtitle="Manage your personal information and account details."
            />

            <div className="border-y border-border bg-surface">
                {/* Profile summary */}
                <div className="border-b border-border px-5 py-7 sm:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white shadow-sm">
                                {firstLetter}
                            </div>

                            <div className="min-w-0">
                                <h2 className="truncate text-xl font-semibold tracking-[-0.02em] text-text-primary">
                                    {form.name || 'User'}
                                </h2>

                                <p className="mt-1 text-sm text-text-secondary">
                                    Member since{' '}
                                    {formatMemberSince(memberSince)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <CalendarDays
                                size={16}
                                strokeWidth={1.8}
                                className="text-primary"
                            />

                            <span>Personal account</span>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {(error || success) && (
                    <div className="px-5 pt-6 sm:px-8">
                        {error && (
                            <div className="border-l-[3px] border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="border-l-[3px] border-green-500 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {success}
                            </div>
                        )}
                    </div>
                )}

                {/* Profile information */}
                <div className="px-5 py-8 sm:px-8">
                    <div className="mb-7 max-w-2xl">
                        <h3 className="text-base font-semibold text-text-primary">
                            Personal information
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-text-secondary">
                            Update the information associated with your Stand
                            For People account.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
                        {/* Name */}
                        <Field label="Full Name">
                            <div className="relative">
                                <UserRound
                                    size={17}
                                    strokeWidth={1.8}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                />

                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        handleChange('name', e.target.value)
                                    }
                                    className={`${inputCls} pl-10.5`}
                                />
                            </div>
                        </Field>

                        {/* Email */}
                        <Field label="Email Address">
                            <div className="relative">
                                <Mail
                                    size={17}
                                    strokeWidth={1.8}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                />

                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        handleChange('email', e.target.value)
                                    }
                                    className={`${inputCls} pl-10.5`}
                                />
                            </div>
                        </Field>

                        {/* Phone */}
                        <Field label="Phone Number">
                            <div className="relative">
                                <Phone
                                    size={17}
                                    strokeWidth={1.8}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                />

                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) =>
                                        handleChange('phone', e.target.value)
                                    }
                                    className={`${inputCls} pl-10.5`}
                                />
                            </div>
                        </Field>

                        {/* Date of birth */}
                        <Field label="Date of Birth">
                            <div className="relative">
                                <CalendarDays
                                    size={17}
                                    strokeWidth={1.8}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                />

                                <input
                                    type="date"
                                    value={form.date_of_birth}
                                    onChange={(e) =>
                                        handleChange(
                                            'date_of_birth',
                                            e.target.value,
                                        )
                                    }
                                    className={`${inputCls} pl-10.5`}
                                />
                            </div>
                        </Field>

                        {/* District */}
                        <Field label="District">
                            <div className="relative">
                                <MapPin
                                    size={17}
                                    strokeWidth={1.8}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                                />

                                <input
                                    type="text"
                                    value={form.district}
                                    onChange={(e) =>
                                        handleChange('district', e.target.value)
                                    }
                                    className={`${inputCls} pl-10.5`}
                                />
                            </div>
                        </Field>

                        {/* Account info */}
                        <div>
                            <label className="mb-2 block text-[13px] font-medium text-text-primary">
                                Account Details
                            </label>

                            <div className="flex h-11 items-center rounded-lg border border-border bg-background-alt px-3.5">
                                <span className="text-sm text-text-secondary">
                                    Member since
                                </span>

                                <span className="ml-1.5 text-sm font-medium text-text-primary">
                                    {formatMemberSince(memberSince)}
                                </span>
                            </div>
                        </div>

                        {/* Address */}
                        <Field label="Address" className="lg:col-span-2">
                            <div className="relative">
                                <MapPin
                                    size={17}
                                    strokeWidth={1.8}
                                    className="pointer-events-none absolute left-3.5 top-4 text-text-secondary"
                                />

                                <textarea
                                    rows={4}
                                    value={form.address}
                                    onChange={(e) =>
                                        handleChange('address', e.target.value)
                                    }
                                    className="
                                        w-full resize-none
                                        rounded-lg
                                        border border-border
                                        bg-surface
                                        py-3 pl-10.5 pr-3.5
                                        text-[14px] text-text-primary
                                        outline-none
                                        transition-all
                                        placeholder:text-text-secondary/60
                                        hover:border-slate-300
                                        focus:border-primary
                                        focus:ring-[3px]
                                        focus:ring-primary/10
                                    "
                                />
                            </div>
                        </Field>
                    </div>
                </div>

                {/* Save area */}
                <div className="flex flex-col gap-4 border-t border-border bg-background-alt/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p className="text-sm text-text-secondary">
                        Make sure your information is correct before saving your
                        changes.
                    </p>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="
                            inline-flex h-10 items-center justify-center gap-2
                            bg-primary px-5
                            text-sm font-semibold text-white
                            shadow-sm
                            transition-all
                            hover:bg-primary-hover
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        <Save size={16} strokeWidth={1.9} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IndividualProfile;

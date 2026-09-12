import React, { useEffect, useState } from 'react';
import {
    Save,
    Mail,
    Phone,
    UserRound,
    CalendarDays,
    ShieldCheck,
} from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';

const API_URL = 'http://127.0.0.1:8000/api';

const Field = ({ label, children }) => (
    <div className="space-y-2">
        <label className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#64716c]">
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

const Profile = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
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

                setForm({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                });

                setMemberSince(user?.created_at || null);
            } catch (err) {
                console.error('Admin profile error:', err);

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

            const response = await fetch(`${API_URL}/profile`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
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

            setForm({
                name: updatedUser?.name || '',
                email: updatedUser?.email || '',
                phone: updatedUser?.phone || '',
            });

            setMemberSince(updatedUser?.created_at || memberSince);

            // Keep the locally stored logged-in user synchronized.
            const storage = localStorage.getItem('auth_token')
                ? localStorage
                : sessionStorage;

            const existingUser = JSON.parse(storage.getItem('user') || 'null');

            storage.setItem(
                'user',
                JSON.stringify({
                    ...existingUser,
                    ...updatedUser,
                }),
            );

            setSuccess('Your profile has been updated successfully.');
        } catch (err) {
            console.error('Admin profile update error:', err);

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

                <div className="overflow-hidden border-y border-[#e1e7e4] bg-white">
                    <div className="border-b border-[#e7ece9] bg-[#fafcfb] px-5 py-7 sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 animate-pulse rounded-full bg-[#e8eeeb]" />

                            <div className="space-y-2">
                                <div className="h-4 w-36 animate-pulse rounded bg-[#e8eeeb]" />
                                <div className="h-3 w-52 animate-pulse rounded bg-[#eef2f0]" />
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-7 sm:px-8">
                        <div className="mb-6 space-y-2">
                            <div className="h-4 w-40 animate-pulse rounded bg-[#e8eeeb]" />
                            <div className="h-3 w-64 animate-pulse rounded bg-[#eef2f0]" />
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="space-y-2">
                                    <div className="h-3 w-20 animate-pulse rounded bg-[#e8eeeb]" />
                                    <div className="h-11 animate-pulse rounded-[7px] bg-[#f1f4f2]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const firstLetter = form.name?.trim()?.charAt(0)?.toUpperCase() || 'A';

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Profile"
                subtitle="Manage your personal information and account details."
            />

            <div className="overflow-hidden border-y border-[#dfe6e2] bg-white">
                {/* Profile Header */}
                <div className="relative border-b border-[#e3e9e6] bg-[#f8faf9] px-5 py-7 sm:px-8">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white shadow-[0_4px_12px_rgba(15,118,110,0.16)]">
                                    {firstLetter}
                                </div>

                                <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#f8faf9] bg-white">
                                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                                </div>
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h2 className="truncate text-[18px] font-semibold tracking-[-0.01em] text-[#17211e]">
                                        {form.name || 'Admin'}
                                    </h2>

                                    <span className="inline-flex items-center gap-1.5 border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                                        <ShieldCheck
                                            size={13}
                                            strokeWidth={2}
                                        />
                                        Administrator
                                    </span>
                                </div>

                                <p className="mt-1 text-[13px] text-[#697570]">
                                    Member since{' '}
                                    <span className="font-medium text-[#4f5b56]">
                                        {formatMemberSince(memberSince)}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="hidden border-l border-[#dfe6e2] pl-6 sm:block">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#89938f]">
                                Account status
                            </p>

                            <div className="mt-1.5 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary" />

                                <span className="text-[13px] font-medium text-[#34413c]">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-5 py-8 sm:px-8">
                    {/* Feedback */}
                    {error && (
                        <div className="mb-7 flex items-start gap-3 border border-red-200 bg-red-50/70 px-4 py-3.5">
                            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                            <p className="text-[13px] leading-5 text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-7 flex items-start gap-3 border border-green-200 bg-green-50/70 px-4 py-3.5">
                            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />

                            <p className="text-[13px] leading-5 text-green-700">
                                {success}
                            </p>
                        </div>
                    )}

                    {/* Section Heading */}
                    <div className="mb-6 flex items-start justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="h-5 w-1 bg-primary" />

                                <h3 className="text-[15px] font-semibold text-[#17211e]">
                                    Account Information
                                </h3>
                            </div>

                            <p className="mt-1.5 pl-3.5 text-[12px] leading-5 text-[#7a8581]">
                                Keep your administrator account information
                                accurate and up to date.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="grid gap-x-7 gap-y-6 md:grid-cols-2">
                        <Field label="Full Name">
                            <div className="group relative">
                                <UserRound
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4.25 w-4.25 -translate-y-1/2 text-[#87928d] transition-colors group-focus-within:text-primary"
                                    strokeWidth={1.8}
                                />

                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        handleChange('name', e.target.value)
                                    }
                                    className={`${inputCls} pl-11`}
                                />
                            </div>
                        </Field>

                        <Field label="Email Address">
                            <div className="group relative">
                                <Mail
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4.25 w-4.25 -translate-y-1/2 text-[#87928d] transition-colors group-focus-within:text-primary"
                                    strokeWidth={1.8}
                                />

                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        handleChange('email', e.target.value)
                                    }
                                    className={`${inputCls} pl-11`}
                                />
                            </div>
                        </Field>

                        <Field label="Phone Number">
                            <div className="group relative">
                                <Phone
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4.25 w-4.25 -translate-y-1/2 text-[#87928d] transition-colors group-focus-within:text-primary"
                                    strokeWidth={1.8}
                                />

                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) =>
                                        handleChange('phone', e.target.value)
                                    }
                                    className={`${inputCls} pl-11`}
                                />
                            </div>
                        </Field>

                        <Field label="Member Since">
                            <div className="relative">
                                <CalendarDays
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4.25 w-4.25 -translate-y-1/2 text-[#87928d]"
                                    strokeWidth={1.8}
                                />

                                <div
                                    className={`${inputCls} flex cursor-default items-center pl-11 text-[#5f6b67]`}
                                >
                                    {formatMemberSince(memberSince)}
                                </div>
                            </div>
                        </Field>
                    </div>

                    {/* Footer */}
                    <div className="mt-9 flex flex-col gap-4 border-t border-[#e4e9e7] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-[12px] font-medium text-[#697570]">
                                Administrator account
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#929b97]">
                                Your changes will be saved to your account.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="
                                inline-flex h-10 items-center justify-center gap-2
                                bg-primary px-5
                                text-[13px] font-semibold text-white
                                shadow-sm
                                transition-all duration-200
                                hover:bg-primary-hover
                                hover:shadow-[0_3px_10px_rgba(15,118,110,0.14)]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                disabled:shadow-none
                            "
                        >
                            <Save className="h-4 w-4" strokeWidth={1.9} />

                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

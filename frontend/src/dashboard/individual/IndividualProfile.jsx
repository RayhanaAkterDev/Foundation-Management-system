import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';

const API_URL = 'http://127.0.0.1:8000/api';

const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-primary">
            {label}
        </label>

        {children}
    </div>
);

const inputCls =
    'h-11 w-full rounded-xl border border-[#e5e7eb] px-3 text-sm text-text-primary placeholder-[#6b7280] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

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
                    phone: profile.phone || '',
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
                phone: updatedProfile.phone || '',
                district: updatedProfile.district || '',
                address: updatedProfile.address || '',
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
                    individualProfile: updatedProfile,
                }),
            );

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

                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                    <p className="text-sm text-[#6b7280]">
                        Loading your profile...
                    </p>
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

            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                {/* Avatar */}
                <div className="mb-6 flex items-center gap-4">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                        {firstLetter}
                    </span>

                    <div>
                        <p className="font-['Fraunces'] text-base font-semibold text-text-primary">
                            {form.name || 'Individual'}
                        </p>

                        <p className="text-sm text-[#6b7280]">
                            Individual · Member since{' '}
                            {formatMemberSince(memberSince)}
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {success}
                    </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Full Name">
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                handleChange('name', e.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Email Address">
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                handleChange('email', e.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Phone Number">
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                                handleChange('phone', e.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>

                    <Field label="District">
                        <input
                            type="text"
                            value={form.district}
                            onChange={(e) =>
                                handleChange('district', e.target.value)
                            }
                            className={inputCls}
                        />
                    </Field>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="block text-sm font-medium text-text-primary">
                            Address
                        </label>

                        <textarea
                            rows={3}
                            value={form.address}
                            onChange={(e) =>
                                handleChange('address', e.target.value)
                            }
                            className="w-full resize-none rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm text-text-primary placeholder-[#6b7280] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <div className="mt-6 border-t border-[#e5e7eb] pt-5">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save className="h-4 w-4" />

                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Preferences summary */}
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-['Fraunces'] text-base font-semibold text-text-primary">
                    Preferences
                </h2>

                <p className="text-sm text-[#6b7280]">
                    Participation preferences and causes will appear here once
                    they are configured for your account.
                </p>
            </div>
        </div>
    );
};

export default IndividualProfile;

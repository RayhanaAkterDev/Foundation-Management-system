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

const Field = ({ label, children }) => (
    <div className="space-y-2">
        <label className="block text-[13px] font-medium tracking-[0.01em] text-[#334155]">
            {label}
        </label>

        {children}
    </div>
);

const inputCls =
    'h-11 w-full rounded-[8px] border border-[#dfe5e2] bg-[#fbfcfb] px-3.5 text-[14px] text-[#17211e] placeholder-[#8b9691] outline-none transition-all focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/10';

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

                    // Phone now comes from users.phone.
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

                // Phone now comes from users.phone.
                phone: updatedUser?.phone || '',

                date_of_birth: updatedProfile.date_of_birth || '',

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

                <div className="border-y border-[#e2e8e5] bg-white">
                    <div className="px-5 py-8 sm:px-8">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 animate-pulse rounded-full bg-[#e8eeeb]" />

                            <div className="space-y-2">
                                <div className="h-4 w-36 animate-pulse rounded bg-[#e8eeeb]" />
                                <div className="h-3 w-52 animate-pulse rounded bg-[#eef2f0]" />
                            </div>
                        </div>

                        <div className="mt-8 grid gap-5 md:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="space-y-2">
                                    <div className="h-3 w-20 animate-pulse rounded bg-[#e8eeeb]" />
                                    <div className="h-11 animate-pulse rounded-lg bg-[#f1f4f2]" />
                                </div>
                            ))}
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

            <div className="border-y border-[#e2e8e5] bg-white">
                <div className="px-5 py-8 sm:px-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                            {firstLetter}
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-[#17211e]">
                                {form.name || 'User'}
                            </h2>

                            <p className="text-sm text-[#6b7280]">
                                Member since {formatMemberSince(memberSince)}
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        <Field label="Full Name">
                            <div className="relative">
                                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />

                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        handleChange('name', e.target.value)
                                    }
                                    className={`${inputCls} pl-10`}
                                />
                            </div>
                        </Field>

                        <Field label="Email">
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />

                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        handleChange('email', e.target.value)
                                    }
                                    className={`${inputCls} pl-10`}
                                />
                            </div>
                        </Field>

                        <Field label="Phone">
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />

                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) =>
                                        handleChange('phone', e.target.value)
                                    }
                                    className={`${inputCls} pl-10`}
                                />
                            </div>
                        </Field>

                        <Field label="Date of Birth">
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />

                                <input
                                    type="date"
                                    value={form.date_of_birth}
                                    onChange={(e) =>
                                        handleChange(
                                            'date_of_birth',
                                            e.target.value,
                                        )
                                    }
                                    className={`${inputCls} pl-10`}
                                />
                            </div>
                        </Field>

                        <Field label="District">
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />

                                <input
                                    type="text"
                                    value={form.district}
                                    onChange={(e) =>
                                        handleChange('district', e.target.value)
                                    }
                                    className={`${inputCls} pl-10`}
                                />
                            </div>
                        </Field>

                        <Field label="Address">
                            <textarea
                                rows={3}
                                value={form.address}
                                onChange={(e) =>
                                    handleChange('address', e.target.value)
                                }
                                className="w-full resize-none rounded-lg border border-[#dfe5e2] bg-[#fbfcfb] px-3.5 py-3 text-[14px] text-[#17211e] placeholder-[#8b9691] outline-none transition-all focus:border-primary focus:bg-white focus:ring-[3px] focus:ring-primary/10"
                            />
                        </Field>
                    </div>

                    <div className="mt-8 border-t border-[#e2e8e5] pt-5">
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
            </div>
        </div>
    );
};

export default IndividualProfile;

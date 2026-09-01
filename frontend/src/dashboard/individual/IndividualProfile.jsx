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
                    phone: profile.phone || '',
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
                phone: updatedProfile.phone || '',
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
        <div className="space-y-7">
            <PageHeader
                title="My Profile"
                subtitle="Manage your personal information and account details."
            />

            {/* PROFILE AREA */}
            <section className="overflow-hidden border-y border-[#dfe6e3] bg-white">
                <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
                    {/* PROFILE IDENTITY */}
                    <aside className="relative border-b border-[#e2e8e5] bg-[#f2f6f4] px-6 py-7 lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
                        <div className="relative">
                            <div className="flex h-17 w-17 items-center justify-center rounded-full border border-[#c9d9d3] bg-white text-[24px] font-semibold text-primary shadow-[0_2px_8px_rgba(15,118,110,0.06)]">
                                {firstLetter}
                            </div>

                            <div className="mt-5">
                                <h2 className="font-['Fraunces'] text-[20px] font-semibold leading-tight text-[#17211e]">
                                    {form.name || 'Individual'}
                                </h2>

                                <p className="mt-1 text-[13px] text-[#64716c]">
                                    Individual member
                                </p>
                            </div>

                            <div className="mt-7 border-t border-[#d9e3df] pt-5">
                                <div className="flex items-start gap-3">
                                    <CalendarDays className="mt-0.5 h-3.75 w-3.75 shrink-0 text-[#6b817a]" />

                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#82908b]">
                                            Member since
                                        </p>

                                        <p className="mt-1 text-[13px] font-medium text-[#34413d]">
                                            {formatMemberSince(memberSince)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {form.email && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-3.75 w-3.75 shrink-0 text-[#71827c]" />

                                        <span className="min-w-0 break-all text-[12px] leading-5 text-[#596761]">
                                            {form.email}
                                        </span>
                                    </div>
                                )}

                                {form.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-3.75 w-3.75 shrink-0 text-[#71827c]" />

                                        <span className="text-[12px] text-[#596761]">
                                            {form.phone}
                                        </span>
                                    </div>
                                )}

                                {form.district && (
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-3.75 w-3.75 shrink-0 text-[#71827c]" />

                                        <span className="text-[12px] text-[#596761]">
                                            {form.district}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* FORM */}
                    <div className="min-w-0">
                        {/* HEADER */}
                        <div className="relative overflow-hidden border-b border-[#e3e9e6] bg-[#fcfdfc] px-6 py-6 sm:px-8">
                            <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-linear-to-l from-[#f0f6f3] to-transparent opacity-70" />

                            <div className="relative flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dce8e3] bg-[#edf5f1]">
                                    <UserRound className="h-4.5 w-4.5 text-primary" />
                                </div>

                                <div className="min-w-0 pt-0.5">
                                    <h2 className="font-['Fraunces'] text-[25px] font-semibold leading-none tracking-tight text-[#17211e]">
                                        Personal information
                                    </h2>

                                    <p className="mt-2 text-[13px] leading-5 text-[#78837f]">
                                        Keep your contact details and personal
                                        information up to date.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FORM BODY */}
                        <div className="px-6 py-8 sm:px-8 sm:py-9">
                            {/* ERROR */}
                            {error && (
                                <div className="mb-7 flex items-start gap-3 border border-red-100 bg-red-50/70 px-4 py-3.5 text-[13px] leading-5 text-red-700">
                                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* SUCCESS */}
                            {success && (
                                <div className="mb-7 flex items-start gap-3 border border-[#cfe7df] bg-[#f0f8f5] px-4 py-3.5 text-[13px] leading-5 text-[#176b61]">
                                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    <span>{success}</span>
                                </div>
                            )}

                            <div className="space-y-9">
                                {/* BASIC INFORMATION */}
                                <section>
                                    <div className="mb-5 flex items-end gap-4">
                                        <div className="shrink-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                                                Profile details
                                            </p>

                                            <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-[#1b2723]">
                                                Basic information
                                            </h3>
                                        </div>

                                        <div className="mb-1.25 h-px flex-1 bg-[#e6ece9]" />
                                    </div>

                                    <div className="space-y-5">
                                        {/* NAME + EMAIL */}
                                        <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                                            <Field label="Full Name">
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputCls}
                                                />
                                            </Field>

                                            <Field label="Email Address">
                                                <input
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputCls}
                                                />
                                            </Field>
                                        </div>

                                        {/* PHONE + DOB + DISTRICT */}
                                        <div className="grid gap-x-6 gap-y-5 md:grid-cols-3">
                                            <Field label="Phone Number">
                                                <input
                                                    type="tel"
                                                    value={form.phone}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            'phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputCls}
                                                />
                                            </Field>

                                            <Field label="Date of Birth">
                                                <input
                                                    type="date"
                                                    value={form.date_of_birth}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            'date_of_birth',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputCls}
                                                />
                                            </Field>

                                            <Field label="District">
                                                <input
                                                    type="text"
                                                    value={form.district}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            'district',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={inputCls}
                                                />
                                            </Field>
                                        </div>
                                    </div>
                                </section>

                                {/* LOCATION */}
                                <section className="border-t border-[#e5ebe8] pt-8">
                                    <div className="mb-5 flex items-end gap-4">
                                        <div className="shrink-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                                                Residence
                                            </p>

                                            <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-[#1b2723]">
                                                Location details
                                            </h3>
                                        </div>

                                        <div className="mb-1.25 h-px flex-1 bg-[#e6ece9]" />
                                    </div>

                                    {/* ADDRESS PANEL */}
                                    <div className="rounded-xl border border-[#e1e8e4] bg-[#fcfdfc] p-5 sm:p-6">
                                        <div className="mb-5">
                                            <h4 className="text-[14px] font-semibold text-[#26332e]">
                                                Residential address
                                            </h4>

                                            <p className="mt-1 text-[12px] leading-5 text-[#7b8682]">
                                                Add the address where you
                                                currently reside.
                                            </p>
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="block text-[12px] font-semibold tracking-[0.015em] text-[#47544f]">
                                                Address
                                            </label>

                                            <textarea
                                                rows={3}
                                                value={form.address}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'address',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full resize-none rounded-lg border border-[#d8e1dd] bg-white px-4 py-3.5 text-[14px] leading-6 text-[#17211e] placeholder-[#8b9691] outline-none transition-all duration-200 focus:border-primary focus:ring-[3px] focus:ring-primary/10"
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* ACTION BAR */}
                        <div className="flex flex-col-reverse gap-4 border-t border-[#e1e8e4] bg-[#f6f9f7] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                            <div className="flex items-start gap-2.5">
                                <div className="mt-1.25 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9aa8a2]" />

                                <p className="max-w-md text-[12px] leading-5 text-[#7c8883]">
                                    Your information is used to keep your SP
                                    account accurate and up to date.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-[13px] font-semibold text-white shadow-[0_2px_5px_rgba(18,102,94,0.15)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_4px_12px_rgba(18,102,94,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />

                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* PREFERENCES */}
            <section className="border-y border-[#dfe6e3] bg-[#f5f8f6]">
                <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
                    <div className="border-b border-[#e1e8e4] px-6 py-6 lg:border-b-0 lg:border-r lg:px-7">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#74837d]">
                            Account
                        </p>

                        <h2 className="mt-2 font-['Fraunces'] text-[18px] font-semibold text-[#17211e]">
                            Preferences
                        </h2>
                    </div>

                    <div className="flex min-h-27 items-center px-6 py-6 sm:px-8">
                        <p className="max-w-2xl text-[13px] leading-6 text-[#697670]">
                            Participation preferences and causes will appear
                            here once they are configured for your account.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default IndividualProfile;

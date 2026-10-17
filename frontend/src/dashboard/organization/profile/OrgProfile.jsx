import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import PageHeader from '@/components/dashboard/PageHeader';
import { apiRequest } from '@/api/client';

const Field = ({ label, children, className = '' }) => (
    <label className={`block min-w-0 ${className}`}>
        <span className="mb-2 block font-sans! text-[12px] font-medium! text-[#AEB7C3]!">
            {label}
        </span>
        {children}
    </label>
);

const inputCls =
    'block h-12 w-full min-w-0 rounded-none border border-[#363D47] bg-[#141920]! px-4 font-sans! text-[14px] font-normal! text-[#EDF0F3]! placeholder:text-[#778291]! shadow-none! outline-none! transition-colors hover:border-[#596473] focus:border-[#8794A4]! focus:ring-0! disabled:cursor-not-allowed disabled:opacity-50';
const textareaCls =
    'block w-full min-w-0 resize-y rounded-none border border-[#363D47] bg-[#141920]! px-4 py-3 font-sans! text-[14px] font-normal! leading-6 text-[#EDF0F3]! placeholder:text-[#778291]! shadow-none! outline-none! transition-colors hover:border-[#596473] focus:border-[#8794A4]! focus:ring-0! disabled:cursor-not-allowed disabled:opacity-50';

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    mission: '',
};

const toArray = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    return [];
};

const getErrorMessage = (error) => {
    const firstValidationError = error?.errors
        ? Object.values(error.errors).flat()[0]
        : null;

    return (
        firstValidationError ||
        error?.message ||
        'Something went wrong. Please try again.'
    );
};

const OrgProfile = () => {
    const [form, setForm] = useState(emptyForm);
    const [organization, setOrganization] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let cancelled = false;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await apiRequest('/organization/profile');
                const profile = response.organization;

                if (!profile) {
                    throw new Error(
                        'The organization profile was not returned by the server.',
                    );
                }

                if (cancelled) return;

                setOrganization(profile);

                setForm({
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    website: profile.website || '',
                    address: profile.address || '',
                    mission: profile.mission || '',
                });
            } catch (err) {
                if (!cancelled) {
                    console.error('Organization profile error:', err);
                    setError(getErrorMessage(err));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleChange = (key, value) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));

        setError('');
        setSuccess('');
    };

    const handleSave = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const response = await apiRequest('/organization/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    website: form.website.trim(),
                    address: form.address.trim(),
                    mission: form.mission.trim(),
                }),
            });

            const updatedProfile = response.organization;

            if (!updatedProfile) {
                throw new Error(
                    'The server did not return the updated organization profile.',
                );
            }

            setOrganization(updatedProfile);

            setForm({
                name: updatedProfile.name || '',
                email: updatedProfile.email || '',
                phone: updatedProfile.phone || '',
                website: updatedProfile.website || '',
                address: updatedProfile.address || '',
                mission: updatedProfile.mission || '',
            });

            setSuccess(
                response.message ||
                    'Organization profile updated successfully.',
            );
        } catch (err) {
            console.error('Organization profile update error:', err);
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const focusAreas = toArray(organization?.focus_areas);
    const communitiesServed = toArray(organization?.communities_served);

    const verificationStatus = organization?.verification_status?.toLowerCase();

    const isVerified = verificationStatus === 'verified';

    const orgInitials = (organization?.name || 'Organization')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();

    return (
        <div className="mx-auto w-full max-w-[1360px] pb-12 font-sans! text-[#EDF0F3]!">
            <PageHeader
                title="Organization Profile"
                subtitle="Manage your organization's public information and details."
            />

            {error && (
                <div
                    role="alert"
                    className="mb-5 flex items-start gap-3 border border-[#69404A] bg-[#2A2026] px-4 py-3.5 text-[13px] text-[#E5A9B1]!"
                >
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    {error}
                </div>
            )}
            {success && (
                <div
                    role="status"
                    className="mb-5 flex items-center gap-3 border border-[#375043] bg-[#1A2922] px-4 py-3.5 text-[13px] text-[#B4D9C1]!"
                >
                    <CheckCircle2 size={17} className="shrink-0" />
                    {success}
                </div>
            )}

            {loading ? (
                <div className="animate-pulse border border-[#303640] bg-[#191D23] p-8">
                    <div className="h-20 w-3/5 bg-[#282E37]" />
                    <div className="mt-10 grid gap-5 md:grid-cols-2">
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="h-12 bg-[#282E37]" />
                        ))}
                    </div>
                </div>
            ) : organization ? (
                <form
                    onSubmit={handleSave}
                    className="min-w-0 border border-[#303640] bg-[#191D23]"
                >
                    {/* A single identity header, not a separate profile card */}
                    <div className="flex flex-col gap-5 border-b border-[#303640] px-5 py-7 sm:flex-row sm:items-center sm:px-8 lg:px-10">
                        <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center overflow-hidden border border-[#424B57] bg-[#29313C] font-sans! text-[21px] font-semibold! text-[#E8EDF3]!">
                            {organization.photo ? (
                                <img
                                    src={organization.photo}
                                    alt={`${form.name || 'Organization'} logo`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                orgInitials
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="break-words font-sans! text-[21px] font-semibold! leading-snug text-[#F2F4F6]!">
                                {form.name || 'Organization'}
                            </h2>
                            <p className="mt-1 font-sans! text-[13px] text-[#9BA5B2]!">
                                {organization.organization_type ||
                                    'Organization'}
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 self-start border border-[#3A444D] bg-[#20262D] px-3 py-2 sm:self-center">
                            {isVerified ? (
                                <ShieldCheck
                                    size={16}
                                    className="text-[#A4C7B1]"
                                />
                            ) : (
                                <AlertCircle
                                    size={16}
                                    className="text-[#CDB18B]"
                                />
                            )}
                            <span className="font-sans! text-[12px] font-medium! text-[#D1D7DE]!">
                                {isVerified
                                    ? 'Verified organization'
                                    : 'Verification pending'}
                            </span>
                        </div>
                    </div>

                    <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_310px]">
                        <div className="min-w-0 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
                            <div className="mb-8">
                                <h3 className="font-sans! text-[18px] font-semibold! text-[#F0F2F5]!">
                                    Profile information
                                </h3>
                                <p className="mt-1.5 font-sans! text-[13px] leading-6 text-[#9BA5B2]!">
                                    Edit the details shown on your
                                    organization's public profile.
                                </p>
                            </div>

                            <div className="grid min-w-0 gap-x-6 gap-y-6 md:grid-cols-2">
                                <Field label="Organization name">
                                    <input
                                        type="text"
                                        required
                                        maxLength={255}
                                        value={form.name}
                                        onChange={(e) =>
                                            handleChange('name', e.target.value)
                                        }
                                        className={inputCls}
                                        disabled={saving}
                                    />
                                </Field>
                                <Field label="Email address">
                                    <input
                                        type="email"
                                        required
                                        maxLength={255}
                                        value={form.email}
                                        onChange={(e) =>
                                            handleChange(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        className={inputCls}
                                        disabled={saving}
                                    />
                                </Field>
                                <Field label="Phone number">
                                    <input
                                        type="tel"
                                        maxLength={30}
                                        value={form.phone}
                                        onChange={(e) =>
                                            handleChange(
                                                'phone',
                                                e.target.value,
                                            )
                                        }
                                        className={inputCls}
                                        disabled={saving}
                                        placeholder="Enter phone number"
                                    />
                                </Field>
                                <Field label="Website">
                                    <input
                                        type="url"
                                        maxLength={255}
                                        value={form.website}
                                        onChange={(e) =>
                                            handleChange(
                                                'website',
                                                e.target.value,
                                            )
                                        }
                                        className={inputCls}
                                        disabled={saving}
                                        placeholder="https://example.org"
                                    />
                                </Field>
                            </div>

                            <div className="my-9 border-t border-[#303640]" />
                            <div className="mb-6">
                                <h3 className="font-sans! text-[18px] font-semibold! text-[#F0F2F5]!">
                                    About the organization
                                </h3>
                                <p className="mt-1.5 font-sans! text-[13px] leading-6 text-[#9BA5B2]!">
                                    Where you work and what your organization
                                    stands for.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <Field label="Address">
                                    <textarea
                                        rows={2}
                                        maxLength={1000}
                                        value={form.address}
                                        onChange={(e) =>
                                            handleChange(
                                                'address',
                                                e.target.value,
                                            )
                                        }
                                        className={textareaCls}
                                        disabled={saving}
                                        placeholder="Organization address"
                                    />
                                </Field>
                                <Field label="Mission">
                                    <textarea
                                        rows={5}
                                        maxLength={5000}
                                        value={form.mission}
                                        onChange={(e) =>
                                            handleChange(
                                                'mission',
                                                e.target.value,
                                            )
                                        }
                                        className={textareaCls}
                                        disabled={saving}
                                        placeholder="Describe your organization's mission"
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Read-only facts: intentionally quiet and unboxed */}
                        <aside className="min-w-0 border-t border-[#303640] bg-[#171B21] px-5 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-6 lg:py-10">
                            <h3 className="font-sans! text-[15px] font-semibold! text-[#E7EBF0]!">
                                Organization details
                            </h3>
                            <div className="mt-7 space-y-6">
                                <div>
                                    <p className="font-sans! text-[11px] font-medium! text-[#929EAD]!">
                                        Registration number
                                    </p>
                                    <p className="mt-2 break-all font-sans! text-[13px] leading-6 text-[#D6DDE5]!">
                                        {organization.registration_number ||
                                            'Not assigned'}
                                    </p>
                                </div>
                                <div className="border-t border-[#2E3540] pt-6">
                                    <p className="font-sans! text-[11px] font-medium! text-[#929EAD]!">
                                        Areas of focus
                                    </p>
                                    <p className="mt-2 font-sans! text-[13px] leading-6 text-[#D6DDE5]!">
                                        {focusAreas.length
                                            ? focusAreas.join(', ')
                                            : 'Not specified'}
                                    </p>
                                </div>
                                <div className="border-t border-[#2E3540] pt-6">
                                    <p className="font-sans! text-[11px] font-medium! text-[#929EAD]!">
                                        Communities served
                                    </p>
                                    <p className="mt-2 font-sans! text-[13px] leading-6 text-[#D6DDE5]!">
                                        {communitiesServed.length
                                            ? communitiesServed.join(', ')
                                            : 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-[#303640] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                        <p className="font-sans! text-[12px] leading-5 text-[#929EAD]!">
                            Updates to this profile will be saved to your
                            organization.
                        </p>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2.5 border border-[#515E6E] bg-[#303B49] px-5 font-sans! text-[13px] font-semibold! text-[#F3F5F7]! transition-colors hover:border-[#6A7889] hover:bg-[#3B495A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6B2BF] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            {saving ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#AAB4C0]/40 border-t-[#E7EBF0]" />
                            ) : (
                                <Save size={16} strokeWidth={1.8} />
                            )}
                            {saving ? 'Saving changes...' : 'Save changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="border border-[#303640] bg-[#191D23] px-6 py-14 text-center">
                    <AlertCircle size={28} className="mx-auto text-[#A1ACBA]" />
                    <h2 className="mt-4 font-sans! text-[17px] font-semibold! text-[#F0F2F5]!">
                        Unable to load organization profile
                    </h2>
                    <p className="mt-2 font-sans! text-[13px] text-[#A1ACBA]!">
                        Check your connection and try again.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-6 border border-[#515E6E] bg-[#303B49] px-5 py-2.5 font-sans! text-[13px] text-[#F3F5F7]! hover:bg-[#3B495A]"
                    >
                        Try again
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrgProfile;

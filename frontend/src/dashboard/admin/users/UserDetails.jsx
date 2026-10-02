import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Shield,
    UserRound,
    Phone,
    MapPin,
    Home,
    Building2,
    FileText,
    Globe,
    Users,
    Target,
    Tags,
    HeartHandshake,
    Hash,
    Mail,
    Pencil,
    X,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';

import UserForm from './components/UserForm';
import { fetchUser, updateUser } from './api/userApi';

// ============================================================
// HELPERS
// ============================================================

const formatType = (value) => {
    if (!value) {
        return 'Not provided';
    }

    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatList = (value) => {
    if (!value) {
        return 'Not provided';
    }

    if (Array.isArray(value)) {
        return value.length ? value.join(', ') : 'Not provided';
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed)) {
                return parsed.length ? parsed.join(', ') : 'Not provided';
            }

            return parsed || 'Not provided';
        } catch {
            return value;
        }
    }

    return String(value);
};

const formatDate = (value) => {
    if (!value) {
        return 'Not provided';
    }

    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// ============================================================
// PROFILE SECTION
// ============================================================

const ProfileSection = ({ number, title, description, children }) => (
    <section className="border-b border-border py-7 last:border-b-0 sm:py-8">
        <div className="mb-5 flex items-start gap-4 sm:mb-6 sm:gap-5">
            <div className="flex shrink-0 items-center gap-2.5 pt-1.5">
                <span className="font-[Poppins] text-[9px] font-semibold tracking-[0.17em] text-primary">
                    {number}
                </span>

                <span className="hidden h-px w-8 bg-primary/25 sm:block" />
            </div>

            <div className="min-w-0">
                <h2 className="font-[Fraunces] text-[22px] font-semibold leading-[1.15] tracking-tight text-text-primary sm:text-[24px]">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-text-secondary sm:text-[13px]">
                        {description}
                    </p>
                )}
            </div>
        </div>

        {children}
    </section>
);

// ============================================================
// DETAIL
// ============================================================

const Detail = ({
    icon: Icon,
    label,
    value,
    wide = false,
    emphasized = false,
}) => {
    const displayValue =
        value !== undefined && value !== null && value !== ''
            ? value
            : 'Not provided';

    return (
        <div
            className={`
                border-t border-border/90
                py-4.5
                sm:py-5
                ${wide ? 'sm:col-span-2' : ''}
            `}
        >
            <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
                <div
                    className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        border border-primary/10
                        bg-primary/4.5
                        text-primary
                    "
                >
                    <Icon size={16} strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="mb-1.5 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                        {label}
                    </p>

                    <div
                        className={`
                            wrap-break-word
                            text-[13px]
                            leading-6
                            sm:text-[14px]
                            ${
                                emphasized
                                    ? 'font-semibold text-text-primary'
                                    : 'font-medium text-slate-600'
                            }
                        `}
                    >
                        {displayValue}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// LONG DETAIL
// ============================================================

const LongDetail = ({ icon: Icon, label, value }) => {
    const displayValue =
        value !== undefined && value !== null && value !== ''
            ? value
            : 'Not provided';

    return (
        <div className="border-t border-border/90 py-4.5 sm:py-5">
            <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
                <div
                    className="
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        border border-primary/10
                        bg-primary/4.5
                        text-primary
                    "
                >
                    <Icon size={16} strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="mb-1.5 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                        {label}
                    </p>

                    <p className="max-w-2xl wrap-break-word text-[13px] leading-6 text-slate-600 sm:text-[14px]">
                        {displayValue}
                    </p>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// USER DETAILS
// ============================================================

const UserDetails = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // ============================================================
    // LOAD USER
    // ============================================================

    useEffect(() => {
        let cancelled = false;

        const loadUser = async () => {
            try {
                setLoading(true);
                setLoadError('');

                const data = await fetchUser(userId);

                if (!cancelled) {
                    setUser(data.user);
                }
            } catch (err) {
                if (!cancelled) {
                    setLoadError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadUser();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    // ============================================================
    // NAVIGATION
    // ============================================================

    const handleBack = () => {
        if (saving) {
            return;
        }

        navigate('/admin/dashboard/users');
    };

    // ============================================================
    // EDIT MODE
    // ============================================================

    const handleStartEdit = () => {
        setSaveError('');
        setFieldErrors({});
        setSuccessMessage('');
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        if (saving) {
            return;
        }

        setIsEditing(false);
        setSaveError('');
        setFieldErrors({});
    };

    // ============================================================
    // UPDATE USER
    // ============================================================

    const handleUpdateUser = async (formData) => {
        if (!user) {
            return;
        }

        setSaving(true);
        setSaveError('');
        setFieldErrors({});
        setSuccessMessage('');

        try {
            await updateUser(user.id, formData);

            const refreshed = await fetchUser(user.id);

            setUser(refreshed.user);
            setIsEditing(false);
            setSuccessMessage('User updated successfully.');
        } catch (err) {
            if (err.status === 422 && err.errors) {
                setFieldErrors(err.errors);
            }

            setSaveError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="User Details"
                    subtitle="Loading account information..."
                />

                <div className="flex min-h-[360px] items-center justify-center border border-border bg-surface">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-border border-t-primary" />

                        <p className="text-sm font-semibold text-text-primary">
                            Loading user details...
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                            Please wait while we retrieve the account.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // LOAD ERROR
    // ============================================================

    if (loadError || !user) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="User Details"
                    subtitle="The requested account could not be loaded."
                    action={
                        <button
                            type="button"
                            onClick={handleBack}
                            className="
                                inline-flex h-10
                                items-center gap-2
                                border border-border
                                bg-surface px-4
                                text-sm font-medium
                                text-text-primary
                                transition-colors
                                hover:bg-background-alt
                            "
                        >
                            <ArrowLeft size={16} strokeWidth={1.8} />
                            <span>Back to users</span>
                        </button>
                    }
                />

                <div className="border border-red-200 bg-red-50 px-5 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-red-100 text-red-600">
                            <FileText size={17} strokeWidth={1.8} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-red-900">
                                Unable to load user
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-700">
                                {loadError ||
                                    'The requested user could not be found.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // DERIVED DATA
    // ============================================================

    const individualProfile = user.individual_profile;
    const organization = user.organization;

    const isOrganization = user.role === 'organization';

    const roleLabel =
        user.role === 'admin' ? 'Administrator' : formatType(user.role);

    // ============================================================
    // EDIT MODE
    // ============================================================

    if (isEditing) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Edit User"
                    subtitle={`Update account information and access settings for ${user.name}.`}
                    action={
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={saving}
                            className="
                                inline-flex h-10
                                items-center gap-2
                                border border-border
                                bg-surface px-4
                                text-sm font-medium
                                text-text-primary
                                transition-colors
                                hover:bg-background-alt
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <X size={16} strokeWidth={1.8} />
                            <span>Cancel editing</span>
                        </button>
                    }
                />

                <div className="mx-auto w-full max-w-[1000px]">
                    <UserForm
                        mode="edit"
                        user={user}
                        loading={saving}
                        error={saveError}
                        fieldErrors={fieldErrors}
                        onSubmit={handleUpdateUser}
                        onCancel={handleCancelEdit}
                    />
                </div>
            </div>
        );
    }

    // ============================================================
    // DETAILS PAGE
    // ============================================================

    return (
        <div className="space-y-8">
            <PageHeader
                title="User Details"
                subtitle="Review account, contact, profile, and access information."
                action={
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="
                                inline-flex h-10
                                items-center gap-2
                                border border-border
                                bg-surface px-4
                                text-sm font-medium
                                text-text-primary
                                transition-colors
                                hover:bg-background-alt
                            "
                        >
                            <ArrowLeft size={16} strokeWidth={1.8} />
                            <span>Back</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleStartEdit}
                            className="
                                inline-flex h-10
                                items-center gap-2
                                bg-primary px-4
                                text-sm font-semibold
                                text-white!
                                transition-colors
                                hover:bg-primary-hover
                            "
                        >
                            <Pencil size={15} strokeWidth={1.9} />
                            <span>Edit User</span>
                        </button>
                    </div>
                }
            />

            {successMessage && (
                <div className="border-l-4 border-emerald-500 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                    {successMessage}
                </div>
            )}

            {/* ============================================================
                ACCOUNT IDENTITY
            ============================================================ */}

            <section className="border border-border bg-surface">
                <div
                    className="
                        flex flex-col gap-6
                        border-b border-border
                        px-5 py-6
                        sm:px-7
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >
                    <div className="flex min-w-0 items-center gap-4">
                        <div
                            className="
                                flex h-14 w-14 shrink-0
                                items-center justify-center
                                bg-primary
                                text-white!
                            "
                        >
                            {isOrganization ? (
                                <Building2 size={24} strokeWidth={1.6} />
                            ) : (
                                <UserRound size={24} strokeWidth={1.6} />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="mb-1 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.17em] text-primary">
                                {roleLabel}
                            </p>

                            <h2 className="wrap-break-word font-[Fraunces] text-[25px] font-semibold leading-tight tracking-tight text-text-primary sm:text-[28px]">
                                {user.name || 'User'}
                            </h2>

                            <p className="mt-1 wrap-break-word text-[13px] text-text-secondary">
                                {user.email || 'Not provided'}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-5">
                        <div>
                            <p className="mb-1.5 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                                Member since
                            </p>

                            <p className="text-[13px] font-medium text-text-primary">
                                {formatDate(user.created_at)}
                            </p>
                        </div>

                        <div className="h-9 border-l border-border" />

                        <StatusBadge status={user.status} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="flex items-start gap-3.5 px-5 py-5 sm:px-7">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary/10 bg-primary/4.5 text-primary">
                            <Mail size={16} strokeWidth={1.7} />
                        </div>

                        <div className="min-w-0">
                            <p className="mb-1 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                                Primary contact
                            </p>

                            <p className="wrap-break-word text-[13px] font-semibold text-text-primary">
                                {user.email || 'Not provided'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3.5 border-t border-border px-5 py-5 sm:border-l sm:border-t-0 sm:px-7">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary/10 bg-primary/4.5 text-primary">
                            <Shield size={16} strokeWidth={1.7} />
                        </div>

                        <div>
                            <p className="mb-1 font-[Poppins] text-[9px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                                Account role
                            </p>

                            <p className="text-[13px] font-semibold text-text-primary">
                                {roleLabel}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                INFORMATION
            ============================================================ */}

            <section className="border border-border bg-surface px-5 sm:px-7 lg:px-8">
                {!isOrganization && (
                    <ProfileSection
                        number="01"
                        title="Personal information"
                        description="Personal and location information provided by the member."
                    >
                        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                            <Detail
                                icon={UserRound}
                                label="Full name"
                                value={user.name}
                                emphasized
                            />

                            <Detail
                                icon={Phone}
                                label="Phone number"
                                value={user.phone}
                            />

                            <Detail
                                icon={MapPin}
                                label="District"
                                value={individualProfile?.district}
                                emphasized
                            />

                            <Detail
                                icon={Calendar}
                                label="Date of birth"
                                value={individualProfile?.date_of_birth}
                            />

                            <Detail
                                icon={Home}
                                label="Address"
                                value={individualProfile?.address}
                                wide
                            />
                        </div>
                    </ProfileSection>
                )}

                <ProfileSection
                    number={isOrganization ? '01' : '02'}
                    title="Account details"
                    description="Identity, access role and account status."
                >
                    <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                        <Detail
                            icon={Mail}
                            label="Email address"
                            value={user.email}
                            emphasized
                        />

                        <Detail
                            icon={Calendar}
                            label="Member since"
                            value={formatDate(user.created_at)}
                        />

                        <Detail
                            icon={Shield}
                            label="Account role"
                            value={roleLabel}
                            emphasized
                        />

                        <Detail
                            icon={UserRound}
                            label="Account status"
                            value={<StatusBadge status={user.status} />}
                        />

                        {isOrganization && (
                            <Detail
                                icon={Shield}
                                label="Verification"
                                value={
                                    organization?.is_verified
                                        ? 'Verified organization'
                                        : 'Verification pending'
                                }
                                emphasized
                            />
                        )}
                    </div>
                </ProfileSection>

                {isOrganization && (
                    <>
                        <ProfileSection
                            number="02"
                            title="Organization"
                            description="Registration, contact and organizational identity."
                        >
                            <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                                <Detail
                                    icon={Building2}
                                    label="Organization type"
                                    value={formatType(organization?.type)}
                                    emphasized
                                />

                                <Detail
                                    icon={Hash}
                                    label="Registration number"
                                    value={organization?.registration_number}
                                />

                                <Detail
                                    icon={Phone}
                                    label="Phone number"
                                    value={organization?.phone}
                                />

                                <Detail
                                    icon={Globe}
                                    label="Website"
                                    value={organization?.website}
                                />

                                <Detail
                                    icon={Home}
                                    label="Address"
                                    value={organization?.address}
                                    wide
                                />
                            </div>
                        </ProfileSection>

                        <ProfileSection
                            number="03"
                            title="Mission & reach"
                            description="The organization's purpose, focus areas and community coverage."
                        >
                            <LongDetail
                                icon={Target}
                                label="Mission"
                                value={organization?.mission}
                            />

                            <LongDetail
                                icon={Tags}
                                label="Focus areas"
                                value={formatList(organization?.focus_areas)}
                            />

                            <LongDetail
                                icon={Users}
                                label="Communities served"
                                value={formatList(
                                    organization?.communities_served,
                                )}
                            />

                            <LongDetail
                                icon={HeartHandshake}
                                label="Primary activities"
                                value={formatList(
                                    organization?.primary_activities,
                                )}
                            />

                            <Detail
                                icon={Users}
                                label="Team size"
                                value={organization?.team_size}
                            />
                        </ProfileSection>
                    </>
                )}
            </section>
        </div>
    );
};

export default UserDetails;

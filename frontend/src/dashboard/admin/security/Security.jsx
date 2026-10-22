import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowUpRight,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
    MailCheck,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';
import DashboardInput from '@/components/dashboard/DashboardInput';
import LoadingUI from '@/components/dashboard/LoadingUI';
import LoadingError from '@/components/dashboard/LoadingError';
import SuccessDialog from '@/components/dashboard/SuccessDialog';

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const PASSWORD_ENDPOINT = `${API_URL}/profile/password`;

const initialForm = {
    current_password: '',
    password: '',
    password_confirmation: '',
};

const getToken = () =>
    localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

async function parseResponse(response) {
    const text = await response.text();
    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = {};
        }
    }

    if (!response.ok) {
        const validationError = data?.errors
            ? Object.values(data.errors).flat().find(Boolean)
            : null;

        throw new Error(
            validationError ||
                data?.message ||
                `Request failed (${response.status}).`,
        );
    }

    return data;
}

/* =========================================================
   ROLE CONFIGURATION
========================================================= */

const ROLE_CONFIG = {
    admin: {
        accountType: 'administrator',
        accessTitle: 'Administrator access',
        accessDescription: 'Access to the administration dashboard.',
        profilePath: '/admin/dashboard/profile',
        editPath: '/admin/dashboard/profile/edit',
    },
    individual: {
        accountType: 'individual',
        accessTitle: 'Individual account',
        accessDescription: 'Access to your individual dashboard.',
        profilePath: '/individual/dashboard/profile',
        editPath: '/individual/dashboard/profile/edit',
    },
    organization: {
        accountType: 'organization',
        accessTitle: 'Organization account',
        accessDescription: 'Access to your organization dashboard.',
        profilePath: '/organization/dashboard/profile',
        editPath: '/organization/dashboard/profile/edit',
    },
};

function getDashboardRole(pathname) {
    if (pathname.startsWith('/organization/dashboard')) {
        return 'organization';
    }

    if (pathname.startsWith('/individual/dashboard')) {
        return 'individual';
    }

    return 'admin';
}

/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
    id,
    label,
    value,
    onChange,
    visible,
    onToggle,
    autoComplete,
    disabled,
    placeholder,
}) {
    return (
        <div className="security-password-input min-w-0">
            <DashboardInput
                id={id}
                name={id}
                label={label}
                type={visible ? 'text' : 'password'}
                leftIcon={LockKeyhole}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                placeholder={placeholder}
                disabled={disabled}
                required
                rightElement={
                    <button
                        type="button"
                        onClick={onToggle}
                        disabled={disabled}
                        aria-label={visible ? `Hide ${label}` : `Show ${label}`}
                        aria-pressed={Boolean(visible)}
                        className="
                            flex h-8 w-8 items-center justify-center
                            text-[#8290A1] transition-colors
                            hover:text-[#D9E0E8]
                            focus-visible:outline
                            focus-visible:outline-[#637489]
                            disabled:cursor-not-allowed
                        "
                    >
                        {visible ? (
                            <EyeOff size={17} strokeWidth={1.7} />
                        ) : (
                            <Eye size={17} strokeWidth={1.7} />
                        )}
                    </button>
                }
            />
        </div>
    );
}

/* =========================================================
   SIDEBAR INFORMATION ROW
========================================================= */

function SecurityRow({
    icon: Icon,
    title,
    description,
    action,
    onAction,
    last = false,
}) {
    return (
        <div
            className={`
                min-w-0 py-4.5
                ${last ? '' : 'border-b border-[#29323E]'}
            `}
        >
            <div className="flex min-w-0 items-start gap-3">
                <Icon
                    size={17}
                    strokeWidth={1.7}
                    className="mt-0.5 shrink-0 text-[#8392A3]"
                />

                <div className="min-w-0 flex-1">
                    <h3
                        className="
                            m-0! font-sans! text-[13px]!
                            font-semibold! leading-5!
                            text-[#DCE3EB]!
                        "
                    >
                        {title}
                    </h3>

                    <p
                        className="
                            mt-1.5 text-[12px] leading-[1.7]
                            text-[#8E9AAA]!
                        "
                    >
                        {description}
                    </p>

                    {action && (
                        <button
                            type="button"
                            onClick={onAction}
                            className="
                                mt-2.5 inline-flex min-h-7
                                items-center gap-1.5
                                text-[12px] font-medium
                                text-[#B4C3D1]!
                                transition-colors
                                hover:text-[#E5EAF0]!
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#547F77]
                            "
                        >
                            {action}
                            <ArrowUpRight size={13} strokeWidth={1.8} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   ACCOUNT SECURITY SIDEBAR
========================================================= */

function AccountSecuritySidebar({ role }) {
    const navigate = useNavigate();
    const config = ROLE_CONFIG[role];

    return (
        <aside
            className="
                flex min-w-0 flex-col overflow-hidden
                border border-[#29323E] bg-[#0E1219]
            "
        >
            <div
                className="
                    border-b border-[#29323E]
                    bg-[#151C25] px-5 py-5
                    sm:px-6
                "
            >
                <h2
                    className="
                        m-0! font-sans! text-[15px]!
                        font-semibold! tracking-[-0.01em]!
                        text-[#DFE5EC]!
                    "
                >
                    Account security
                </h2>

                <p
                    className="
                        mt-1.5 text-[12px] leading-5
                        text-[#8D99A8]!
                    "
                >
                    Account access and related settings.
                </p>
            </div>

            <div className="min-w-0 flex-1 px-5 sm:px-6">
                <SecurityRow
                    icon={ShieldCheck}
                    title={config.accessTitle}
                    description={config.accessDescription}
                />

                <SecurityRow
                    icon={MailCheck}
                    title="Email verification"
                    description="Review your registered email and verification status."
                    action="View profile"
                    onAction={() => navigate(config.profilePath)}
                />

                <SecurityRow
                    icon={UserRound}
                    title="Account information"
                    description="Manage your personal and contact details."
                    action="Edit profile"
                    onAction={() => navigate(config.editPath)}
                    last
                />
            </div>
        </aside>
    );
}

/* =========================================================
   MAIN SECURITY PAGE
========================================================= */

export default function Security() {
    const location = useLocation();

    const role = getDashboardRole(location.pathname);
    const config = ROLE_CONFIG[role];

    const [form, setForm] = useState(initialForm);
    const [visibleFields, setVisibleFields] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successOpen, setSuccessOpen] = useState(false);

    /* -----------------------------------------------------
       PASSWORD VALIDATION
    ----------------------------------------------------- */

    const password = form.password;

    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
    };

    const allRequirementsMet = Object.values(requirements).every(Boolean);

    const passwordsMatch =
        form.password_confirmation.length > 0 &&
        form.password === form.password_confirmation;

    /* -----------------------------------------------------
       FORM HANDLERS
    ----------------------------------------------------- */

    const handleChange = (key, value) => {
        setForm((previous) => ({
            ...previous,
            [key]: value,
        }));

        setError('');
    };

    const toggleVisibility = (key) => {
        setVisibleFields((previous) => ({
            ...previous,
            [key]: !previous[key],
        }));
    };

    const handleReset = () => {
        if (saving) return;

        setForm({ ...initialForm });
        setVisibleFields({});
        setError('');
    };

    /* -----------------------------------------------------
       UPDATE PASSWORD
    ----------------------------------------------------- */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (saving) return;

        if (!form.current_password) {
            setError('Enter your current password.');
            return;
        }

        if (!allRequirementsMet) {
            setError(
                'Your new password does not meet the password requirements.',
            );
            return;
        }

        if (form.current_password === form.password) {
            setError(
                'Your new password must be different from your current password.',
            );
            return;
        }

        if (!passwordsMatch) {
            setError('The new passwords do not match.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const token = getToken();

            if (!token) {
                throw new Error(
                    'Your session has expired. Please log in again.',
                );
            }

            const response = await fetch(PASSWORD_ENDPOINT, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            await parseResponse(response);

            setForm({ ...initialForm });
            setVisibleFields({});
            setSuccessOpen(true);
        } catch (err) {
            setError(err.message || 'Unable to update your password.');
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-w-0 space-y-6 pb-8 font-sans">
            <PageHeader
                title="Account Security"
                subtitle={`Manage your password and ${config.accountType} account security.`}
            />

            <div
                className="
                    grid min-w-0 grid-cols-1
                    items-stretch gap-5
                    xl:grid-cols-[minmax(0,1fr)_360px]
                "
            >
                {/* PASSWORD MANAGEMENT */}

                <section
                    className="
                        flex min-w-0 flex-col overflow-hidden
                        border border-[#29323E]
                        bg-[#0E1219]
                    "
                >
                    <div
                        className="
                            border-b border-[#29323E]
                            bg-[#151C25]
                            px-5 py-5 sm:px-7
                        "
                    >
                        <div className="flex items-center gap-3.5">
                            <div
                                className="
                                    flex h-10 w-10 shrink-0
                                    items-center justify-center
                                    border border-[#35414F]
                                    bg-[#202A35]
                                    text-[#AAB9C8]
                                "
                            >
                                <KeyRound size={18} strokeWidth={1.7} />
                            </div>

                            <div className="min-w-0">
                                <h2
                                    className="
                                        m-0! font-sans!
                                        text-[17px]!
                                        font-semibold!
                                        tracking-[-0.02em]!
                                        text-[#DFE5EC]!
                                    "
                                >
                                    Change password
                                </h2>

                                <p
                                    className="
                                        mt-1 text-[13px]
                                        leading-5 text-[#909CAB]!
                                    "
                                >
                                    Update your {config.accountType} account
                                    password.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        autoComplete="off"
                        className="flex min-w-0 flex-1 flex-col"
                    >
                        <div
                            className="
                                flex-1 px-5 py-6
                                sm:px-7 sm:py-7
                            "
                        >
                            {error && (
                                <div className="mb-6">
                                    <LoadingError
                                        title="Password update failed"
                                        message={error}
                                    />
                                </div>
                            )}

                            {/* CURRENT PASSWORD */}

                            <PasswordField
                                id="current_password"
                                label="Current password"
                                value={form.current_password}
                                onChange={(event) =>
                                    handleChange(
                                        'current_password',
                                        event.target.value,
                                    )
                                }
                                visible={visibleFields.current_password}
                                onToggle={() =>
                                    toggleVisibility('current_password')
                                }
                                autoComplete="off"
                                placeholder="Enter your current password"
                                disabled={saving}
                            />

                            <div className="my-6 border-t border-[#27313D]" />

                            {/* NEW PASSWORD */}

                            <div className="space-y-5">
                                <div className="min-w-0">
                                    <PasswordField
                                        id="password"
                                        label="New password"
                                        value={form.password}
                                        onChange={(event) =>
                                            handleChange(
                                                'password',
                                                event.target.value,
                                            )
                                        }
                                        visible={visibleFields.password}
                                        onToggle={() =>
                                            toggleVisibility('password')
                                        }
                                        autoComplete="new-password"
                                        placeholder="Create a new password"
                                        disabled={saving}
                                    />

                                    <p
                                        className="
                                            mt-2.5 text-[12px]
                                            leading-5 text-[#8793A3]!
                                        "
                                    >
                                        Use 8+ characters with uppercase,
                                        lowercase and a number.
                                    </p>
                                </div>

                                {/* CONFIRM PASSWORD */}

                                <div className="min-w-0">
                                    <PasswordField
                                        id="password_confirmation"
                                        label="Confirm new password"
                                        value={form.password_confirmation}
                                        onChange={(event) =>
                                            handleChange(
                                                'password_confirmation',
                                                event.target.value,
                                            )
                                        }
                                        visible={
                                            visibleFields.password_confirmation
                                        }
                                        onToggle={() =>
                                            toggleVisibility(
                                                'password_confirmation',
                                            )
                                        }
                                        autoComplete="new-password"
                                        placeholder="Re-enter your new password"
                                        disabled={saving}
                                    />

                                    {form.password_confirmation && (
                                        <div
                                            className={`
                                                mt-2.5 flex items-center
                                                gap-2 text-[12px]
                                                ${
                                                    passwordsMatch
                                                        ? 'text-[#A5C9B7]!'
                                                        : 'text-[#C99AA2]!'
                                                }
                                            `}
                                        >
                                            <span
                                                className={`
                                                    h-1.5 w-1.5
                                                    shrink-0 rounded-full
                                                    ${
                                                        passwordsMatch
                                                            ? 'bg-[#83B69E]'
                                                            : 'bg-[#BE828D]'
                                                    }
                                                `}
                                            />

                                            {passwordsMatch
                                                ? 'Passwords match'
                                                : 'Passwords do not match'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* FORM ACTIONS */}

                        <div
                            className="
                                flex flex-col-reverse gap-3
                                border-t border-[#29323E]
                                bg-[#131A23]
                                px-5 py-4
                                sm:flex-row sm:items-center
                                sm:justify-end sm:px-7
                            "
                        >
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={saving}
                                className="
                                    inline-flex min-h-10
                                    items-center justify-center
                                    border border-[#343E4B]
                                    px-5 text-[13px] font-medium
                                    text-[#AFBAC7]!
                                    transition-colors
                                    hover:bg-[#1B2530]
                                    hover:text-[#E0E6ED]!
                                    disabled:opacity-50
                                "
                            >
                                Clear fields
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="
                                    inline-flex min-h-10 w-full
                                    items-center justify-center
                                    gap-2.5 bg-[#0F766E] px-5
                                    text-[13px] font-semibold
                                    text-white!
                                    transition-colors
                                    hover:bg-[#115E59]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    sm:w-auto sm:min-w-[174px]
                                "
                            >
                                {saving ? (
                                    <LoadingUI
                                        variant="button"
                                        title="Updating..."
                                    />
                                ) : (
                                    <>
                                        <ShieldCheck
                                            size={16}
                                            strokeWidth={1.8}
                                        />
                                        Update password
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                {/* ROLE-SPECIFIC ACCOUNT INFORMATION */}

                <AccountSecuritySidebar role={role} />
            </div>

            {/* SUCCESS DIALOG */}

            <SuccessDialog
                open={successOpen}
                title="Password updated"
                message={`Your ${config.accountType} password has been changed successfully.`}
                onClose={() => setSuccessOpen(false)}
            />

            {/* PASSWORD AUTOFILL STYLING */}

            <style>
                {`
                    .security-password-input input:-webkit-autofill,
                    .security-password-input input:-webkit-autofill:hover,
                    .security-password-input input:-webkit-autofill:focus,
                    .security-password-input input:-webkit-autofill:active {
                        -webkit-text-fill-color: #D8DEE7 !important;
                        caret-color: #D8DEE7 !important;

                        -webkit-box-shadow:
                            0 0 0 1000px #151B23 inset !important;

                        box-shadow:
                            0 0 0 1000px #151B23 inset !important;

                        transition:
                            background-color 9999s ease-out 0s;
                    }
                `}
            </style>
        </div>
    );
}
